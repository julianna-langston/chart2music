// The point of rowArrayAdapter is that we don't have to copy data into c2m if a library
// we're integrating with already stores it differently.
// TODO: supporting sort/continuous might be a little verbose
// author: Andrew Pikul (ajpikul@gmail.com)

import type { SupportedDataPointType } from "./dataPoint";
import { isHighLowDataPoint, isOHLCDataPoint } from "./dataPoint";

/**
 * An interface that imitates an array to give c2m read-access to chart data stored elsewhere.
 */
export interface RowArrayAdapter<T> {
    length: number;
    min: (prop: string) => number;
    minWithIndex: (prop: string) => [number, number];
    max: (prop: string) => number;
    maxWithIndex: (prop: string) => [number, number];
    at: (index: number) => T;
    findIndex(test: (T) => boolean): number;
}

/**
 * Check if an object implements the RowArrayAdapter interface. Used where we use Array.isArray().
 * @param obj - the object to check
 * @returns true if the object implements the interface
 */
export function isRowArrayAdapter(
    obj: unknown
): obj is RowArrayAdapter<unknown> {
    return (
        obj &&
        typeof obj === "object" &&
        "length" in obj && // TODO: Could, if they give us "length()" instead of "length", we fix it for them?
        "min" in obj &&
        "max" in obj &&
        "at" in obj
    );
}

/**
 * Create a RowArrayAdapter from an actual array.
 */
export class ArrayAsAdapter<T extends number | SupportedDataPointType> {
    _array: T[];

    /**
     * Construct adapter from supplied array
     * @param array - the underlying array from the adapter
     */
    constructor(array: (T | SupportedDataPointType)[]) {
        // NOTE: If you give us a SupportedDataPointType, we will attempt to cast it for you to type T
        if (!array) {
            this._array = [] as T[];
            return; // (Should throw error? don't think c2m allows empty data)
        }
        this._array = array as T[]; // Don't inherit array, we want to fail Array.isArray()
    }

    /**
     * Shims the Array.length property
     * @returns the length of the array
     */
    get length(): number {
        return this._array.length;
    }

    /**
     * Implements a min() function, in this case a shim over Math.min()
     * @param prop - a string indicating the property that is assessed for min
     * @returns the minimum value of the array
     */
    min(prop: string): number {
        return this.minWithIndex(prop)[1];
    }

    /**
     * Implements a function like min() but returns an array of [index, value]
     * @param prop - a string indicating the property that is assessed for min
     * @returns [index, value] corresponding to the minimum of the row
     */
    minWithIndex(prop: string): [number, number] {
        if (!this._array) return [-1, NaN];
        return this._array.reduce(
            (
                localMinimum: [number, number],
                point: T,
                currentIndex: number
            ): [number, number] => {
                let val: number = NaN;
                if (typeof point === "number") {
                    if (prop) return [-1, NaN];
                    val = point;
                    // eslint and tsc disagree about whether or not the above condition
                    // is sufficient to guarantee type exclusion, tsc says no. the argument
                    // gets rather abstract wrt `extends`, but this is just a test implementation
                    // and real implementations should not support numbers anyway
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                } else if (prop in (point as SupportedDataPointType)) {
                    // online linter wants me to specify [index: string]:number to use `in`
                    val = point[prop] as number;
                } else if (isOHLCDataPoint(point) && prop === "y") {
                    val = Math.min(
                        point.high,
                        point.low,
                        point.open,
                        point.close
                    );
                } else if (isHighLowDataPoint(point) && prop === "y") {
                    val = Math.min(point.high, point.low);
                } else return localMinimum;
                if (isNaN(localMinimum[1])) {
                    return [currentIndex, val];
                }
                return val < localMinimum[1]
                    ? [currentIndex, val]
                    : localMinimum;
            },
            [-1, NaN] // Initial value of reduce()
        );
    }

    /**
     * Implements a max() function, in this case a shim over Math.max()
     * @param prop - a string indicating the property that is assessed for min
     * @returns the maximum value of the array
     */
    max(prop: string): number {
        return this.maxWithIndex(prop)[1];
    }

    /**
     * Implements a function like max(), but returns an array of [index, value]
     * @param prop - a string indicating the property that is assessed for min
     * @returns [index, value] coresponding to the maximum of the row
     */
    maxWithIndex(prop: string): [number, number] {
        if (!this._array) return [-1, NaN];
        return this._array.reduce(
            (
                localMaximum: [number, number],
                point: T,
                currentIndex: number
            ): [number, number] => {
                let val: number = NaN;
                if (typeof point === "number") {
                    if (prop) return [-1, NaN];
                    val = point;
                    // eslint and tsc disagree about whether or not the above condition
                    // is sufficient to guarantee type exclusion, tsc says no. the argument
                    // gets rather abstract wrt `extends`, but this is just a test implementation
                    // and real implementations should not support numbers anyway
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                } else if (prop in (point as SupportedDataPointType)) {
                    // online linter wants me to specify [index: string]:number to use `in`
                    val = point[prop] as number;
                } else if (isOHLCDataPoint(point) && prop === "y") {
                    val = Math.max(
                        point.high,
                        point.low,
                        point.open,
                        point.close
                    );
                } else if (isHighLowDataPoint(point) && prop === "y") {
                    val = Math.max(point.high, point.low);
                } else return localMaximum;
                if (isNaN(localMaximum[1])) {
                    return [currentIndex, val];
                }
                return val > localMaximum[1]
                    ? [currentIndex, val]
                    : localMaximum;
            },
            [-1, NaN] // Initial value of reduce()
        );
    }

    /**
     * Shims the Array.at() function
     * @param index - the index of the value you'd like to access
     * @returns the value at the supplied index
     */
    at(index: number): T {
        return this._array.at(index);
    }

    /**
     * Shims the Array.findIndex() function, finds index of first element which satisfies the test function
     * @param test - then function by which we test
     * @returns index of first element
     */
    findIndex(test: (T) => boolean): number {
        return this._array.findIndex(test);
    }

    /**
     * forEach imitates an arrays forEach():
     * @param callbackFn - a function to execute for each element in the "array".
     * It accepts three arguments:
     * value: T
     * index: number
     * array: the current ArrayAsAdapter<T>
     *
     * and returns nothing.
     * @param thisArg - an optional argument to set as "this" in your callbackFn.
     * As in Array.prototype.forEach(), if the callbackFn is defined by arrow syntax,
     * the arrow syntax will lexically bind its own this and ignore thisArg.
     */
    forEach(
        callbackFn: (value: T, index: number, array: ArrayAsAdapter<T>) => void,
        thisArg?: unknown
    ): void {
        this._array.forEach((innerValue: T, innerIndex: number) => {
            // typescript doesn't like us binding thisArg which is `unknown` type
            // but we're shimming a javascript function and the user has the right
            // to assign legitimately any value they'd like as `this`
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            callbackFn.bind(thisArg)(innerValue, innerIndex, this);
        }); // purposely use => because we need our lexically-scoped this
    }
}

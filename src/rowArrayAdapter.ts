// The point of rowArrayAdapter is that we don't have to copy data into c2m if a library
// we're integrating with already stores it differently.
// TODO: supporting sort/continuous might be a little verbose
// author: Andrew Pikul (ajpikul@gmail.com)

import type { SupportedDataPointType } from "./dataPoint";
/**
 * An interface that imitates an array to give c2m read-access to chart data stored elsewhere.
 */
export interface RowArrayAdapter<T> {
    length: number;
    min: () => number;
    max: () => number;
    at: (index: number) => T;
    findIndex(test: (T) => boolean): number;
}

/**
 * Check if an object implements the RowArrayAdapter interface.
 * @param obj - the object to check
 * @returns true if the object implements the interface
 */
export function isRowArrayAdapter(
    obj: unknown
): obj is RowArrayAdapter<unknown> {
    return (
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
export class ArrayAsAdapter<T> {
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
     * @returns the minimum value of the array
     */
    min(): number {
        return 0; // TODO implement when necessary
    }

    /**
     * Implements a max() function, in this case a shim over Math.max()
     * @returns the maximum value of the array
     */
    max(): number {
        return 0; // TODO implement when necessary
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
}

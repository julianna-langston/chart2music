// The point of rowArrayAdapter is that we don't have to copy data into c2m if a library
// we're integrating with already stores it differently.
// TODO: supporting sort/continuous might be a little verbose
// author: Andrew Pikul (ajpikul@gmail.com)

import type { SupportedDataPointType } from "./dataPoint";

/**
 * An interface that imitates an array to give c2m read-access to chart data stored elsewhere.
 */
export interface RowArrayAdapter {
    length: number;
    min: () => number;
    max: () => number;
    at: (index: number) => SupportedDataPointType;
    findIndex(test: (any) => boolean): number;
}

/**
 * Check if an object implements the RowArrayAdapter interface.
 * @param obj - the object to check
 * @returns true if the object implements the interface
 */
export function isRowArrayAdapter(obj: unknown): obj is RowArrayAdapter {
    return (
        typeof obj === "object" &&
        "length" in obj && // TODO: Could, if they give us "length()" instead of "length", we fix it for them?
        "min" in obj &&
        "max" in obj &&
        "at" in obj
    );
}

/**
 * Create a RowArrayAdapter from an actual array. This is meant to aid in testing.
 */
export class ArrayAsAdapter {
    _array: number[];

    /**
     * Construct adapter from supplied array
     * @param array - the underlying array from the adapter
     */
    constructor(array: number[]) {
        this._array = array; // Don't inherit array, we want to fail Array.isArray()
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
        return Math.min(...this._array);
    } // TODO: I forget if we want value or index

    /**
     * Implements a max() function, in this case a shim over Math.max()
     * @returns the maximum value of the array
     */
    max(): number {
        return Math.max(...this._array);
    } // TODO: Same as above

    /**
     * Shims the Array.at() function
     * @param index - the index of the value you'd like to access
     * @returns the value at the supplied index
     */
    at(index: number): number {
        return this._array.at(index);
    }

    /**
     * Shims the Array.findIndex() function, finds index of first element which satisfies the test function
     * @param test - then function by which we test
     * @returns index of first element
     */
    findIndex(test: (any) => boolean): number {
        return this._array.findIndex(test);
    }
}

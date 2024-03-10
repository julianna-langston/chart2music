// The point of rowArrayAdapter is that we don't have to copy data into c2m if a library
// we're integrating with already stores it differently.
// TODO: supporting sort/continuous might be a little verbose
// author: Andrew Pikul (ajpikul@gmail.com)

import type { SupportedDataPointType } from "./dataPoint";

/**
 * An interface that imitates an array to give c2m read-access to chart data stored elsewhere.
 */
export interface RowArrayAdapter {
    length: () => number;
    min: () => number;
    max: () => number;
    at: (index: number) => SupportedDataPointType;
}

/**
 * Check if an object implements the RowArrayAdapter interface.
 * @param obj - the object to check
 * @returns true if the object implements the interface
 */
export function isRowArrayAdapter(obj: unknown): obj is RowArrayAdapter {
    return (
        typeof obj === "object" &&
        "length" in obj &&
        "min" in obj &&
        "max" in obj &&
        "at" in obj
    );
}

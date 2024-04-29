import * as adapter from "../src/rowArrayAdapter";
import type { SupportedDataPointType } from "../src/dataPoint";

export const probabilities = [
    0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1
];

/**
 * ValidAdapterType is a list of types we'll accept to be randomized into adapters
 */
type ValidAdapterType = number | SupportedDataPointType;

/**
 * AdapterTypeRandomizer provides a way to fuzz test, switching
 * between regular arrays and adapters.
 */
export class AdapterTypeRandomizer {
    proportion: number;

    /**
     * constructor to set relative proportions
     * @param proportion - how often should the input be wrapped in an adapter
     * @returns void
     */
    constructor(proportion: number | undefined) {
        if (typeof proportion === "undefined") proportion = 0.5;
        this.proportion = proportion;
    }

    /**
     * a is the wrapper fucntion for arrays, it might return the equivalent adapter
     * @param input - the array you want to wrap
     * @returns either a or a wrapped a
     */
    a(
        input: ValidAdapterType[]
    ): adapter.RowArrayAdapter<ValidAdapterType> | ValidAdapterType[] {
        const flip = Math.random();
        if (flip < this.proportion)
            return new adapter.ArrayAsAdapter<ValidAdapterType>(input);
        return input;
    }
}

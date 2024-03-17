import * as adapter from "../src/rowArrayAdapter";

export const probabilities = [
    0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1
];

/**
 * AdapterTypeRandomizer provides a way to fuzz test, switching
 * between regular arrays and adapters.
 */
export class AdapterTypeRandomizer<T> {
    proportion: number;

    /**
     * constructor to set relative proportions
     * @param proportion - how often should the input be wrapped in a adapter
     */
    constructor(proportion: number | undefined) {
        this.proportion = proportion || 0.5;
    }

    /**
     * a is the wrapper fucntion for arrays, it might return the equivalent adapter
     * @param a - the array you want to wrap
     * @returns either a or a wrapped a
     */
    a(a: T[]): adapter.RowArrayAdapter<T> | T[] {
        const flip = Math.random();

        if (flip < this.proportion) return new adapter.ArrayAsAdapter<T>(a);

        return a;
    }
}

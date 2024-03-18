import * as adapter from "../src/rowArrayAdapter";
import type { SimpleDataPoint } from "../src/dataPoint";
import { convertDataRow } from "../src/utils";

const plainArray = [1123, 2342, 301823, 409];
const adaptedArray = new adapter.ArrayAsAdapter<number>(plainArray);
const simplePointArray = new adapter.ArrayAsAdapter<SimpleDataPoint>(
    convertDataRow(plainArray)
);

test("test if ArrayAsAdapter successful constructs a proper RowArrayAdapter", () => {
    expect(adapter.isRowArrayAdapter(plainArray)).toBeFalsy();
    expect(adapter.isRowArrayAdapter(adaptedArray)).toBeTruthy();

    // Test length
    expect(adaptedArray.length).toBe(plainArray.length);
    expect(simplePointArray.length).toBe(plainArray.length);

    // Test min/max
    expect(adaptedArray.min("x")).toBe(NaN);
    expect(adaptedArray.max("y")).toBe(NaN);
    expect(adaptedArray.min("")).toBe(Math.min(...plainArray));
    expect(simplePointArray.min("x")).toBe(0);
    expect(simplePointArray.min("y")).toBe(Math.min(...plainArray));
    expect(simplePointArray.max("x")).toBe(plainArray.length - 1);
    expect(simplePointArray.max("y")).toBe(Math.max(...plainArray));

    // Test at(i)
    plainArray.forEach((el, i) => {
        expect(adaptedArray.at(i)).toBe(el);
        expect(simplePointArray.at(i).x).toBe(i);
        expect(simplePointArray.at(i).y).toBe(el);
    });

    // Test indexOf(i)
    plainArray.forEach((val, i) => {
        expect(
            adaptedArray.findIndex((point: number) => {
                return point === val;
            })
        ).toBe(i);
        expect(
            simplePointArray.findIndex((point: SimpleDataPoint) => {
                return point.y === val;
            })
        ).toBe(i);
        expect(
            simplePointArray.findIndex(() => {
                return false;
            })
        ).toBe(-1);
    });

    // Test forEach:
    adaptedArray.forEach(function (element, index, array) {
        expect(element).toBe(plainArray[index]);
        expect(array).toBe(adaptedArray);
        expect(this).toBe("this replaces `this`");
    }, "this replaces `this`");
    // NOTE: can't use => if we want to replace this
    // because => does a permanent bind
    adaptedArray.forEach(function (element, index, array) {
        expect(element).toBe(plainArray[index]);
        expect(array).toBe(adaptedArray);
        // an unspecified value of `this` will be `undefined`
        // in a testing context, but in a browser it will depend on
        // whether 'use strict`; Testing for it may be prudent.
    });
    simplePointArray.forEach(function (element, index, array) {
        expect(element.y).toBe(plainArray[index]);
        expect(array).toBe(simplePointArray);
        expect(this).toBe("this replaces `this`");
    }, "this replaces `this`");
    simplePointArray.forEach(function (element, index, array) {
        expect(element.y).toBe(plainArray[index]);
        expect(array).toBe(simplePointArray);
    });

    // Implement:
    // [x] length
    // [x] indexOf
    // [x] min
    // [x] max
    // [x] at
    // [x] forEach
    // [ ] find
    // [ ] map
    // [ ] filter
    // [ ] for(in of)
    // [ ] reduce
});

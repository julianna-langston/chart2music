/* eslint-disable @typescript-eslint/ban-ts-comment */
// Enabling an error condition to test error handling
import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";
import {
    validateInput,
    validateInputAxes,
    validateInputDataHomogeneity,
    validateInputDataRowHomogeneity,
    validateInputElement,
    validateInputType
} from "../src/validate";

const validTypes =
    "line, bar, band, pie, candlestick, histogram, box, matrix, scatter";

test("validateInputType", () => {
    expect(validateInputType()).toBe(
        `Required parameter 'type' was left undefined. Supported types are: ${validTypes}`
    );
    expect(
        // @ts-ignore - deliberately generating error condition
        validateInputType("invalid")
    ).toBe(`Invalid input type: invalid. Valid types are: ${validTypes}`);
    expect(
        // @ts-ignore - deliberately generating error condition
        validateInputType([SUPPORTED_CHART_TYPES.LINE, "invalid"])
    ).toBe(`Invalid input types: invalid. Valid types are: ${validTypes}`);
    expect(
        // @ts-ignore - deliberately generating error condition
        validateInputType(["invalid1", "invalid2"])
    ).toBe(
        `Invalid input types: invalid1, invalid2. Valid types are: ${validTypes}`
    );
    expect(validateInputType(SUPPORTED_CHART_TYPES.LINE)).toBe("");
    expect(
        validateInputType([
            SUPPORTED_CHART_TYPES.BAR,
            SUPPORTED_CHART_TYPES.LINE
        ])
    ).toBe("");
});

test("validateInputElement", () => {
    // @ts-ignore - deliberately generating error condition
    expect(validateInputElement()).toBe(
        "Required parameter 'element' was left undefined. An HTMLElement or SVGElement must be provided for this parameter."
    );
    // @ts-ignore - deliberately generating error condition
    expect(validateInputElement(3)).toBe(
        "Provided value for 'element' must be an instance of HTMLElement or SVGElement."
    );
    expect(validateInputElement(document.createElement("div"))).toBe("");
    expect(
        validateInputElement(
            document.createElementNS("http://www.w3.org/2000/svg", "svg")
        )
    ).toBe("");
});

test("validateInputAxes", () => {
    expect(validateInputAxes()).toBe("");
    expect(validateInputAxes({})).toBe("");
    // @ts-ignore - deliberately generating error condition
    expect(validateInputAxes({ invalid: {} })).toBe(
        "Unsupported axes were included: invalid. The only supported axes are: x, y, y2."
    );
    // @ts-ignore - deliberately generating error condition
    expect(validateInputAxes({ invalid: {}, invalid2: {} })).toBe(
        "Unsupported axes were included: invalid, invalid2. The only supported axes are: x, y, y2."
    );
    expect(
        validateInputAxes({
            y: {
                type: "linear"
            }
        })
    ).toBe("");
    expect(
        validateInputAxes({
            y: {
                type: "log10"
            }
        })
    ).toBe("");
    expect(
        validateInputAxes({
            y: {
                // @ts-ignore - deliberately generating error condition
                type: "invalid"
            }
        })
    ).toBe(
        `Axis y has an unsupported axis type "invalid". Valid axis types are: linear, log10.`
    );
    expect(
        validateInputAxes({
            y: {
                type: "log10",
                minimum: 0.01
            }
        })
    ).toBe("");
    expect(
        validateInputAxes({
            y: {
                type: "log10",
                minimum: 0
            }
        })
    ).toBe(
        `Axis y has type "log10", but has a minimum or maximum value of 0. No values <= 0 are supported for logarithmic axes.`
    );
    expect(
        validateInputAxes({
            y: {
                type: "log10",
                maximum: 0
            }
        })
    ).toBe(
        `Axis y has type "log10", but has a minimum or maximum value of 0. No values <= 0 are supported for logarithmic axes.`
    );
});

test("validateInput", () => {
    expect(
        validateInput({
            // @ts-ignore - deliberately generating error condition
            type: "invalid",
            // @ts-ignore - deliberately generating error condition
            element: "invalid"
        })
    ).toBe(
        `Invalid input type: invalid. Valid types are: ${validTypes}\nProvided value for 'element' must be an instance of HTMLElement or SVGElement.`
    );
});

test("validateInputDataRowHomogeneity", () => {
    // Confirm number homogeneity
    expect(validateInputDataRowHomogeneity([1, 2, 3, 4, 5])).toBe("");

    // @ts-ignore - deliberately generating error condition
    // Invalidate on number heterogeneity
    expect(validateInputDataRowHomogeneity([1, 2, "a", 4, 5])).toBe(
        `The first item is a number, but item index 2 is not (value: "a"). All items should be of the same type.`
    );

    // Confirm simple data point homogeneity
    expect(
        validateInputDataRowHomogeneity([
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 3 }
        ])
    ).toBe("");
    // Confirm simple data point homogeneity
    expect(
        validateInputDataRowHomogeneity([{ x: 1, y: 1 }, { x: 2, y: 2 }, 3])
    ).toBe(
        `The first item is a simple data point (x/y), but item index 2 is not (value: 3). All items should be of the same type.`
    );

    // Confirm simple data point homogeneity
    expect(
        validateInputDataRowHomogeneity([
            { x: 1, y2: 1 },
            { x: 2, y2: 2 },
            { x: 3, y2: 3 }
        ])
    ).toBe("");
    // Confirm simple data point homogeneity
    expect(
        validateInputDataRowHomogeneity([
            { x: 1, y2: 1 },
            { x: 2, y: 2 },
            { x: 3, y2: 3 }
        ])
    ).toBe(
        `The first item is an alternate axis data point (x/y2), but item index 1 is not (value: {"x":2,"y":2}). All items should be of the same type.`
    );

    // Confirm simple data point homogeneity
    expect(
        validateInputDataRowHomogeneity([
            { x: 1, high: 1, low: 1 },
            { x: 2, high: 2, low: 2 },
            { x: 3, high: 3, low: 3 }
        ])
    ).toBe("");
    // Confirm simple data point homogeneity
    expect(
        validateInputDataRowHomogeneity([
            { x: 1, high: 1, low: 1 },
            { x: 2, y: 2 },
            { x: 3, y2: 3 }
        ])
    ).toBe(
        `The first item is a high low data point (x/high/low), but item index 1 is not (value: {"x":2,"y":2}). All items should be of the same type.`
    );

    // Confirm simple data point homogeneity
    expect(
        validateInputDataRowHomogeneity([
            { x: 1, open: 1, high: 1, low: 1, close: 1 },
            { x: 2, open: 2, high: 2, low: 2, close: 2 },
            { x: 3, open: 3, high: 3, low: 3, close: 3 }
        ])
    ).toBe("");
    // Confirm simple data point homogeneity
    expect(
        validateInputDataRowHomogeneity([
            { x: 1, high: 1, low: 1, open: 1, close: 1 },
            { x: 2, high: 2, low: 1 },
            { x: 3, y2: 3 }
        ])
    ).toBe(
        `The first item is an OHLC data point (x/open/high/low/close), but item index 1 is not (value: {"x":2,"high":2,"low":1}). All items should be of the same type.`
    );

    // Confirm simple data point homogeneity
    expect(
        validateInputDataRowHomogeneity([
            { x: 0, low: 5.03, q1: 6.36, median: 6.91, q3: 7.34, high: 7.53 },
            { x: 1, low: 7.1, q1: 7.18, median: 7.25, q3: 7.33, high: 7.4 },
            { x: 2, low: 7.31, q1: 7.32, median: 7.32, q3: 7.33, high: 7.33 }
        ])
    ).toBe("");
    // Confirm simple data point homogeneity
    expect(
        validateInputDataRowHomogeneity([
            { x: 0, low: 5.03, q1: 6.36, median: 6.91, q3: 7.34, high: 7.53 },
            { x: 2, high: 2, low: 1 },
            { x: 3, y2: 3 }
        ])
    ).toBe(
        `The first item is a box data point (x/low/q1/median/q3/high), but item index 1 is not (value: {"x":2,"high":2,"low":1}). All items should be of the same type.`
    );
    expect(
        validateInputDataRowHomogeneity([
            { x: 0, low: 5.03, q1: 6.36, median: 6.91, q3: 7.34, high: 7.53 },
            // @ts-ignore: Deliberately using invalid data in order to test error handling
            {
                x: 1,
                low: 5.03,
                q1: 6.36,
                median: 6.91,
                q3: 7.34,
                high: 7.53,
                outlier: null
            }
        ])
    ).toBe(
        `At least one box provided an outlier that was not an array. An outliers should be an array of numbers. The box is question is: {"x":1,"low":5.03,"q1":6.36,"median":6.91,"q3":7.34,"high":7.53,"outlier":null}`
    );
    expect(
        validateInputDataRowHomogeneity([
            { x: 0, low: 5.03, q1: 6.36, median: 6.91, q3: 7.34, high: 7.53 },
            // @ts-ignore: Deliberately using invalid data in order to test error handling
            {
                x: 1,
                low: 5.03,
                q1: 6.36,
                median: 6.91,
                q3: 7.34,
                high: 7.53,
                outlier: 5
            }
        ])
    ).toBe(
        `At least one box provided an outlier that was not an array. An outliers should be an array of numbers. The box is question is: {"x":1,"low":5.03,"q1":6.36,"median":6.91,"q3":7.34,"high":7.53,"outlier":5}`
    );
    expect(
        validateInputDataRowHomogeneity([
            { x: 0, low: 5.03, q1: 6.36, median: 6.91, q3: 7.34, high: 7.53 },
            {
                x: 1,
                low: 5.03,
                q1: 6.36,
                median: 6.91,
                q3: 7.34,
                high: 7.53,
                outlier: [5]
            },
            // @ts-ignore: Deliberately using invalid data in order to test error handling
            {
                x: 2,
                low: 5.03,
                q1: 6.36,
                median: 6.91,
                q3: 7.34,
                high: 7.53,
                outlier: [5, null]
            }
        ])
    ).toBe(
        `At least one box has a non-numeric outlier. Box outliers must be an array of numbers. The box in question is: {"x":2,"low":5.03,"q1":6.36,"median":6.91,"q3":7.34,"high":7.53,"outlier":[5,null]}`
    );

    // @ts-ignore - deliberately generating error condition
    // Confirm number homogeneity
    expect(validateInputDataRowHomogeneity(["1", 2, 3, 4, 5])).toBe(
        `The first item is of an unrecognized type (value: "1"). Supported types are: number, simple data point (x/y), alternative axis data point (x/y2), and high low data point (x/high/low).`
    );

    expect(
        validateInputDataRowHomogeneity([
            // @ts-ignore
            { x: new Date(), y: 1 }
        ])
    ).toContain(
        "The first item is a date, which is not a supported format type"
    );
});

test("validateInputDataHomogeneity", () => {
    // Good, 1 row
    expect(validateInputDataHomogeneity([1, 2, 3, 4, 5])).toBe("");

    // Good, multiple rows
    expect(
        validateInputDataHomogeneity({
            a: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ],
            b: [
                { x: 1, y2: 1 },
                { x: 2, y2: 2 },
                { x: 3, y2: 3 }
            ]
        })
    ).toBe("");

    // @ts-ignore - deliberately generating error condition
    // Bad, 1 row
    expect(validateInputDataRowHomogeneity([1, 2, "a", 4, 5])).toBe(
        `The first item is a number, but item index 2 is not (value: "a"). All items should be of the same type.`
    );

    // Bad, multiple rows
    expect(
        validateInputDataHomogeneity({
            a: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ],
            b: [
                { x: 1, y2: 1 },
                { x: 2, y: 2 },
                { x: 3, y2: 3 }
            ]
        })
    ).toBe(
        `Error for data category b: The first item is an alternate axis data point (x/y2), but item index 1 is not (value: {"x":2,"y":2}). All items should be of the same type.`
    );
});

test("c2mChart validation", () => {
    // @ts-ignore
    const { err } = c2mChart({});
    expect(err).toBe(
        `Required parameter 'type' was left undefined. Supported types are: ${validTypes}\nRequired parameter 'element' was left undefined. An HTMLElement or SVGElement must be provided for this parameter.`
    );
});

test("validate img tag without cc property", () => {
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.BAR,
        element: document.createElement("img"),
        data: [1, 2, 3]
    });

    expect(err).toBe(
        "Error: If the target element is an IMG element, a CC property must be specified."
    );
});

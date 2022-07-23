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

test("validateInputType", () => {
    expect(validateInputType()).toBe(
        "Required parameter 'type' was left undefined. Supported types are: line, bar"
    );
    expect(
        // @ts-ignore - deliberately generating error condition
        validateInputType("invalid")
    ).toBe("Invalid input type: invalid. Valid types are: line, bar");
    expect(validateInputType(SUPPORTED_CHART_TYPES.LINE)).toBe("");
});

test("validateInputElement", () => {
    // @ts-ignore - deliberately generating error condition
    expect(validateInputElement()).toBe(
        "Required parameter 'element' was left undefined. An HTMLElement must be provided for this parameter."
    );
    // @ts-ignore - deliberately generating error condition
    expect(validateInputElement(3)).toBe(
        "Provided value for 'element' must be an instance of HTMLElement."
    );
    expect(validateInputElement(document.createElement("div"))).toBe("");
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
        "Invalid input type: invalid. Valid types are: line, bar\nProvided value for 'element' must be an instance of HTMLElement."
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

    // @ts-ignore - deliberately generating error condition
    // Confirm number homogeneity
    expect(validateInputDataRowHomogeneity(["1", 2, 3, 4, 5])).toBe(
        `The first item is of an unrecognized type (value: "1"). Supported types are: number, simple data point (x/y), alternative axis data point (x/y2), and high low data point (x/high/low).`
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
    const {err} = c2mChart({});
    expect(err).toBe("Required parameter 'type' was left undefined. Supported types are: line, bar\nRequired parameter 'element' was left undefined. An HTMLElement must be provided for this parameter.");
});
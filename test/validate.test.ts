/* eslint-disable @typescript-eslint/ban-ts-comment */
// Enabling an error condition to test error handling
import { SUPPORTED_CHART_TYPES } from "../src/types";
import {
    validateInput,
    validateInputAxes,
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

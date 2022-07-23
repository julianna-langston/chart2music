import type { SonifyTypes } from "./types";
import { SUPPORTED_CHART_TYPES } from "./types";

export const validateInput = (input: SonifyTypes) => {
    const errors = [];

    errors.push(validateInputType(input.type));
    errors.push(validateInputElement(input.element));
    errors.push(validateInputAxes(input.axes));

    return errors.filter((str) => str !== "").join("\n");
};

export const validateInputType = (type?: SUPPORTED_CHART_TYPES): string => {
    if (typeof type === "undefined") {
        return `Required parameter 'type' was left undefined. Supported types are: ${Object.values(
            SUPPORTED_CHART_TYPES
        ).join(", ")}`;
    }

    if (Object.values(SUPPORTED_CHART_TYPES).includes(type)) {
        return "";
    }

    return `Invalid input type: ${type}. Valid types are: ${Object.values(
        SUPPORTED_CHART_TYPES
    ).join(", ")}`;
};

export const validateInputElement = (element: HTMLElement) => {
    if (typeof element === "undefined") {
        return "Required parameter 'element' was left undefined. An HTMLElement must be provided for this parameter.";
    }

    if (element instanceof HTMLElement) {
        return "";
    }

    return "Provided value for 'element' must be an instance of HTMLElement.";
};

export const validateInputAxes = (axes?: SonifyTypes["axes"]) => {
    if (typeof axes === "undefined") {
        return "";
    }

    const supportedAxis = ["x", "y", "y2"];
    const unsupportedAxes = Object.keys(axes).filter(
        (axis) => !supportedAxis.includes(axis)
    );
    if (unsupportedAxes.length > 0) {
        return `Unsupported axes were included: ${unsupportedAxes.join(
            ", "
        )}. The only supported axes are: ${supportedAxis.join(", ")}.`;
    }

    return "";
};

import type { SupportedDataPointType } from "./dataPoint";
import {
    isAlternateAxisDataPoint,
    isHighLowDataPoint,
    isSimpleDataPoint,
    isOHLCDataPoint
} from "./dataPoint";
import type { SonifyTypes } from "./types";
import { SUPPORTED_CHART_TYPES } from "./types";

export const validateInput = (input: SonifyTypes) => {
    const errors = [];

    errors.push(validateInputType(input.type));
    errors.push(validateInputElement(input.element));
    errors.push(validateInputAxes(input.axes));
    errors.push(validateInputDataHomogeneity(input.data));

    return errors.filter((str) => str !== "").join("\n");
};

export const validateInputType = (
    type?: SUPPORTED_CHART_TYPES | SUPPORTED_CHART_TYPES[]
): string => {
    if (typeof type === "undefined") {
        return `Required parameter 'type' was left undefined. Supported types are: ${Object.values(
            SUPPORTED_CHART_TYPES
        ).join(", ")}`;
    }

    if (Array.isArray(type)) {
        const unsupported_types = type.filter(
            (str) => !Object.values(SUPPORTED_CHART_TYPES).includes(str)
        );
        if (unsupported_types.length === 0) {
            return "";
        }
        return `Invalid input types: ${unsupported_types.join(
            ", "
        )}. Valid types are: ${Object.values(SUPPORTED_CHART_TYPES).join(
            ", "
        )}`;
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

export const validateInputDataHomogeneity = (data: SonifyTypes["data"]) => {
    if (Array.isArray(data)) {
        return validateInputDataRowHomogeneity(data);
    }
    for (const key in data) {
        const result = validateInputDataRowHomogeneity(data[key]);
        if (result !== "") {
            return `Error for data category ${key}: ${result}`;
        }
    }
    return "";
};

export const validateInputDataRowHomogeneity = (
    row: (number | SupportedDataPointType)[]
) => {
    const first = row[0];
    if (typeof first === "number") {
        const failure = row.findIndex((cell) => !(typeof cell === "number"));
        if (failure === -1) {
            return "";
        }
        return `The first item is a number, but item index ${failure} is not (value: ${JSON.stringify(
            row[failure]
        )}). All items should be of the same type.`;
    }
    if (isSimpleDataPoint(first)) {
        const failure = row.findIndex((cell) => !isSimpleDataPoint(cell));
        if (failure === -1) {
            return "";
        }
        return `The first item is a simple data point (x/y), but item index ${failure} is not (value: ${JSON.stringify(
            row[failure]
        )}). All items should be of the same type.`;
    }
    if (isAlternateAxisDataPoint(first)) {
        const failure = row.findIndex(
            (cell) => !isAlternateAxisDataPoint(cell)
        );
        if (failure === -1) {
            return "";
        }
        return `The first item is an alternate axis data point (x/y2), but item index ${failure} is not (value: ${JSON.stringify(
            row[failure]
        )}). All items should be of the same type.`;
    }
    if (isOHLCDataPoint(first)) {
        const failure = row.findIndex((cell) => !isOHLCDataPoint(cell));
        if (failure === -1) {
            return "";
        }
        return `The first item is an OHLC data point (x/open/high/low/close), but item index ${failure} is not (value: ${JSON.stringify(
            row[failure]
        )}). All items should be of the same type.`;
    }
    if (isHighLowDataPoint(first)) {
        const failure = row.findIndex((cell) => !isHighLowDataPoint(cell));
        if (failure === -1) {
            return "";
        }
        return `The first item is a high low data point (x/high/low), but item index ${failure} is not (value: ${JSON.stringify(
            row[failure]
        )}). All items should be of the same type.`;
    }

    return `The first item is of an unrecognized type (value: ${JSON.stringify(
        first
    )}). Supported types are: number, simple data point (x/y), alternative axis data point (x/y2), and high low data point (x/high/low).`;
};

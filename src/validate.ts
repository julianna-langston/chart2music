import type { BoxDataPoint, SupportedDataPointType } from "./dataPoint";
import {
    isAlternateAxisDataPoint,
    isHighLowDataPoint,
    isSimpleDataPoint,
    isOHLCDataPoint,
    isBoxDataPoint
} from "./dataPoint";
import { AVAILABLE_LANGUAGES } from "./translator";
import type {
    ChartContainerType,
    SonifyTypes,
    SUPPORTED_CHART_TYPES
} from "./types";
import { SUPPORTED_TYPES_LIST } from "./types";

export const validateInput = (input: SonifyTypes) => {
    const errors = [];

    errors.push(validateInputType(input.type));
    errors.push(validateInputLang(input.lang));
    errors.push(validateInputElement(input.element));
    errors.push(validateInputAxes(input.axes));
    errors.push(validateInputDataHomogeneity(input.data));
    errors.push(validateCornerCases(input));
    errors.push(validateHierarchyReferences(input.data, input.options));
    errors.push(validateInputTypeCountsMatchData(input.type, input.data));

    return errors.filter((str) => str !== "").join("\n");
};

export const validateInputType = (
    type?: SUPPORTED_CHART_TYPES | SUPPORTED_CHART_TYPES[]
): string => {
    const supported_types_string = SUPPORTED_TYPES_LIST.join(", ");

    if (typeof type === "undefined") {
        return `Required parameter 'type' was left undefined. Supported types are: ${supported_types_string}`;
    }

    if (Array.isArray(type)) {
        const unsupported_types = type.filter(
            (str) => !SUPPORTED_TYPES_LIST.includes(str)
        );
        if (unsupported_types.length === 0) {
            return "";
        }
        return `Invalid input types: ${unsupported_types.join(
            ", "
        )}. Valid types are: ${supported_types_string}`;
    }

    if (SUPPORTED_TYPES_LIST.includes(type)) {
        return "";
    }

    return `Invalid input type: ${type}. Valid types are: ${supported_types_string}`;
};

export const validateInputLang = (lang?: string) => {
    if (typeof lang === "undefined") {
        return "";
    }

    if (AVAILABLE_LANGUAGES.includes(lang)) {
        return "";
    }

    return `Error: Unrecognized language "${lang}". Available languages: ${AVAILABLE_LANGUAGES.join(", ")}.`;
};

export const validateInputTypeCountsMatchData = (
    type: SUPPORTED_CHART_TYPES | SUPPORTED_CHART_TYPES[],
    data: SonifyTypes["data"]
) => {
    if (!Array.isArray(type)) {
        return "";
    }

    // If `type` is an array, confirm that the number of items matches the number of items in `data`
    const keys = Object.keys(data);
    if (type.length === keys.length) {
        return "";
    }

    return `Error: Number of types (${type.length}) and number of data groups (${keys.length}) don't match.`;
};

export const validateInputElement = (element: ChartContainerType) => {
    if (typeof element === "undefined") {
        return "Required parameter 'element' was left undefined. An HTMLElement or SVGElement must be provided for this parameter.";
    }

    if (element instanceof HTMLElement || element instanceof SVGElement) {
        return "";
    }

    return "Provided value for 'element' must be an instance of HTMLElement or SVGElement.";
};

const valid_axis_types = ["linear", "log10"];

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

    for (const axis in axes) {
        const thisAxis = axes[axis as keyof typeof axes];
        if (
            typeof thisAxis.type === "string" &&
            !valid_axis_types.includes(thisAxis.type)
        ) {
            return `Axis ${axis} has an unsupported axis type "${
                thisAxis.type
            }". Valid axis types are: ${valid_axis_types.join(", ")}.`;
        }
        if (
            thisAxis.type === "log10" &&
            (thisAxis.minimum === 0 || thisAxis.maximum === 0)
        ) {
            return `Axis ${axis} has type "log10", but has a minimum or maximum value of 0. No values <= 0 are supported for logarithmic axes.`;
        }
    }

    return "";
};

export const validateInputDataHomogeneity = (data: SonifyTypes["data"]) => {
    if (Array.isArray(data)) {
        return validateInputDataRowHomogeneity(data);
    }
    for (const key in data) {
        if (data[key] === null) {
            continue;
        }
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: TypeScript doesn't think it's possible for first.x to be a date. However, users calling
    // with vanilla javascript can still pass in a date, and they must be stopped.
    if (first.x instanceof Date) {
        return "The first item is a date, which is not a supported format type. Please re-submit with the ms version of the date. For example: `myDate.valueOf()`.";
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
    if (isBoxDataPoint(first)) {
        const failure = row.findIndex((cell) => !isBoxDataPoint(cell));
        if (failure >= 0) {
            return `The first item is a box data point (x/low/q1/median/q3/high), but item index ${failure} is not (value: ${JSON.stringify(
                row[failure]
            )}). All items should be of the same type.`;
        }

        // Find boxes with outliers that aren't arrays
        const nonArray = row.findIndex(
            (cell: BoxDataPoint) =>
                "outlier" in cell && !Array.isArray(cell.outlier)
        );
        if (nonArray >= 0) {
            return `At least one box provided an outlier that was not an array. An outliers should be an array of numbers. The box is question is: ${JSON.stringify(
                row[nonArray]
            )}`;
        }

        const nonArrayNumber = row.findIndex(
            (cell: BoxDataPoint) =>
                "outlier" in cell &&
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                cell.outlier.findIndex((o) => typeof o !== "number") >= 0
        );
        if (nonArrayNumber >= 0) {
            return `At least one box has a non-numeric outlier. Box outliers must be an array of numbers. The box in question is: ${JSON.stringify(
                row[nonArrayNumber]
            )}`;
        }
        return "";
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

export const validateCornerCases = (input: SonifyTypes) => {
    if (
        input.element instanceof HTMLImageElement &&
        typeof input.cc === "undefined"
    ) {
        return "Error: If the target element is an IMG element, a CC property must be specified.";
    }

    return "";
};

export const validateHierarchyReferences = (
    data: SonifyTypes["data"],
    options: SonifyTypes["options"] = {}
) => {
    const { root } = options;

    if (!root) {
        return "";
    }

    if (Array.isArray(data)) {
        return `Unexpected data structure. options.root="${root}", but "${root}" is not a key in data.
        Data is: ${JSON.stringify(data).replace(/^.{0,100}(.+)$/, "...")}`;
    }

    // Get all of the group names
    const groupNames = Object.keys(data);

    if (!groupNames.includes(root)) {
        return `Root points to group '${root}', but that group doesn't exist. Valid root values are: ${groupNames.join(
            ", "
        )}.`;
    }

    // Get all of the groups
    const groups = Object.values(data);

    // Go through each group, and find the "children" entries
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
        const group = groups[groupIndex];
        const groupName = groupNames[groupIndex];

        const omitter = (n) => n !== groupName && n !== root;

        if (!Array.isArray(group)) {
            continue;
        }

        for (let cell = 0; cell < group.length; cell++) {
            if (typeof group[cell] !== "object") {
                continue;
            }

            const { children } = group[cell] as SupportedDataPointType;
            if (!children) {
                continue;
            }

            if (typeof children !== "string") {
                return `Error: Group '${groupName}', point index ${cell}: Expected property 'children' to be of type string. Instead, it was of type '${typeof children}'.`;
            }

            if (!groupNames.includes(children)) {
                return `Error: Group '${groupName}', point index ${cell}: Property 'children' has value '${children}'. Unfortunately, that is not a valid value. Valid values are: ${groupNames
                    .filter(omitter)
                    .join(", ")}.`;
            }

            if (children === groupName) {
                return `Error: Group '${groupName}', point index ${cell}: Property 'children' has value '${children}'. Unfortunately, children are not allowed to refer to their own group. Valid values are: ${groupNames
                    .filter(omitter)
                    .join(", ")}.`;
            }

            if (children === root) {
                return `Error: Group '${groupName}', point index ${cell}: Property 'children' is pointing to the root value, which is invalid. Valid values are: ${groupNames
                    .filter(omitter)
                    .join(", ")}.`;
            }
        }
    }

    return "";
};

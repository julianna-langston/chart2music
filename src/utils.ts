import type {
    AlternateAxisDataPoint,
    OHLCDataPoint,
    SimpleDataPoint,
    SupportedDataPointType
} from "./dataPoint";
import {
    isOHLCDataPoint,
    isAlternateAxisDataPoint,
    isHighLowDataPoint,
    isSimpleDataPoint,
    isBoxDataPoint
} from "./dataPoint";
import type {
    AxisData,
    StatBundle,
    SUPPORTED_CHART_TYPES,
    validAxes,
    detectableDataPoint,
    groupedMetadata,
    SonifyTypes,
    dataSet,
    AxisScale
} from "./types";

export const interpolateBin = (
    point: number,
    min: number,
    max: number,
    bins: number,
    scale: AxisScale
) => {
    return scale === "linear"
        ? interpolateBinLinear(point, min, max, bins)
        : interpolateBinLog(point, min, max, bins);
};

const interpolateBinLinear = (
    point: number,
    min: number,
    max: number,
    bins: number
) => {
    const pct = (point - min) / (max - min);
    return Math.floor(bins * pct);
};

const interpolateBinLog = (
    pointRaw: number,
    minRaw: number,
    maxRaw: number,
    bins: number
) => {
    const point = Math.log10(pointRaw);
    const min = Math.log10(minRaw);
    const max = Math.log10(maxRaw);
    const pct = (point - min) / (max - min);
    return Math.floor(bins * pct);
};

export const calcPan = (pct: number) => (pct * 2 - 1) * 0.98;

/**
 *
 */
type SummaryTypes = {
    type: SUPPORTED_CHART_TYPES | SUPPORTED_CHART_TYPES[];
    title: string;
    dataRows: number;
    x: AxisData;
    y: AxisData;
    y2?: AxisData;
    live?: boolean;
};
export const generateSummary = ({
    type,
    title,
    dataRows,
    x,
    y,
    y2,
    live = false
}: SummaryTypes) => {
    const text = [];
    if (Array.isArray(type)) {
        text.push(
            `Sonified ${live ? "live " : ""}${type
                .sort()
                .join("-")} chart "${title}"`
        );
    } else {
        text.push(`Sonified ${live ? "live " : ""}${type} chart "${title}"`);
    }
    if (dataRows > 1) {
        text.push(`contains ${dataRows} categories`);
    }
    text.push(
        `x is "${x.label}" from ${x.format(x.minimum)} to ${x.format(
            x.maximum
        )}${x.type === "log10" ? " logarithmic" : ""}${
            x.continuous ? " continuously" : ""
        }`
    );
    text.push(
        `y is "${y.label}" from ${y.format(y.minimum)} to ${y.format(
            y.maximum
        )}${y.type === "log10" ? " logarithmic" : ""}`
    );

    if (y2) {
        text.push(
            `alternative y is "${y2.label}" from ${y2.format(
                y2.minimum
            )} to ${y2.format(y2.maximum)}${
                y.type === "log10" ? " logarithmic" : ""
            }`
        );
    }

    const isMobile = detectIfMobile();
    const keyboardMessage = `Use arrow keys to navigate.${
        live ? " Press M to toggle monitor mode." : ""
    } Press H for more hotkeys.`;
    const mobileMessage = `Swipe left or right to navigate. 2 finger swipe left or right to play the rest of the category.`;

    return `${text.join(", ")}. ${isMobile ? mobileMessage : keyboardMessage}`;
};

export const calculateAxisMinimum = (
    data: SupportedDataPointType[][],
    prop: "x" | "y" | "y2"
) => {
    const values: number[] = data
        .flat()
        .map((point: SupportedDataPointType): number => {
            if (isSimpleDataPoint(point)) {
                if (prop === "x" || prop === "y") {
                    return point[prop];
                }
            } else if (isAlternateAxisDataPoint(point)) {
                if (prop === "x" || prop === "y2") {
                    return point[prop];
                }
            } else if (isOHLCDataPoint(point)) {
                if (prop === "x") {
                    return point.x;
                }
                if (prop === "y") {
                    return Math.min(
                        point.high,
                        point.low,
                        point.open,
                        point.close
                    );
                }
            } else if (isHighLowDataPoint(point)) {
                if (prop === "x") {
                    return point.x;
                }
                if (prop === "y") {
                    return Math.min(point.high, point.low);
                }
            }
            return NaN;
        })
        .filter((num) => !isNaN(num));
    if (values.length === 0) {
        return NaN;
    }
    return Math.min(...values);
};
export const calculateAxisMaximum = (
    data: SupportedDataPointType[][],
    prop: "x" | "y" | "y2"
) => {
    const values: number[] = data
        .flat()
        .map((point: SupportedDataPointType): number => {
            if (isSimpleDataPoint(point)) {
                if (prop === "x" || prop === "y") {
                    return point[prop];
                }
            } else if (isAlternateAxisDataPoint(point)) {
                if (prop === "x" || prop === "y2") {
                    return point[prop];
                }
            } else if (isOHLCDataPoint(point)) {
                if (prop === "x") {
                    return point.x;
                }
                if (prop === "y") {
                    return Math.max(
                        point.high,
                        point.low,
                        point.open,
                        point.close
                    );
                }
            } else if (isHighLowDataPoint(point)) {
                if (prop === "x") {
                    return point.x;
                }
                if (prop === "y") {
                    return Math.max(point.high, point.low);
                }
            }
            return NaN;
        })
        .filter((num) => !isNaN(num));
    if (values.length === 0) {
        return NaN;
    }
    return Math.max(...values);
};

export const defaultFormat = (value: number) => `${value}`;

export const sentenceCase = (str: string) =>
    `${str.substring(0, 1).toUpperCase()}${str.substring(1).toLowerCase()}`;

export const generatePointDescription = (
    point: SupportedDataPointType,
    xFormat: AxisData["format"],
    yFormat: AxisData["format"],
    stat?: keyof StatBundle,
    outlierIndex: number | null = null
) => {
    if (isOHLCDataPoint(point)) {
        if (typeof stat !== "undefined") {
            return `${xFormat(point.x)}, ${yFormat(
                point[stat as keyof OHLCDataPoint]
            )}`;
        }
        return `${xFormat(point.x)}, ${yFormat(point.open)} - ${yFormat(
            point.high
        )} - ${yFormat(point.low)} - ${yFormat(point.close)}`;
    }

    if (isBoxDataPoint(point) && outlierIndex !== null) {
        return `${xFormat(point.x)}, ${yFormat(point.outlier[outlierIndex])}, ${
            outlierIndex + 1
        } of ${point.outlier.length}`;
    }

    if (isBoxDataPoint(point) || isHighLowDataPoint(point)) {
        if (typeof stat !== "undefined") {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return `${xFormat(point.x)}, ${yFormat(point[stat])}`;
        }
        const outlierNote =
            "outlier" in point && point.outlier?.length > 0
                ? `, with ${point.outlier.length} outliers`
                : "";
        return `${xFormat(point.x)}, ${yFormat(point.high)} - ${yFormat(
            point.low
        )}${outlierNote}`;
    }

    if (isSimpleDataPoint(point)) {
        return `${xFormat(point.x)}, ${yFormat(point.y)}`;
    }

    if (isAlternateAxisDataPoint(point)) {
        return `${xFormat(point.x)}, ${yFormat(point.y2)}`;
    }

    return "";
};

export const usesAxis = (
    data: SupportedDataPointType[][],
    axisName: "x" | "y" | "y2"
) => {
    const firstUseOfAxis = data.find((row) => {
        return row.find((point) => axisName in point);
    });
    return typeof firstUseOfAxis !== "undefined";
};

/**
 * Determine metadata about data sets, to help users navigate more effectively
 *
 * @param data - the X/Y values
 */
export const calculateMetadataByGroup = (
    data: SupportedDataPointType[][]
): groupedMetadata[] => {
    return data.map((row, index) => {
        let yValues: number[] = [];
        let availableStats = [];
        if (isSimpleDataPoint(row[0])) {
            yValues = (row as SimpleDataPoint[]).map(({ y }) => y);
        } else if (isAlternateAxisDataPoint(row[0])) {
            yValues = (row as AlternateAxisDataPoint[]).map(({ y2 }) => y2);
        } else if (isOHLCDataPoint(row[0])) {
            // Don't calculate min/max for high/low
            availableStats = ["open", "high", "low", "close"];
        } else if (isBoxDataPoint(row[0])) {
            availableStats = ["high", "q3", "median", "q1", "low", "outlier"];
        } else if (isHighLowDataPoint(row[0])) {
            // Don't calculate min/max for high/low
            availableStats = ["high", "low"];
        }

        const filteredYValues = yValues.filter((num) => !isNaN(num));

        // Calculate min/max
        // (set to -1 if there are no values to calculate, such as in the case of OHLC data)
        const [min, max] =
            filteredYValues.length > 0
                ? [Math.min(...filteredYValues), Math.max(...filteredYValues)]
                : [-1, -1];

        // Calculate tenths
        const tenths = Math.round(row.length / 10);

        return {
            index,
            minimumPointIndex: yValues.indexOf(min),
            maximumPointIndex: yValues.indexOf(max),
            minimumValue: min,
            maximumValue: max,
            tenths,
            availableStats,
            statIndex: -1,
            inputType: detectDataPointType(row[0])
        };
    });
};

/**
 * Initialize internal representation of axis metadata. Providing metadata is optional, so we
 * need to generate metadata that hasn't been provided.
 *
 * @param data - the X/Y values
 * @param axisName - which axis is this? "x" or "y"
 * @param userAxis - metadata provided by the invocation
 */
export const initializeAxis = (
    data: SupportedDataPointType[][],
    axisName: validAxes,
    userAxis?: AxisData
): AxisData => {
    const format =
        userAxis?.format ??
        ("valueLabels" in userAxis
            ? (index) => userAxis.valueLabels[index]
            : defaultFormat);

    return {
        minimum: userAxis?.minimum ?? calculateAxisMinimum(data, axisName),
        maximum: userAxis?.maximum ?? calculateAxisMaximum(data, axisName),
        label: userAxis?.label ?? "",
        type: userAxis?.type ?? "linear",
        format,
        continuous: userAxis.continuous ?? false
    };
};

export const detectDataPointType = (query: unknown): detectableDataPoint => {
    if (typeof query === "number") {
        return "number";
    }
    if (typeof query !== "object") {
        return "unknown";
    }

    if (isSimpleDataPoint(query)) {
        return "SimpleDataPoint";
    }

    if (isAlternateAxisDataPoint(query)) {
        return "AlternativeAxisDataPoint";
    }

    if (isOHLCDataPoint(query)) {
        return "OHLCDataPoint";
    }

    if (isBoxDataPoint(query)) {
        return "BoxDataPoint";
    }

    if (isHighLowDataPoint(query)) {
        return "HighLowDataPoint";
    }

    return "unknown";
};

export const convertDataRow = (row: (SupportedDataPointType | number)[]) => {
    return row.map((point: number | SupportedDataPointType, index: number) => {
        if (typeof point === "number") {
            return {
                x: index,
                y: point
            } as SupportedDataPointType;
        }
        return point;
    });
};

export const formatWrapper = (axis: AxisData) => {
    const format = (num: number) => {
        if (isNaN(num)) {
            return "missing";
        }
        if (axis.minimum && num < axis.minimum) {
            return "too low";
        }
        if (axis.maximum && num > axis.maximum) {
            return "too high";
        }
        return axis.format(num);
    };

    return format;
};

export const isUnplayable = (yValue: number, yAxis: AxisData) => {
    return isNaN(yValue) || yValue < yAxis.minimum || yValue > yAxis.maximum;
};

export const prepChartElement = (elem: HTMLElement, title: string) => {
    if (!elem.hasAttribute("alt") && !elem.hasAttribute("aria-label")) {
        elem.setAttribute("aria-label", `${title}, Sonified chart`);
    }

    if (!elem.hasAttribute("role")) {
        elem.setAttribute("role", "application");
    }
};

export const checkForNumberInput = (
    metadataByGroup: groupedMetadata[],
    data: SonifyTypes["data"]
) => {
    if (Array.isArray(data) && typeof data[0] === "number") {
        metadataByGroup[0].inputType = "number";
    } else {
        let index = 0;
        for (const group in data) {
            if (detectDataPointType((data as dataSet)[group][0]) === "number") {
                metadataByGroup[index].inputType = "number";
            }
            index++;
        }
    }

    return metadataByGroup;
};

// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
export const detectIfMobile = () => {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
};

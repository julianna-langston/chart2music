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
import type { translateEvaluators } from "./translations";
import type {
    AxisData,
    StatBundle,
    validAxes,
    detectableDataPoint,
    groupedMetadata,
    SonifyTypes,
    dataSet,
    AxisScale,
    ChartContainerType
} from "./types";

export const interpolateBin = ({
    point,
    min,
    max,
    bins,
    scale
}: {
    point: number;
    min: number;
    max: number;
    bins: number;
    scale: AxisScale;
}) => {
    return scale === "linear"
        ? interpolateBinLinear({ point, min, max, bins })
        : interpolateBinLog({
              pointRaw: point,
              minRaw: min,
              maxRaw: max,
              bins
          });
};

const interpolateBinLinear = ({
    point,
    min,
    max,
    bins
}: {
    point: number;
    min: number;
    max: number;
    bins: number;
}) => {
    const pct = (point - min) / (max - min);
    return Math.floor(bins * pct);
};

const interpolateBinLog = ({
    pointRaw,
    minRaw,
    maxRaw,
    bins
}: {
    pointRaw: number;
    minRaw: number;
    maxRaw: number;
    bins: number;
}) => {
    const point = Math.log10(pointRaw);
    const min = Math.log10(minRaw);
    const max = Math.log10(maxRaw);
    const pct = (point - min) / (max - min);
    return Math.floor(bins * pct);
};

export const calcPan = (pct: number) => (isNaN(pct) ? 0 : (pct * 2 - 1) * 0.98);

const isNotNull = (tmp: unknown) => tmp !== null;

export const calculateAxisMinimum = ({
    data,
    prop,
    filterGroupIndex
}: {
    data: SupportedDataPointType[][];
    prop: "x" | "y" | "y2";
    filterGroupIndex?: number;
}) => {
    let dataToProcess: SupportedDataPointType[] = data.flat().filter(isNotNull);

    if (filterGroupIndex >= 0 && filterGroupIndex < data.length) {
        dataToProcess = data.at(filterGroupIndex);
    }

    const values: number[] = dataToProcess
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
export const calculateAxisMaximum = ({
    data,
    prop,
    filterGroupIndex
}: {
    data: SupportedDataPointType[][];
    prop: "x" | "y" | "y2";
    filterGroupIndex?: number;
}) => {
    let dataToProcess: SupportedDataPointType[] = data.flat().filter(isNotNull);

    if (filterGroupIndex >= 0 && filterGroupIndex < data.length) {
        dataToProcess = data.at(filterGroupIndex);
    }

    const values: number[] = dataToProcess
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

export const generatePointDescription = ({
    point,
    xFormat = defaultFormat,
    yFormat = defaultFormat,
    stat,
    outlierIndex = null,
    announcePointLabelFirst = false,
    translationCallback
}: {
    point: SupportedDataPointType;
    xFormat?: AxisData["format"];
    yFormat?: AxisData["format"];
    stat?: keyof StatBundle;
    outlierIndex?: number | null;
    announcePointLabelFirst?: boolean;
    translationCallback: (
        code: string,
        evaluators?: translateEvaluators
    ) => string;
}) => {
    if (isOHLCDataPoint(point)) {
        if (typeof stat !== "undefined") {
            return translationCallback("point-xy", {
                x: xFormat(point.x),
                y: yFormat(point[stat as keyof OHLCDataPoint] as number)
            });
        }
        return translationCallback("point-xohlc", {
            x: xFormat(point.x),
            open: yFormat(point.open),
            high: yFormat(point.high),
            low: yFormat(point.low),
            close: yFormat(point.close)
        });
    }

    if (isBoxDataPoint(point) && outlierIndex !== null) {
        return translationCallback("point-outlier", {
            x: xFormat(point.x),
            y: point.outlier.at(outlierIndex),
            index: outlierIndex + 1,
            count: point.outlier.length
        });
    }

    if (isBoxDataPoint(point) || isHighLowDataPoint(point)) {
        if (typeof stat !== "undefined") {
            return translationCallback("point-xy", {
                x: xFormat(point.x),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                y: yFormat(point[stat])
            });
        }

        const { x, high, low } = point;
        const formattedPoint = {
            x: xFormat(x),
            high: yFormat(high),
            low: yFormat(low)
        };

        if ("outlier" in point && point.outlier?.length > 0) {
            return translationCallback("point-xhl-outlier", {
                ...formattedPoint,
                count: point.outlier.length
            });
        }

        return translationCallback("point-xhl", formattedPoint);
    }

    if (isSimpleDataPoint(point)) {
        // Fast path: simple point without a label
        if (!point.label) {
            return translationCallback("point-xy", {
                x: xFormat(point.x),
                y: yFormat(point.y),
                ...(point._stackBreakdown && {
                    stackBreakdown: point._stackBreakdown
                })
            });
        }

        // Point with label: use point-xy-label template
        return translationCallback("point-xy-label", {
            x: xFormat(point.x),
            y: yFormat(point.y),
            label: point.label,
            announcePointLabelFirst,
            ...(point._stackBreakdown && {
                stackBreakdown: point._stackBreakdown
            })
        });
    }

    if (isAlternateAxisDataPoint(point)) {
        return translationCallback("point-xy", {
            x: xFormat(point.x),
            y: yFormat(point.y2)
        });
    }

    return "";
};

export const usesAxis = ({
    data,
    axisName
}: {
    data: SupportedDataPointType[][];
    axisName: "x" | "y" | "y2";
}) => {
    const firstUseOfAxis = data.filter(isNotNull).find((row) => {
        return row.find((point) => axisName in point);
    });
    return typeof firstUseOfAxis !== "undefined";
};

/**
 * Determine metadata about data sets, to help users navigate more effectively
 * @param data - the X/Y values
 */
export const calculateMetadataByGroup = (
    data: (SupportedDataPointType[] | null)[]
): groupedMetadata[] => {
    return data.map((row, index) => {
        if (row === null) {
            return {
                index,
                minimumPointIndex: null,
                maximumPointIndex: null,
                minimumValue: NaN,
                maximumValue: NaN,
                tenths: NaN,
                availableStats: [],
                statIndex: -1,
                inputType: null,
                size: 0
            };
        }

        let yValues: number[] = [];
        let availableStats = [];
        if (isSimpleDataPoint(row.at(0))) {
            yValues = (row as SimpleDataPoint[]).map(({ y }) => y);
        } else if (isAlternateAxisDataPoint(row.at(0))) {
            yValues = (row as AlternateAxisDataPoint[]).map(({ y2 }) => y2);
        } else if (isOHLCDataPoint(row.at(0))) {
            // Don't calculate min/max for high/low
            availableStats = ["open", "high", "low", "close"];
        } else if (isBoxDataPoint(row.at(0))) {
            availableStats = ["high", "q3", "median", "q1", "low", "outlier"];
        } else if (isHighLowDataPoint(row.at(0))) {
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
            inputType: detectDataPointType(row.at(0)),
            size: row.length
        };
    });
};

/**
 * Initialize internal representation of axis metadata. Providing metadata is optional, so we
 * need to generate metadata that hasn't been provided.
 * @param props -
 * @param props.data - the X/Y values
 * @param props.axisName - which axis is this? "x" or "y"
 * @param props.userAxis - metadata provided by the invocation
 * @param props.filterGroupIndex -
 */
export const initializeAxis = ({
    data,
    axisName,
    userAxis,
    filterGroupIndex
}: {
    data: SupportedDataPointType[][];
    axisName: validAxes;
    userAxis?: AxisData;
    filterGroupIndex?: number;
}): AxisData => {
    const format =
        userAxis?.format ??
        ("valueLabels" in userAxis
            ? (index) => userAxis.valueLabels[index]
            : defaultFormat);

    return {
        minimum:
            userAxis?.minimum ??
            calculateAxisMinimum({ data, prop: axisName, filterGroupIndex }),
        maximum:
            userAxis?.maximum ??
            calculateAxisMaximum({ data, prop: axisName, filterGroupIndex }),
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

export const convertDataRow = (
    row: (SupportedDataPointType | number)[] | null
) => {
    if (row === null) {
        return null;
    }

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

export const formatWrapper = ({
    axis,
    translationCallback
}: {
    axis: AxisData;
    translationCallback: (
        code: string,
        evaluators?: translateEvaluators
    ) => string;
}) => {
    const format = (num: number) => {
        if (isNaN(num)) {
            return translationCallback("missing");
        }
        if (typeof axis.minimum === "number" && num < axis.minimum) {
            return translationCallback("tooLow");
        }
        if (typeof axis.maximum === "number" && num > axis.maximum) {
            return translationCallback("tooHigh");
        }
        return axis.format(num);
    };

    return format;
};

/**
 *
 */
type ChartSummaryType = {
    groupCount: number;
    title: string;
    live?: boolean;
    hierarchy?: boolean;
    translationCallback: (
        code: string,
        evaluators?: translateEvaluators
    ) => string;
};
export const generateChartSummary = ({
    title,
    groupCount,
    live = false,
    hierarchy = false,
    translationCallback
}: ChartSummaryType) => {
    const text = ["summ", "chart"];

    if (live) {
        text.push("live");
    }

    if (hierarchy) {
        text.push("hier");
    }

    if (groupCount > 1) {
        text.push("group");
    }

    if (title.length > 0) {
        text.push("title");
    }

    return translationCallback(text.join("-"), {
        groupCount,
        title
    });
};

const axisDescriptions = {
    x: "X",
    y: "Y",
    y2: "Alternate Y"
};
export const generateAxisSummary = ({
    axisLetter,
    axis,
    translationCallback
}: {
    axisLetter: "x" | "y" | "y2";
    axis: AxisData;
    translationCallback: (
        code: string,
        evaluators?: translateEvaluators
    ) => string;
}) => {
    const code = ["axis", "desc"];

    if (axis.type === "log10") {
        code.push("log");
    }

    if (axisLetter === "x" && axis.continuous) {
        code.push("con");
    }

    return translationCallback(code.join("-"), {
        letter: axisDescriptions[axisLetter],
        label: axis.label ?? "",
        min: axis.format(axis.minimum),
        max: axis.format(axis.maximum)
    });
};

/**
 *
 */
type InstructionsType = {
    hierarchy: boolean;
    live: boolean;
    hasNotes: boolean;
    translationCallback: (
        code: string,
        evaluators?: translateEvaluators
    ) => string;
};
export const generateInstructions = ({
    hierarchy,
    live,
    hasNotes,
    translationCallback
}: InstructionsType) => {
    const keyboardMessage = filteredJoin(
        [
            translationCallback("instructionArrows"),
            hierarchy && translationCallback("instructionHierarchy"),
            live && translationCallback("instructionLive"),
            translationCallback("instructionHotkeys")
        ],
        " "
    );

    const info = [keyboardMessage];

    if (hasNotes) {
        info.unshift("Has notes.");
    }
    return info.join(" ");
};

export const isUnplayable = (yValue: number, yAxis: AxisData) => {
    return isNaN(yValue) || yValue < yAxis.minimum || yValue > yAxis.maximum;
};

export const prepChartElement = ({
    elem,
    title,
    translationCallback,
    addCleanupTask
}: {
    elem: ChartContainerType;
    title: string;
    translationCallback: (
        code: string,
        evaluators?: translateEvaluators
    ) => string;
    addCleanupTask: (fn: () => void) => void;
}) => {
    if (!elem.hasAttribute("alt") && !elem.hasAttribute("aria-label")) {
        const label = title
            ? translationCallback("description", { title })
            : translationCallback("description-untitled");
        elem.setAttribute("aria-label", label);
        addCleanupTask(() => elem.removeAttribute("aria-label"));
    }

    if (!elem.hasAttribute("role")) {
        elem.setAttribute("role", "application");
        addCleanupTask(() => elem.removeAttribute("role"));
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
            const row = (data as dataSet)[group];
            if (
                row !== null &&
                Array.isArray(row) &&
                detectDataPointType(row.at(0)) === "number"
            ) {
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

export const filteredJoin = (arr: string[], joiner: string) =>
    arr.filter((item) => Boolean(item)).join(joiner);

export const determineCC = (
    containerElement: ChartContainerType,
    cleanUpFnCallback: (fn: () => void) => void,
    providedCC?: HTMLElement
): HTMLElement => {
    if (providedCC) {
        return providedCC;
    }

    const generatedCC = document.createElement("div");
    containerElement.appendChild(generatedCC);
    cleanUpFnCallback(() => {
        generatedCC.remove();
    });
    return generatedCC;
};

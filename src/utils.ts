import type { OHLCDataPoint, SupportedDataPointType } from "./dataPoint";
import {
    isOHLCDataPoint,
    isAlternateAxisDataPoint,
    isHighLowDataPoint,
    isSimpleDataPoint,
    isBoxDataPoint
} from "./dataPoint";
import { translate } from "./translator";
import type {
    AxisData,
    StatBundle,
    validAxes,
    detectableDataPoint,
    groupedMetadata,
    SonifyTypes,
    dataSet,
    AxisScale
} from "./types";
import type { RowArrayAdapter } from "./rowArrayAdapter";
import { isRowArrayAdapter } from "./rowArrayAdapter";

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

export const calcPan = (pct: number) => (isNaN(pct) ? 0 : (pct * 2 - 1) * 0.98);

const isNotNull = (tmp: unknown) => tmp !== null;

/**
 * calculateRowMinimum will return [index, value] for the lowest value in the data row (a row is like a graph line, or trace, or function).
 * @param row - the row in question
 * @param prop - the name of property used to calculate the minimum ('y', 'y2', etc)
 * @returns [index, value] - the index and value of the minimum
 */
function calculateRowMinimum(
    row: SupportedDataPointType[] | RowArrayAdapter<SupportedDataPointType>,
    prop: string
): [number, number] {
    // [index, value]
    if (!row) return [-1, NaN];
    if (isRowArrayAdapter(row)) return row.minWithIndex(prop);
    return row.reduce(
        (
            localMinimum: [number, number],
            point: SupportedDataPointType,
            currentIndex: number
        ): [number, number] => {
            let val: number = NaN;
            if (prop in point) {
                val = point[prop] as number;
            } else if (isOHLCDataPoint(point) && prop === "y") {
                val = Math.min(point.high, point.low, point.open, point.close);
            } else if (isHighLowDataPoint(point) && prop === "y") {
                val = Math.min(point.high, point.low);
            } else {
                return localMinimum;
            }
            if (isNaN(val) || val === null) {
                return localMinimum;
            }
            if (isNaN(localMinimum[1])) {
                return [currentIndex, val];
            }
            return val < localMinimum[1] ? [currentIndex, val] : localMinimum;
        },
        [-1, NaN] // Initial value of reduce()
    );
}

// Question: Howcome the pre-adapter code didn't support Boxpoint for minimum/maximum?
export const calculateAxisMinimum = (
    data: (
        | SupportedDataPointType[]
        | RowArrayAdapter<SupportedDataPointType>
    )[],
    prop: "x" | "y" | "y2",
    filterGroupIndex?: number
) => {
    if (filterGroupIndex >= 0 && filterGroupIndex < data.length) {
        data = [data[filterGroupIndex]];
    }

    const localMinimums: number[] = data
        .map((row) => calculateRowMinimum(row, prop)[1])
        .filter((num) => !isNaN(num));
    if (localMinimums.length === 0) {
        return NaN;
    }
    return Math.min(...localMinimums);
};

/**
 * calculateRowMaximum will return [index, value] for the highest value in the data row (a row is like a graph line, or trace, or function).
 * @param row - the row in question
 * @param prop - the name of property used to calculate the maximum ('y', 'y2', etc)
 * @returns [index, value] - the index and value of the maximum
 */
function calculateRowMaximum(
    row: SupportedDataPointType[] | RowArrayAdapter<SupportedDataPointType>,
    prop: string
): [number, number] {
    if (!row) return [-1, NaN];
    if (isRowArrayAdapter(row)) return row.maxWithIndex(prop);
    return row.reduce(
        (
            localMaximum: [number, number],
            point: SupportedDataPointType,
            currentIndex: number
        ): [number, number] => {
            let val: number = NaN;
            if (prop in point) {
                val = point[prop] as number;
            } else if (isOHLCDataPoint(point) && prop === "y") {
                val = Math.max(point.high, point.low, point.open, point.close);
            } else if (isHighLowDataPoint(point) && prop === "y") {
                val = Math.max(point.high, point.low);
            } else return localMaximum;
            if (isNaN(val) || val === null) {
                return localMaximum;
            }
            if (isNaN(localMaximum[1])) {
                return [currentIndex, val];
            }
            return val > localMaximum[1] ? [currentIndex, val] : localMaximum;
        },
        [-1, NaN] // Initial value of reduce()
    );
}

export const calculateAxisMaximum = (
    data: (
        | SupportedDataPointType[]
        | RowArrayAdapter<SupportedDataPointType>
    )[],
    prop: "x" | "y" | "y2",
    filterGroupIndex?: number
) => {
    if (filterGroupIndex >= 0 && filterGroupIndex < data.length) {
        data = [data[filterGroupIndex]];
    }

    const localMaximums: number[] = data
        .map((row) => calculateRowMaximum(row, prop)[1])
        .filter((num) => !isNaN(num));
    if (localMaximums.length === 0) {
        return NaN;
    }
    return Math.max(...localMaximums);
};

export const defaultFormat = (value: number) => `${value}`;

export const generatePointDescription = (
    language: string,
    point: SupportedDataPointType,
    xFormat: AxisData["format"],
    yFormat: AxisData["format"],
    stat?: keyof StatBundle,
    outlierIndex: number | null = null,
    announcePointLabelFirst = false
) => {
    if (isOHLCDataPoint(point)) {
        if (typeof stat !== "undefined") {
            return translate(language, "point-xy", {
                x: xFormat(point.x),
                y: yFormat(point[stat as keyof OHLCDataPoint] as number)
            });
        }
        // @ts-expect-error: ts weirdness. It doesn't think "open"/"high"/"low"/"close"/"x" are strings.
        return translate(language, "point-xohlc", point);
    }

    if (isBoxDataPoint(point) && outlierIndex !== null) {
        return translate(language, "point-outlier", {
            x: xFormat(point.x),
            y: point.outlier.at(outlierIndex),
            index: outlierIndex + 1,
            count: point.outlier.length
        });
    }

    if (isBoxDataPoint(point) || isHighLowDataPoint(point)) {
        if (typeof stat !== "undefined") {
            return translate(language, "point-xy", {
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
            return translate(language, "point-xhl-outlier", {
                ...formattedPoint,
                count: point.outlier.length
            });
        }

        return translate(language, "point-xhl", formattedPoint);
    }

    if (isSimpleDataPoint(point)) {
        const details = [xFormat(point.x), yFormat(point.y)];
        if (point.label) {
            if (announcePointLabelFirst) {
                details.unshift(point.label);
            } else {
                details.push(point.label);
            }
        }
        return details.join(", ");
    }

    if (isAlternateAxisDataPoint(point)) {
        return translate(language, "point-xy", {
            x: xFormat(point.x),
            y: yFormat(point.y2)
        });
    }

    return "";
};

export const usesAxis = (
    data: (
        | SupportedDataPointType[]
        | RowArrayAdapter<SupportedDataPointType>
    )[],
    axisName: "x" | "y" | "y2"
): boolean => {
    const firstUseOfAxis = data.filter(isNotNull).find((row) => {
        if (isRowArrayAdapter(row)) {
            if (row.length === 0) return false;
            // RowArrayAdapter doesn't support heterogenous data arrays,
            // so its either 0 or not there
            return axisName in row.at(0);
        } else {
            return row.find((point) => axisName in point);
        }
    });
    return typeof firstUseOfAxis !== "undefined"; // firstUseOfAxis
};

/**
 * Determine metadata about data sets, to help users navigate more effectively
 * @param data - the X/Y values
 */
export const calculateMetadataByGroup = (
    data: (
        | SupportedDataPointType[]
        | RowArrayAdapter<SupportedDataPointType>
        | null
    )[]
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

        let min = -1,
            indexMin = -1,
            max = -1,
            indexMax = -1;
        let availableStats = [];
        const firstPoint = row.at(0);
        if (isSimpleDataPoint(firstPoint)) {
            [indexMin, min] = calculateRowMinimum(row, "y");
            [indexMax, max] = calculateRowMaximum(row, "y");
        } else if (isAlternateAxisDataPoint(firstPoint)) {
            [indexMin, min] = calculateRowMinimum(row, "y2");
            [indexMax, max] = calculateRowMaximum(row, "y2");
        } else if (isOHLCDataPoint(firstPoint)) {
            // Don't calculate min/max for high/low
            availableStats = ["open", "high", "low", "close"];
        } else if (isBoxDataPoint(firstPoint)) {
            availableStats = ["high", "q3", "median", "q1", "low", "outlier"];
        } else if (isHighLowDataPoint(firstPoint)) {
            // Don't calculate min/max for high/low
            availableStats = ["high", "low"];
        }

        // Calculate tenths
        const tenths = Math.round(row.length / 10);

        return {
            index,
            minimumPointIndex: indexMin,
            maximumPointIndex: indexMax,
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
 * @param data - the X/Y values
 * @param axisName - which axis is this? "x" or "y"
 * @param userAxis - metadata provided by the invocation
 * @param filterGroupIndex -
 */
export const initializeAxis = (
    data: (
        | SupportedDataPointType[]
        | RowArrayAdapter<SupportedDataPointType>
    )[],
    axisName: validAxes,
    userAxis?: AxisData,
    filterGroupIndex?: number
): AxisData => {
    const format =
        userAxis?.format ??
        ("valueLabels" in userAxis
            ? (index) => userAxis.valueLabels[index]
            : defaultFormat);

    return {
        minimum:
            userAxis?.minimum ??
            calculateAxisMinimum(data, axisName, filterGroupIndex),
        maximum:
            userAxis?.maximum ??
            calculateAxisMaximum(data, axisName, filterGroupIndex),
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
    row:
        | (SupportedDataPointType | number)[]
        | RowArrayAdapter<SupportedDataPointType>
        | null
) => {
    if (row === null) {
        return null;
    }
    // If it's already a rowArrayAdapter we def don't need to do a conversion
    if (isRowArrayAdapter(row)) return row;
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

export const formatWrapper = (axis: AxisData, language: string) => {
    const format = (num: number) => {
        if (isNaN(num)) {
            return translate(language, "missing");
        }
        if (axis.minimum && num < axis.minimum) {
            return translate(language, "tooLow");
        }
        if (axis.maximum && num > axis.maximum) {
            return translate(language, "tooHigh");
        }
        return axis.format(num);
    };

    return format;
};

/**
 *
 */
type ChartSummaryType = {
    language: string;
    groupCount: number;
    title: string;
    live?: boolean;
    hierarchy?: boolean;
};
export const generateChartSummary = ({
    language,
    title,
    groupCount,
    live = false,
    hierarchy = false
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

    return translate(language, text.join("-"), {
        groupCount,
        title
    });
};

const axisDescriptions = {
    x: "X",
    y: "Y",
    y2: "Alternate Y"
};
export const generateAxisSummary = (
    axisLetter: "x" | "y" | "y2",
    axis: AxisData,
    language: string
) => {
    const code = ["axis", "desc"];
    if (axis.type === "log10") {
        code.push("log");
    }
    if (axisLetter === "x" && axis.continuous) {
        code.push("con");
    }

    return translate(language, code.join("-"), {
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
    language: string;
};
export const generateInstructions = ({
    hierarchy,
    live,
    hasNotes,
    language
}: InstructionsType) => {
    const keyboardMessage = filteredJoin(
        [
            translate(language, "instructionArrows"),
            hierarchy && translate(language, "instructionHierarchy"),
            live && translate(language, "instructionLive"),
            translate(language, "instructionHotkeys")
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

export const prepChartElement = (
    elem: HTMLElement,
    title: string,
    language: string,
    addCleanupTask: (fn: () => void) => void
) => {
    if (!elem.hasAttribute("alt") && !elem.hasAttribute("aria-label")) {
        elem.setAttribute(
            "aria-label",
            translate(language, "description", { title })
        );
        addCleanupTask(() => elem.removeAttribute("aria-label"));
    }

    if (!elem.hasAttribute("role")) {
        elem.setAttribute("role", "application");
        addCleanupTask(() => elem.removeAttribute("role"));
    }
};

export const checkForNumberInput = (
    // TODO What is this lol
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

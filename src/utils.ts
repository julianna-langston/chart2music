import type {
    AxisData,
    dataPoint,
    StatBundle,
    SUPPORTED_CHART_TYPES
} from "./types";

export const interpolateBin = (
    point: number,
    min: number,
    max: number,
    bins: number
) => {
    const pct = (point - min) / (max - min);
    return Math.floor(bins * pct);
};
export const calcPan = (pct: number) => (pct * 2 - 1) * 0.98;

/**
 *
 */
type SummaryTypes = {
    type: SUPPORTED_CHART_TYPES;
    title: string;
    dataRows: number;
    x: AxisData;
    y: AxisData;
    y2?: AxisData;
};
export const generateSummary = ({
    type,
    title,
    dataRows,
    x,
    y,
    y2
}: SummaryTypes) => {
    const text = [`Sonified ${type} chart "${title}"`];
    if (dataRows > 1) {
        text.push(`contains ${dataRows} ${type}s`);
    }
    text.push(
        `x is "${x.label}" from ${x.format(x.minimum)} to ${x.format(
            x.maximum
        )}`
    );
    text.push(
        `y is "${y.label}" from ${y.format(y.minimum)} to ${y.format(
            y.maximum
        )}`
    );

    if (y2) {
        text.push(
            `alternative y is "${y2.label}" from ${y2.format(
                y2.minimum
            )} to ${y2.format(y2.maximum)}`
        );
    }

    return `${text.join(
        ", "
    )}. Use arrow keys to navigate. Press H for more hotkeys.`;
};

export const calculateAxisMinimum = (
    data: dataPoint[][],
    prop: "x" | "y" | "y2"
) => {
    const values: number[] = data
        .flat()
        .filter((point) => prop in point)
        .map((point: dataPoint): number => {
            if (typeof point[prop] === "number") {
                return point[prop] as number;
            }
            return Math.min(...Object.values(point[prop] as StatBundle));
        });
    return Math.min(...values);
};
export const calculateAxisMaximum = (
    data: dataPoint[][],
    prop: "x" | "y" | "y2"
) => {
    const values: number[] = data
        .flat()
        .filter((point) => prop in point)
        .map((point: dataPoint): number => {
            if (typeof point[prop] === "number") {
                return point[prop] as number;
            }
            return Math.max(...Object.values(point[prop] as StatBundle));
        });
    return Math.max(...values);
};

export const defaultFormat = (value: number) => `${value}`;

export const sentenceCase = (str: string) =>
    `${str.substring(0, 1).toUpperCase()}${str.substring(1).toLowerCase()}`;

// export const calcInflectionPoints = (nums: number[]) => {
//     const nums2: number[] = [];
//     for(let j=0; j<nums.length-2; j++){
//         nums2.push(nums[j+1]-nums[j])
//     }

//     const inflectionIndeces: number[] = [];
//     let temp = nums2[0]
//     for(let i=1; i<nums2.length-2; i++){
//         if(nums2[i] === 0){
//             continue;
//         }
//         if(temp > 0 && nums2[i] > 0){
//             continue;
//         }
//         if(temp < 0 && nums2[i] < 0){
//             continue;
//         }
//         temp = nums2[i];
//         inflectionIndeces.push(i);
//     }

//     return inflectionIndeces;
// }

export const generatePointDescription = (
    point: dataPoint,
    xAxis: AxisData,
    yAxis: AxisData,
    stat?: keyof StatBundle
) => {
    if (typeof stat !== "undefined" && typeof point.y !== "number") {
        return `${xAxis.format(point.x)}, ${yAxis.format(point.y[stat])}`;
    }

    if (typeof point.y === "number") {
        return `${xAxis.format(point.x)}, ${yAxis.format(point.y)}`;
    } else if (typeof point.y2 === "number") {
        return `${xAxis.format(point.x)}, ${yAxis.format(point.y2)}`;
    } else {
        if ("high" in point.y && "low" in point.y) {
            return `${xAxis.format(point.x)}, ${yAxis.format(
                point.y.high
            )} - ${yAxis.format(point.y.low)}`;
        }
    }
    return "";
};

export const usesAxis = (data: dataPoint[][], axisName: "x" | "y" | "y2") => {
    const firstUseOfAxis = data.find((row) => {
        return row.find((point) => axisName in point);
    });
    return typeof firstUseOfAxis !== "undefined";
};

export const uniqueArray = <T>(arr: T[]) => {
    return [...new Set(arr)];
};

import type { AudioEngineConstructor } from "./audio/AudioEngine";

/**
 * The chart types available
 */
export enum SUPPORTED_CHART_TYPES {
    LINE = "line"
}

/**
 * A dictionary of data, where the key is the group name, and the value is the array of data points
 */
export type dataSet = {
    [groupName: string]: dataPoint[];
};

/**
 * Bundle of possible statistics
 */
export type StatBundle = {
    high?: number;
    low?: number;
};

/**
 * Data and metadata for an individual point
 */
export type dataPoint = {
    x: number;
    y?: number | StatBundle;
    y2?: number;
    callback?: () => void;
};

/**
 * Metadata for an axis
 */
export type AxisData = {
    minimum?: number;
    maximum?: number;
    label?: string;
    format?: (value: number) => string;
};

/**
 * All of the data and metadata that could be provided by the invocation
 */
export type SonifyTypes = {
    data: dataSet | dataPoint[] | number[];
    element: HTMLElement;
    axes?: {
        x?: AxisData;
        y?: AxisData;
        y2?: AxisData;
    };
    title?: string;
    cc?: HTMLElement;
    type?: SUPPORTED_CHART_TYPES;
    audioEngine?: AudioEngineConstructor;
};

/**
 * Metadata for a group of chart data
 */
export type groupedMetadata = {
    minimumPointIndex: number;
    maximumPointIndex: number;
    tenths: number;
    statIndex: number;
    availableStats: (keyof StatBundle)[];
};

/**
 * Axes that can be used
 */
export type validAxes = "x" | "y" | "y2";

/**
 * Options available for C2M chart
 */
export type c2mOptions = {
    enableSound?: boolean;
    enableSpeech?: boolean;
};

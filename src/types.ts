import type { AudioEngineConstructor } from "./audio/AudioEngine";

/**
 * Contains the data to describe a chart that should be sonified.
 * Most of the keys of this interface are optional, with the exception of "data" and "element".
 */
export type SonifyTypes = {
    /**
     * The data that should be presented in this chart.
     * This key is required for all charts.
     */
    data: dataSet | dataPoint[] | number[];
    /**
     * The HTML element in the DOM that represents this chart.
     * This will be used to handle keyboard events to enable the user to interact with the chart.
     * This key is required for all charts.
     */
    element: HTMLElement;
    /**
     * Optional metadata for the chart.
     * If you do not provide this metadata, it will be calculated automatically from the chart data.
     */
    axes?: {
        /** Optional metadata for the x-axis. */
        x?: AxisData;
        /** Optional metadata for the y-axis. */
        y?: AxisData;
        /** Optional metadata for the y2-axis. */
        y2?: AxisData;
    };
    /** Optional title for the chart. */
    title?: string;
    /**
     * An optional HTML element that will be used to output messages to a running screen reader.
     * If you do not provide this key, a suitable HTML will be created for you.
     */
    cc?: HTMLElement;
    /** Optional type for the chart. */
    type?: SUPPORTED_CHART_TYPES;
    /** Optional audio engine to replace the default audio engine. */
    audioEngine?: AudioEngineConstructor;
};

/**
 * A dictionary of data, where the key is the group name, and the value is the array of data points
 */
export type dataSet = {
    [groupName: string]: dataPoint[];
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
 * The chart types available
 */
export enum SUPPORTED_CHART_TYPES {
    LINE = "line"
}

/**
 * Bundle of possible statistics
 */
export type StatBundle = {
    high?: number;
    low?: number;
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

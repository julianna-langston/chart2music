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
 * Data and metadata for an individual point
 */
export type dataPoint = {
    x: number;
    y: number;
    callback?: () => void;
};

/**
 * Metadata for an axis
 */
export type AxisData = {
    minimum: number;
    maximum: number;
    label: string;
    format: (value: number) => string;
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
    };
    title?: string;
    cc?: HTMLElement;
    type?: SUPPORTED_CHART_TYPES;
};

/**
 * Maps for keys to actions
 */
export type KeyActionMap = {
    [keys: string]: () => void;
};

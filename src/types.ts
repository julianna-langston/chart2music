/* eslint-disable no-unused-vars */
import type { AudioEngine } from "./audio/";
import type { c2m } from "./c2mChart";
import type { SupportedDataPointType } from "./dataPoint";

/**
 *
 */
type SupportedInputType = SupportedDataPointType | number;

/**
 * The types of scales (linear, log) that are supported for an axis
 */
export type AxisScale = "linear" | "log10";

/**
 * Contains the data to describe a chart that should be sonified.
 * Most of the keys of this interface are optional, with the exception of "data" and "element".
 */
export type SonifyTypes = {
    /** Required type for the chart. */
    type: SUPPORTED_CHART_TYPES | SUPPORTED_CHART_TYPES[];
    /**
     * The data that should be presented in this chart.
     * This key is required for all charts.
     */
    data: dataSet | SupportedInputType[];
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
    /** Optional audio engine to replace the default audio engine. */
    audioEngine?: AudioEngine;
    options?: c2mOptions;
};

/**
 * A dictionary of data, where the key is the group name, and the value is the array of data points
 */
export type dataSet = {
    [groupName: string]: SupportedInputType[];
};

/**
 * Metadata for an axis
 */
export type AxisData = {
    minimum?: number;
    maximum?: number;
    label?: string;
    /* The formatter callback to format any number plotted against this axis */
    format?: (value: number) => string;
    type?: AxisScale;
};

/**
 * The chart types available
 */
export enum SUPPORTED_CHART_TYPES {
    LINE = "line",
    BAR = "bar",
    BAND = "band",
    PIE = "pie",
    CANDLESTICK = "candlestick"
}

/**
 * Bundle of possible statistics
 */
export type StatBundle = {
    open?: number;
    high?: number;
    low?: number;
    close?: number;
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
    inputType: detectableDataPoint;
};

/**
 * Axes that can be used
 */
export type validAxes = "x" | "y" | "y2";

/**
 * Data provided for the on focus callback
 */
export type c2mCallbackType = {
    slice: string;
    index: number;
};

/**
 * Options available for C2M chart
 */
export type c2mOptions = {
    enableSound?: boolean;
    enableSpeech?: boolean;
    /* The callback invoked when the end user focuses on a data point */
    onFocusCallback?: (point: c2mCallbackType) => void;
    /* The callback invoked when the user presses enter */
    onSelectCallback?: (point: c2mCallbackType) => void;
    live?: boolean;
    maxWidth?: number;
};

/**
 *
 */
export type c2mGolangReturn = {
    err: null | string;
    data?: c2m;
};

/**
 * Types of data points
 */
export type detectableDataPoint =
    | "number"
    | "unknown"
    | "SimpleDataPoint"
    | "HighLowDataPoint"
    | "OHLCDataPoint"
    | "AlternativeAxisDataPoint";

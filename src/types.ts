export enum supportedChartTypes {
    LINE
}

export type dataPoint = {
    x: number;
    y: number;
    callback?: () => void;
}

export type SonifyTypes = {
    data: dataPoint[];
    element: HTMLElement;
    axes?: any;
    title?: string;
    cc?: HTMLElement;
    type?: supportedChartTypes;
}

export type AxesRange = {
    x_min: number;
    x_max: number;
    y_min: number;
    y_max: number;
}
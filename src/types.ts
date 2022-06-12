export enum supportedChartTypes {
    LINE
}

export type dataLine = {
    label?: string;
    data: dataPoint[];
}

export type dataPoint = {
    x: number;
    y: number;
    callback?: () => void;
}

export type AxisData = {
    minimum: number;
    maximum: number;
    label: string;
    format: (value: number) => string;
}

export type SonifyTypes = {
    data: dataPoint[] | dataLine[];
    element: HTMLElement;
    axes: {
        x: AxisData;
        y: AxisData;
    };
    title: string;
    cc?: HTMLElement;
    type?: supportedChartTypes;
}

export type AxesRange = {
    x_min: number;
    x_max: number;
    y_min: number;
    y_max: number;
}
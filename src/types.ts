export enum supportedChartTypes {
    LINE = "line"
}

export type dataSet = {
    [groupName: string]: dataPoint[];
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
    data: dataSet | dataPoint[];
    element: HTMLElement;
    axes?: {
        x?: AxisData;
        y?: AxisData;
    };
    title?: string;
    cc?: HTMLElement;
    type?: supportedChartTypes;
}

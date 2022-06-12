import type { AxisData, dataPoint } from "./types";

export const array_minimum = (numbers: number[]) =>
    numbers.reduce((acc, item) => Math.min(acc, item));
export const array_maximum = (numbers: number[]) =>
    numbers.reduce((acc, item) => Math.max(acc, item));
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

export const generateSummary = (title: string, x: AxisData, y: AxisData) =>
    `Sonified line chart "${title}", x is ${x.label} from ${x.format(
        x.minimum
    )} to ${x.format(x.maximum)}, y is ${y.label} from ${y.format(
        y.minimum
    )} to ${y.format(y.maximum)}`;

export const calculateAxisMinimum = (data: dataPoint[][], prop: "x" | "y") => {
    const values = data.flat().map((point) => point[prop]);
    return Math.min(...values);
};
export const calculateAxisMaximum = (data: dataPoint[][], prop: "x" | "y") => {
    const values = data.flat().map((point) => point[prop]);
    return Math.max(...values);
};

export const defaultFormat = (value: number) => `${value}`;

export const array_minimum = (numbers: number[]) => numbers.reduce((acc, item) => Math.min(acc, item));
export const array_maximum = (numbers: number[]) => numbers.reduce((acc, item) => Math.max(acc, item));
export const interpolateBin = (point: number, min: number, max: number, bins: number) => {
    const pct = (point-min)/(max-min);
    return Math.floor(bins*pct);
}
export const calcPan = (pct: number) => ((pct * 2) - 1) * .98;
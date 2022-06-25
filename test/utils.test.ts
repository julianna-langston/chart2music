import { dataPoint } from "../src/types";
import {calcPan, calculateAxisMaximum, calculateAxisMinimum, defaultFormat, generateSummary, interpolateBin, sentenceCase} from "../src/utils";

test("sentence case", () => {
    expect(sentenceCase("test")).toBe("Test");
    expect(sentenceCase("TEST")).toBe("Test");
    expect(sentenceCase("Test")).toBe("Test");
    expect(sentenceCase("HELLO WORLD")).toBe("Hello world");
});

test("interpolate bin", () => {
    expect(interpolateBin(5, 0, 100, 100)).toBe(5);
    expect(interpolateBin(5, 5, 100, 10)).toBe(0);
    expect(interpolateBin(15, 5, 100, 10)).toBe(1);
});

test("generating summary", () => {
    expect(
        generateSummary(
            "My title",
            {
                label: "Growth",
                minimum: 0,
                maximum: 100,
                format: (value) => (`${value}%`)
            },
            {
                label: "Value",
                minimum: 10,
                maximum: 20,
                format: defaultFormat
            }
        )
    ).toBe(`Sonified chart "My title", x is Growth from 0% to 100%, y is Value from 10 to 20. Use arrow keys to navigate. Press H for more hotkeys.`);
});

test("adjust percent for panning", () => {
    expect(calcPan(0)).toBe(-0.98);
    expect(calcPan(0.5)).toBe(0);
    expect(calcPan(1)).toBe(0.98);
});

test("calculate axis min/max", () => {
    const singleRow: dataPoint[][] = [[1, 5, 2, 0, 3, 6].map((x) => {return {x}})];
    const multiRow = [
        [1, 5, 2, 0, 3, 6].map((x) => {return {x}}),
        [11, 15, 12, 10, 13, 16].map((x) => {return {x}}),
    ];
    const bundledRow = [[
        {x: 5, y: {high: 50, low: 20}},
        {x: 5, y: {high: 51, low: 15}},
        {x: 5, y: {high: 52, low: 30}},
        {x: 5, y: {high: 53, low: 45}},
    ]];

    expect(calculateAxisMinimum(singleRow, "x")).toBe(0);
    expect(calculateAxisMinimum(multiRow, "x")).toBe(0);
    expect(calculateAxisMinimum(bundledRow, "x")).toBe(5);
    expect(calculateAxisMinimum(bundledRow, "y")).toBe(15);

    expect(calculateAxisMaximum(singleRow, "x")).toBe(6);
    expect(calculateAxisMaximum(multiRow, "x")).toBe(16);
    expect(calculateAxisMaximum(bundledRow, "x")).toBe(5);
    expect(calculateAxisMaximum(bundledRow, "y")).toBe(53);
})
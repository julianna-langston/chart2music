import type { dataPoint } from "../src/types";
import { SUPPORTED_CHART_TYPES } from "../src/types";
import {
    calcPan,
    calculateAxisMaximum,
    calculateAxisMinimum,
    defaultFormat,
    generateSummary,
    interpolateBin,
    sentenceCase,
    generatePointDescription
} from "../src/utils";

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
        generateSummary({
            type: SUPPORTED_CHART_TYPES.LINE,
            title: "My title",
            x: {
                label: "Growth",
                minimum: 0,
                maximum: 100,
                format: (value) => `${value}%`
            },
            y: {
                label: "Value",
                minimum: 10,
                maximum: 20,
                format: defaultFormat
            },
            dataRows: 1
        })
    ).toBe(
        `Sonified line chart "My title", x is "Growth" from 0% to 100%, y is "Value" from 10 to 20. Use arrow keys to navigate. Press H for more hotkeys.`
    );
    expect(
        generateSummary({
            type: SUPPORTED_CHART_TYPES.LINE,
            title: "My title",
            x: {
                label: "Growth",
                minimum: 0,
                maximum: 100,
                format: (value) => `${value}%`
            },
            y: {
                label: "Value",
                minimum: 10,
                maximum: 20,
                format: defaultFormat
            },
            dataRows: 5
        })
    ).toBe(
        `Sonified line chart "My title", contains 5 categories, x is "Growth" from 0% to 100%, y is "Value" from 10 to 20. Use arrow keys to navigate. Press H for more hotkeys.`
    );
    expect(
        generateSummary({
            type: SUPPORTED_CHART_TYPES.LINE,
            title: "My title",
            x: {
                label: "Growth",
                minimum: 0,
                maximum: 100,
                format: (value) => `${value}%`
            },
            y: {
                label: "Value",
                minimum: 10,
                maximum: 20,
                format: defaultFormat
            },
            y2: {
                label: "Volume",
                minimum: 0,
                maximum: 100,
                format: defaultFormat
            },
            dataRows: 1
        })
    ).toBe(
        `Sonified line chart "My title", x is "Growth" from 0% to 100%, y is "Value" from 10 to 20, alternative y is "Volume" from 0 to 100. Use arrow keys to navigate. Press H for more hotkeys.`
    );
});

test("adjust percent for panning", () => {
    expect(calcPan(0)).toBe(-0.98);
    expect(calcPan(0.5)).toBe(0);
    expect(calcPan(1)).toBe(0.98);
});

test("calculate axis min/max", () => {
    const singleRow: dataPoint[][] = [
        [1, 5, 2, 0, 3, 6].map((x) => {
            return { x };
        })
    ];
    const multiRow = [
        [1, 5, 2, 0, 3, 6].map((x) => {
            return { x };
        }),
        [11, 15, 12, 10, 13, 16].map((x) => {
            return { x };
        })
    ];
    const bundledRow = [
        [
            { x: 5, y: { high: 50, low: 20 } },
            { x: 5, y: { high: 51, low: 15 } },
            { x: 5, y: { high: 52, low: 30 } },
            { x: 5, y: { high: 53, low: 45 } }
        ]
    ];

    expect(calculateAxisMinimum(singleRow, "x")).toBe(0);
    expect(calculateAxisMinimum(multiRow, "x")).toBe(0);
    expect(calculateAxisMinimum(bundledRow, "x")).toBe(5);
    expect(calculateAxisMinimum(bundledRow, "y")).toBe(15);

    expect(calculateAxisMaximum(singleRow, "x")).toBe(6);
    expect(calculateAxisMaximum(multiRow, "x")).toBe(16);
    expect(calculateAxisMaximum(bundledRow, "x")).toBe(5);
    expect(calculateAxisMaximum(bundledRow, "y")).toBe(53);
});

// test("calculate inflection points", () => {
//     expect(calcInflectionPoints([1,2,3,4,5,4,3,2,2,2,2])).toStrictEqual([4]);
//     // expect(calcInflectionPoints([1,2,3,4,5,4,3,2,2,2,3,4])).toStrictEqual([4,9]);
//     expect(calcInflectionPoints([-2,-1,0,1,2,3,15,20,5])).toStrictEqual([8]);
//     expect(calcInflectionPoints([-2,-1,0,1,2,3,15,20])).toStrictEqual([]);
// })

test("Generate point description", () => {
    // point: dataPoint,
    // xAxis: AxisData,
    // yAxis: AxisData,
    // stat?: keyof StatBundle

    // if (typeof stat !== "undefined" && typeof point.y !== "number") {
    //     return `${xAxis.format(point.x)}, ${yAxis.format(point.y[stat])}`;
    // }

    // if (typeof point.y === "number") {
    //     return `${xAxis.format(point.x)}, ${yAxis.format(point.y)}`;
    // } else if (typeof point.y2 === "number") {
    //     return `${xAxis.format(point.x)}, ${yAxis.format(point.y2)}`;
    // } else {
    //     if ("high" in point.y && "low" in point.y) {
    //         return `${xAxis.format(point.x)}, ${yAxis.format(
    //             point.y.high
    //         )} - ${yAxis.format(point.y.low)}`;
    //     }
    // }
    // return "";

    // x/y
    // x/y2
    // x/high
    // formatting x, y

    expect(
        generatePointDescription(
            {
                x: 0,
                y: 1
            },
            { format: defaultFormat },
            { format: defaultFormat }
        )
    ).toBe("0, 1");
    expect(
        generatePointDescription(
            {
                x: 0,
                y2: 1
            },
            { format: defaultFormat },
            { format: defaultFormat }
        )
    ).toBe("0, 1");
    expect(
        generatePointDescription(
            {
                x: 0,
                y: {
                    high: 10,
                    low: 5
                }
            },
            { format: defaultFormat },
            { format: defaultFormat }
        )
    ).toBe("0, 10 - 5");
    expect(
        generatePointDescription(
            {
                x: 0,
                y: {
                    high: 10,
                    low: 5
                }
            },
            { format: defaultFormat },
            { format: defaultFormat },
            "high"
        )
    ).toBe("0, 10");
    expect(
        generatePointDescription(
            {
                x: 0,
                y: {
                    high: 10,
                    low: 5
                }
            },
            { format: defaultFormat },
            { format: defaultFormat },
            "low"
        )
    ).toBe("0, 5");
    expect(
        generatePointDescription(
            {
                x: 0,
                y: 1
            },
            { format: (value) => `$${value}` },
            { format: defaultFormat }
        )
    ).toBe("$0, 1");
    expect(
        generatePointDescription(
            {
                x: 0,
                y: {
                    high: 10
                }
            },
            { format: defaultFormat },
            { format: defaultFormat }
        )
    ).toBe("");
});

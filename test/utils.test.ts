import type { SimpleDataPoint } from "../src/dataPoint";
import { SUPPORTED_CHART_TYPES } from "../src/types";
import {
    calcPan,
    calculateAxisMaximum,
    calculateAxisMinimum,
    defaultFormat,
    generateSummary,
    interpolateBin,
    sentenceCase,
    generatePointDescription,
    calculateMetadataByGroup,
    detectDataPointType
} from "../src/utils";

test("sentence case", () => {
    expect(sentenceCase("test")).toBe("Test");
    expect(sentenceCase("TEST")).toBe("Test");
    expect(sentenceCase("Test")).toBe("Test");
    expect(sentenceCase("HELLO WORLD")).toBe("Hello world");
});

test("interpolate bin - linear", () => {
    expect(interpolateBin(5, 0, 100, 100, "linear")).toBe(5);
    expect(interpolateBin(5, 5, 100, 10, "linear")).toBe(0);
    expect(interpolateBin(15, 5, 100, 10, "linear")).toBe(1);
});

test("interpolate bin - log", () => {
    expect(interpolateBin(5, 0.001, 100, 100, "log10")).toBe(73);
    expect(interpolateBin(5, 5, 100, 10, "log10")).toBe(0);
    expect(interpolateBin(15, 5, 100, 10, "log10")).toBe(3);
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
        `Sonified line chart "My title", contains 5 groups, x is "Growth" from 0% to 100%, y is "Value" from 10 to 20. Use arrow keys to navigate. Press H for more hotkeys.`
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
    expect(
        generateSummary({
            type: SUPPORTED_CHART_TYPES.LINE,
            title: "My title",
            x: {
                label: "Growth",
                minimum: 0,
                maximum: 10000,
                format: defaultFormat,
                type: "log10"
            },
            y: {
                label: "Value",
                minimum: 10,
                maximum: 20000,
                format: defaultFormat
            },
            y2: {
                label: "Volume",
                minimum: 1,
                maximum: 10000,
                format: defaultFormat
            },
            dataRows: 1
        })
    ).toBe(
        `Sonified line chart "My title", x is "Growth" from 0 to 10000 logarithmic, y is "Value" from 10 to 20000, alternative y is "Volume" from 1 to 10000. Use arrow keys to navigate. Press H for more hotkeys.`
    );
    expect(
        generateSummary({
            type: SUPPORTED_CHART_TYPES.LINE,
            title: "My title",
            x: {
                label: "Growth",
                minimum: 0,
                maximum: 10000,
                format: defaultFormat
            },
            y: {
                label: "Value",
                minimum: 10,
                maximum: 20000,
                format: defaultFormat,
                type: "log10"
            },
            y2: {
                label: "Volume",
                minimum: 1,
                maximum: 10000,
                format: defaultFormat
            },
            dataRows: 1
        })
    ).toBe(
        `Sonified line chart "My title", x is "Growth" from 0 to 10000, y is "Value" from 10 to 20000 logarithmic, alternative y is "Volume" from 1 to 10000. Use arrow keys to navigate. Press H for more hotkeys.`
    );
    expect(
        generateSummary({
            type: SUPPORTED_CHART_TYPES.LINE,
            title: "My title",
            x: {
                label: "Growth",
                minimum: 0,
                maximum: 10000,
                format: defaultFormat
            },
            y: {
                label: "Value",
                minimum: 10,
                maximum: 20000,
                format: defaultFormat
            },
            y2: {
                label: "Volume",
                minimum: 1,
                maximum: 10000,
                format: defaultFormat,
                type: "log10"
            },
            dataRows: 1
        })
    ).toBe(
        `Sonified line chart "My title", x is "Growth" from 0 to 10000, y is "Value" from 10 to 20000, alternative y is "Volume" from 1 to 10000 logarithmic. Use arrow keys to navigate. Press H for more hotkeys.`
    );
});

test("adjust percent for panning", () => {
    expect(calcPan(0)).toBe(-0.98);
    expect(calcPan(0.5)).toBe(0);
    expect(calcPan(1)).toBe(0.98);
});

test("calculate axis min/max", () => {
    const singleRow: SimpleDataPoint[][] = [
        [1, 5, 2, 0, 3, 6].map((x) => {
            return { x, y: 0 };
        })
    ];
    const multiRow = [
        [1, 5, 2, 0, 3, 6].map((x) => {
            return { x, y: 0 };
        }),
        [11, 15, 12, 10, 13, 16].map((x) => {
            return { x, y: 0 };
        })
    ];
    const bundledRow = [
        [
            { x: 5, high: 50, low: 20 },
            { x: 5, high: 51, low: 15 },
            { x: 5, high: 52, low: 30 },
            { x: 5, high: 53, low: 45 }
        ]
    ];
    const ohlcRow = [
        [
            { x: 5, open: 8, high: 50, low: 20, close: 20 },
            { x: 5, open: 20, high: 51, low: 15, close: 20 },
            { x: 5, open: 20, high: 52, low: 30, close: 20 },
            { x: 5, open: 20, high: 53, low: 45, close: 55 }
        ]
    ];
    const mixMultiRow = [
        [100, 101, 102, 103].map((y, x) => {
            return { x, y };
        }),
        [200, 201, 202, 203].map((y2, x) => {
            return { x, y2 };
        })
    ];

    expect(calculateAxisMinimum(singleRow, "x")).toBe(0);
    expect(calculateAxisMinimum(multiRow, "x")).toBe(0);
    expect(calculateAxisMinimum(bundledRow, "x")).toBe(5);
    expect(calculateAxisMinimum(bundledRow, "y")).toBe(15);
    expect(calculateAxisMinimum(bundledRow, "y2")).toBe(NaN);
    expect(calculateAxisMinimum(ohlcRow, "x")).toBe(5);
    expect(calculateAxisMinimum(ohlcRow, "y")).toBe(8);
    expect(calculateAxisMinimum(ohlcRow, "y2")).toBe(NaN);
    expect(calculateAxisMinimum(mixMultiRow, "y")).toBe(100);
    expect(calculateAxisMinimum(mixMultiRow, "y2")).toBe(200);

    expect(calculateAxisMaximum(singleRow, "x")).toBe(6);
    expect(calculateAxisMaximum(multiRow, "x")).toBe(16);
    expect(calculateAxisMaximum(bundledRow, "x")).toBe(5);
    expect(calculateAxisMaximum(bundledRow, "y")).toBe(53);
    expect(calculateAxisMaximum(bundledRow, "y2")).toBe(NaN);
    expect(calculateAxisMaximum(ohlcRow, "x")).toBe(5);
    expect(calculateAxisMaximum(ohlcRow, "y")).toBe(55);
    expect(calculateAxisMaximum(ohlcRow, "y2")).toBe(NaN);
    expect(calculateAxisMaximum(mixMultiRow, "y")).toBe(103);
    expect(calculateAxisMaximum(mixMultiRow, "y2")).toBe(203);
});

test("Generate point description", () => {
    expect(
        generatePointDescription(
            {
                x: 0,
                y: 1
            },
            defaultFormat,
            defaultFormat
        )
    ).toBe("0, 1");
    expect(
        generatePointDescription(
            {
                x: 0,
                y: 1,
                label: "Test"
            },
            defaultFormat,
            defaultFormat
        )
    ).toBe("0, 1, Test");
    expect(
        generatePointDescription(
            {
                x: 0,
                y: 1,
                label: "Test"
            },
            defaultFormat,
            defaultFormat,
            // eslint-disable-next-line no-undefined
            undefined,
            null,
            true
        )
    ).toBe("Test, 0, 1");
    expect(
        generatePointDescription(
            {
                x: 0,
                y2: 1
            },
            defaultFormat,
            defaultFormat
        )
    ).toBe("0, 1");
    expect(
        generatePointDescription(
            {
                x: 0,
                high: 10,
                low: 5
            },
            defaultFormat,
            defaultFormat
        )
    ).toBe("0, 10 - 5");
    expect(
        generatePointDescription(
            {
                x: 0,
                high: 10,
                low: 5
            },
            defaultFormat,
            defaultFormat,
            "high"
        )
    ).toBe("0, 10");
    expect(
        generatePointDescription(
            {
                x: 0,
                high: 10,
                low: 5
            },
            defaultFormat,
            defaultFormat,
            "low"
        )
    ).toBe("0, 5");
    expect(
        generatePointDescription(
            {
                x: 0,
                open: 8,
                high: 10,
                close: 7,
                low: 5
            },
            defaultFormat,
            defaultFormat
        )
    ).toBe("0, 8 - 10 - 5 - 7");
    expect(
        generatePointDescription(
            {
                x: 0,
                open: 8,
                high: 10,
                close: 7,
                low: 5
            },
            defaultFormat,
            defaultFormat,
            "high"
        )
    ).toBe("0, 10");
    expect(
        generatePointDescription(
            {
                x: 0,
                open: 8,
                high: 10,
                close: 7,
                low: 5
            },
            defaultFormat,
            defaultFormat,
            "open"
        )
    ).toBe("0, 8");
    expect(
        generatePointDescription(
            {
                x: 0,
                y: 1
            },
            (value) => `$${value}`,
            defaultFormat
        )
    ).toBe("$0, 1");
    expect(
        generatePointDescription(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - Deliberately using invalid values to test handling of invalid values
            {
                x: 0,
                high: 10
            },
            defaultFormat,
            defaultFormat
        )
    ).toBe("");
    expect(
        generatePointDescription(
            {
                x: 0,
                low: 5,
                q1: 7,
                median: 8,
                q3: 8.5,
                high: 10
            },
            defaultFormat,
            defaultFormat
        )
    ).toBe("0, 10 - 5");
    expect(
        generatePointDescription(
            {
                x: 0,
                low: 5,
                q1: 7,
                median: 8,
                q3: 8.5,
                high: 10
            },
            defaultFormat,
            defaultFormat,
            "low"
        )
    ).toBe("0, 5");
    expect(
        generatePointDescription(
            {
                x: 0,
                low: 5,
                q1: 7,
                median: 8,
                q3: 8.5,
                high: 10,
                outlier: [20]
            },
            defaultFormat,
            defaultFormat
        )
    ).toBe("0, 10 - 5, with 1 outliers");
    expect(
        generatePointDescription(
            {
                x: 0,
                low: 5,
                q1: 7,
                median: 8,
                q3: 8.5,
                high: 10,
                outlier: [20, 23]
            },
            defaultFormat,
            defaultFormat
        )
    ).toBe("0, 10 - 5, with 2 outliers");
    expect(
        generatePointDescription(
            {
                x: 0,
                low: 5,
                q1: 7,
                median: 8,
                q3: 8.5,
                high: 10,
                outlier: [20, 23]
            },
            defaultFormat,
            defaultFormat,
            "low"
        )
    ).toBe("0, 5");
    expect(
        generatePointDescription(
            {
                x: 0,
                low: 5,
                q1: 7,
                median: 8,
                q3: 8.5,
                high: 10,
                outlier: [20, 23]
            },
            defaultFormat,
            defaultFormat,
            "outlier",
            0
        )
    ).toBe("0, 20, 1 of 2");
    expect(
        generatePointDescription(
            {
                x: 0,
                low: 5,
                q1: 7,
                median: 8,
                q3: 8.5,
                high: 10,
                outlier: [20, 23]
            },
            defaultFormat,
            defaultFormat,
            "outlier",
            1
        )
    ).toBe("0, 23, 2 of 2");
});

test("Calculate metadata by group", () => {
    // Simple test
    expect(
        calculateMetadataByGroup([
            [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ]
        ])
    ).toEqual([
        {
            minimumPointIndex: 0,
            maximumPointIndex: 2,
            index: 0,
            maximumValue: 3,
            minimumValue: 1,
            tenths: 0,
            availableStats: [],
            statIndex: -1,
            inputType: "SimpleDataPoint"
        }
    ]);

    // Multiple groups
    expect(
        calculateMetadataByGroup([
            [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ],
            [
                { x: 1, y: 8 },
                { x: 2, y: 6 },
                { x: 3, y: 7 }
            ]
        ])
    ).toEqual([
        {
            minimumPointIndex: 0,
            maximumPointIndex: 2,
            index: 0,
            maximumValue: 3,
            minimumValue: 1,
            tenths: 0,
            availableStats: [],
            statIndex: -1,
            inputType: "SimpleDataPoint"
        },
        {
            minimumPointIndex: 1,
            maximumPointIndex: 0,
            index: 1,
            maximumValue: 8,
            minimumValue: 6,
            tenths: 0,
            availableStats: [],
            statIndex: -1,
            inputType: "SimpleDataPoint"
        }
    ]);

    // Contains y2
    expect(
        calculateMetadataByGroup([
            [
                { x: 1, y2: 1 },
                { x: 2, y2: 2 },
                { x: 3, y2: 3 }
            ]
        ])
    ).toEqual([
        {
            minimumPointIndex: 0,
            maximumPointIndex: 2,
            index: 0,
            maximumValue: 3,
            minimumValue: 1,
            tenths: 0,
            availableStats: [],
            statIndex: -1,
            inputType: "AlternativeAxisDataPoint"
        }
    ]);

    // Contains high/low
    expect(
        calculateMetadataByGroup([
            [
                { x: 1, high: 1, low: 1 },
                { x: 2, high: 2, low: 2 },
                { x: 3, high: 3, low: 3 }
            ]
        ])
    ).toEqual([
        {
            minimumPointIndex: -1,
            maximumPointIndex: -1,
            index: 0,
            maximumValue: -1,
            minimumValue: -1,
            tenths: 0,
            availableStats: ["high", "low"],
            statIndex: -1,
            inputType: "HighLowDataPoint"
        }
    ]);

    // Contains OHLC
    expect(
        calculateMetadataByGroup([
            [
                { x: 1, open: 1, high: 1, low: 1, close: 1 },
                { x: 2, open: 2, high: 2, low: 2, close: 2 },
                { x: 3, open: 3, high: 3, low: 3, close: 3 }
            ]
        ])
    ).toEqual([
        {
            minimumPointIndex: -1,
            maximumPointIndex: -1,
            index: 0,
            maximumValue: -1,
            minimumValue: -1,
            tenths: 0,
            availableStats: ["open", "high", "low", "close"],
            statIndex: -1,
            inputType: "OHLCDataPoint"
        }
    ]);

    // Contains Box plot
    expect(
        calculateMetadataByGroup([
            [
                {
                    x: 0,
                    low: 5.03,
                    q1: 6.36,
                    median: 6.91,
                    q3: 7.34,
                    high: 7.53
                },
                { x: 1, low: 7.1, q1: 7.18, median: 7.25, q3: 7.33, high: 7.4 },
                {
                    x: 2,
                    low: 7.31,
                    q1: 7.32,
                    median: 7.32,
                    q3: 7.33,
                    high: 7.33
                },
                { x: 3, low: 3.07, q1: 4.78, median: 5.3, q3: 6.3, high: 7.27 },
                {
                    x: 4,
                    low: 4.87,
                    q1: 5.8,
                    median: 6.13,
                    q3: 6.66,
                    high: 7.09
                },
                {
                    x: 5,
                    low: 3.91,
                    q1: 4.88,
                    median: 5.28,
                    q3: 6.01,
                    high: 6.74
                },
                {
                    x: 6,
                    low: 4.22,
                    q1: 5.15,
                    median: 5.49,
                    q3: 5.81,
                    high: 6.6
                },
                { x: 7, low: 4.91, q1: 5.3, median: 5.65, q3: 5.9, high: 6.38 },
                {
                    x: 8,
                    low: 2.91,
                    q1: 3.74,
                    median: 4.13,
                    q3: 4.43,
                    high: 5.44
                },
                { x: 9, low: 4.4, q1: 4.41, median: 4.64, q3: 4.96, high: 5.2 }
            ]
        ])
    ).toEqual([
        {
            minimumPointIndex: -1,
            maximumPointIndex: -1,
            index: 0,
            maximumValue: -1,
            minimumValue: -1,
            tenths: 1,
            availableStats: ["high", "q3", "median", "q1", "low", "outlier"],
            statIndex: -1,
            inputType: "BoxDataPoint"
        }
    ]);

    // Minimum point when multiple values have the same minimum
    expect(
        calculateMetadataByGroup([
            [
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 3, y: 0 }
            ]
        ])[0].minimumPointIndex
    ).toBe(0);

    // Maximum point when multiple values have the same minimum
    expect(
        calculateMetadataByGroup([
            [
                { x: 1, y: 0 },
                { x: 2, y: 3 },
                { x: 3, y: 3 }
            ]
        ])[0].maximumPointIndex
    ).toBe(1);

    // Can calculate minimum/maximum values even when there are NaNs
    expect(
        calculateMetadataByGroup([
            [
                { x: 0, y: 1 },
                { x: 1, y: 2 },
                { x: 2, y: 3 },
                { x: 2, y: 4 },
                { x: 2, y: 5 },
                { x: 2, y: 6 },
                { x: 2, y: 7 },
                { x: 2, y: 8 },
                { x: 2, y: 9 },
                { x: 2, y: 10 },
                { x: 2, y: NaN },
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: Providing invalid data to test error handling
                { x: 2, y: null },
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: Providing invalid data to test error handling
                { x: 2 },
                { x: 2, y: 5 },
                { x: 2, y: 6 },
                { x: 2, y: 4 },
                { x: 2, y: 2 },
                { x: 2, y: 0 }
            ]
        ])
    ).toEqual([
        {
            minimumPointIndex: 17,
            maximumPointIndex: 9,
            index: 0,
            maximumValue: 10,
            minimumValue: 0,
            tenths: 2,
            availableStats: [],
            statIndex: -1,
            inputType: "SimpleDataPoint"
        }
    ]);
});

test("detectDataPointType", () => {
    expect(detectDataPointType(5)).toBe("number");
    expect(detectDataPointType({ x: 1, y: 5 })).toBe("SimpleDataPoint");
    expect(detectDataPointType({ x: 1, y2: 5 })).toBe(
        "AlternativeAxisDataPoint"
    );
    expect(detectDataPointType({ x: 1, high: 5, low: 5 })).toBe(
        "HighLowDataPoint"
    );
    expect(
        detectDataPointType({ x: 1, open: 5, close: 5, high: 5, low: 5 })
    ).toBe("OHLCDataPoint");
    expect(detectDataPointType({})).toBe("unknown");
    expect(detectDataPointType("{}")).toBe("unknown");
});

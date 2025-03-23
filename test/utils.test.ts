import type { SimpleDataPoint } from "../src/dataPoint";
import { TranslationManager } from "../src/translator";
import {
    calcPan,
    calculateAxisMaximum,
    calculateAxisMinimum,
    interpolateBin,
    generatePointDescription,
    calculateMetadataByGroup,
    detectDataPointType,
    generateChartSummary,
    generateAxisSummary,
    convertDataRow,
    detectIfMobile,
    formatWrapper
} from "../src/utils";

const english = new TranslationManager("en");
const german = new TranslationManager("de");

describe("utils", () => {
    test("interpolate bin - linear", () => {
        expect(
            interpolateBin({
                point: 5,
                min: 0,
                max: 100,
                bins: 100,
                scale: "linear"
            })
        ).toBe(5);
        expect(
            interpolateBin({
                point: 5,
                min: 5,
                max: 100,
                bins: 10,
                scale: "linear"
            })
        ).toBe(0);
        expect(
            interpolateBin({
                point: 15,
                min: 5,
                max: 100,
                bins: 10,
                scale: "linear"
            })
        ).toBe(1);
    });

    test("interpolate bin - log", () => {
        expect(
            interpolateBin({
                point: 5,
                min: 0.001,
                max: 100,
                bins: 100,
                scale: "log10"
            })
        ).toBe(73);
        expect(
            interpolateBin({
                point: 5,
                min: 5,
                max: 100,
                bins: 10,
                scale: "log10"
            })
        ).toBe(0);
        expect(
            interpolateBin({
                point: 15,
                min: 5,
                max: 100,
                bins: 10,
                scale: "log10"
            })
        ).toBe(3);
    });

    test("adjust percent for panning", () => {
        expect(calcPan(0)).toBe(-0.98);
        expect(calcPan(0.5)).toBe(0);
        expect(calcPan(1)).toBe(0.98);
        expect(calcPan(NaN)).toBe(0);
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
        const hierarchyRows = [
            [
                { x: 0, y: 1 },
                { x: 1, y: 2 },
                { x: 2, y: 3 }
            ],
            [
                { x: 3, y: 10 },
                { x: 4, y: 11 }
            ]
        ];
        expect(calculateAxisMinimum({ data: singleRow, prop: "x" })).toBe(0);
        expect(calculateAxisMinimum({ data: multiRow, prop: "x" })).toBe(0);
        expect(calculateAxisMinimum({ data: bundledRow, prop: "x" })).toBe(5);
        expect(calculateAxisMinimum({ data: bundledRow, prop: "y" })).toBe(15);
        expect(calculateAxisMinimum({ data: bundledRow, prop: "y2" })).toBe(
            NaN
        );
        expect(calculateAxisMinimum({ data: ohlcRow, prop: "x" })).toBe(5);
        expect(calculateAxisMinimum({ data: ohlcRow, prop: "y" })).toBe(8);
        expect(calculateAxisMinimum({ data: ohlcRow, prop: "y2" })).toBe(NaN);
        expect(calculateAxisMinimum({ data: mixMultiRow, prop: "y" })).toBe(
            100
        );
        expect(calculateAxisMinimum({ data: mixMultiRow, prop: "y2" })).toBe(
            200
        );
        expect(
            calculateAxisMinimum({
                data: hierarchyRows,
                prop: "x",
                filterGroupIndex: 0
            })
        ).toBe(0);
        expect(
            calculateAxisMinimum({
                data: hierarchyRows,
                prop: "x",
                filterGroupIndex: 1
            })
        ).toBe(3);

        expect(calculateAxisMaximum({ data: singleRow, prop: "x" })).toBe(6);
        expect(calculateAxisMaximum({ data: multiRow, prop: "x" })).toBe(16);
        expect(calculateAxisMaximum({ data: bundledRow, prop: "x" })).toBe(5);
        expect(calculateAxisMaximum({ data: bundledRow, prop: "y" })).toBe(53);
        expect(calculateAxisMaximum({ data: bundledRow, prop: "y2" })).toBe(
            NaN
        );
        expect(calculateAxisMaximum({ data: ohlcRow, prop: "x" })).toBe(5);
        expect(calculateAxisMaximum({ data: ohlcRow, prop: "y" })).toBe(55);
        expect(calculateAxisMaximum({ data: ohlcRow, prop: "y2" })).toBe(NaN);
        expect(calculateAxisMaximum({ data: mixMultiRow, prop: "y" })).toBe(
            103
        );
        expect(calculateAxisMaximum({ data: mixMultiRow, prop: "y2" })).toBe(
            203
        );
        expect(
            calculateAxisMaximum({
                data: hierarchyRows,
                prop: "x",
                filterGroupIndex: 0
            })
        ).toBe(2);
        expect(
            calculateAxisMaximum({
                data: hierarchyRows,
                prop: "x",
                filterGroupIndex: 1
            })
        ).toBe(4);
    });

    test("Generate point description", () => {
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    y: 1
                },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 1");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    y: 1,
                    label: "Test"
                },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 1, Test");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    y: 1,
                    label: "Test"
                },
                announcePointLabelFirst: true,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("Test, 0, 1");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    y2: 1
                },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 1");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    high: 10,
                    low: 5
                },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 10 - 5");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    high: 10,
                    low: 5
                },
                stat: "high",
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 10");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    high: 10,
                    low: 5
                },
                stat: "low",
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 5");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    open: 8,
                    high: 10,
                    close: 7,
                    low: 5
                },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 8 - 10 - 5 - 7");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    open: 8,
                    high: 10,
                    close: 7,
                    low: 5
                },
                xFormat: (num) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")[num],
                yFormat: (num) => `${num}%`,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("A, 8% - 10% - 5% - 7%");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    open: 8,
                    high: 10,
                    close: 7,
                    low: 5
                },
                stat: "high",
                xFormat: (num) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")[num],
                yFormat: (num) => `${num}%`,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("A, 10%");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    open: 8,
                    high: 10,
                    close: 7,
                    low: 5
                },
                stat: "high",
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 10");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    open: 8,
                    high: 10,
                    close: 7,
                    low: 5
                },
                stat: "open",
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 8");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    y: 1
                },
                xFormat: (value) => `$${value}`,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("$0, 1");
        expect(
            generatePointDescription({
                // @ts-expect-error - Deliberately using invalid values to test handling of invalid values
                point: {
                    x: 0,
                    high: 10
                }
            })
        ).toBe("");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    low: 5,
                    q1: 7,
                    median: 8,
                    q3: 8.5,
                    high: 10
                },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 10 - 5");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    low: 5,
                    q1: 7,
                    median: 8,
                    q3: 8.5,
                    high: 10
                },
                stat: "low",
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 5");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    low: 5,
                    q1: 7,
                    median: 8,
                    q3: 8.5,
                    high: 10,
                    outlier: [20]
                },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 10 - 5, with 1 outlier");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    low: 5,
                    q1: 7,
                    median: 8,
                    q3: 8.5,
                    high: 10,
                    outlier: [20, 23]
                },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 10 - 5, with 2 outliers");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    low: 5,
                    q1: 7,
                    median: 8,
                    q3: 8.5,
                    high: 10,
                    outlier: [20, 23]
                },
                translationCallback: (id, ev) => german.translate(id, ev)
            })
        ).toBe("0, 10 - 5, mit 2 Ausreissern");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    low: 5,
                    q1: 7,
                    median: 8,
                    q3: 8.5,
                    high: 10,
                    outlier: [20, 23]
                },
                stat: "low",
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 5");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    low: 5,
                    q1: 7,
                    median: 8,
                    q3: 8.5,
                    high: 10,
                    outlier: [20, 23]
                },
                stat: "outlier",
                outlierIndex: 0,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe("0, 20, 1 of 2");
        expect(
            generatePointDescription({
                point: {
                    x: 0,
                    low: 5,
                    q1: 7,
                    median: 8,
                    q3: 8.5,
                    high: 10,
                    outlier: [20, 23]
                },
                stat: "outlier",
                outlierIndex: 1,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
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
                size: 3,
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
                size: 3,
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
                size: 3,
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
                size: 3,
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
                size: 3,
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
                size: 3,
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
                    {
                        x: 1,
                        low: 7.1,
                        q1: 7.18,
                        median: 7.25,
                        q3: 7.33,
                        high: 7.4
                    },
                    {
                        x: 2,
                        low: 7.31,
                        q1: 7.32,
                        median: 7.32,
                        q3: 7.33,
                        high: 7.33
                    },
                    {
                        x: 3,
                        low: 3.07,
                        q1: 4.78,
                        median: 5.3,
                        q3: 6.3,
                        high: 7.27
                    },
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
                    {
                        x: 7,
                        low: 4.91,
                        q1: 5.3,
                        median: 5.65,
                        q3: 5.9,
                        high: 6.38
                    },
                    {
                        x: 8,
                        low: 2.91,
                        q1: 3.74,
                        median: 4.13,
                        q3: 4.43,
                        high: 5.44
                    },
                    {
                        x: 9,
                        low: 4.4,
                        q1: 4.41,
                        median: 4.64,
                        q3: 4.96,
                        high: 5.2
                    }
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
                availableStats: [
                    "high",
                    "q3",
                    "median",
                    "q1",
                    "low",
                    "outlier"
                ],
                statIndex: -1,
                size: 10,
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
                size: 18,
                inputType: "SimpleDataPoint"
            }
        ]);

        // When data row is `null`
        expect(calculateMetadataByGroup([null])).toEqual([
            {
                index: 0,
                minimumPointIndex: null,
                maximumPointIndex: null,
                minimumValue: NaN,
                maximumValue: NaN,
                tenths: NaN,
                availableStats: [],
                statIndex: -1,
                inputType: null,
                size: 0
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

    test("generateChartSummary", () => {
        expect(
            generateChartSummary({
                title: "",
                groupCount: 1,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`Sonified chart.`);
        expect(
            generateChartSummary({
                title: "Test",
                groupCount: 1,
                live: false,
                hierarchy: false,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`Sonified chart titled "Test".`);
        expect(
            generateChartSummary({
                title: "Test",
                groupCount: 2,
                live: false,
                hierarchy: false,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`Sonified chart with 2 groups titled "Test".`);
        expect(
            generateChartSummary({
                title: "",
                groupCount: 2,
                live: false,
                hierarchy: false,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`Sonified chart with 2 groups.`);
        expect(
            generateChartSummary({
                title: "Test",
                groupCount: 1,
                live: true,
                hierarchy: false,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`Sonified live chart titled "Test".`);
        expect(
            generateChartSummary({
                title: "Test",
                groupCount: 2,
                live: false,
                hierarchy: true,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`Sonified hierarchical chart with 2 groups titled "Test".`);
        expect(
            generateChartSummary({
                title: "",
                groupCount: 2,
                live: true,
                hierarchy: true,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`Sonified live hierarchical chart with 2 groups.`);
    });

    test("generateAxisSummary", () => {
        const axis = {
            label: "Revenue",
            format: (num: number) => `$${num.toLocaleString()}`,
            minimum: 0,
            maximum: 1000000
        };

        // Standard axes
        expect(
            generateAxisSummary({
                axisLetter: "x",
                axis,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`X is "Revenue" from $0 to $1,000,000.`);
        expect(
            generateAxisSummary({
                axisLetter: "y",
                axis,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`Y is "Revenue" from $0 to $1,000,000.`);
        expect(
            generateAxisSummary({
                axisLetter: "y2",
                axis,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`Alternate Y is "Revenue" from $0 to $1,000,000.`);

        const unlablledAxis = {
            format: () => "*",
            minimum: 0,
            maximum: 1000000
        };
        // Unlabelled axis
        expect(
            generateAxisSummary({
                axisLetter: "x",
                axis: unlablledAxis,
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`X is "" from * to *.`);
        // Continuous
        expect(
            generateAxisSummary({
                axisLetter: "x",
                axis: { ...axis, continuous: true },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`X is "Revenue" from $0 to $1,000,000 continuously.`);
        // Logarithmic
        expect(
            generateAxisSummary({
                axisLetter: "x",
                axis: { ...axis, type: "log10" },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`X is "Revenue" from $0 to $1,000,000 logarithmic.`);
        // Logarithmic + Continuous
        expect(
            generateAxisSummary({
                axisLetter: "x",
                axis: {
                    ...axis,
                    continuous: true,
                    type: "log10"
                },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(
            `X is "Revenue" from $0 to $1,000,000 logarithmic continuously.`
        );

        // Special case: Y and Y2 axes should not be announced as "continuous"
        expect(
            generateAxisSummary({
                axisLetter: "y",
                axis: { ...axis, continuous: true },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`Y is "Revenue" from $0 to $1,000,000.`);
        expect(
            generateAxisSummary({
                axisLetter: "y2",
                axis: { ...axis, continuous: true },
                translationCallback: (id, ev) => english.translate(id, ev)
            })
        ).toBe(`Alternate Y is "Revenue" from $0 to $1,000,000.`);
    });

    test("convertDataRow", () => {
        expect(convertDataRow(null)).toBeNull();
    });

    describe("formatWrapper", () => {
        test("no minimum", () => {
            const wrap = formatWrapper({
                axis: {
                    maximum: 10,
                    format: (n) => `$${n}`
                },
                translationCallback: (id, ev) => english.translate(id, ev)
            });

            expect(wrap(NaN)).toBe("missing");
            expect(wrap(5)).toBe("$5");
            expect(wrap(-1)).toBe("$-1");
            expect(wrap(11)).toBe("too high");
        });
        test("german", () => {
            const wrap = formatWrapper({
                axis: {
                    minimum: 0,
                    maximum: 10,
                    format: (n) => `€${n}`
                },
                translationCallback: (id, evaluators) =>
                    german.translate(id, evaluators)
            });

            expect(wrap(NaN)).toBe("fehlt");
            expect(wrap(5)).toBe("€5");
            expect(wrap(-1)).toBe("zu tief");
            expect(wrap(11)).toBe("zu hoch");
        });
    });

    test("detectIfMobile", () => {
        const userAgentGetter = jest.spyOn(
            window.navigator,
            "userAgent",
            "get"
        );

        // Mobile Android + Firefox
        userAgentGetter.mockReturnValue(
            "Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/118.0 Firefox/118.0"
        );
        expect(detectIfMobile()).toBeTruthy();

        // Win10 + Chrome
        userAgentGetter.mockReturnValue(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
        );
        expect(detectIfMobile()).toBeFalsy();

        jest.clearAllMocks();
    });
});

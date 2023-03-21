import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";
import { MockAudioEngine } from "./_mockAudioEngine";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

const audioEngine = new MockAudioEngine();

const regions = [
    "Western Europe",
    "Latin America and Caribbean",
    "North America",
    "Australia and New Zeland",
    "Middle East and Northern Africa",
    "Southeastern Asia",
    "Central and Eastern Europe",
    "Eastern Asia",
    "Sub-Saharan Africa",
    "Southern Asia"
];

const title = "World Happiness Report";
const axes = {
    x: {
        label: "Region",
        format: (index: number) => regions[index]
    },
    y: {
        label: "Average Happiness Score"
    }
};
const data = [
    { x: 0, low: 5.03, q1: 6.36, median: 6.91, q3: 7.34, high: 7.53 },
    {
        x: 1,
        low: 4.87,
        q1: 5.8,
        median: 6.13,
        q3: 6.66,
        high: 7.09,
        outlier: [4.03]
    },
    { x: 2, low: 7.1, q1: 7.18, median: 7.25, q3: 7.33, high: 7.4 },
    { x: 3, low: 7.31, q1: 7.32, median: 7.32, q3: 7.33, high: 7.33 },
    { x: 4, low: 3.07, q1: 4.78, median: 5.3, q3: 6.3, high: 7.27 },
    { x: 5, low: 3.91, q1: 4.88, median: 5.28, q3: 6.01, high: 6.74 },
    { x: 6, low: 4.22, q1: 5.15, median: 5.49, q3: 5.81, high: 6.6 },
    { x: 7, low: 4.91, q1: 5.3, median: 5.65, q3: 5.9, high: 6.38 },
    {
        x: 8,
        low: 2.91,
        q1: 3.74,
        median: 4.13,
        q3: 4.43,
        high: 5.44,
        outlier: [5.648]
    },
    {
        x: 9,
        low: 4.4,
        q1: 4.41,
        median: 4.64,
        q3: 4.96,
        high: 5.2,
        outlier: [3.36, 3]
    }
];

// Navigate box plot without outliers
// Navigate with outlier
// Navigate between outliers

test("Checking out the outliers", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.BOX,
        title,
        axes,
        data,
        element: mockElement,
        cc: mockElementCC,
        audioEngine
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toEqual(
        `Sonified box chart "World Happiness Report", x is "Region" from Western Europe to Southern Asia, y is "Average Happiness Score" from 2.91 to 7.53. Use arrow keys to navigate. Press H for more hotkeys.`
    );

    [
        {
            press: { key: " " },
            text: "All, Western Europe, 7.53 - 5.03",
            count: 5
        },
        {
            press: { key: "ArrowRight" },
            text: "Latin America and Caribbean, 7.09 - 4.87, with 1 outliers",
            count: 5
        },
        {
            press: { key: "ArrowDown" },
            text: "High, Latin America and Caribbean, 7.09",
            count: 1
        },
        {
            press: { key: "ArrowDown" },
            text: "Q3, Latin America and Caribbean, 6.66",
            count: 1
        },
        {
            press: { key: "ArrowDown" },
            text: "Median, Latin America and Caribbean, 6.13",
            count: 1
        },
        {
            press: { key: "ArrowDown" },
            text: "Q1, Latin America and Caribbean, 5.8",
            count: 1
        },
        {
            press: { key: "ArrowDown" },
            text: "Low, Latin America and Caribbean, 4.87",
            count: 1
        },
        {
            press: { key: "ArrowDown" },
            text: "Outlier, Latin America and Caribbean, 4.03, 1 of 1",
            count: 1
        },
        {
            press: { key: "ArrowRight" },
            text: "Outlier, Latin America and Caribbean, 4.03, 1 of 1",
            count: 0
        },
        {
            press: { key: "ArrowLeft" },
            text: "Outlier, Latin America and Caribbean, 4.03, 1 of 1",
            count: 0
        },
        {
            press: { key: "ArrowDown" },
            text: "Outlier, Latin America and Caribbean, 4.03, 1 of 1",
            count: 0
        },
        {
            press: { key: "ArrowUp" },
            text: "Low, Latin America and Caribbean, 4.87",
            count: 1
        },
        {
            press: { key: "ArrowRight" },
            text: "North America, 7.1",
            count: 1
        },
        {
            press: { key: "ArrowDown" },
            text: "North America, 7.1",
            count: 0
        },
        {
            press: { key: "End" },
            text: "Southern Asia, 4.4",
            count: 1
        },
        {
            press: { key: "ArrowDown" },
            text: "Outlier, Southern Asia, 3.36, 1 of 2",
            count: 1
        },
        {
            press: { key: "ArrowRight" },
            text: "Southern Asia, 3, 2 of 2",
            count: 1
        },
        {
            press: { key: "ArrowLeft" },
            text: "Southern Asia, 3.36, 1 of 2",
            count: 1
        },
        {
            press: { shiftKey: true, key: "End" },
            text: "Southern Asia, 3.36, 1 of 2",
            count: 2
        },
        {
            press: { shiftKey: true, key: "End" },
            text: "Southern Asia, 3.36, 1 of 2",
            count: 1
        },
        {
            press: { shiftKey: true, key: "Home" },
            text: "Southern Asia, 3.36, 1 of 2",
            count: 2
        },
        {
            press: { shiftKey: true, key: "Home" },
            text: "Southern Asia, 3.36, 1 of 2",
            count: 1
        }
    ].forEach(({ press, text, count }) => {
        mockElement.dispatchEvent(new KeyboardEvent("keydown", press));
        jest.advanceTimersByTime(250);
        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(text);
        expect(audioEngine.playCount).toBe(count);
        audioEngine.reset();
    });
});

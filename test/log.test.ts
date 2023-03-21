import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";
import { hertzes } from "./_constants";
import { MockAudioEngine } from "./_mockAudioEngine";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

const options = { hertzes };
const audioEngine = new MockAudioEngine();

beforeEach(() => {
    jest.clearAllMocks();
    audioEngine.reset();
});

describe("Check panning/frequency/timing", () => {
    describe("Y axis traverses magnitudes", () => {
        test("X: linear, Y: linear", () => {
            const data = [1, 10, 100, 1000, 10000].map((y, x) => {
                return { x, y };
            });
            const mockElement = document.createElement("div");
            const mockElementCC = document.createElement("div");
            const { err, data: chart } = c2mChart({
                type: SUPPORTED_CHART_TYPES.LINE,
                data,
                element: mockElement,
                cc: mockElementCC,
                audioEngine,
                options
            });
            expect(err).toBe(null);

            mockElement.dispatchEvent(new Event("focus"));

            // Confirm that a summary was generated
            expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

            mockElement.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "End",
                    shiftKey: true
                })
            );
            jest.advanceTimersByTime(50);
            expect(audioEngine.lastPanning).toBe(-0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                x: 0,
                y: 1
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(-0.49);
            expect(Math.round(audioEngine.lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                x: 1,
                y: 10
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(0);
            expect(Math.round(audioEngine.lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                x: 2,
                y: 100
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(0.49);
            expect(Math.round(audioEngine.lastFrequency)).toBe(82);
            expect(chart?.currentPoint).toEqual({
                x: 3,
                y: 1000
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(3951);
            expect(chart?.currentPoint).toEqual({
                x: 4,
                y: 10000
            });
        });

        test("X: linear, Y: log", () => {
            const data = [1, 10, 100, 1000, 10000].map((y, x) => {
                return { x, y };
            });
            const mockElement = document.createElement("div");
            const mockElementCC = document.createElement("div");
            const { err, data: chart } = c2mChart({
                type: SUPPORTED_CHART_TYPES.LINE,
                data,
                axes: {
                    y: {
                        type: "log10"
                    }
                },
                element: mockElement,
                cc: mockElementCC,
                audioEngine,
                options
            });
            expect(err).toBe(null);

            mockElement.dispatchEvent(new Event("focus"));

            // Confirm that a summary was generated
            expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

            mockElement.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "End",
                    shiftKey: true
                })
            );
            jest.advanceTimersByTime(50);
            expect(audioEngine.lastPanning).toBe(-0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                x: 0,
                y: 1
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(-0.49);
            expect(Math.round(audioEngine.lastFrequency)).toBe(156);
            expect(chart?.currentPoint).toEqual({
                x: 1,
                y: 10
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(0);
            expect(Math.round(audioEngine.lastFrequency)).toBe(466);
            expect(chart?.currentPoint).toEqual({
                x: 2,
                y: 100
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(0.49);
            expect(Math.round(audioEngine.lastFrequency)).toBe(1319);
            expect(chart?.currentPoint).toEqual({
                x: 3,
                y: 1000
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(3951);
            expect(chart?.currentPoint).toEqual({
                x: 4,
                y: 10000
            });
        });
    });

    describe("X axis traverses magnitudes", () => {
        test("X: linear, Y: linear", () => {
            const data = [1, 10, 100, 1000, 10000].map((x, y) => {
                return { x, y };
            });
            const mockElement = document.createElement("div");
            const mockElementCC = document.createElement("div");
            const { err, data: chart } = c2mChart({
                type: SUPPORTED_CHART_TYPES.LINE,
                data,
                element: mockElement,
                cc: mockElementCC,
                audioEngine,
                options
            });
            expect(err).toBe(null);

            mockElement.dispatchEvent(new Event("focus"));

            // Confirm that a summary was generated
            expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

            mockElement.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "End",
                    shiftKey: true
                })
            );
            jest.advanceTimersByTime(50);
            expect(audioEngine.lastPanning).toBe(-0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                y: 0,
                x: 1
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBeCloseTo(-0.978);
            expect(Math.round(audioEngine.lastFrequency)).toBe(156);
            expect(chart?.currentPoint).toEqual({
                y: 1,
                x: 10
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBeCloseTo(-0.96);
            expect(Math.round(audioEngine.lastFrequency)).toBe(466);
            expect(chart?.currentPoint).toEqual({
                y: 2,
                x: 100
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBeCloseTo(-0.784);
            expect(Math.round(audioEngine.lastFrequency)).toBe(1319);
            expect(chart?.currentPoint).toEqual({
                y: 3,
                x: 1000
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(3951);
            expect(chart?.currentPoint).toEqual({
                y: 4,
                x: 10000
            });
        });
        test("X: linear + continuous, Y: linear", () => {
            const data = [1, 10, 100, 1000, 10000].map((x, y) => {
                return { x, y };
            });
            const mockElement = document.createElement("div");
            const mockElementCC = document.createElement("div");
            const { err, data: chart } = c2mChart({
                type: SUPPORTED_CHART_TYPES.LINE,
                data,
                axes: {
                    x: {
                        continuous: true
                    }
                },
                element: mockElement,
                cc: mockElementCC,
                audioEngine,
                options
            });
            expect(err).toBe(null);

            mockElement.dispatchEvent(new Event("focus"));

            // Confirm that a summary was generated
            expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

            expect(audioEngine.playHistory).toHaveLength(0);

            mockElement.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "End",
                    shiftKey: true
                })
            );
            jest.advanceTimersByTime(1);
            expect(audioEngine.playHistory).toHaveLength(1);
            expect(audioEngine.lastPanning).toBe(-0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                y: 0,
                x: 1
            });

            jest.advanceTimersByTime(10);
            expect(audioEngine.playHistory).toHaveLength(2);
            expect(audioEngine.lastPanning).toBeCloseTo(-0.978);
            expect(Math.round(audioEngine.lastFrequency)).toBe(156);
            expect(chart?.currentPoint).toEqual({
                y: 1,
                x: 10
            });

            jest.advanceTimersByTime(100);
            expect(audioEngine.playHistory).toHaveLength(3);
            expect(audioEngine.lastPanning).toBeCloseTo(-0.96);
            expect(Math.round(audioEngine.lastFrequency)).toBe(466);
            expect(chart?.currentPoint).toEqual({
                y: 2,
                x: 100
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);
            expect(audioEngine.lastPanning).toBeCloseTo(-0.784);
            expect(Math.round(audioEngine.lastFrequency)).toBe(1319);
            expect(chart?.currentPoint).toEqual({
                y: 3,
                x: 1000
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(5);
            expect(audioEngine.lastPanning).toBe(0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(3951);
            expect(chart?.currentPoint).toEqual({
                y: 4,
                x: 10000
            });

            audioEngine.reset();
            expect(audioEngine.playHistory).toHaveLength(0);
            mockElement.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "Home",
                    shiftKey: true
                })
            );
            jest.advanceTimersByTime(1);
            expect(audioEngine.playHistory).toHaveLength(1);
            expect(audioEngine.lastPanning).toBe(0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(3951);
            expect(chart?.currentPoint).toEqual({
                y: 4,
                x: 10000
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(1);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(1);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(1);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(1);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(1);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(1);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(1);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(1);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(2);
            expect(audioEngine.lastPanning).toBeCloseTo(-0.784);
            expect(Math.round(audioEngine.lastFrequency)).toBe(1319);
            expect(chart?.currentPoint).toEqual({
                y: 3,
                x: 1000
            });

            jest.advanceTimersByTime(230);
            expect(audioEngine.playHistory).toHaveLength(3);
            expect(audioEngine.lastPanning).toBeCloseTo(-0.96);
            expect(Math.round(audioEngine.lastFrequency)).toBe(466);
            expect(chart?.currentPoint).toEqual({
                y: 2,
                x: 100
            });

            jest.advanceTimersByTime(16);
            expect(audioEngine.playHistory).toHaveLength(4);
            expect(audioEngine.lastPanning).toBeCloseTo(-0.978);
            expect(Math.round(audioEngine.lastFrequency)).toBe(156);
            expect(chart?.currentPoint).toEqual({
                y: 1,
                x: 10
            });

            jest.advanceTimersByTime(5);
            expect(audioEngine.playHistory).toHaveLength(5);
            expect(audioEngine.lastPanning).toBe(-0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                y: 0,
                x: 1
            });
        });
        test("X: log, Y: linear", () => {
            const data = [1, 10, 100, 1000, 10000].map((x, y) => {
                return { x, y };
            });
            const mockElement = document.createElement("div");
            const mockElementCC = document.createElement("div");
            const { err, data: chart } = c2mChart({
                type: SUPPORTED_CHART_TYPES.LINE,
                data,
                axes: {
                    x: {
                        type: "log10"
                    }
                },
                element: mockElement,
                cc: mockElementCC,
                audioEngine,
                options
            });
            expect(err).toBe(null);

            mockElement.dispatchEvent(new Event("focus"));

            // Confirm that a summary was generated
            expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

            mockElement.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "End",
                    shiftKey: true
                })
            );
            jest.advanceTimersByTime(50);
            expect(audioEngine.lastPanning).toBe(-0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                y: 0,
                x: 1
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(-0.49);
            expect(Math.round(audioEngine.lastFrequency)).toBe(156);
            expect(chart?.currentPoint).toEqual({
                y: 1,
                x: 10
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(0);
            expect(Math.round(audioEngine.lastFrequency)).toBe(466);
            expect(chart?.currentPoint).toEqual({
                y: 2,
                x: 100
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(0.49);
            expect(Math.round(audioEngine.lastFrequency)).toBe(1319);
            expect(chart?.currentPoint).toEqual({
                y: 3,
                x: 1000
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.lastPanning).toBe(0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(3951);
            expect(chart?.currentPoint).toEqual({
                y: 4,
                x: 10000
            });
        });
        test("X: log + continuous, Y: linear", () => {
            const data = [1, 10, 100, 1000, 10000].map((x, y) => {
                return { x, y };
            });
            const mockElement = document.createElement("div");
            const mockElementCC = document.createElement("div");
            const { err, data: chart } = c2mChart({
                type: SUPPORTED_CHART_TYPES.LINE,
                data,
                axes: {
                    x: {
                        type: "log10",
                        continuous: true
                    }
                },
                element: mockElement,
                cc: mockElementCC,
                audioEngine,
                options
            });
            expect(err).toBe(null);

            mockElement.dispatchEvent(new Event("focus"));

            expect(audioEngine.playHistory).toHaveLength(0);

            // Confirm that a summary was generated
            expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

            mockElement.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "End",
                    shiftKey: true
                })
            );
            jest.advanceTimersByTime(5);
            expect(audioEngine.playHistory).toHaveLength(1);
            expect(audioEngine.lastPanning).toBe(-0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                y: 0,
                x: 1
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(1);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(1);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(2);
            expect(audioEngine.lastPanning).toBe(-0.49);
            expect(Math.round(audioEngine.lastFrequency)).toBe(156);
            expect(chart?.currentPoint).toEqual({
                y: 1,
                x: 10
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(2);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(3);
            expect(audioEngine.lastPanning).toBe(0);
            expect(Math.round(audioEngine.lastFrequency)).toBe(466);
            expect(chart?.currentPoint).toEqual({
                y: 2,
                x: 100
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(3);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(3);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);
            expect(audioEngine.lastPanning).toBe(0.49);
            expect(Math.round(audioEngine.lastFrequency)).toBe(1319);
            expect(chart?.currentPoint).toEqual({
                y: 3,
                x: 1000
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(5);
            expect(audioEngine.lastPanning).toBe(0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(3951);
            expect(chart?.currentPoint).toEqual({
                y: 4,
                x: 10000
            });

            audioEngine.reset();

            mockElement.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "Home",
                    shiftKey: true
                })
            );
            jest.advanceTimersByTime(5);
            expect(audioEngine.playHistory).toHaveLength(1);
            expect(audioEngine.lastPanning).toBe(0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(3951);
            expect(chart?.currentPoint).toEqual({
                y: 4,
                x: 10000
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(1);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(1);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(2);
            expect(audioEngine.lastPanning).toBe(0.49);
            expect(Math.round(audioEngine.lastFrequency)).toBe(1319);
            expect(chart?.currentPoint).toEqual({
                y: 3,
                x: 1000
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(2);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(3);
            expect(audioEngine.lastPanning).toBe(0);
            expect(Math.round(audioEngine.lastFrequency)).toBe(466);
            expect(chart?.currentPoint).toEqual({
                y: 2,
                x: 100
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(3);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(3);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);
            expect(audioEngine.lastPanning).toBe(-0.49);
            expect(Math.round(audioEngine.lastFrequency)).toBe(156);
            expect(chart?.currentPoint).toEqual({
                y: 1,
                x: 10
            });

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(4);

            jest.advanceTimersByTime(250);
            expect(audioEngine.playHistory).toHaveLength(5);
            expect(audioEngine.lastPanning).toBe(-0.98);
            expect(Math.round(audioEngine.lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                y: 0,
                x: 1
            });
        });
    });
});

import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("Unsupported", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: [SUPPORTED_CHART_TYPES.LINE, SUPPORTED_CHART_TYPES.UNSUPPORTED],
        data: {
            a: [
                { x: 1, y: 10 },
                { x: 2, y: 11 }
            ],
            b: null
        },
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    const result = {
        sr: `Group titled "b" uses an unsupported chart type.`,
        point: {
            index: 1,
            group: "b",
            point: null,
            stat: ""
        }
    };

    [
        {
            press: { key: "ArrowRight" },
            sr: "2, 11",
            point: {
                index: 1,
                group: "a",
                stat: "",
                point: { x: 2, y: 11 }
            }
        },
        {
            press: { key: "PageDown" },
            ...result
        },
        {
            press: { key: "ArrowRight" },
            ...result
        },
        {
            press: { key: "ArrowLeft" },
            ...result
        },
        {
            press: { key: "ArrowUp" },
            ...result
        },
        {
            press: { key: "ArrowDown" },
            ...result
        },
        {
            press: { key: "End" },
            ...result
        },
        {
            press: { key: "Enter" },
            ...result
        },
        {
            press: { key: "ArrowLeft", ctrlKey: true },
            ...result
        },
        {
            press: { key: "ArrowRight", ctrlKey: true },
            ...result
        },
        {
            press: { key: " " },
            ...result
        },
        {
            press: { key: "Home" },
            ...result
        },
        {
            press: { key: "]" },
            ...result
        },
        {
            press: { key: "[" },
            ...result
        },
        {
            press: {
                key: "End",
                shiftKey: true
            },
            ...result
        },
        {
            press: {
                key: "Home",
                shiftKey: true
            },
            ...result
        },
        {
            press: {
                key: "PageUp",
                shiftKey: true
            },
            ...result
        },
        {
            press: {
                key: "PageDown",
                shiftKey: true
            },
            ...result
        },
        {
            press: { key: "PageUp" },
            sr: `Line chart showing "a". X is "" from 1 to 2. Y is "" from 10 to 11.`,
            point: {
                index: 1,
                group: "a",
                stat: "",
                point: { x: 2, y: 11 }
            }
        }
    ].forEach(({ press, point, sr }) => {
        mockElement.dispatchEvent(new KeyboardEvent("keydown", press));
        jest.advanceTimersByTime(250);
        expect(mockElementCC.textContent?.trim()).toBe(sr);
        expect(chart?.getCurrent()).toStrictEqual(point);
    });
});

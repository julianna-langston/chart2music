import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("Move at boundaries - uneven groups", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: {
            a: [
                { x: 1, y: 10 },
                { x: 2, y: 11 }
            ],
            b: [
                { x: 1, y: 11 },
                { x: 2, y: 12 },
                { x: 3, y: 13 },
                { x: 4, y: 14 }
            ],
            c: [
                { x: 1, y: 11 },
                { x: 2, y: 12 },
                { x: 3, y: 13 }
            ]
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

    [
        {
            key: "PageDown",
            point: {
                index: 0,
                group: "b",
                stat: "",
                point: { x: 1, y: 11 }
            }
        },
        {
            key: "End",
            point: {
                index: 3,
                group: "b",
                stat: "",
                point: { x: 4, y: 14 }
            }
        },
        {
            key: "PageDown",
            point: {
                index: 2,
                group: "c",
                stat: "",
                point: { x: 3, y: 13 }
            }
        },
        {
            key: "PageUp",
            point: {
                index: 2,
                group: "b",
                stat: "",
                point: { x: 3, y: 13 }
            }
        },
        {
            key: "PageUp",
            point: {
                index: 1,
                group: "a",
                stat: "",
                point: { x: 2, y: 11 }
            }
        }
    ].forEach(({ key, point }) => {
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key
            })
        );
        expect(chart?.getCurrent()).toStrictEqual(point);
        jest.advanceTimersByTime(250);
    });
});

import { c2mChart } from "../src/entryPoint_mjs";
import { SUPPORTED_CHART_TYPES } from "../src/types";

window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("Confirm that C2M modifies provided elements", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        element: mockElement,
        cc: mockElementCC
    });

    expect(err).toBe(null);
    expect(mockElement.getAttribute("tabIndex")).toBe("0");
    expect(mockElementCC.getAttribute("aria-live")).toBe("assertive");
});

test("Confirm that C2M adds a CC element to the container if no CC element is provided", () => {
    const mockElement = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        element: mockElement
    });

    expect(err).toBe(null);
    expect(mockElement.getAttribute("tabIndex")).toBe("0");

    const newChild = mockElement.querySelector("div");
    expect(newChild).not.toBeNull();
    expect(newChild?.getAttribute("aria-live")).toBe("assertive");
});

test("C2M setup handles partial axis info", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        axes: {
            y: {
                minimum: 0
            }
        },
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`Y is "" from 0 to 5.`);

    // Confirm
    expect(mockElementCC.textContent).not.toContain(`Sonified live chart`);
    expect(mockElementCC.textContent).not.toContain(`Press M`);
});

test("C2M sorts out-of-order scatter plot data", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.SCATTER,
        data: [
            {
                x: 1030,
                y: 52420.1
            },
            {
                x: 960,
                y: 665384
            },
            {
                x: 823,
                y: 113990
            },
            {
                x: 931,
                y: 53178
            },
            {
                x: 823,
                y: 500
            },
            {
                x: 823,
                y: 200000
            },
            {
                x: 823,
                y: 200000
            }
        ],
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(
        `X is "" from 823 to 1030 continuously`
    );

    // Confirm
    expect(chart?.currentPoint?.x).toBe(823);
    expect(chart?.currentPoint).toHaveProperty("y", 500);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.currentPoint?.x).toBe(823);
    expect(chart?.currentPoint).toHaveProperty("y", 113990);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.currentPoint?.x).toBe(823);
    expect(chart?.currentPoint).toHaveProperty("y", 200000);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.currentPoint?.x).toBe(823);
    expect(chart?.currentPoint).toHaveProperty("y", 200000);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.currentPoint?.x).toBe(931);
    expect(chart?.currentPoint).toHaveProperty("y", 53178);
});

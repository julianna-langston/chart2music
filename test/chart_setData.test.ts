import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("setData: setting new data (no starting explicit axis) (no axes)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 1 to 5.`);

    chart?.setData([10, 11, 12]);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 10 to 12.`);
});

test("setData: setting new data (starting explicit axis) (no axes)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
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
    expect(mockElementCC.textContent).toContain(`y is "" from 0 to 5.`);

    chart?.setData([10, 11, 12]);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 0 to 12.`);
});

test("setData: setting new data (starting explicit format) (no overwrite)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        axes: {
            y: {
                format: (value) => `$${value}`
            }
        },
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from $1 to $5.`);

    chart?.setData([10, 11, 12]);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from $10 to $12.`);
});

test("setData: setting new data (starting explicit format) (overwrite)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        axes: {
            y: {
                format: (value) => `$${value}`
            }
        },
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from $1 to $5.`);

    chart?.setData([10, 11, 12], {
        y: {
            format: (value) => `${value}%`
        }
    });

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 10% to 12%.`);

    // Confirm that set format retains
    chart?.setData([20, 21, 22]);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 20% to 22%.`);
});

test("setData: setting new data (no starting explicit format) (add format)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 1 to 5.`);

    chart?.setData([10, 11, 12], {
        y: {
            format: (value) => `${value}%`
        }
    });

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 10% to 12%.`);

    // Confirm that set format retains
    chart?.setData([20, 21, 22]);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 20% to 22%.`);
});

test("setData: setting new data (starting explicit minimum) (no overwrite)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
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
    expect(mockElementCC.textContent).toContain(`y is "" from 0 to 5.`);

    chart?.setData([10, 11, 12]);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 0 to 12.`);
});

test("setData: setting new data (starting explicit minimum) (overwrite)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
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
    expect(mockElementCC.textContent).toContain(`y is "" from 0 to 5.`);

    chart?.setData([10, 11, 12], {
        y: {
            minimum: 9
        }
    });

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 9 to 12.`);

    // Confirm that set format retains
    chart?.setData([20, 21, 22]);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 9 to 22.`);
});

test("setData: setting new data (no starting explicit minimum) (add minimum)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 1 to 5.`);

    chart?.setData([10, 11, 12], {
        y: {
            minimum: 9
        }
    });

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 9 to 12.`);

    // Confirm that set format retains
    chart?.setData([20, 21, 22]);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 9 to 22.`);
});

test("setData: setting new data with starting pointIndex", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 1 to 5.`);

    chart?.setData([10, 11, 12], {}, 1);

    expect(chart?.getCurrent().point).toEqual({
        x: 1,
        y: 11
    });
});

test("setData: setting new data with starting group and pointIndex", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: {
            a: [1, 2, 3, 4, 5],
            b: [8, 7, 6, 5, 4]
        },
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    chart?.setData({ a: [10, 11, 12], b: [20, 21, 22] }, {}, 1, "b");

    expect(chart?.getCurrent().point).toEqual({
        x: 1,
        y: 21
    });
});

test("setData: setting new data with invalid starting group", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: {
            a: [1, 2, 3, 4, 5],
            b: [8, 7, 6, 5, 4]
        },
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    chart?.setData({ a: [10, 11, 12], b: [20, 21, 22] }, {}, 1, "c");

    expect(chart?.getCurrent().point).toEqual({
        x: 1,
        y: 11
    });
});

test("setData: setting new data with invalid pointIndex (less than 0)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    chart?.setData([10, 11, 12], {}, -1);

    expect(chart?.getCurrent().point).toEqual({
        x: 0,
        y: 10
    });
});

test("setData: setting new data with invalid pointIndex (too high)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    chart?.setData([10, 11, 12], {}, 8);

    expect(chart?.getCurrent().point).toEqual({
        x: 2,
        y: 12
    });
});

test("setData: retain stat value", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [
            { x: 1, high: 8, low: 7 },
            { x: 2, high: 9, low: 6 },
            { x: 3, high: 10, low: 5 },
            { x: 4, high: 11, low: 4 }
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
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toStrictEqual({
        group: "",
        stat: "",
        point: { x: 2, high: 9, low: 6 }
    });

    // Move down (setting stat to "High")
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toStrictEqual({
        group: "",
        stat: "high",
        point: { x: 2, high: 9, low: 6 }
    });

    // Call .setData
    chart?.setData([
        { x: 2, high: 9, low: 6 },
        { x: 3, high: 10, low: 5 },
        { x: 4, high: 11, low: 4 },
        { x: 5, high: 12, low: 3 }
    ]);

    // Confirm that the stat didn't change
    expect(chart?.getCurrent().stat).toBe("high");
});

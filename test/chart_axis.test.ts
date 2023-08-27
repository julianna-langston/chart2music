import c2mChart from "../src/entryPoint";
import { SUPPORTED_CHART_TYPES } from "../src/types";

window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
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
});

// with provided X axis
// with provided Y axis
// axis data: provide min but not max

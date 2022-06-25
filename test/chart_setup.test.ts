import { c2mChart } from "../src/sonify";
import { SUPPORTED_CHART_TYPES } from "../src/types";

test("Confirm that C2M modifies provided elements", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const chart = new c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        element: mockElement,
        cc: mockElementCC
    });

    expect(mockElement.getAttribute("tabIndex")).toBe("0");
    expect(mockElementCC.getAttribute("aria-live")).toBe("assertive");
});

// Confirm that C2M adds a CC element to the chart element if no CC is provided
// with provided X axis
// with provided Y axis
// axis data: provide min but not max

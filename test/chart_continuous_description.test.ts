import { c2mChart } from "../src/entryPoint_mjs";

window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("Confirm that continuous x is described as continuous", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 4, 5],
        axes: {
            x: {
                continuous: true
            }
        },
        element: mockElement,
        cc: mockElementCC
    });

    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`continuously`);
});

test("Confirm that explicitly non-continuous x is not described as continuous", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 4, 5],
        axes: {
            x: {
                continuous: false
            }
        },
        element: mockElement,
        cc: mockElementCC
    });

    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).not.toContain(`continuously`);
});

test("Confirm that implicitly non-continuous x is not described as continuous", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 4, 5],
        element: mockElement,
        cc: mockElementCC
    });

    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).not.toContain(`continuously`);
});

test("Confirm that continuous y is not described as continuous", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 4, 5],
        axes: {
            y: {
                continuous: true
            }
        },
        element: mockElement,
        cc: mockElementCC
    });

    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).not.toContain(`continuously`);
});

import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("Launch help dialog using keyboard command", () => {
    const spyAppend = jest.spyOn(document.body, "appendChild");
    const spyRemove = jest.spyOn(document.body, "removeChild");
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    document.body.focus();

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "h"
        })
    );

    expect(spyAppend).toHaveBeenCalled();

    const dialog = document.body.querySelector("[role='dialog']");

    expect(document.activeElement).toBe(dialog);

    dialog?.dispatchEvent(new Event("blur"));

    expect(spyRemove).toHaveBeenCalled();
});

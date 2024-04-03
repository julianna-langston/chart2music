import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("Confirm cleanup removes the attributes and events listeners C2M added", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    expect(mockElement.hasAttribute("aria-label")).toBeTruthy();
    expect(mockElement.hasAttribute("role")).toBeTruthy();

    mockElement.dispatchEvent(new Event("focus"));
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toContain(
        "Sonified chart"
    );

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 2");

    chart?.cleanUp();
    expect(mockElement.hasAttribute("aria-label")).toBeFalsy();
    expect(mockElement.hasAttribute("role")).toBeFalsy();

    mockElement.dispatchEvent(new Event("focus"));
    expect(mockElementCC.lastElementChild?.textContent?.trim()).not.toContain(
        "Sonified chart"
    );

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).not.toBe(
        "2, 3"
    );
});

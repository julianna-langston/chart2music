import { c2mChart } from "../src/c2mChart";
import { MockAudioEngine } from "./_mockAudioEngine";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("Waterfall bars announce their open and close values", () => {
    const element = document.createElement("div");
    const cc = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "bar",
        element,
        cc,
        audioEngine: new MockAudioEngine(),
        axes: {
            x: { label: "Category", valueLabels: ["Revenue", "Expenses"] },
            y: { label: "Amount", format: (value) => `$${value}` }
        },
        data: [
            { x: 0, open: 0, close: 120 },
            { x: 1, open: 120, close: 85, custom: { category: "cost" } }
        ]
    });
    expect(err).toBe(null);

    element.dispatchEvent(new Event("focus"));
    element.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    jest.advanceTimersByTime(250);
    expect(cc.lastElementChild?.textContent?.trim()).toBe(
        "All, Revenue, $0 - $120"
    );

    element.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    jest.advanceTimersByTime(250);
    expect(cc.lastElementChild?.textContent?.trim()).toBe(
        "Expenses, $120 - $85"
    );

    element.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    jest.advanceTimersByTime(250);
    expect(cc.lastElementChild?.textContent?.trim()).toBe(
        "Open, Expenses, $120"
    );
    expect(chart?.getCurrent().stat).toBe("open");

    element.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    jest.advanceTimersByTime(250);
    expect(cc.lastElementChild?.textContent?.trim()).toBe(
        "Close, Expenses, $85"
    );
    expect(chart?.getCurrent().stat).toBe("close");
});

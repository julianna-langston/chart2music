import { c2mChart } from "../src/c2mChart";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("setCategoryVisibility: toggle middle (non-current) category", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: {
            a: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ],
            b: [
                { x: 1, y: 11 },
                { x: 2, y: 12 },
                { x: 3, y: 13 }
            ],
            c: [
                { x: 1, y: 7 },
                { x: 2, y: 8 },
                { x: 3, y: 9 }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    chart?.setCategoryVisibility("b", false);
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Chart updated"
    );

    // Move to next category
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 7");
    expect(chart?.getCurrent()).toStrictEqual({
        index: 0,
        group: "c",
        stat: "",
        point: {
            x: 1,
            y: 7
        }
    });

    chart?.setCategoryVisibility("b", false);
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).not.toBe(
        "Chart updated"
    );
    // Move to next category
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageUp"
        })
    );
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 1");

    chart?.setCategoryVisibility("b", true);
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Chart updated"
    );
    // Move to next category
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 11");
    chart?.setCategoryVisibility("b", true);
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).not.toBe(
        "Chart updated"
    );
});
test("setCategoryVisibility: error: try to set visibility on non-existant category", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: {
            a: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ],
            b: [
                { x: 1, y: 11 },
                { x: 2, y: 12 },
                { x: 3, y: 13 }
            ],
            c: [
                { x: 1, y: 7 },
                { x: 2, y: 8 },
                { x: 3, y: 9 }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    const funcError = chart?.setCategoryVisibility("d", false);
    expect(funcError).toContain(`Unknown group named "d"`);
});

test("setCategoryVisibility: Hide current category (first)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: {
            a: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ],
            b: [
                { x: 1, y: 11 },
                { x: 2, y: 12 },
                { x: 3, y: 13 }
            ],
            c: [
                { x: 1, y: 7 },
                { x: 2, y: 8 },
                { x: 3, y: 9 }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    const funcError = chart?.setCategoryVisibility("a", false);
    expect(funcError).toBe("");
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Chart updated"
    );

    // Move to next category
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 11");
});
test("setCategoryVisibility: Hide current category (last)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: {
            a: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ],
            b: [
                { x: 1, y: 11 },
                { x: 2, y: 12 },
                { x: 3, y: 13 }
            ],
            c: [
                { x: 1, y: 7 },
                { x: 2, y: 8 },
                { x: 3, y: 9 }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 7");

    const funcError = chart?.setCategoryVisibility("c", false);
    expect(funcError).toBe("");
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Chart updated"
    );

    // Move to next category
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 11");
});
test("setCategoryVisibility: Hide current category (middle)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: {
            a: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ],
            b: [
                { x: 1, y: 11 },
                { x: 2, y: 12 },
                { x: 3, y: 13 }
            ],
            c: [
                { x: 1, y: 7 },
                { x: 2, y: 8 },
                { x: 3, y: 9 }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 11");

    const funcError = chart?.setCategoryVisibility("b", false);
    expect(funcError).toBe("");
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Chart updated"
    );

    // Move to next category
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 7");
});

test("setCategoryVisibility: error: try to hide all categories", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: {
            a: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ],
            b: [
                { x: 1, y: 11 },
                { x: 2, y: 12 },
                { x: 3, y: 13 }
            ],
            c: [
                { x: 1, y: 7 },
                { x: 2, y: 8 },
                { x: 3, y: 9 }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    expect(chart?.setCategoryVisibility("a", false)).toBe("");
    expect(chart?.setCategoryVisibility("b", false)).toBe("");
    expect(chart?.setCategoryVisibility("c", false)).toContain(
        `Group "c" can not be hidden`
    );
});

test("setCategoryVisibility: of 2, focus on 2nd, turn off first", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: {
            a: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ],
            b: [
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

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toContain(
        `Line chart showing "b".`
    );

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 11");

    expect(chart?.setCategoryVisibility("a", false));

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("2, 12");
    expect(chart?.getCurrent()).toEqual({
        group: "b",
        index: 1,
        stat: "",
        point: {
            x: 2,
            y: 12
        }
    });
});

test("setCategoryVisibility: of 2, focus on 2nd, turn off first", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: {
            a: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ],
            b: [
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

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toContain(
        `Line chart showing "b".`
    );

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 11");

    expect(chart?.setCategoryVisibility("b", false));

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 1");
    expect(chart?.getCurrent()).toEqual({
        group: "a",
        stat: "",
        index: 0,
        point: {
            x: 1,
            y: 1
        }
    });
});

// done: set a visible group to hidden
// done: set a hidden group to visible
// done: set an already-visible group to visible
// done: set an already-hidden group to hidden
// done: set current (middle) group to hidden
// done: set current (first) group to hidden
// done: set current (last) group to hidden
// set first group to hidden
// done: set last group to hidden
// set group to hidden then visible
// set last group to hidden, then page down to boundary
// set first group to hidden, then page up to boundary
// done: test error messages

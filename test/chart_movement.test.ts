import { c2mChart } from "../src/c2mChart";
import type { SimpleDataPoint } from "../src/dataPoint";
import { StarTrekEpisodeRatings, StartTrekEpisodeRatingsX } from "./_test_data";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("Move around by single events", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
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
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 2");
    expect(chart?.getCurrent()).toStrictEqual({
        index: 1,
        group: "",
        stat: "",
        point: {
            x: 1,
            y: 2
        }
    });

    // Move left
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowLeft"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("0, 1");

    // Move to end
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("7, 3");

    // Move to home
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Home"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("0, 1");

    // Move to max value
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "]"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("5, 5");

    // Move to min value
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "["
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("3, 0");
});

test("Move around by single events", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [
            1, 2, 3, 0, 4, 5, 4, 3, 1, 2, 3, 0, 4, 5, 4, 3, 1, 2, 3, 0, 4, 5, 4,
            3, 1, 2, 3, 0, 4, 5, 4, 3
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
            ctrlKey: true,
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("3, 0");

    // Move to the end
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("31, 3");

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            ctrlKey: true,
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("31, 3");

    // Move left by tenths
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            ctrlKey: true,
            key: "ArrowLeft"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("28, 4");

    // Move home
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Home"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("0, 1");

    // Move left by tenths
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            ctrlKey: true,
            key: "ArrowLeft"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("0, 1");

    // Move left by tenths
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "m"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Not a live chart"
    );
});

test("Movement for a grouped chart", () => {
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
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("2, 2");
    expect(chart?.getCurrent()).toStrictEqual({
        index: 1,
        group: "a",
        stat: "",
        point: {
            x: 2,
            y: 2
        }
    });

    // Move to next category
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
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("2, 12");
    expect(chart?.getCurrent()).toStrictEqual({
        index: 1,
        group: "b",
        stat: "",
        point: {
            x: 2,
            y: 12
        }
    });

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("3, 13");
    expect(chart?.getCurrent()).toStrictEqual({
        index: 2,
        group: "b",
        stat: "",
        point: {
            x: 3,
            y: 13
        }
    });

    // Move to previous category
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageUp"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toContain(
        `Line chart showing "a".`
    );
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("3, 3");
    expect(chart?.getCurrent()).toStrictEqual({
        index: 2,
        group: "a",
        stat: "",
        point: {
            x: 3,
            y: 3
        }
    });

    // Move to last category
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            altKey: true,
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent().group).toEqual("c");

    // Move to first category
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            altKey: true,
            key: "PageUp"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent().group).toEqual("a");

    // Move to category maximum
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "]"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toEqual({
        index: 2,
        group: "a",
        stat: "",
        point: {
            x: 3,
            y: 3
        }
    });

    // Move to chart maximum
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "]",
            ctrlKey: true
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toEqual({
        index: 2,
        group: "b",
        stat: "",
        point: {
            x: 3,
            y: 13
        }
    });

    // Move to category minimum
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "["
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toEqual({
        index: 0,
        group: "b",
        stat: "",
        point: {
            x: 1,
            y: 11
        }
    });

    // Move to chart minimum
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "[",
            ctrlKey: true
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toEqual({
        index: 0,
        group: "a",
        stat: "",
        point: {
            x: 1,
            y: 1
        }
    });
});

test("Movement for a chart with stats", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: ["band", "line"],
        data: {
            a: [
                { x: 1, high: 10, low: 8 },
                { x: 2, high: 11, low: 9 },
                { x: 3, high: 12, low: 10 }
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

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toBe(
        `Sonified chart with 2 groups. Band chart showing "a". X is "" from 1 to 3. Y is "" from 8 to 13. Use arrow keys to navigate. Press H for more hotkeys.`
    );

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "2, 11 - 9"
    );
    expect(chart?.getCurrent()).toStrictEqual({
        index: 1,
        group: "a",
        stat: "",
        point: { x: 2, high: 11, low: 9 }
    });

    // Move down
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "High, 2, 11"
    );
    expect(chart?.getCurrent()).toStrictEqual({
        index: 1,
        group: "a",
        stat: "high",
        point: { x: 2, high: 11, low: 9 }
    });

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("3, 12");

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowUp"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "All, 3, 12 - 10"
    );

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "["
        })
    );
    jest.advanceTimersByTime(250);
    // Unchanged
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "All, 3, 12 - 10"
    );

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "]"
        })
    );
    jest.advanceTimersByTime(250);
    // Unchanged
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "All, 3, 12 - 10"
    );
});

test("Movement for a chart with a y2 axis and formatting", () => {
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
                { x: 1, y2: 11 },
                { x: 2, y2: 12 },
                { x: 3, y2: 13 }
            ]
        },
        axes: {
            x: {
                format: (value) => `${value}!`
            },
            y: {
                format: (value) => `$${value}`
            },
            y2: {
                format: (value) => `${value}%`
            }
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

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("2!, $2");
    expect(chart?.getCurrent()).toStrictEqual({
        index: 1,
        group: "a",
        stat: "",
        point: {
            x: 2,
            y: 2
        }
    });

    // Move to next category
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toContain(
        `Line chart showing "b".`
    );
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toContain(
        `Alternate Y is "" from 11% to 13%.`
    );
    // Play
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("2!, 12%");
    expect(chart?.getCurrent()).toStrictEqual({
        index: 1,
        group: "b",
        stat: "",
        point: {
            x: 2,
            y2: 12
        }
    });

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("3!, 13%");
    expect(chart?.getCurrent()).toStrictEqual({
        index: 2,
        group: "b",
        stat: "",
        point: {
            x: 3,
            y2: 13
        }
    });

    // Move to previous category
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageUp"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toContain(
        `Line chart showing "a".`
    );
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toContain(
        `Y is "" from $1 to $3.`
    );
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("3!, $3");
    expect(chart?.getCurrent()).toStrictEqual({
        index: 2,
        group: "a",
        stat: "",
        point: {
            x: 3,
            y: 3
        }
    });
});

test("Movement for a matrix", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "matrix",
        element: mockElement,
        cc: mockElementCC,
        data: StarTrekEpisodeRatings,
        axes: {
            x: {
                label: "Episodes",
                valueLabels: StartTrekEpisodeRatingsX
            }
        },
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
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("Ep 2, 7");

    // Move left
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowLeft"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Ep 1, 7.2"
    );

    // Move to end
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Ep 29, 7.5"
    );

    // Move to home
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Home"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Ep 1, 7.2"
    );

    // Move to max value
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "]"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Ep 28, 9.2"
    );

    // Move to min value
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "["
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Ep 27, 5.7"
    );

    // Move to min value
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            ctrlKey: true,
            key: "["
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Ep 22, 3.3"
    );

    // Move to min value
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Ep 29, missing"
    );

    // Move to min value
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            ctrlKey: true,
            key: "]"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Ep 19, 9.4"
    );

    // Move to min value
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            ctrlKey: true,
            key: "ArrowLeft"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Ep 16, 7.1"
    );

    // Move to min value
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            ctrlKey: true,
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Ep 19, 9.4"
    );
});

// with formatting
// enough data to test moveByTenths

test("Test onSelectCallback", () => {
    let lastSelectedIndex = -1;

    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            onSelectCallback: ({ index }) => {
                lastSelectedIndex = index;
            },
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
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 2");
    expect(chart?.getCurrent()).toStrictEqual({
        index: 1,
        group: "",
        stat: "",
        point: {
            x: 1,
            y: 2
        }
    });

    // Select item
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Enter"
        })
    );
    expect(lastSelectedIndex).toBe(1);
});

test("Move with tickLabels option", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        axes: {
            x: {
                valueLabels: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
            }
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
    expect(mockElementCC.textContent).toContain(`X is "" from A to H`);

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("B, 2");
    expect(chart?.getCurrent()).toStrictEqual({
        index: 1,
        group: "",
        stat: "",
        point: {
            x: 1,
            y: 2
        }
    });

    // Move to end
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("H, 3");
});

test("Changing groups with continuous mode: 1-1", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: {
            a: [
                {
                    x: 3, // ms: 750
                    y: 2
                },
                {
                    x: 4, // ms: 1000
                    y: 3
                },
                {
                    x: 4.5, // ms: 1125
                    y: 0
                },
                {
                    x: 5, // ms: 1250
                    y: 4
                },
                {
                    x: 10, // ms: 2500
                    y: 5
                }
            ],
            b: [
                {
                    x: 0,
                    y: 5
                },
                {
                    x: 1,
                    y: 6
                },
                {
                    x: 3,
                    y: 5
                },
                {
                    x: 5,
                    y: 8
                },
                {
                    x: 6,
                    y: 6
                },
                {
                    x: 7,
                    y: 8
                }
            ]
        },
        axes: {
            x: {
                continuous: true
            }
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
    expect(mockElementCC.textContent).toContain("continuously");

    [
        {
            input: {
                key: " "
            },
            output: {
                group: "a",
                index: 0
            }
        },
        {
            input: {
                key: "PageDown"
            },
            output: {
                group: "b",
                index: 2
            }
        },
        {
            input: {
                key: "Home"
            },
            output: {
                group: "b",
                index: 0
            }
        },
        {
            input: {
                key: "PageUp"
            },
            output: {
                group: "a",
                index: 0
            }
        },
        {
            input: {
                key: "ArrowRight"
            },
            output: {
                group: "a",
                index: 1
            }
        },
        {
            input: {
                key: "PageDown"
            },
            output: {
                group: "b",
                index: 2
            }
        },
        {
            input: {
                key: "End"
            },
            output: {
                group: "b",
                index: 5
            }
        },
        {
            input: {
                key: "PageUp"
            },
            output: {
                group: "a",
                index: 3
            }
        },
        {
            input: {
                key: "End"
            },
            output: {
                group: "a",
                index: 4
            }
        },
        {
            input: {
                key: "PageDown"
            },
            output: {
                group: "b",
                index: 5
            }
        }
    ].forEach(({ input, output }) => {
        mockElement.dispatchEvent(new KeyboardEvent("keydown", input));

        const current = chart?.getCurrent();
        expect(current?.group).toBe(output.group);
        expect(current?.index).toBe(output.index);
    });
});

test("Stacked bar chart", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "line",
        data: {
            A: [1, 2, 3, 4, 5],
            B: [10, 11, 12, 13, 14]
        },
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false,
            stack: true
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`with 3 groups`);

    // Change groups
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toStrictEqual({
        index: 0,
        group: "A",
        stat: "",
        point: {
            x: 0,
            y: 1
        }
    });

    // Change groups
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toStrictEqual({
        index: 0,
        group: "B",
        stat: "",
        point: {
            x: 0,
            y: 10
        }
    });

    // Change groups
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toStrictEqual({
        index: 4,
        group: "B",
        stat: "",
        point: {
            x: 4,
            y: 14
        }
    });
});

test("Don't stack a bar chart if it only has 1 group", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 4, 5],
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false,
            stack: true
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).not.toContain(`groups`);
});

test("Grouped scatter plot", () => {
    const blueState = [
        ["Arizona", 823, 113990.3],
        ["California", 840, 163694.7],
        ["Colorado", 919, 104093.7],
        ["Connecticut", 860, 5543.4],
        ["Delaware", 950, 2488.7],
        ["District of Columbia", 830, 68.3],
        ["Georgia", 829, 59425.2],
        ["Hawaii", 872, 10931.7],
        ["Illinois", 825, 57913.6],
        ["Maine", 830, 35379.7],
        ["Maryland", 690, 12405.9],
        ["Massachusetts", 820, 10554.4],
        ["Michigan", 870, 96713.5],
        ["Minnesota", 870, 86935.8],
        ["Nevada", 803, 110571.8],
        ["New Hampshire", 830, 9349.2],
        ["New Jersey", 665, 8722.6],
        ["New Mexico", 877, 121590.3],
        ["New York", 539, 54555.0],
        ["Oregon", 896, 98378.5],
        ["Pennsylvania", 798, 46054.3],
        ["Rhode Island", 829, 1544.9],
        ["Vermont", 910, 9616.4],
        ["Virginia", 840, 42774.9],
        ["Washington", 870, 71298.0],
        ["Wisconsin", 860, 65496.4]
    ].map(([label, y, x], index) => {
        return {
            label,
            x,
            y: (y as number) / 1000,
            custom: {
                index
            }
        } as SimpleDataPoint;
    });
    const redState = [
        ["Alabama", 1030, 52420.1],
        ["Alaska", 960, 665384.0],
        ["Arkansas", 931, 53178.6],
        ["Florida", 796, 65757.7],
        ["Idaho", 1122, 83569.0],
        ["Indiana", 914, 36419.6],
        ["Iowa", 1050, 56272.8],
        ["Kansas", 830, 82278.4],
        ["Kentucky", 840, 40407.8],
        ["Louisiana", 910, 52378.1],
        ["Mississippi", 692, 48431.8],
        ["Missouri", 830, 69707.0],
        ["Montana", 1120, 147039.7],
        ["Nebraska", 1046, 77347.8],
        ["North Carolina", 790, 53819.2],
        ["North Dakota", 1080, 70698.3],
        ["Ohio", 910, 44825.6],
        ["Oklahoma", 860, 69898.9],
        ["South Carolina", 850, 32020.5],
        ["South Dakota", 950, 77115.7],
        ["Tennessee", 840, 42144.3],
        ["Texas", 797, 268596.5],
        ["Utah", 870, 84896.9],
        ["West Virginia", 876, 24230.0],
        ["Wyoming", 1140, 97813.0]
    ].map(([label, y, x], index) => {
        return {
            label,
            x,
            y: (y as number) / 1000,
            custom: {
                index
            }
        } as SimpleDataPoint;
    });
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: "scatter",
        data: {
            Blue: blueState,
            Red: redState
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
    expect(mockElementCC.textContent).toContain(`with 3 groups`);
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toStrictEqual({
        index: 0,
        group: "All",
        stat: "",
        point: {
            label: "District of Columbia",
            x: 68.3,
            y: 0.83,
            custom: {
                index: 5
            }
        }
    });

    // Change groups
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toStrictEqual({
        index: 0,
        group: "Blue",
        stat: "",
        point: {
            label: "District of Columbia",
            x: 68.3,
            y: 0.83,
            custom: {
                index: 5
            }
        }
    });

    // Change groups
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toStrictEqual({
        index: 0,
        group: "Red",
        stat: "",
        point: {
            label: "West Virginia",
            y: 0.876,
            x: 24230,
            custom: {
                index: 23
            }
        }
    });

    // Change groups
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toStrictEqual({
        index: 24,
        group: "Red",
        stat: "",
        point: {
            label: "Alaska",
            x: 665384,
            y: 0.96,
            custom: {
                index: 1
            }
        }
    });

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "["
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toStrictEqual({
        index: 6,
        group: "Red",
        stat: "",
        point: {
            label: "Mississippi",
            x: 48431.8,
            y: 0.692,
            custom: {
                index: 10
            }
        }
    });
});

import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("Move around by single events", () => {
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
        type: SUPPORTED_CHART_TYPES.LINE,
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
        type: SUPPORTED_CHART_TYPES.LINE,
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
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "b, 2, 12"
    );
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
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("a, 3, 3");
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
        type: [SUPPORTED_CHART_TYPES.BAND, SUPPORTED_CHART_TYPES.LINE],
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
        `Sonified band-line chart "", contains 2 categories, x is "" from 1 to 3, y is "" from 8 to 13. Use arrow keys to navigate. Press H for more hotkeys.`
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
        type: SUPPORTED_CHART_TYPES.LINE,
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

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "b, 2!, 12%"
    );
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

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageUp"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "a, 3!, $3"
    );
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

// with formatting
// enough data to test moveByTenths

test("Test onSelectCallback", () => {
    let lastSelectedIndex = -1;

    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
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
        type: SUPPORTED_CHART_TYPES.LINE,
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
    expect(mockElementCC.textContent).toContain(`x is "" from A to H`);

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
        type: SUPPORTED_CHART_TYPES.LINE,
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
        type: SUPPORTED_CHART_TYPES.LINE,
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
    expect(mockElementCC.textContent).toContain(`contains 3 categories`);

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
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(chart?.getCurrent()).toStrictEqual({
        index: 0,
        group: "Stack",
        stat: "",
        point: {
            x: 0,
            y: 11
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
        group: "Stack",
        stat: "",
        point: {
            x: 4,
            y: 19
        }
    });
});

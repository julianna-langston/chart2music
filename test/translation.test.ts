import { c2m, c2mChart } from "../src/c2mChart";
import { TranslationManager } from "../src/translator";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

describe("Manager", () => {
    test("Generate strings", () => {
        const mgr = new TranslationManager("en");

        expect(mgr.language).toBe("en");
        expect(mgr.loadedLanguages).toEqual(["en"]);
        expect(mgr.translate("missing")).toBe("missing");
        expect(mgr.translate("description", { title: "Test" })).toBe(
            "Test, Sonified chart"
        );
    });
    test("Non-default language", () => {
        const mgr = new TranslationManager("de");

        expect(mgr.language).toBe("de");
        expect(mgr.loadedLanguages).toEqual(["en", "de"]);
        expect(mgr.translate("missing")).toBe("fehlt");
    });
});

test("Spanish", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        lang: "es",
        title: "EXEMPLE",
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
        "EXEMPLE Actualizado"
    );
});

test("Get list of available languages", () => {
    expect(c2m.languages).toHaveLength(6);
    expect(c2m.languages).toContain("en");
    expect(c2m.languages).toContain("es");
    expect(c2m.languages).toContain("de");
    expect(c2m.languages).toContain("fr");
    expect(c2m.languages).toContain("it");
    expect(c2m.languages).toContain("hmn");
});

test("French", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        lang: "fr",
        title: "Exemple",
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
    expect(mockElementCC.textContent).toContain(
        `Graphique sonifié avec 3 groupes intitulé "Exemple".`
    );

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.textContent).toContain(`2, 2`);
});

test("German", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        lang: "de",
        title: "Beuspiel",
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
    expect(mockElementCC.textContent).toContain(
        `Sonifizierte Grafik mit 3 Gruppen mit dem Titel "Beuspiel".`
    );

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.textContent).toContain(`2, 2`);
});

test("Italian", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        lang: "it",
        title: "Esempio",
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
    expect(mockElementCC.textContent).toContain(
        `Grafico sonificato con 3 gruppi intitolato "Esempio".`
    );

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.textContent).toContain(`2, 2`);
});

test("Hmong", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        lang: "hmn",
        title: "Piv txwv",
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
    expect(mockElementCC.textContent).toContain(
        `Daim kab kos siv suab muaj 3 pab hu ua "Piv txwv".`
    );

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.textContent).toContain(`2, 2`);
});

describe("Provided translations", () => {
    test("Provide custom text for the element's aria-label", () => {
        const mockElement = document.createElement("div");
        const mockElementCC = document.createElement("div");
        const { err } = c2mChart({
            lang: "en",
            title: "EXAMPLE",
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
                enableSound: false,
                translationCallback: ({ language, id, evaluators }) => {
                    if (language !== "en") {
                        return false;
                    }

                    switch (id) {
                        case "description": {
                            return `Sonified chart, ${(evaluators.title as string) ?? ""}`;
                        }
                        default: {
                            return false;
                        }
                    }
                }
            }
        });
        expect(err).toBe(null);

        expect(mockElement.getAttribute("aria-label")).toBe(
            "Sonified chart, EXAMPLE"
        );
    });

    test("Custom point-xy-label formatting with labels for stacked bars", () => {
        const mockElement = document.createElement("div");
        const mockElementCC = document.createElement("div");
        const { err } = c2mChart({
            lang: "en",
            title: "Stacked Bar Revenue",
            type: "line",
            data: {
                "Q1 2023": [
                    {
                        x: 1,
                        y: 100,
                        label: "Product A: 30, Product B: 40, Product C: 30"
                    },
                    {
                        x: 2,
                        y: 120,
                        label: "Product A: 35, Product B: 45, Product C: 40"
                    }
                ],
                "Q2 2023": [
                    {
                        x: 1,
                        y: 150,
                        label: "Product A: 50, Product B: 60, Product C: 40"
                    }
                ]
            },
            element: mockElement,
            cc: mockElementCC,
            options: {
                enableSound: false,
                translationCallback: ({ id, evaluators }) => {
                    if (id === "point-xy-label") {
                        return `${evaluators.x as string}, total ${evaluators.y as string} (${evaluators.label as string})`;
                    }
                    return false;
                }
            }
        });
        expect(err).toBe(null);

        mockElement.dispatchEvent(new Event("focus"));

        // Navigate to first point - use Home to ensure we're at index 0
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Home"
            })
        );
        jest.advanceTimersByTime(250);

        // Verify custom format is used with label
        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
            "1, total 100 (Product A: 30, Product B: 40, Product C: 30)"
        );

        // Navigate to next point
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "ArrowRight"
            })
        );
        jest.advanceTimersByTime(250);

        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
            "2, total 120 (Product A: 35, Product B: 45, Product C: 40)"
        );

        // Navigate to next group
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "PageDown"
            })
        );
        jest.advanceTimersByTime(250);

        // After PageDown, navigate to first point of new group
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Home"
            })
        );
        jest.advanceTimersByTime(250);

        // Verify custom format works for second group
        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
            "1, total 150 (Product A: 50, Product B: 60, Product C: 40)"
        );
    });

    test("Backwards compatibility: simple points with labels use default format", () => {
        const mockElement = document.createElement("div");
        const mockElementCC = document.createElement("div");
        const { err } = c2mChart({
            lang: "en",
            title: "Test Chart",
            type: "line",
            data: {
                series: [
                    { x: 1, y: 10, label: "Point A" },
                    { x: 2, y: 20, label: "Point B" }
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

        // Navigate to first point using Home
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Home"
            })
        );
        jest.advanceTimersByTime(250);

        // Verify default format appends label with comma
        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
            "1, 10, Point A"
        );

        // Navigate to second point
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "ArrowRight"
            })
        );
        jest.advanceTimersByTime(250);

        // Verify default format works for second point too
        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
            "2, 20, Point B"
        );
    });

    test("announcePointLabelFirst puts label at the beginning", () => {
        const mockElement = document.createElement("div");
        const mockElementCC = document.createElement("div");
        const { err } = c2mChart({
            lang: "en",
            title: "Test Chart",
            type: "line",
            data: {
                series: [
                    { x: 1, y: 10, label: "Point A" },
                    { x: 2, y: 20, label: "Point B" }
                ]
            },
            element: mockElement,
            cc: mockElementCC,
            options: {
                enableSound: false,
                announcePointLabelFirst: true
            }
        });
        expect(err).toBe(null);

        mockElement.dispatchEvent(new Event("focus"));

        // Navigate to first point
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Home"
            })
        );
        jest.advanceTimersByTime(250);

        // Verify label comes first: "Point A, 1, 10"
        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
            "Point A, 1, 10"
        );

        // Navigate to second point
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "ArrowRight"
            })
        );
        jest.advanceTimersByTime(250);

        // Verify label comes first: "Point B, 2, 20"
        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
            "Point B, 2, 20"
        );
    });

    test("Default behavior puts label at the end", () => {
        const mockElement = document.createElement("div");
        const mockElementCC = document.createElement("div");
        const { err } = c2mChart({
            lang: "en",
            title: "Test Chart",
            type: "line",
            data: {
                series: [
                    { x: 1, y: 10, label: "Point A" },
                    { x: 2, y: 20, label: "Point B" }
                ]
            },
            element: mockElement,
            cc: mockElementCC,
            options: {
                enableSound: false,
                announcePointLabelFirst: false
            }
        });
        expect(err).toBe(null);

        mockElement.dispatchEvent(new Event("focus"));

        // Navigate to first point
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Home"
            })
        );
        jest.advanceTimersByTime(250);

        // Verify label comes last: "1, 10, Point A"
        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
            "1, 10, Point A"
        );

        // Navigate to second point
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "ArrowRight"
            })
        );
        jest.advanceTimersByTime(250);

        // Verify label comes last: "2, 20, Point B"
        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
            "2, 20, Point B"
        );
    });
});

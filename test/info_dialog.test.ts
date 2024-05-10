import { c2mChart } from "../src/c2mChart";

jest.useFakeTimers();

afterEach(() => {
    // Clear dialog, if it's still up
    document.querySelector("dialog")?.close();
});

test("Info Dialog should be correctly generated", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        },
        info: {
            notes: ["Test 1", "Test 2?", "<button>TEST 3</button>"]
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    // Confirm that summary says "Has notes."
    expect(mockElementCC.textContent).toContain("Has notes.");

    expect(document.querySelectorAll("dialog").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "I"
        })
    );
    expect(document.querySelectorAll("dialog").length).toBe(1);

    const dialog = document.querySelector("dialog");

    expect(dialog?.querySelector("h2")).not.toBeUndefined();
    expect(dialog?.querySelector("h2")?.textContent).toBe("Notes");

    expect(dialog?.querySelectorAll("li")).toHaveLength(3);

    const listItems = Array.from(dialog?.querySelectorAll("li") ?? []).map(
        (elem) => elem.textContent
    );
    expect(listItems).toEqual(["Test 1", "Test 2?", "<button>TEST 3</button>"]);
});

test("Make sure that HTML elements are correctly escaped out of notes", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        },
        info: {
            notes: ["Test 1", "Test 2?", "<button>TEST 3</button>"]
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "I"
        })
    );

    const dialog = document.querySelector("dialog");
    expect(dialog?.querySelectorAll("li")).toHaveLength(3);
    expect(dialog?.querySelectorAll("button")).toHaveLength(0);
});

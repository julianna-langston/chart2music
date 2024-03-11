import * as adapter from "../src/rowArrayAdapter";

test("test if ArrayAsAdapter successful constructs a proper RowArrayAdapter", () => {
    const x = [1, 2, 3, 4];
    expect(adapter.isRowArrayAdapter(x)).toBeFalsy();

    const xAdapter = new adapter.ArrayAsAdapter(x);
    expect(adapter.isRowArrayAdapter(xAdapter)).toBeTruthy();
    expect(xAdapter.length).toBe(x.length);
    // expect(xAdapter.min()).toBe(Math.min(...x)); // not yet
    // expect(xAdapter.max()).toBe(Math.max(...x)); // not yet
    x.forEach((el, i) => {
        expect(xAdapter.at(i).y).toBe(el);
        expect(xAdapter.at(i).x).toBe(i);
    });
    x.forEach((el, i) => {
        expect(
            xAdapter.findIndex((el2: adapter.RowArrayAdapter) => {
                if (!el2) return false;
                return el2.y === el;
            })
        ).toBe(i);
        expect(
            xAdapter.findIndex(() => {
                return false;
            })
        ).toBe(-1);
    });
});

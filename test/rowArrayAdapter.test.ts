import * as adapter from "../src/rowArrayAdapter";

test("test if functions return the correct value", () => {
    const x = [1, 2, 3, 4];
    expect(adapter.isRowArrayAdapter(x)).toBeFalsy();

    const xAdapter = new adapter.ArrayAsAdapter(x);
    expect(adapter.isRowArrayAdapter(xAdapter)).toBeTruthy();
    expect(xAdapter.length).toBe(x.length);
    expect(xAdapter.min()).toBe(Math.min(...x));
    expect(xAdapter.max()).toBe(Math.max(...x));
    x.forEach((el, i) => {
        expect(xAdapter.at(i)).toBe(el);
    });
    expect(xAdapter.length).toBe(x.length);
});

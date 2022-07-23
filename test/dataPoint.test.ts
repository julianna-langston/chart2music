import {
    isAlternateAxisDataPoint,
    isHighLowDataPoint,
    isSimpleDataPoint
} from "../src/dataPoint";

test("test if functions return the correct value", () => {
    // All should be true.
    expect(isSimpleDataPoint({ x: 5, y: 5 })).toBeTruthy();
    expect(isAlternateAxisDataPoint({ x: 5, y2: 5 })).toBeTruthy();
    expect(isHighLowDataPoint({ x: 5, high: 5, low: 5 })).toBeTruthy();
    // All should be false since we're missing the "x" value.
    expect(isSimpleDataPoint({ y: 5 })).toBeFalsy();
    expect(isAlternateAxisDataPoint({ y2: 5 })).toBeFalsy();
    expect(isHighLowDataPoint({ high: 5, low: 5 })).toBeFalsy();
    // All should be false since we're missing a key property.
    expect(isSimpleDataPoint({ x: 5, foo: 5 })).toBeFalsy();
    expect(isAlternateAxisDataPoint({ x: 5, bar: 5 })).toBeFalsy();
    expect(isHighLowDataPoint({ x: 5, bas: 5, low: 5 })).toBeFalsy();
    expect(isHighLowDataPoint({ x: 5, high: 5, bas: 5 })).toBeFalsy();
});

test("test if functions act as type guards", () => {
    const simplePointValue = 2;
    const altPointValue = 4;
    const hlPointHighValue = 20;
    const hlPointLowValue = 10;
    const simplePoint = { x: 1, y: simplePointValue };
    const altPoint = { x: 2, y2: altPointValue };
    const hlPoint = { x: 3, high: hlPointHighValue, low: hlPointLowValue };
    const invalidPoint = {
        y: simplePointValue,
        y2: altPointValue,
        high: hlPointHighValue,
        low: hlPointLowValue
    }; // missing x property
    // Test isSimpleDataPoint.
    let result = false;
    if (isSimpleDataPoint(simplePoint)) {
        result = simplePoint.y === simplePointValue;
    }
    expect(result).toBeTruthy();
    // Test isAlternateAxisDataPoint.
    result = false;
    if (isAlternateAxisDataPoint(altPoint)) {
        result = altPoint.y2 === altPointValue;
    }
    expect(result).toBeTruthy();
    // Test isHighLowDataPoint.
    result = false;
    if (isHighLowDataPoint(hlPoint)) {
        result =
            hlPoint.high === hlPointHighValue &&
            hlPoint.low === hlPointLowValue;
    }
    expect(result).toBeTruthy();
    // Make sure isSimpleDataPoint rejects points.
    result = false;
    if (isSimpleDataPoint(invalidPoint)) {
        result = true;
    }
    expect(result).toBeFalsy();
    // Make sure isAlternateAxisDataPoint rejects points.
    result = false;
    if (isAlternateAxisDataPoint(invalidPoint)) {
        result = true;
    }
    expect(result).toBeFalsy();
    // Make sure isHighLowDataPoint rejects points.
    result = false;
    if (isHighLowDataPoint(invalidPoint)) {
        result = true;
    }
    expect(result).toBeFalsy();
});

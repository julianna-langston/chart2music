/**
 * The base of all data points.
 * This only contains the x-axis, see the rest of the DataPoint interfaces to actually create data points.
 */
interface DataPoint {
    /** The x-axis value */
    x: number;
}

/**
 * Check if an object implements the DataPoint interface.
 *
 * @param obj - the object to check
 * @returns true if the object implements the interface
 */
function isDataPoint(obj: unknown): obj is DataPoint {
    return typeof obj === "object" && "x" in obj;
}

/**
 * A simple data point with x and y values.
 */
export interface SimpleDataPoint extends DataPoint {
    /** The y-axis value */
    y: number;
}

/**
 * Check if an object implements the SimpleDataPoint interface.
 *
 * @param obj - the object to check
 * @returns true if the object implements the interface
 */
export function isSimpleDataPoint(obj: unknown): obj is SimpleDataPoint {
    return isDataPoint(obj) && "y" in obj;
}

/**
 * A data point that is like the SimpleDataPoint interface but with an alternate axis.
 */
export interface AlternateAxisDataPoint extends DataPoint {
    /** The y2-axis */
    y2: number;
}

/**
 * Check if an object implements the AlternateAxisDataPoint interface.
 *
 * @param obj - the object to check
 * @returns true if the object implements the interface
 */
export function isAlternateAxisDataPoint(
    obj: unknown
): obj is AlternateAxisDataPoint {
    return isDataPoint(obj) && "y2" in obj;
}

/**
 * A data point that has both a high and low value.
 */
export interface HighLowDataPoint extends DataPoint {
    /** The high value */
    high: number;
    /** The low value */
    low: number;
}

/**
 * Check if an object implements the HighLowDataPoint interface.
 *
 * @param obj - the object to check
 * @returns true if the object implements the interface
 */
export function isHighLowDataPoint(obj: unknown): obj is HighLowDataPoint {
    return isDataPoint(obj) && "high" in obj && "low" in obj;
}

/**
 * A type that includes all of the supported data point types.
 */
export type SupportedDataPointType =
    | SimpleDataPoint
    | AlternateAxisDataPoint
    | HighLowDataPoint;

import {
    interpolateBin,
    calcPan,
    generateSummary,
    calculateAxisMinimum,
    calculateAxisMaximum,
    defaultFormat
} from "./utils.js";
import { HERTZ, SPEEDS, NOTE_LENGTH } from "./constants.js";
import type {
    SonifyTypes,
    AxisData,
    dataPoint,
    StatBundle,
    groupedMetadata,
    validAxes
} from "./types";
import { ScreenReaderBridge } from "./ScreenReaderBridge.js";
import { OscillatorAudioEngine } from "./OscillatorAudioEngine.js";
import { KeyboardEventManager } from "./keyboardManager.js";

let context: null | AudioContext = null;

const generatePointDescription = (
    point: dataPoint,
    xAxis: AxisData,
    yAxis: AxisData
) => {
    if (typeof point.y === "number") {
        return `${xAxis.format(point.x)}, ${yAxis.format(point.y)}`;
    } else if (typeof point.y2 === "number") {
        return `${xAxis.format(point.x)}, ${yAxis.format(point.y2)}`;
    } else {
        if ("high" in point.y && "low" in point.y) {
            return `${xAxis.format(point.x)}, ${yAxis.format(
                point.y.high
            )} - ${yAxis.format(point.y.low)}`;
        }
    }
    return "";
};

const usesAxis = (data: dataPoint[][], axisName: "x" | "y" | "y2") => {
    const firstUseOfAxis = data.find((row) => {
        return row.find((point) => axisName in point);
    });
    return typeof firstUseOfAxis !== "undefined";
};

/**
 * Manages data and interactions
 */
export class Sonify {
    private _chartElement: HTMLElement;
    private _ccElement: HTMLElement;
    private _summary: string;
    private _groups: string[];
    private _data: dataPoint[][];
    private _groupIndex = 0;
    private _pointIndex = 0;
    private _sr: ScreenReaderBridge;
    private _xAxis: AxisData;
    private _yAxis: AxisData;
    private _y2Axis: AxisData;
    private _title: string;
    private _playListInterval: number | null = null;
    private _speedRateIndex = 1;
    private _flagNewGroup = false;
    private _keyEventManager: KeyboardEventManager;
    private _audioEngine: OscillatorAudioEngine | null = null;
    private _metadataByGroup: groupedMetadata[];

    /**
     * Constructor
     *
     * @param input - data/config provided by the invocation
     */
    constructor(input: SonifyTypes) {
        this._chartElement = input.element;
        this._ccElement = input.cc ?? this._chartElement;
        this._title = input.title ?? "";

        this._initializeData(input.data);
        this._calculateMetadataByGroup();

        this._xAxis = this._initializeAxis("x", input.axes?.x);
        this._yAxis = this._initializeAxis("y", input.axes?.y);
        if (usesAxis(this._data, "y2")) {
            this._y2Axis = this._initializeAxis("y2", input.axes?.y2);
        }

        // Generate summary
        this._summary = generateSummary(this._title, this._xAxis, this._yAxis);

        // Initialize SRB
        ScreenReaderBridge.addAriaAttributes(this._ccElement);
        this._sr = new ScreenReaderBridge(this._ccElement);

        this._initializeKeyActionMap();
        this._startListening();
    }

    /**
     * Initialize which keys map to which actions
     */
    private _initializeKeyActionMap() {
        this._keyEventManager = new KeyboardEventManager(this._chartElement);
        this._keyEventManager.registerKeyEvents([
            {
                title: "Go to next point",
                key: "ArrowRight",
                callback: () => {
                    this._moveRight();
                    this._playAndSpeak();
                }
            },
            {
                title: "Play all right",
                key: "Shift+ArrowRight",
                callback: () => {
                    this._playAllRight();
                }
            },
            {
                title: "Go to previous point",
                key: "ArrowLeft",
                callback: () => {
                    this._moveLeft();
                    this._playAndSpeak();
                }
            },
            {
                title: "Play all left",
                key: "Shift+ArrowLeft",
                callback: () => {
                    this._playAllLeft();
                }
            },
            {
                title: "Go to previous group",
                key: "PageUp",
                callback: () => {
                    if (this._groupIndex === 0) {
                        return;
                    }
                    this._groupIndex--;
                    this._flagNewGroup = true;
                    this._playAndSpeak();
                }
            },
            {
                title: "Go to next group",
                key: "PageDown",
                callback: () => {
                    if (this._groupIndex === this._data.length - 1) {
                        return;
                    }
                    this._groupIndex++;
                    this._flagNewGroup = true;
                    this._playAndSpeak();
                }
            },
            {
                title: "Go to first point",
                key: "Home",
                callback: () => {
                    this._pointIndex = 0;
                    this._playAndSpeak();
                }
            },
            {
                title: "Go to last point",
                key: "End",
                callback: () => {
                    this._pointIndex = this._data[this._groupIndex].length - 1;
                    this._playAndSpeak();
                }
            },
            {
                title: "Replay",
                key: "",
                callback: () => {
                    this._flagNewGroup = true;
                    this._playAndSpeak();
                }
            },
            {
                title: "Go backward by a tenth",
                key: "Ctrl+ArrowLeft",
                callback: () => {
                    this._moveLeftTenths();
                    this._playAndSpeak();
                }
            },
            {
                title: "Go forward by a tenth",
                key: "Ctrl+ArrowRight",
                callback: () => {
                    this._moveRightTenths();
                    this._playAndSpeak();
                }
            },
            {
                title: "Go to minimum value",
                key: "[",
                callback: () => {
                    if (this._moveToMinimum()) {
                        this._playAndSpeak();
                    }
                }
            },
            {
                title: "Go to maximum value",
                key: "]",
                callback: () => {
                    if (this._moveToMaximum()) {
                        this._playAndSpeak();
                    }
                }
            },
            {
                title: "Speed up",
                key: "q",
                callback: () => {
                    if (this._speedRateIndex < SPEEDS.length - 1) {
                        this._speedRateIndex++;
                    }
                    this._sr.render(`Speed, ${SPEEDS[this._speedRateIndex]}`);
                }
            },
            {
                title: "Slow down",
                key: "e",
                callback: () => {
                    if (this._speedRateIndex > 0) {
                        this._speedRateIndex--;
                    }
                    this._sr.render(`Speed, ${SPEEDS[this._speedRateIndex]}`);
                }
            },
            {
                title: "Open help dialog",
                key: "h",
                callback: () => {
                    this._keyEventManager.launchHelpDialog();
                }
            }
        ]);
    }

    /**
     * Initialize internal data structure. The user can provide data is several different types of formats,
     * so those formats will need to be unified here.
     *
     * @param userData - data provided by the invocation
     */
    private _initializeData(userData: SonifyTypes["data"]) {
        if (!Array.isArray(userData)) {
            // Data is presumably of type dataSet. No other effort necessary.
            this._groups = Object.keys(userData);
            this._data = Object.values(userData);
            return;
        }

        const massagedData: dataPoint[] = userData.map(
            (point: number | dataPoint, index: number) => {
                if (typeof point === "number") {
                    return {
                        x: index,
                        y: point
                    };
                }
                return point;
            }
        );

        this._groups = [""];
        this._data = [massagedData];
    }

    /**
     * Determine metadata about data sets, to help users navigate more effectively
     */
    private _calculateMetadataByGroup() {
        this._metadataByGroup = this._data.map((row) => {
            // Calculate min/max
            const yValues = row
                .map(({ y, y2 }) => y ?? y2)
                .filter((value) => typeof value === "number") as number[];
            const min = Math.min(...yValues);
            const max = Math.max(...yValues);

            // Calculate tenths
            const tenths = Math.round(row.length / 10);

            return {
                minimumPointIndex: yValues.indexOf(min),
                maximumPointIndex: yValues.indexOf(max),
                tenths
            };
        });
    }

    /**
     * Initialize internal representation of axis metadata. Providing metadata is optional, so we
     * need to generate metadata that hasn't been provided.
     *
     * @param axisName - which axis is this? "x" or "y"
     * @param userAxis - metadata provided by the invocation
     */
    private _initializeAxis(
        axisName: validAxes,
        userAxis?: AxisData
    ): AxisData {
        return {
            minimum:
                userAxis?.minimum ?? calculateAxisMinimum(this._data, axisName),
            maximum:
                userAxis?.maximum ?? calculateAxisMaximum(this._data, axisName),
            label: userAxis?.label ?? "",
            format: userAxis?.format ?? defaultFormat
        };
    }

    /**
     * Listen to various events, and drive interactions
     */
    private _startListening() {
        this._chartElement.addEventListener("focus", () => {
            if (!context) {
                context = new AudioContext();
            }
            this._sr.render(this._summary);
        });
    }

    /**
     * Play an individual data point, and then speak its details
     */
    private _playAndSpeak() {
        this._playCurrent();
        setTimeout(() => {
            this._speakCurrent();
        }, NOTE_LENGTH * 1000);
    }

    /**
     * Move focus to the next data point to the right, if there is one
     */
    private _moveRight() {
        const max = this._data[this._groupIndex].length - 1;
        if (this._pointIndex >= max) {
            this._pointIndex = max;
            return;
        }
        this._pointIndex++;
    }

    /**
     * Move focus to the next data point to the left, if there is one
     */
    private _moveLeft() {
        if (this._pointIndex <= 0) {
            this._pointIndex = 0;
            return;
        }
        this._pointIndex--;
    }

    /**
     * Move focus to the lowest value data point
     *
     * @returns - if move was completed
     */
    private _moveToMinimum() {
        const index = this._metadataByGroup[this._groupIndex].minimumPointIndex;
        if (index === -1) {
            return false;
        }
        this._pointIndex = index;
        return true;
    }

    /**
     * Move focus to the lowest value data point
     *
     * @returns - if move was completed
     */
    private _moveToMaximum() {
        const index = this._metadataByGroup[this._groupIndex].maximumPointIndex;
        if (index === -1) {
            return false;
        }
        this._pointIndex = index;
        return true;
    }

    /**
     * Move by a tenth to the left
     */
    private _moveLeftTenths() {
        this._pointIndex = Math.max(
            this._pointIndex - this._metadataByGroup[this._groupIndex].tenths,
            0
        );
    }

    /**
     * Move by a tenth to the right
     */
    private _moveRightTenths() {
        this._pointIndex = Math.min(
            this._pointIndex + this._metadataByGroup[this._groupIndex].tenths,
            this._data[this._groupIndex].length - 1
        );
    }

    /**
     * Play all data points to the left, if there are any
     */
    private _playAllLeft() {
        const min = 0;
        this._playListInterval = setInterval(() => {
            if (this._pointIndex <= min) {
                this._pointIndex = min;
                clearInterval(this._playListInterval);
            } else {
                this._pointIndex--;
                this._playCurrent();
            }
        }, SPEEDS[this._speedRateIndex]);
        this._playCurrent();
    }

    /**
     * Play all data points to the right, if there are any
     */
    private _playAllRight() {
        const max = this._data[this._groupIndex].length - 1;
        this._playListInterval = setInterval(() => {
            if (this._pointIndex >= max) {
                this._pointIndex = max;
                clearInterval(this._playListInterval);
            } else {
                this._pointIndex++;
                this._playCurrent();
            }
        }, SPEEDS[this._speedRateIndex]);
        this._playCurrent();
    }

    /**
     * Play the current data point
     */
    private _playCurrent() {
        if (!this._audioEngine && context) {
            this._audioEngine = new OscillatorAudioEngine(context);
        }

        const current = this._data[this._groupIndex][this._pointIndex];

        const xPan = calcPan(
            (current.x - this._xAxis.minimum) /
                (this._xAxis.maximum - this._xAxis.minimum)
        );

        if (typeof current.y === "number") {
            const yBin = interpolateBin(
                current.y,
                this._yAxis.minimum,
                this._yAxis.maximum,
                HERTZ.length - 1
            );

            if (this._audioEngine) {
                this._audioEngine.playNote(HERTZ[yBin], xPan, NOTE_LENGTH);
            }
        } else if (typeof current.y2 === "number") {
            const yBin = interpolateBin(
                current.y2,
                this._y2Axis.minimum,
                this._y2Axis.maximum,
                HERTZ.length - 1
            );

            if (this._audioEngine) {
                this._audioEngine.playNote(HERTZ[yBin], xPan, NOTE_LENGTH);
            }
        } else {
            (["high", "low"] as (keyof StatBundle)[]).forEach((stat) => {
                if (stat in (current.y as StatBundle)) {
                    const yBin = interpolateBin(
                        current.y[stat] as number,
                        this._yAxis.minimum,
                        this._yAxis.maximum,
                        HERTZ.length - 1
                    );

                    if (this._audioEngine) {
                        this._audioEngine.playNote(
                            HERTZ[yBin],
                            xPan,
                            NOTE_LENGTH
                        );
                    }
                }
            });
        }

        current.callback?.();
    }

    /**
     * Update the screen reader on the current data point
     */
    private _speakCurrent() {
        // If we're glagged to announce a new group, but the group name is empty, ignore the flag
        if (this._flagNewGroup && this._groups[this._groupIndex] === "") {
            this._flagNewGroup = false;
        }

        const current = this._data[this._groupIndex][this._pointIndex];
        const point = generatePointDescription(
            current,
            this._xAxis,
            "y" in current ? this._yAxis : this._y2Axis
        );
        const text =
            (this._flagNewGroup ? `${this._groups[this._groupIndex]}, ` : "") +
            point;

        this._sr.render(text);

        this._flagNewGroup = false;
    }
}

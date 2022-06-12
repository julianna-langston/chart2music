import {
    interpolateBin,
    calcPan,
    generateSummary,
    calculateAxisMinimum,
    calculateAxisMaximum,
    defaultFormat
} from "./utils.js";
import { HERTZ, SPEEDS, NOTE_LENGTH } from "./constants.js";
import type { SonifyTypes, AxisData, dataPoint, KeyActionMap } from "./types";
import { ScreenReaderBridge } from "./ScreenReaderBridge.js";

let context: null | AudioContext = null;

const generateKeypressDescription = (e: KeyboardEvent) => {
    return `${e.altKey ? "Alt+" : ""}${e.ctrlKey ? "Ctrl+" : ""}${e.shiftKey ? "Shift+" : ""}${e.key}`
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
    private _title: string;
    private _playListInterval: number | null = null;
    private _speedRateIndex = 1;
    private _flagNewGroup = false;
    private _keyActionMap: KeyActionMap;

    /**
     * Constructor
     *
     * @param input - data/config provided by the invocation
     */
    constructor(input: SonifyTypes) {
        this._chartElement = input.element;
        if (!this._chartElement.hasAttribute("tabIndex")) {
            this._chartElement.setAttribute("tabIndex", "0");
        }
        this._ccElement = input.cc ?? this._chartElement;
        this._title = input.title ?? "";

        this._initializeData(input.data);

        this._xAxis = this._initializeAxis("x", input.axes?.x);
        this._yAxis = this._initializeAxis("y", input.axes?.y);

        // Generate summary
        this._summary = generateSummary(this._title, this._xAxis, this._yAxis);

        // Initialize SRB
        ScreenReaderBridge.addAriaAttributes(this._ccElement);
        this._sr = new ScreenReaderBridge(this._ccElement);

        this._initializeKeyActionMap();
        this._startListening();
    }

    private _initializeKeyActionMap() {
        this._keyActionMap = {
            "ArrowRight": () => {
                this._moveRight();
                this._playAndSpeak();
            },
            "Shift+ArrowRight": () => {
                this._playAllRight();
            },
            "ArrowLeft": () => {
                this._moveLeft();
                this._playAndSpeak();
            },
            "Shift+ArrowLeft": () => {
                this._playAllLeft();
            },
            "PageUp": () => {
                if (this._groupIndex === 0) {
                    return;
                }
                this._groupIndex--;
                this._flagNewGroup = true;
                this._playAndSpeak();
            },
            "PageDown": () => {
                if (this._groupIndex === this._data.length - 1) {
                    return;
                }
                this._groupIndex++;
                this._flagNewGroup = true;
                this._playAndSpeak();
            },
            "Home": () => {
                this._pointIndex = 0;
                this._playAndSpeak();
            },
            "End": () => {
                this._pointIndex = this._data[this._groupIndex].length - 1;
                this._playAndSpeak();
            },
            " ": () => {
                this._flagNewGroup = true;
                this._playAndSpeak();
            },
            "q": () => {
                if (this._speedRateIndex > 0) {
                    this._speedRateIndex--;
                }
                this._sr.render(`Speed, ${SPEEDS[this._speedRateIndex]}`);
            },
            "e": () => {
                if (this._speedRateIndex < SPEEDS.length - 1) {
                    this._speedRateIndex++;
                }
                this._sr.render(`Speed, ${SPEEDS[this._speedRateIndex]}`);
            },
        }  
    }

    /**
     * Initialize internal data strucuture. The user can provide data is several different types of formats,
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
     * Initialize internal representation of axis metadata. Providing metadata is optional, so we
     * need to generate metadata that hasn't been provided.
     *
     * @param axisName - which axis is this? "x" or "y"
     * @param userAxis - metadata provided by the invocation
     */
    private _initializeAxis(
        axisName: "x" | "y",
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
            if (context === null) {
                context = new AudioContext();
            }
            this._sr.render(this._summary);
        });

        this._chartElement.addEventListener("keydown", (e) => {
            clearInterval(this._playListInterval);

            const keyPressDescription = generateKeypressDescription(e);

            if(keyPressDescription in this._keyActionMap){
                this._keyActionMap[keyPressDescription]();
                e.preventDefault();
            }
        });
    }

    /**
     * Play an individual data point, and then speak its details
     */
    private _playAndSpeak(){
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
        const current = this._data[this._groupIndex][this._pointIndex];

        const yBin = interpolateBin(
            current.y,
            this._yAxis.minimum,
            this._yAxis.maximum,
            HERTZ.length - 1
        );
        const xPan = calcPan(
            (current.x - this._xAxis.minimum) /
                (this._xAxis.maximum - this._xAxis.minimum)
        );

        pianist(yBin, xPan);

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
        const point = `${this._xAxis.format(current.x)}, ${this._yAxis.format(
            current.y
        )}`;
        const text =
            (this._flagNewGroup ? `${this._groups[this._groupIndex]}, ` : "") +
            point;

        this._sr.render(text);

        this._flagNewGroup = false;
    }
}

/**
 * Play an individual note
 *
 * @param noteIndex Which note to play, based on the Hertz list
 * @param positionX Where the note should be panned (-1 to 1)
 */
const pianist = (noteIndex: number, positionX: number) => {
    if (context === null) {
        return;
    }

    // Pan note
    const panner = new PannerNode(context, { positionX });
    panner.connect(context.destination);

    // Gain (so that you don't hear clipping)
    const gain = new GainNode(context);
    gain.gain.setValueAtTime(1, context.currentTime);
    gain.connect(panner);

    // Oscillator
    const osc = new OscillatorNode(context);
    osc.frequency.setValueAtTime(HERTZ[noteIndex], context.currentTime);
    osc.connect(gain);

    osc.start();
    gain.gain.setValueAtTime(0.01, context.currentTime + NOTE_LENGTH);
    osc.stop(context.currentTime + NOTE_LENGTH + 0.1);
};

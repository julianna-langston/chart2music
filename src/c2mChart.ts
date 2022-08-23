import { OscillatorAudioEngine } from "./audio/index";
import type { AudioEngine } from "./audio/index";
import { HERTZ, NOTE_LENGTH, SPEEDS } from "./constants";
import { KeyboardEventManager, keyboardEventToString } from "./keyboardManager";
import { ScreenReaderBridge } from "./ScreenReaderBridge";
import type {
    AxisData,
    groupedMetadata,
    SonifyTypes,
    c2mOptions,
    c2mGolangReturn,
    c2mCallbackType
} from "./types";
import {
    calcPan,
    generateSummary,
    interpolateBin,
    sentenceCase,
    generatePointDescription,
    usesAxis,
    calculateMetadataByGroup,
    initializeAxis,
    detectDataPointType,
    calculateAxisMinimum,
    calculateAxisMaximum,
    convertDataRow,
    formatWrapper,
    isUnplayable,
    prepChartElement,
    checkForNumberInput
} from "./utils";
import { validateInput } from "./validate";
import {
    isAlternateAxisDataPoint,
    isHighLowDataPoint,
    isOHLCDataPoint,
    isSimpleDataPoint
} from "./dataPoint";
import type { SupportedDataPointType } from "./dataPoint";

/**
 * List of actions that could be activated by keyboard or touch
 */
enum ActionSet {
    NEXT_POINT = "next_point",
    PREVIOUS_POINT = "previous_point",
    PLAY_RIGHT = "play_right",
    PLAY_LEFT = "play_left",
    STOP_PLAY = "stop_play",
    PREVIOUS_STAT = "previous_stat",
    NEXT_STAT = "next_stat",
    PREVIOUS_CATEGORY = "previous_category",
    NEXT_CATEGORY = "next_category",
    FIRST_POINT = "first_point",
    LAST_POINT = "last_point",
    REPLAY = "replay",
    SELECT = "select",
    PREVIOUS_TENTH = "previous_tenth",
    NEXT_TENTH = "next_tenth",
    GO_MINIMUM = "go_minimum",
    GO_MAXIMUM = "go_maximum",
    SPEED_UP = "speed_up",
    SLOW_DOWN = "slow_down",
    MONITOR = "monitor",
    HELP = "help",
    OPTIONS = "options"
}

/**
 * List of kinds of swipes available from touch actions
 */
enum TouchActionSet {
    LEFT = "left",
    RIGHT = "right",
    UP = "up",
    DOWN = "down",
    DOUBLE_LEFT = "double_left",
    DOUBLE_RIGHT = "double_right",
    DOUBLE_UP = "double_up",
    DOUBLE_DOWN = "double_down"
}

declare global {
    /**
     * augment the global window object
     */
    interface Window {
        __chart2music_options__?: {
            _hertzClamps?: {
                lower: number;
                upper: number;
            };
        };
    }
}

const launchOptionDialog = (
    { upper, lower }: { upper: number; lower: number },
    cb: (lower: number, upper: number) => void,
    playCb?: (hertz: number) => void
) => {
    const previousElement = document.activeElement as HTMLElement;
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.innerHTML = `<h1>Options</h1>

    <p tabIndex="0">While navigating this chart, you may find some sounds too low or too high to hear. Alternatively, you may want to expand the range of the sounds available. Use these sliders to adjust the range of sound:</p>

    <form id="optionForm">
        <div>
            <label>
                Lower hertz:
                <input type="range" min="0" max="${
                    upper - 1
                }" step="1" id="lowerRange" value="${lower}" />
            </label>
        </div>
        <div>
            <label>
                Upper hertz:
                <input type="range" min="${lower + 1}" max="${
        HERTZ.length - 1
    }" step="1" id="upperRange" value="${upper}" />
            </label>
        </div>

        <div>
            <label>
                <input type="checkbox" id="global" checked />
                Save my options for other charts on this page
            </label>
        </div>

        <input id="save" type="submit" value="Save" />
    </form>
    `;

    const lowerRange: HTMLInputElement = dialog.querySelector("#lowerRange");
    const upperRange: HTMLInputElement = dialog.querySelector("#upperRange");
    const global: HTMLInputElement = dialog.querySelector("#global");

    if (!window) {
        global.parentElement.parentElement.style.display = " none";
    }

    const save = () => {
        const lowerValue = Number(lowerRange.value);
        const upperValue = Number(upperRange.value);
        const saveGlobal = global.checked;
        cb(lowerValue, upperValue);

        if (window && saveGlobal) {
            if (!window.__chart2music_options__) {
                window.__chart2music_options__ = {};
            }
            window.__chart2music_options__ = {
                _hertzClamps: {
                    lower: lowerValue,
                    upper: upperValue
                }
            };
        }
        esc();
    };

    dialog.querySelector("#optionForm").addEventListener("submit", (e) => {
        e.preventDefault();
        save();
    });

    dialog.querySelector("#save").addEventListener("click", (e) => {
        e.preventDefault();
        save();
    });

    if (playCb) {
        lowerRange.addEventListener("change", () => {
            playCb(Number(lowerRange.value));
            upperRange.min = String(Number(lowerRange.value) + 1);
        });
        upperRange.addEventListener("change", () => {
            playCb(Number(upperRange.value));
            lowerRange.max = String(Number(upperRange.value) - 1);
        });
    }

    const esc = () => {
        previousElement.focus();
        dialog.parentElement.removeChild(dialog);
    };

    dialog.addEventListener("keydown", (evt) => {
        if (evt.key === "Escape") {
            esc();
        }
    });
    dialog.addEventListener("blur", esc);

    document.body.appendChild(dialog);
    const p: HTMLElement = dialog.querySelector("[tabIndex]");
    p.focus();
};

let context: null | AudioContext = null;

/**
 * Validates and initializes a single chart that should be sonified
 *
 * @param {SonifyTypes} input - data, config, and options for the chart
 * @returns c2mGolangReturn - A value of "err" (null if no error, or string if error) and "data" (the chart, if there was no error)
 */
export const c2mChart = (input: SonifyTypes): c2mGolangReturn => {
    const validationErrorString = validateInput(input);
    if (validationErrorString !== "") {
        return { err: validationErrorString };
    }

    return {
        err: null,
        data: new c2m(input)
    };
};

/**
 * Represents a single chart that should be sonified.
 */
export class c2m {
    private _chartElement: HTMLElement;
    private _ccElement: HTMLElement;
    private _summary: string;
    private _groups: string[];
    private _data: SupportedDataPointType[][];
    private _groupIndex = 0;
    private _pointIndex = 0;
    private _sr: ScreenReaderBridge;
    private _xAxis: AxisData;
    private _yAxis: AxisData;
    private _y2Axis: AxisData;
    private _title: string;
    private _playListInterval: NodeJS.Timeout | null = null;
    private _speedRateIndex = 1;
    private _flagNewGroup = false;
    private _flagNewStat = false;
    private _keyEventManager: KeyboardEventManager;
    private _audioEngine: AudioEngine | null = null;
    private _metadataByGroup: groupedMetadata[];
    private _options: c2mOptions = {
        enableSound: true,
        enableSpeech: true,
        live: false
    };
    private _providedAudioEngine?: AudioEngine;
    private _monitorMode = false;
    private _type: SonifyTypes["type"];
    private _explicitAxes: {
        x?: AxisData;
        y?: AxisData;
        y2?: AxisData;
    } = {};
    private _hertzClamps = {
        upper: HERTZ.length - 12,
        lower: 21
    };
    private _availableActions: {
        [key in ActionSet]: () => void;
    };

    /**
     * Constructor
     *
     * @param input - data/config provided by the invocation
     */
    constructor(input: SonifyTypes) {
        this._type = input.type;
        this._providedAudioEngine = input.audioEngine;
        this._title = input.title ?? "";
        this._chartElement = input.element;
        prepChartElement(this._chartElement, this._title);

        this._ccElement = input.cc ?? this._chartElement;

        this._setData(input.data, input.axes);

        if (input?.options) {
            this._options = {
                ...this._options,
                ...input?.options
            };
        }

        // Generate summary
        this._generateSummary();

        // Initialize SRB
        ScreenReaderBridge.addAriaAttributes(this._ccElement);
        this._sr = new ScreenReaderBridge(this._ccElement);

        this._availableActions = this._initializeActionMap();

        this._initializeKeyActionMap();
        this._initializeTouchActions();
        this._startListening();
    }

    /**
     * Establish what actions are available for the touch/keyboard action listeners
     */
    private _initializeActionMap() {
        return {
            next_point: () => {
                clearInterval(this._playListInterval);
                if (this._moveRight()) {
                    this._playAndSpeak();
                }
            },
            previous_point: () => {
                clearInterval(this._playListInterval);
                if (this._moveLeft()) {
                    this._playAndSpeak();
                }
            },
            play_right: () => {
                clearInterval(this._playListInterval);
                this._playRight();
            },
            play_left: () => {
                clearInterval(this._playListInterval);
                this._playLeft();
            },
            stop_play: () => {
                clearInterval(this._playListInterval);
            },
            previous_stat: () => {
                clearInterval(this._playListInterval);
                if (this._movePrevStat()) {
                    this._flagNewStat = true;
                    this._playAndSpeak();
                }
            },
            next_stat: () => {
                clearInterval(this._playListInterval);
                if (this._moveNextStat()) {
                    this._flagNewStat = true;
                    this._playAndSpeak();
                }
            },
            previous_category: () => {
                clearInterval(this._playListInterval);
                if (this._groupIndex === 0) {
                    return;
                }
                this._groupIndex--;
                this._flagNewGroup = true;
                this._playAndSpeak();
            },
            next_category: () => {
                clearInterval(this._playListInterval);
                if (this._groupIndex === this._data.length - 1) {
                    return;
                }
                this._groupIndex++;
                this._flagNewGroup = true;
                this._playAndSpeak();
            },
            first_point: () => {
                clearInterval(this._playListInterval);
                this._pointIndex = 0;
                this._playAndSpeak();
            },
            last_point: () => {
                clearInterval(this._playListInterval);
                this._pointIndex = this._data[this._groupIndex].length - 1;
                this._playAndSpeak();
            },
            replay: () => {
                clearInterval(this._playListInterval);
                this._flagNewGroup = true;
                this._flagNewStat = true;
                this._playAndSpeak();
            },
            select: () => {
                this._options.onSelectCallback?.({
                    slice: this._groups[this._groupIndex],
                    index: this._pointIndex
                });
            },
            previous_tenth: () => {
                clearInterval(this._playListInterval);
                this._moveLeftTenths();
                this._playAndSpeak();
            },
            next_tenth: () => {
                clearInterval(this._playListInterval);
                this._moveRightTenths();
                this._playAndSpeak();
            },
            go_minimum: () => {
                clearInterval(this._playListInterval);
                if (this._moveToMinimum()) {
                    this._playAndSpeak();
                }
            },
            go_maximum: () => {
                clearInterval(this._playListInterval);
                if (this._moveToMaximum()) {
                    this._playAndSpeak();
                }
            },
            speed_up: () => {
                clearInterval(this._playListInterval);
                if (this._speedRateIndex < SPEEDS.length - 1) {
                    this._speedRateIndex++;
                }
                this._sr.render(`Speed, ${SPEEDS[this._speedRateIndex]}`);
            },
            slow_down: () => {
                clearInterval(this._playListInterval);
                if (this._speedRateIndex > 0) {
                    this._speedRateIndex--;
                }
                this._sr.render(`Speed, ${SPEEDS[this._speedRateIndex]}`);
            },
            monitor: () => {
                if (!this._options.live) {
                    this._sr.render("Not a live chart");
                    return;
                }
                this._monitorMode = !this._monitorMode;
                this._sr.render(
                    `Monitoring ${this._monitorMode ? "on" : "off"}`
                );
            },
            help: () => {
                clearInterval(this._playListInterval);
                this._keyEventManager.launchHelpDialog();
            },
            options: () => {
                this._checkAudioEngine();
                launchOptionDialog(
                    this._hertzClamps,
                    (lowerIndex: number, upperIndex: number) => {
                        this._setHertzClamps(lowerIndex, upperIndex);
                    },
                    (hertzIndex: number) => {
                        this._audioEngine?.playDataPoint(
                            HERTZ[hertzIndex],
                            0,
                            NOTE_LENGTH
                        );
                    }
                );
            }
        };
    }

    /**
     * Wire up the touch action event listeners
     */
    private _initializeTouchActions() {
        let touches: Touch[] = [];
        const elem = this._chartElement;
        const touchActionMap: { [swipe in TouchActionSet]: () => void } = {
            left: this._availableActions.previous_point,
            right: this._availableActions.next_point,
            up: this._availableActions.previous_stat,
            down: this._availableActions.next_stat,
            double_down: this._availableActions.next_category,
            double_left: this._availableActions.play_left,
            double_right: this._availableActions.play_right,
            double_up: this._availableActions.previous_category
        };
        let waitTime = 0;
        let lastDirection = "";
        let secondTouchTimeout: NodeJS.Timeout | number | null = null;
        elem.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this._availableActions.stop_play();
            if (document.activeElement !== this._chartElement) {
                this._chartElement.focus();
            }
            Array.from(e.targetTouches).forEach((touch) => {
                touches.push(touch);
            });
        });
        const endTouch = (e: TouchEvent) => {
            e.preventDefault();
            let direction = "";
            Array.from(e.changedTouches).forEach((touch) => {
                // Remove from touches list
                const startTouch = touches.find(
                    (t) => t.identifier === touch.identifier
                );
                touches = touches.filter(
                    (t) => t.identifier !== touch.identifier
                );

                // Determine change angle
                const { clientX: startX, clientY: startY } = startTouch;
                const { clientX: endX, clientY: endY } = touch;
                const xDiff = endX - startX;
                const yDiff = endY - startY;

                // Print conclusion
                if (xDiff < -200 && Math.abs(yDiff) < 200) {
                    direction = TouchActionSet.LEFT;
                } else if (xDiff > 200 && Math.abs(yDiff) < 200) {
                    direction = TouchActionSet.RIGHT;
                } else if (yDiff < -200 && Math.abs(xDiff) < 200) {
                    direction = TouchActionSet.UP;
                } else if (yDiff > 200 && Math.abs(xDiff) < 200) {
                    direction = TouchActionSet.DOWN;
                } else {
                    direction = "";
                    return;
                }

                if (waitTime > new Date().valueOf() - 25) {
                    if (direction === lastDirection) {
                        clearTimeout(secondTouchTimeout);
                        touchActionMap[
                            `double_${direction}` as TouchActionSet
                        ]();
                        direction = "";
                    }
                }
                // This was the first of multiple touches
                if (touches.length > 0) {
                    waitTime = new Date().valueOf();
                    lastDirection = direction;
                }

                secondTouchTimeout = setTimeout(() => {
                    touchActionMap[direction as TouchActionSet]?.();
                    direction = "";
                }, 25);
            });
        };
        elem.addEventListener("touchend", endTouch);
        elem.addEventListener("touchcancel", endTouch);
    }

    /**
     * Generate (or regenerate) chart summary
     */
    public _generateSummary() {
        this._summary = generateSummary({
            type: this._type,
            title: this._title,
            x: this._xAxis,
            y: this._yAxis,
            dataRows: this._groups.length,
            y2: this._y2Axis,
            live: this._options.live
        });
    }

    /**
     * Assign or re-assign data values
     *
     * @param data - data for the chart
     * @param [axes] - updated axes metadata
     */
    private _setData(data: SonifyTypes["data"], axes?: SonifyTypes["axes"]) {
        // Update axes
        this._explicitAxes = {
            x: {
                ...(this._explicitAxes.x ?? {}),
                ...(axes?.x ?? {})
            },
            y: {
                ...(this._explicitAxes.y ?? {}),
                ...(axes?.y ?? {})
            },
            y2: {
                ...(this._explicitAxes.y2 ?? {}),
                ...(axes?.y2 ?? {})
            }
        };

        this._initializeData(data);

        this._metadataByGroup = calculateMetadataByGroup(this._data);
        this._metadataByGroup = checkForNumberInput(
            this._metadataByGroup,
            data
        );

        this._xAxis = initializeAxis(this._data, "x", this._explicitAxes.x);
        this._yAxis = initializeAxis(this._data, "y", this._explicitAxes.y);
        if (usesAxis(this._data, "y2")) {
            this._y2Axis = initializeAxis(
                this._data,
                "y2",
                this._explicitAxes.y2
            );
        }

        // Generate summary
        this._generateSummary();
    }

    /**
     * Assign or re-assign data values
     *
     * @param data - data for the chart
     * @param [axes] - updated axes metadata
     * @param [pointIndex] - the pointIndex to focus on
     * @param [groupName] -  the name of the group to focus on
     */
    setData(
        data: SonifyTypes["data"],
        axes?: SonifyTypes["axes"],
        pointIndex?: number,
        groupName?: string
    ) {
        this._setData(data, axes);

        this._pointIndex = Math.min(
            Math.max(pointIndex ?? 0, 0),
            this._data[0].length - 1
        );
        this._groupIndex = Math.max(this._groups.indexOf(groupName), 0);

        this._sr.render(`${this._title || "Chart"} updated`);
    }

    /**
     * Get the data point that the user is currently focused on
     *
     * @returns - the current group name and data point
     */
    getCurrent() {
        const { statIndex, availableStats } =
            this._metadataByGroup[this._groupIndex];
        return {
            group: this._groups[this._groupIndex],
            point: this._data[this._groupIndex][this._pointIndex],
            stat: availableStats[statIndex] ?? ""
        };
    }

    /**
     * If there's a max width, shift off any data points that go over size
     */
    private _shrinkToMaxWidth() {
        if (typeof this._options.maxWidth === "undefined") {
            return;
        }

        let recalculateX = false,
            recalculateY = false,
            recalculateY2 = false;
        for (let i = 0; i < this._data.length; i++) {
            if (this._data[i].length <= this._options.maxWidth) {
                continue;
            }

            const tmp = this._data[i].shift();
            this._pointIndex--;
            if (
                this._xAxis.minimum === tmp.x ||
                this._xAxis.maximum === tmp.x
            ) {
                recalculateX = true;
            }
            recalculateY = true;

            if (isAlternateAxisDataPoint(tmp)) {
                recalculateY2 = true;
            }

            const targetType = this._metadataByGroup[i].inputType;

            if (targetType === "number") {
                this._data[i].forEach((item, index) => {
                    this._data[i][index].x = index;
                });
            }
        }

        if (recalculateX) {
            this._xAxis.minimum = calculateAxisMinimum(this._data, "x");
            this._xAxis.maximum = calculateAxisMaximum(this._data, "x");
        }
        if (recalculateY) {
            this._yAxis.minimum = calculateAxisMinimum(this._data, "y");
            this._yAxis.maximum = calculateAxisMaximum(this._data, "y");
        }
        if (recalculateY2) {
            this._y2Axis.minimum = calculateAxisMinimum(this._data, "y2");
            this._y2Axis.maximum = calculateAxisMaximum(this._data, "y2");
        }

        if (this._pointIndex < 0) {
            this._pointIndex = 0;
        }
    }

    /**
     * Append data in a live chart
     *
     * @param dataPoint - the data point
     * @param group - which group to apply to, if there are multiple groups
     */
    appendData(
        dataPoint: SupportedDataPointType | number,
        group?: string
    ): { err: string | null; data?: SupportedDataPointType } {
        const groupIndex = group ? this._groups.indexOf(group) : 0;
        if (groupIndex === -1) {
            return {
                err: `Error adding data to unknown group name "${group}". ${
                    this._groups.length === 1
                        ? "There are no group names."
                        : `Valid groups: ${this._groups.join(", ")}`
                } `
            };
        }

        const addedType = detectDataPointType(dataPoint);
        const targetType = this._metadataByGroup[groupIndex].inputType;

        if (addedType !== targetType) {
            return {
                err: `Mismatched type error. Trying to add data of type ${addedType} to target data of type ${targetType}.`
            };
        }

        const newDataPoint =
            typeof dataPoint === "number"
                ? {
                      x: this._data[groupIndex].length,
                      y: dataPoint
                  }
                : dataPoint;

        this._data[groupIndex].push(newDataPoint);

        this._xAxis.maximum = Math.max(this._xAxis.maximum, newDataPoint.x);
        if (isSimpleDataPoint(newDataPoint)) {
            this._yAxis.maximum = Math.max(this._yAxis.maximum, newDataPoint.y);
            this._yAxis.minimum = Math.min(this._yAxis.minimum, newDataPoint.y);
        } else if (isOHLCDataPoint(newDataPoint)) {
            this._yAxis.maximum = Math.max(
                this._yAxis.maximum,
                newDataPoint.open,
                newDataPoint.high,
                newDataPoint.low,
                newDataPoint.close
            );
            this._yAxis.minimum = Math.min(
                this._yAxis.minimum,
                newDataPoint.open,
                newDataPoint.high,
                newDataPoint.low,
                newDataPoint.close
            );
        } else if (isHighLowDataPoint(newDataPoint)) {
            this._yAxis.maximum = Math.max(
                this._yAxis.maximum,
                newDataPoint.high,
                newDataPoint.low
            );
            this._yAxis.minimum = Math.min(
                this._yAxis.minimum,
                newDataPoint.high,
                newDataPoint.low
            );
        }

        if (this._monitorMode) {
            const { statIndex, availableStats } =
                this._metadataByGroup[groupIndex];
            this._playDataPoint(newDataPoint, statIndex, availableStats);
        }

        this._shrinkToMaxWidth();
        return {
            err: null,
            data: newDataPoint
        };
    }

    /**
     * Wire up the hotkey action event listeners
     */
    private _initializeKeyActionMap() {
        this._keyEventManager = new KeyboardEventManager(this._chartElement);
        this._keyEventManager.registerKeyEvents([
            {
                title: "Go to next point",
                key: "ArrowRight",
                callback: this._availableActions.next_point
            },
            {
                title: "Go to previous point",
                key: "ArrowLeft",
                callback: this._availableActions.previous_point
            },
            {
                title: "Play right",
                key: "Shift+End",
                callback: this._availableActions.play_right
            },
            {
                title: "Play left",
                key: "Shift+Home",
                callback: this._availableActions.play_left
            },
            {
                title: "Cancel play",
                key: "Ctrl+Control",
                keyDescription: "Control",
                callback: this._availableActions.stop_play
            },
            {
                title: "Navigate to previous statistic",
                key: "ArrowUp",
                callback: this._availableActions.previous_stat
            },
            {
                title: "Navigate to next statistic",
                key: "ArrowDown",
                callback: this._availableActions.next_stat
            },
            {
                title: "Go to previous category",
                key: "PageUp",
                callback: this._availableActions.previous_category
            },
            {
                title: "Go to next category",
                key: "PageDown",
                callback: this._availableActions.next_category
            },
            {
                title: "Go to first point",
                key: "Home",
                callback: this._availableActions.first_point
            },
            {
                title: "Go to last point",
                key: "End",
                callback: this._availableActions.last_point
            },
            {
                title: "Replay",
                key: " ",
                keyDescription: "Spacebar",
                callback: this._availableActions.replay
            },
            {
                title: "Select item",
                key: "Enter",
                callback: this._availableActions.select
            },
            {
                title: "Go backward by a tenth",
                key: "Ctrl+ArrowLeft",
                callback: this._availableActions.previous_tenth
            },
            {
                title: "Go forward by a tenth",
                key: "Ctrl+ArrowRight",
                callback: this._availableActions.next_tenth
            },
            {
                title: "Go to minimum value",
                key: "[",
                callback: this._availableActions.go_minimum
            },
            {
                title: "Go to maximum value",
                key: "]",
                callback: this._availableActions.go_maximum
            },
            {
                title: "Speed up",
                key: "q",
                callback: this._availableActions.speed_up
            },
            {
                title: "Slow down",
                key: "e",
                callback: this._availableActions.slow_down
            },
            {
                title: "Toggle monitor mode",
                key: "m",
                callback: this._availableActions.monitor
            },
            {
                title: "Open help dialog",
                key: "h",
                callback: this._availableActions.help
            },
            {
                title: "Open options dialog",
                key: "o",
                callback: this._availableActions.options
            }
        ]);

        const hotkeyCallbackWrapper = (cb: (args: c2mCallbackType) => void) => {
            cb({
                slice: this._groups[this._groupIndex],
                index: this._pointIndex
            });
        };

        this._options.customHotkeys?.forEach((hotkey) => {
            this._keyEventManager.registerKeyEvent({
                ...hotkey,
                key: keyboardEventToString(hotkey.key as KeyboardEvent),
                callback: () => {
                    hotkeyCallbackWrapper(hotkey.callback);
                }
            });
        });
    }

    /**
     * Change the range of playable hertz
     *
     * @param lowerIndex - index of the lower end of the HERTZ
     * @param upperIndex - index of the upper end of the HERTZ
     */
    private _setHertzClamps(lowerIndex: number, upperIndex: number) {
        this._hertzClamps.lower = lowerIndex;
        this._hertzClamps.upper = upperIndex;
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
            this._data = Object.values(userData).map((row) =>
                convertDataRow(row)
            );
            return;
        }

        this._groups = [""];
        this._data = [convertDataRow(userData)];
    }

    /**
     * Listen to various events, and drive interactions
     */
    private _startListening() {
        this._chartElement.addEventListener("focus", () => {
            this._sr.clear();
            if (this._options.live) {
                this._generateSummary();
            }
            if (this._options.enableSpeech) {
                this._sr.render(this._summary);
            }
            if (window.__chart2music_options__?._hertzClamps) {
                const { lower, upper } =
                    window.__chart2music_options__._hertzClamps;
                this._setHertzClamps(lower, upper);
            }
        });
        this._chartElement.addEventListener("blur", () => {
            this._monitorMode = false;
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
            return false;
        }
        this._pointIndex++;
        return true;
    }

    /**
     * Move focus to the next data point to the left, if there is one
     */
    private _moveLeft() {
        if (this._pointIndex <= 0) {
            this._pointIndex = 0;
            return false;
        }
        this._pointIndex--;
        return true;
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
        if (this._pointIndex === 0) {
            return false;
        }
        this._pointIndex = Math.max(
            this._pointIndex - this._metadataByGroup[this._groupIndex].tenths,
            0
        );
        return true;
    }

    /**
     * Move by a tenth to the right
     */
    private _moveRightTenths() {
        if (this._pointIndex === this._data[this._groupIndex].length - 1) {
            return false;
        }
        this._pointIndex = Math.min(
            this._pointIndex + this._metadataByGroup[this._groupIndex].tenths,
            this._data[this._groupIndex].length - 1
        );
        return true;
    }

    /**
     * Move to the next stat
     *
     * @returns if possible
     */
    private _movePrevStat() {
        const { statIndex } = this._metadataByGroup[this._groupIndex];
        if (statIndex < 0) {
            return false;
        }
        this._metadataByGroup[this._groupIndex].statIndex = statIndex - 1;
        return true;
    }

    /**
     * Move to the next stat
     *
     * @returns if possible
     */
    private _moveNextStat() {
        const { statIndex, availableStats } =
            this._metadataByGroup[this._groupIndex];
        if (statIndex >= availableStats.length - 1) {
            return false;
        }
        this._metadataByGroup[this._groupIndex].statIndex = statIndex + 1;
        return true;
    }

    /**
     * Play all data points to the left, if there are any
     */
    private _playLeft() {
        const min = 0;
        this._playListInterval = setInterval(() => {
            if (this._pointIndex <= min) {
                this._pointIndex = min;
                clearInterval(this._playListInterval);
            } else {
                this._pointIndex--;
                this._playCurrent();
            }
        }, SPEEDS[this._speedRateIndex]) as NodeJS.Timeout;
        this._playCurrent();
    }

    /**
     * Play all data points to the right, if there are any
     */
    private _playRight() {
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
     * Get the available hertzes
     *
     * @returns number[]
     */
    private _getHertzRange() {
        return HERTZ.slice(this._hertzClamps.lower, this._hertzClamps.upper);
    }

    /**
     * Play the current data point
     */
    private _playCurrent() {
        if (!this._options.enableSound) {
            this._onFocus();
            return;
        }

        const { statIndex, availableStats } =
            this._metadataByGroup[this._groupIndex];

        const current = this._data[this._groupIndex][this._pointIndex];

        this._playDataPoint(current, statIndex, availableStats);
        this._onFocus();
    }

    /**
     * Confirm the audio engine was initialized
     */
    private _checkAudioEngine() {
        if (!context) {
            context = new AudioContext();
        }
        if (!this._audioEngine && context) {
            this._audioEngine =
                this._providedAudioEngine ?? new OscillatorAudioEngine(context);
        }
    }

    /**
     * Play a given data point
     *
     * @param current - the data point to play
     * @param statIndex - which stat is present, if available
     * @param availableStats - which stats are available
     */
    private _playDataPoint(
        current: SupportedDataPointType,
        statIndex: groupedMetadata["statIndex"],
        availableStats: groupedMetadata["availableStats"]
    ) {
        this._checkAudioEngine();

        if (!this._audioEngine) {
            return;
        }

        if (isUnplayable(current.x, this._xAxis)) {
            return;
        }

        const hertzes = this._getHertzRange();

        const xPan = calcPan(
            (current.x - this._xAxis.minimum) /
                (this._xAxis.maximum - this._xAxis.minimum)
        );

        if (isSimpleDataPoint(current)) {
            if (isUnplayable(current.y, this._yAxis)) {
                return;
            }

            const yBin = interpolateBin(
                current.y,
                this._yAxis.minimum,
                this._yAxis.maximum,
                hertzes.length - 1,
                this._yAxis.type
            );

            this._audioEngine.playDataPoint(hertzes[yBin], xPan, NOTE_LENGTH);

            return;
        }

        if (isAlternateAxisDataPoint(current)) {
            if (isUnplayable(current.y2, this._y2Axis)) {
                return;
            }
            const yBin = interpolateBin(
                current.y2,
                this._y2Axis.minimum,
                this._y2Axis.maximum,
                hertzes.length - 1,
                this._y2Axis.type
            );

            this._audioEngine.playDataPoint(hertzes[yBin], xPan, NOTE_LENGTH);
            return;
        }

        if (isOHLCDataPoint(current) || isHighLowDataPoint(current)) {
            // Only play a single note, because we've drilled into stats
            if (statIndex >= 0) {
                const stat = availableStats[statIndex];

                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                if (isUnplayable(current[stat], this._yAxis)) {
                    return;
                }

                const yBin = interpolateBin(
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    current[stat],
                    this._yAxis.minimum,
                    this._yAxis.maximum,
                    hertzes.length - 1,
                    this._yAxis.type
                );

                this._audioEngine.playDataPoint(
                    hertzes[yBin],
                    xPan,
                    NOTE_LENGTH
                );
                return;
            }

            const interval = 1 / (availableStats.length + 1);
            availableStats.forEach((stat, index) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                if (isUnplayable(current[stat], this._yAxis)) {
                    return;
                }
                const yBin = interpolateBin(
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    current[stat],
                    this._yAxis.minimum,
                    this._yAxis.maximum,
                    hertzes.length - 1,
                    this._yAxis.type
                );
                setTimeout(() => {
                    this._audioEngine.playDataPoint(
                        hertzes[yBin],
                        xPan,
                        NOTE_LENGTH
                    );
                }, SPEEDS[this._speedRateIndex] * interval * index);
            });
        }
    }

    /**
     * Perform actions when a new data point receives focus
     */
    private _onFocus() {
        this._options?.onFocusCallback?.({
            slice: this._groups[this._groupIndex],
            index: this._pointIndex
        });
    }

    /**
     * Update the screen reader on the current data point
     */
    private _speakCurrent() {
        if (!this._options.enableSpeech) {
            return;
        }

        // If we're glagged to announce a new group, but the group name is empty, ignore the flag
        if (this._flagNewGroup && this._groups[this._groupIndex] === "") {
            this._flagNewGroup = false;
        }

        const { statIndex, availableStats } =
            this._metadataByGroup[this._groupIndex];
        if (this._flagNewStat && availableStats.length === 0) {
            this._flagNewStat = false;
        }

        const current = this._data[this._groupIndex][this._pointIndex];
        const point = generatePointDescription(
            current,
            formatWrapper(this._xAxis),
            formatWrapper(
                isAlternateAxisDataPoint(current) ? this._y2Axis : this._yAxis
            ),
            availableStats[statIndex]
        );
        const text =
            (this._flagNewGroup ? `${this._groups[this._groupIndex]}, ` : "") +
            (this._flagNewStat
                ? `${sentenceCase(availableStats[statIndex] ?? "all")}, `
                : "") +
            point;

        this._sr.render(text);

        this._flagNewGroup = false;
        this._flagNewStat = false;
    }
}

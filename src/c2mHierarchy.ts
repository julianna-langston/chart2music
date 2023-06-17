import { OscillatorAudioEngine } from "./audio/index";
import type { AudioEngine } from "./audio/index";
import { HERTZ, NOTE_LENGTH, SPEEDS } from "./constants";
import { KeyboardEventManager } from "./keyboardManager";
import { ScreenReaderBridge } from "./ScreenReaderBridge";
import type {AxisData} from "./types";
import {
    calcPan,
    interpolateBin,
    isUnplayable,
    prepChartElement,
} from "./utils";
import { validateInputElement } from "./validate";
import { launchOptionDialog } from "./optionDialog";

/**
 * List of actions that could be activated by keyboard or touch
 */
enum ActionSet {
    NEXT_POINT = "next_point",
    PREVIOUS_POINT = "previous_point",
    PLAY_RIGHT = "play_right",
    PLAY_LEFT = "play_left",
    STOP_PLAY = "stop_play",
    FIRST_POINT = "first_point",
    LAST_POINT = "last_point",
    DRILL_DOWN = "drill_down",
    DRILL_UP = "drill_up",
    REPLAY = "replay",
    SPEED_UP = "speed_up",
    SLOW_DOWN = "slow_down",
    HELP = "help",
    OPTIONS = "options"
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

let context: null | AudioContext = null;

type HiearchyDataNode = {
    label: string;
    value: number;
    children?: HiearchyDataNode[];
}

type XAxisData = {
    minimum?: number;
    maximum?: number;
    label?: string | string[];
};

type c2mOptions = {
    enableSound?: boolean;
    enableSpeech?: boolean;
    live?: boolean;
    hertzes?: number[];
    onFocusCallback?: (details: any) => void;
}

type HierarchyTypes = {
    /**
     * The data that should be presented in this chart.
     * This key is required for all charts.
     */
    hierarchy: HiearchyDataNode[];
    /**
     * The HTML element in the DOM that represents this chart.
     * This will be used to handle keyboard events to enable the user to interact with the chart.
     * This key is required for all charts.
     */
    element: HTMLElement;
    /**
     * Optional metadata for the chart.
     * If you do not provide this metadata, it will be calculated automatically from the chart data.
     */
    axes?: {
        /** Optional metadata for the x-axis. */
        x?: XAxisData;
        /** Optional metadata for the y-axis. */
        y?: AxisData;
    };
    /** Optional title for the chart. */
    title?: string;
    /**
     * An optional HTML element that will be used to output messages to a running screen reader.
     * If you do not provide this key, a suitable HTML will be created for you.
     */
    cc?: HTMLElement;
    /** Optional audio engine to replace the default audio engine. */
    audioEngine?: AudioEngine;
    options?: c2mOptions;
}


const validateInput = (input: HierarchyTypes) => {
    const errors = [];

    errors.push(validateInputElement(input.element));
    errors.push(validateInputAxes(input.axes));
    errors.push(validateInputDataStructure(input.hierarchy));

    return errors.filter((str) => str !== "").join("\n");
};

const validateInputAxes = (axes?: HierarchyTypes["axes"]) => {
    if (typeof axes === "undefined") {
        return "";
    }

    const supportedAxis = ["x", "y"];
    const unsupportedAxes = Object.keys(axes).filter(
        (axis) => !supportedAxis.includes(axis)
    );
    if (unsupportedAxes.length > 0) {
        return `Unsupported axes were included: ${unsupportedAxes.join(
            ", "
        )}. The only supported axes are: ${supportedAxis.join(", ")}.`;
    }

    return "";
};

export const validateInputDataStructure = (data: HierarchyTypes["hierarchy"]) => {
    if(!Array.isArray(data)){
        return "Data should be an array of nodes"
    }
    
    return "";
};

/**
 * Validates and initializes a single chart that should be sonified
 *
 * @param {SonifyTypes} input - data, config, and options for the chart
 * @returns c2mGolangReturn - A value of "err" (null if no error, or string if error) and "data" (the chart, if there was no error)
 */
export const c2mHierarchy = (input: HierarchyTypes) => {
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
    private _data: HiearchyDataNode[];
    private _breadcrumb: number[] = [];
    private _levelIndex = 0;
    private _pointIndex = 0;
    private _sr: ScreenReaderBridge;
    private _xAxis: AxisData;
    private _yAxis: AxisData;
    private _title: string;
    private _playListInterval: NodeJS.Timeout | null = null;
    private _speedRateIndex = 1;
    private _keyEventManager: KeyboardEventManager;
    private _audioEngine: AudioEngine | null = null;
    private _options: c2mOptions = {
        enableSound: true,
        enableSpeech: true,
        live: false,
        hertzes: HERTZ
    };
    private _providedAudioEngine?: AudioEngine;
    private _explicitAxes: {
        x?: XAxisData;
        y?: AxisData;
    } = {};
    private _hertzClamps = {
        upper: HERTZ.length - 12,
        lower: 21
    };
    private _availableActions: {
        [key in ActionSet]: () => void;
    };
    private _silent = false;
    private _currentLevel: HiearchyDataNode[] = [];
    private _xLabel: string[] = [];

    /**
     * Constructor
     *
     * @param input - data/config provided by the invocation
     */
    constructor(input: HierarchyTypes) {
        this._providedAudioEngine = input.audioEngine;
        this._title = input.title ?? "";
        this._chartElement = input.element;
        prepChartElement(this._chartElement, this._title);

        this._ccElement = input.cc ?? this._chartElement;

        this._setData(input.hierarchy, input.axes);

        // Initialize SRB
        ScreenReaderBridge.addAriaAttributes(this._ccElement);
        this._sr = new ScreenReaderBridge(this._ccElement);

        this._availableActions = this._initializeActionMap();
        this._initializeKeyActionMap();
        this._startListening();
    }

    /**
     * Getter for current data point
     */
    get currentPoint() {
        return this._currentLevel[this._pointIndex];
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
            drill_down: () => {
                clearInterval(this._playListInterval);
                if(this._moveDown()){
                    this._playAndSpeak();
                }
            },
            drill_up: () => {
                clearInterval(this._playListInterval);
                if(this._moveUp()){
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
            first_point: () => {
                clearInterval(this._playListInterval);
                this._pointIndex = 0;
                this._playAndSpeak();
            },
            last_point: () => {
                clearInterval(this._playListInterval);
                this._pointIndex = this._currentLevel.length - 1;
                this._playAndSpeak();
            },
            replay: () => {
                clearInterval(this._playListInterval);
                this._playAndSpeak();
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
            help: () => {
                clearInterval(this._playListInterval);
                this._keyEventManager.launchHelpDialog();
            },
            options: () => {
                this._checkAudioEngine();
                launchOptionDialog(
                    {
                        ...this._hertzClamps,
                        speedIndex: this._speedRateIndex
                    },
                    (
                        lowerIndex: number,
                        upperIndex: number,
                        speedIndex: number
                    ) => {
                        this._setHertzClamps(lowerIndex, upperIndex);
                        this._speedRateIndex = speedIndex;
                        this._sr.render(
                            `Speed, ${SPEEDS[this._speedRateIndex]}`
                        );
                    },
                    (hertzIndex: number) => {
                        this._audioEngine?.playDataPoint(
                            this._options.hertzes[hertzIndex],
                            0,
                            NOTE_LENGTH
                        );
                    }
                );
            }
        };
    }

    /**
     * Generate (or regenerate) chart summary
     */
    private _generateSummary() {
        this._summary = `Sonified hiearchy diagram "${this._title}, 
        x is "${this._xAxis.label}" from ${this._currentLevel[0].label} to ${this._currentLevel[this._currentLevel.length - 1].label}, 
        y is "${this._yAxis.label}" from ${this._yAxis.format(this._currentLevel[0].value)} to ${this._yAxis.format(this._currentLevel[this._currentLevel.length -1].value)}.
        Use arrow keys to navigate. Use Alt+Up and Alt+Down to change levels. Press H fro more hotkeys.`
    }

    /**
     * Assign or re-assign data values
     *
     * @param data - data for the chart
     * @param [axes] - updated axes metadata
     */
    private _setData(data: HierarchyTypes["hierarchy"], axes?: HierarchyTypes["axes"]) {
        // Update axes
        this._explicitAxes = {
            x: {
                ...(this._explicitAxes.x ?? {}),
                ...(axes?.x ?? {})
            },
            y: {
                ...(this._explicitAxes.y ?? {}),
                ...(axes?.y ?? {})
            }
        };

        // CURSOR
        this._data = data;
        this._pointIndex = 0;
        this._currentLevel = this._data;

        if(Array.isArray(this._explicitAxes.x.label)){
            this._xLabel = this._explicitAxes.x.label;
        }

        this._xAxis = {
            minimum: this._explicitAxes.x.minimum ?? 0,
            maximum: this._explicitAxes.x.maximum ?? this._currentLevel.length-1,
            label: this._xLabel[0] ?? (this._explicitAxes.x.label as string)
        };

        const currentLevelValues = this._currentLevel.map(({value}) => value);
        this._yAxis = {
            label: this._explicitAxes.y.label,
            format: this._explicitAxes.y.format,
            minimum: 0,
            maximum: this._explicitAxes.y.maximum ?? Math.max(...currentLevelValues)
        }

        // Generate summary
        this._generateSummary();
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
                title: "Drill down",
                key: "Alt+ArrowDown",
                callback: this._availableActions.drill_down
            },
            {
                title: "Drill up",
                key: "Alt+ArrowUp",
                callback: this._availableActions.drill_up
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
                title: "Speed up",
                caseSensitive: false,
                key: "q",
                callback: this._availableActions.speed_up
            },
            {
                title: "Slow down",
                caseSensitive: false,
                key: "e",
                callback: this._availableActions.slow_down
            },
            {
                title: "Open help dialog",
                caseSensitive: false,
                key: "h",
                callback: this._availableActions.help
            },
            {
                title: "Open options dialog",
                caseSensitive: false,
                key: "o",
                callback: this._availableActions.options
            }
        ]);

        // const hotkeyCallbackWrapper = (cb: (args: c2mCallbackType) => void) => {
        //     cb({
        //         slice: this._groups[
        //             this._visible_group_indices[this._groupIndex]
        //         ],
        //         index: this._pointIndex
        //     });
        // };

        // this._options.customHotkeys?.forEach((hotkey) => {
        //     this._keyEventManager.registerKeyEvent({
        //         ...hotkey,
        //         key: keyboardEventToString(hotkey.key as KeyboardEvent),
        //         callback: () => {
        //             hotkeyCallbackWrapper(hotkey.callback);
        //         }
        //     });
        // });
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
    }

    /**
     * Play an individual data point, and then speak its details
     */
    private _playAndSpeak() {
        if (this._silent) {
            return;
        }
        this._playCurrent();
        setTimeout(() => {
            this._speakCurrent();
        }, NOTE_LENGTH * 1000);
    }

    /**
     * Move focus to the next data point to the right, if there is one
     */
    private _moveRight() {
        const max = this._currentLevel.length - 1;
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

    private _postDrillReset() {
        if(this._levelIndex in this._xLabel){
            this._xAxis.label = this._xLabel[this._levelIndex];
        }
        this._xAxis.maximum = this._currentLevel.length - 1;
        const values = this._currentLevel.map(({value}) => value);
        this._yAxis.minimum = 0;
        this._yAxis.maximum = this._explicitAxes.y.maximum ?? Math.max(...values);
    }

    private _moveUp() {
        if(this._breadcrumb.length === 0){
            return false;
        }

        this._pointIndex = this._breadcrumb.pop();
        this._levelIndex--;

        if(this._breadcrumb.length === 0){
            this._currentLevel = this._data;
        }else{
            let newCurrentLevel = this._data;
            this._breadcrumb.forEach((newIndex) => {
                newCurrentLevel = newCurrentLevel[newIndex].children;
            });
            this._currentLevel = newCurrentLevel;
        }

        this._postDrillReset();
        return true;
    }

    private _moveDown() {
        const current = this.currentPoint;

        if(!("children" in current)){
            return false;
        }

        // Update breadcrumb
        this._breadcrumb.push(this._pointIndex);

        // Move current point
        this._pointIndex = 0;
        this._currentLevel = current.children;
        this._levelIndex++;

        this._postDrillReset();
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
        const max = this._currentLevel.length - 1;
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
        return this._options.hertzes.slice(
            this._hertzClamps.lower,
            this._hertzClamps.upper
        );
    }

    /**
     * Play the current data point
     */
    private _playCurrent() {
        if (!this._options.enableSound) {
            this._onFocus();
            return;
        }

        this._playDataPoint(this.currentPoint);
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
            /* istanbul ignore next */
            this._audioEngine =
                this._providedAudioEngine ?? new OscillatorAudioEngine(context);
        }
    }

    /**
     * Play a given data point
     *
     * @param current - the data point to play
     */
    private _playDataPoint(
        current: HiearchyDataNode,
    ) {
        this._checkAudioEngine();

        /* istanbul ignore next */
        if (!this._audioEngine) {
            return;
        }

        const hertzes = this._getHertzRange();

        const xPan = calcPan(
            (this._pointIndex - this._xAxis.minimum) /
                (this._xAxis.maximum - this._xAxis.minimum)
        ) || 0;

        if (isUnplayable(current.value, this._yAxis)) {
            return;
        }

        const yBin = interpolateBin(
            current.value,
            this._yAxis.minimum,
            this._yAxis.maximum,
            hertzes.length - 1,
            "linear"
        );

        this._audioEngine.playDataPoint(hertzes[yBin], xPan, NOTE_LENGTH);

        return;
    }

    /**
     * Perform actions when a new data point receives focus
     */
    private _onFocus() {
        this._options?.onFocusCallback?.({
            current: this.currentPoint,
            index: this._pointIndex,
            breadcrumbs: this._breadcrumb
        });
    }

    /**
     * Update the screen reader on the current data point
     */
    private _speakCurrent() {
        if (!this._options.enableSpeech) {
            return;
        }

        const current = this.currentPoint;

        const details = [
            current.label,
            this._yAxis.format(current.value) 
        ];

        if("children" in current){
            details.push("has children");
        }

        this._sr.render(details.join(", "));
    }
}

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
    c2mCallbackType,
    StatBundle
} from "./types";
import { SUPPORTED_CHART_TYPES } from "./types";
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
    isBoxDataPoint,
    isHighLowDataPoint,
    isOHLCDataPoint,
    isSimpleDataPoint
} from "./dataPoint";
import type { SupportedDataPointType } from "./dataPoint";
import { launchOptionDialog } from "./optionDialog";

/**
 * List of actions that could be activated by keyboard or touch
 */
enum ActionSet {
    NEXT_POINT = "next_point",
    PREVIOUS_POINT = "previous_point",
    PLAY_RIGHT = "play_right",
    PLAY_LEFT = "play_left",
    PLAY_FORWARD_CATEGORY = "play_forward_category",
    PLAY_BACKWARD_CATEGORY = "play_backward_category",
    STOP_PLAY = "stop_play",
    PREVIOUS_STAT = "previous_stat",
    NEXT_STAT = "next_stat",
    PREVIOUS_CATEGORY = "previous_category",
    NEXT_CATEGORY = "next_category",
    FIRST_CATEGORY = "first_category",
    LAST_CATEGORY = "last_category",
    FIRST_POINT = "first_point",
    LAST_POINT = "last_point",
    REPLAY = "replay",
    SELECT = "select",
    PREVIOUS_TENTH = "previous_tenth",
    NEXT_TENTH = "next_tenth",
    GO_MINIMUM = "go_minimum",
    GO_MAXIMUM = "go_maximum",
    GO_TOTAL_MINIMUM = "go_total_minimum",
    GO_TOTAL_MAXIMUM = "go_total_maximum",
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
    private _visible_group_indices: number[] = [];
    private _data: SupportedDataPointType[][];
    private _groupIndex = 0;
    private _pointIndex = 0;
    private _sr: ScreenReaderBridge;
    private _xAxis: AxisData;
    private _yAxis: AxisData;
    private _y2Axis: AxisData;
    private _title: string;
    private _playListInterval: NodeJS.Timeout | null = null;
    private _playListContinuous: NodeJS.Timeout[] = [];
    private _speedRateIndex = 1;
    private _flagNewGroup = false;
    private _flagNewStat = false;
    private _keyEventManager: KeyboardEventManager;
    private _audioEngine: AudioEngine | null = null;
    private _metadataByGroup: groupedMetadata[];
    private _options: c2mOptions = {
        enableSound: true,
        enableSpeech: true,
        live: false,
        hertzes: HERTZ
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
    private _silent = false;
    private _outlierIndex = 0;
    private _outlierMode = false;
    private _announcePointLabelFirst = false;

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

            if (input.options.hertzes) {
                this._hertzClamps = {
                    upper: input.options.hertzes.length - 1,
                    lower: 0
                };
            }
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
     * Getter for current data point
     */
    get currentPoint() {
        return this._data[this._groupIndex][this._pointIndex];
    }

    /**
     * Clear outstanding play intervals/timeouts
     */
    private _clearPlay() {
        clearInterval(this._playListInterval);
        this._playListContinuous.forEach((item) => {
            clearTimeout(item);
        });
        this._playListContinuous = [];
    }

    /**
     * Establish what actions are available for the touch/keyboard action listeners
     */
    private _initializeActionMap() {
        return {
            next_point: () => {
                this._clearPlay();
                if (this._moveRight()) {
                    this._playAndSpeak();
                }
            },
            previous_point: () => {
                this._clearPlay();
                if (this._moveLeft()) {
                    this._playAndSpeak();
                }
            },
            play_right: () => {
                this._clearPlay();
                this._playRight();
            },
            play_left: () => {
                this._clearPlay();
                this._playLeft();
            },
            play_forward_category: () => {
                this._clearPlay();
                const max = this._visible_group_indices.length - 1;
                this._playListInterval = setInterval(() => {
                    if (this._groupIndex >= max) {
                        this._groupIndex = max;
                        this._clearPlay();
                    } else {
                        this._groupIndex++;
                        this._playCurrent();
                    }
                }, SPEEDS[this._speedRateIndex]);
                this._playCurrent();
            },
            play_backward_category: () => {
                this._clearPlay();
                const min = 0;
                this._playListInterval = setInterval(() => {
                    if (this._groupIndex <= min) {
                        this._groupIndex = min;
                        this._clearPlay();
                    } else {
                        this._groupIndex--;
                        this._playCurrent();
                    }
                }, SPEEDS[this._speedRateIndex]) as NodeJS.Timeout;
                this._playCurrent();
            },
            stop_play: () => {
                this._clearPlay();
            },
            previous_stat: () => {
                this._clearPlay();
                if (this._movePrevStat()) {
                    this._flagNewStat = true;
                    this._playAndSpeak();
                }
            },
            next_stat: () => {
                this._clearPlay();
                if (this._moveNextStat()) {
                    this._flagNewStat = true;
                    this._playAndSpeak();
                }
            },
            previous_category: () => {
                this._clearPlay();
                if (this._groupIndex === 0) {
                    return;
                }
                const currentX = this.currentPoint.x;
                this._groupIndex--;
                this._flagNewGroup = true;
                if (
                    this._xAxis.continuous &&
                    (!this.currentPoint || this.currentPoint.x !== currentX)
                ) {
                    const differences = this._data[this._groupIndex].map(
                        ({ x }) => Math.abs(currentX - x)
                    );
                    const smallestDifference = Math.min(...differences);
                    const closestIndex =
                        differences.indexOf(smallestDifference);
                    this._pointIndex = closestIndex;
                }
                if (
                    this._pointIndex >=
                    this._data[this._visible_group_indices[this._groupIndex]]
                        .length
                ) {
                    this._pointIndex =
                        this._data[
                            this._visible_group_indices[this._groupIndex]
                        ].length - 1;
                }
                this._playAndSpeak();
            },
            next_category: () => {
                this._clearPlay();
                if (
                    this._groupIndex ===
                    this._visible_group_indices.length - 1
                ) {
                    return;
                }
                const currentX = this.currentPoint.x;
                this._groupIndex++;
                this._flagNewGroup = true;
                if (
                    this._xAxis.continuous &&
                    (!this.currentPoint || this.currentPoint.x !== currentX)
                ) {
                    const differences = this._data[this._groupIndex].map(
                        ({ x }) => Math.abs(currentX - x)
                    );
                    const smallestDifference = Math.min(...differences);
                    const closestIndex =
                        differences.indexOf(smallestDifference);
                    this._pointIndex = closestIndex;
                }
                if (
                    this._pointIndex >=
                    this._data[this._visible_group_indices[this._groupIndex]]
                        .length
                ) {
                    this._pointIndex =
                        this._data[
                            this._visible_group_indices[this._groupIndex]
                        ].length - 1;
                }
                this._playAndSpeak();
            },
            first_category: () => {
                this._clearPlay();
                this._groupIndex = 0;
                this._flagNewGroup = true;
                this._playAndSpeak();
            },
            last_category: () => {
                this._clearPlay();
                this._groupIndex = this._visible_group_indices.length - 1;
                this._flagNewGroup = true;
                this._playAndSpeak();
            },
            first_point: () => {
                this._clearPlay();
                this._pointIndex = 0;
                this._playAndSpeak();
            },
            last_point: () => {
                this._clearPlay();
                this._pointIndex =
                    this._data[this._visible_group_indices[this._groupIndex]]
                        .length - 1;
                this._playAndSpeak();
            },
            replay: () => {
                this._clearPlay();
                this._flagNewGroup = true;
                this._flagNewStat = true;
                this._playAndSpeak();
            },
            select: () => {
                this._options.onSelectCallback?.({
                    slice: this._groups[
                        this._visible_group_indices[this._groupIndex]
                    ],
                    index: this._pointIndex,
                    point: this.currentPoint
                });
            },
            previous_tenth: () => {
                this._clearPlay();
                this._moveLeftTenths();
                this._playAndSpeak();
            },
            next_tenth: () => {
                this._clearPlay();
                this._moveRightTenths();
                this._playAndSpeak();
            },
            go_minimum: () => {
                this._clearPlay();
                if (this._moveToMinimum()) {
                    this._playAndSpeak();
                }
            },
            go_maximum: () => {
                this._clearPlay();
                if (this._moveToMaximum()) {
                    this._playAndSpeak();
                }
            },
            go_total_maximum: () => {
                this._clearPlay();
                const winner = this._metadataByGroup
                    .filter((g, index) =>
                        this._visible_group_indices.includes(index)
                    )
                    .reduce((previousValue, currentValue) => {
                        return previousValue.maximumValue >
                            currentValue.maximumValue
                            ? previousValue
                            : currentValue;
                    });
                if (!winner) {
                    return;
                }
                this._groupIndex = this._visible_group_indices.indexOf(
                    winner.index
                );
                this._pointIndex = winner.maximumPointIndex;
                this._playAndSpeak();
            },
            go_total_minimum: () => {
                this._clearPlay();
                const winner = this._metadataByGroup
                    .filter((g, index) =>
                        this._visible_group_indices.includes(index)
                    )
                    .reduce((previousValue, currentValue) => {
                        return previousValue.minimumValue <
                            currentValue.minimumValue
                            ? previousValue
                            : currentValue;
                    });
                if (!winner) {
                    return;
                }
                this._groupIndex = this._visible_group_indices.indexOf(
                    winner.index
                );
                this._pointIndex = winner.minimumPointIndex;
                this._playAndSpeak();
            },
            speed_up: () => {
                this._clearPlay();
                if (this._speedRateIndex < SPEEDS.length - 1) {
                    this._speedRateIndex++;
                }
                this._sr.render(`Speed, ${SPEEDS[this._speedRateIndex]}`);
            },
            slow_down: () => {
                this._clearPlay();
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
                this._clearPlay();
                this._keyEventManager.launchHelpDialog();
            },
            options: () => {
                this._checkAudioEngine();
                launchOptionDialog(
                    {
                        ...this._hertzClamps,
                        speedIndex: this._speedRateIndex,
                        continuousMode: this._xAxis.continuous,
                        labelPosition: this._announcePointLabelFirst
                    },
                    (
                        lowerIndex: number,
                        upperIndex: number,
                        speedIndex: number,
                        continuousMode: boolean,
                        labelPosition: boolean
                    ) => {
                        this._setHertzClamps(lowerIndex, upperIndex);
                        if (this._speedRateIndex !== speedIndex) {
                            this._speedRateIndex = speedIndex;
                            this._sr.render(
                                `Speed, ${SPEEDS[this._speedRateIndex]}`
                            );
                        }
                        if (this._xAxis.continuous !== continuousMode) {
                            this._xAxis.continuous = continuousMode;
                            this._generateSummary();
                        }
                        this._announcePointLabelFirst = labelPosition;
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
    private _generateSummary() {
        this._summary = generateSummary({
            type: this._type,
            title: this._title,
            x: this._xAxis,
            y: this._yAxis,
            dataRows: this._visible_group_indices.length,
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

        if (
            this._type === "scatter" &&
            !("continuous" in this._explicitAxes.x)
        ) {
            this._xAxis.continuous = true;
        }

        if (this._xAxis.continuous) {
            this._data.forEach((row, index) => {
                this._data[index] = row.sort((a, b) => {
                    if (a.x < b.x) {
                        return -1;
                    }
                    if (a.x > b.x) {
                        return 1;
                    }
                    if ("y" in a && "y" in b) {
                        if (a.y < b.y) {
                            return -1;
                        }
                        if (a.y > b.y) {
                            return 1;
                        }
                    }
                    return 0;
                });
            });
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
        const currentStat = this.getCurrent().stat;
        this._setData(data, axes);

        this._pointIndex = Math.min(
            Math.max(pointIndex ?? 0, 0),
            this._data[0].length - 1
        );
        this._groupIndex =
            this._visible_group_indices[
                Math.max(this._groups.indexOf(groupName), 0)
            ];
        if (currentStat !== "") {
            this._metadataByGroup[this._groupIndex].statIndex = Math.max(
                0,
                this._metadataByGroup[this._groupIndex].availableStats.indexOf(
                    currentStat
                )
            );
        }
        this._sr.render(`${this._title || "Chart"} updated`);
    }

    /**
     * Change the visibility of a category
     *
     * @param name - name of category
     * @param [state] - should the category be visible? true = visible, false = hidden
     * @returns string - indicates error message
     */
    setCategoryVisibility(name: string, state: boolean): string {
        const groupIndex = this._groups.indexOf(name);
        if (groupIndex === -1) {
            return `Unknown group named "${name}". Available groups are: "${this._groups.join(
                '", "'
            )}".`;
        }

        const visibleGroupIndex =
            this._visible_group_indices.indexOf(groupIndex);

        if (state) {
            if (!this._visible_group_indices.includes(groupIndex)) {
                this._visible_group_indices.push(groupIndex);
                this._visible_group_indices.sort();
                this._sr.render(`${this._title || "Chart"} updated`);
            }
        } else {
            if (this._visible_group_indices.includes(groupIndex)) {
                if (this._visible_group_indices.length === 1) {
                    return `Group "${name}" can not be hidden. It is the last visible category, and there must always be at least one category visible.`;
                }

                this._visible_group_indices.splice(
                    this._visible_group_indices.indexOf(groupIndex),
                    1
                );
                this._sr.render(`${this._title || "Chart"} updated`);
            }
        }

        if (this._groupIndex === visibleGroupIndex) {
            this._silent = true;
            this._availableActions.previous_category();
            if (visibleGroupIndex > 0) this._availableActions.next_category();
            this._silent = false;
        }

        return "";
    }

    /**
     * Get the data point that the user is currently focused on
     *
     * @returns - the current group name and data point
     */
    getCurrent() {
        const { statIndex, availableStats } =
            this._metadataByGroup[
                this._visible_group_indices[this._groupIndex]
            ];
        return {
            index: this._pointIndex,
            group: this._groups[this._visible_group_indices[this._groupIndex]],
            point: this._data[this._visible_group_indices[this._groupIndex]][
                this._pointIndex
            ],
            stat: availableStats[statIndex] ?? ("" as keyof StatBundle | "")
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
            this._type === SUPPORTED_CHART_TYPES.MATRIX
                ? {
                      title: "Go to previous category",
                      key: "ArrowUp",
                      callback: this._availableActions.previous_category
                  }
                : {
                      title: "Navigate to previous statistic",
                      key: "ArrowUp",
                      callback: this._availableActions.previous_stat
                  },
            this._type === SUPPORTED_CHART_TYPES.MATRIX
                ? {
                      title: "Go to next category",
                      key: "ArrowDown",
                      callback: this._availableActions.next_category
                  }
                : {
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
                title: "Go to first category",
                key: "Alt+PageUp",
                callback: this._availableActions.first_category
            },
            {
                title: "Go to last category",
                key: "Alt+PageDown",
                callback: this._availableActions.last_category
            },
            {
                title: "Play forwards through categories",
                key: "Shift+PageDown",
                callback: this._availableActions.play_forward_category
            },
            {
                title: "Play backwards through categories",
                key: "Shift+PageUp",
                callback: this._availableActions.play_backward_category
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
                title: "Go to category minimum value",
                key: "[",
                callback: this._availableActions.go_minimum
            },
            {
                title: "Go to category maximum value",
                key: "]",
                callback: this._availableActions.go_maximum
            },
            {
                title: "Go to chart minimum value",
                key: "Ctrl+[",
                callback: this._availableActions.go_total_minimum
            },
            {
                title: "Go to chart maximum value",
                key: "Ctrl+]",
                callback: this._availableActions.go_total_maximum
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
                title: "Toggle monitor mode",
                caseSensitive: false,
                key: "m",
                callback: this._availableActions.monitor
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

        const hotkeyCallbackWrapper = (cb: (args: c2mCallbackType) => void) => {
            cb({
                slice: this._groups[
                    this._visible_group_indices[this._groupIndex]
                ],
                index: this._pointIndex,
                point: this.currentPoint
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
            this._visible_group_indices = this._groups.map(
                (value, index) => index
            );
            this._data = Object.values(userData).map((row) =>
                convertDataRow(row)
            );
            return;
        }

        this._groups = [""];
        this._visible_group_indices = [0];
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
        if (this._silent) {
            return;
        }
        this._playCurrent();
        setTimeout(() => {
            this._speakCurrent();
        }, NOTE_LENGTH * 1000);
    }

    /**
     * Move focus to the next outlier, if there is one
     */
    private _moveNextOutlier() {
        const currentPoint = this._data[this._groupIndex][this._pointIndex];
        if (isBoxDataPoint(currentPoint) && "outlier" in currentPoint) {
            const { outlier } = currentPoint;
            if (this._outlierIndex >= outlier.length - 1) {
                return false;
            }
            this._outlierIndex++;
            return true;
        }
        return false;
    }

    /**
     * Move focus to the previous outlier, if there is one
     */
    private _movePrevOutlier() {
        const currentPoint = this._data[this._groupIndex][this._pointIndex];
        if (isBoxDataPoint(currentPoint) && "outlier" in currentPoint) {
            if (this._outlierIndex <= 0) {
                this._outlierIndex = 0;
                return false;
            }
            this._outlierIndex--;
            return true;
        }
        return false;
    }

    /**
     * Move focus to the next data point to the right, if there is one
     */
    private _moveRight() {
        if (this._outlierMode) {
            return this._moveNextOutlier();
        }

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
        if (this._outlierMode) {
            return this._movePrevOutlier();
        }
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
        const current = this.currentPoint;
        if (
            this._outlierMode &&
            isBoxDataPoint(current) &&
            "outlier" in current
        ) {
            if (this._outlierIndex <= 0) {
                this._outlierIndex = 0;
                return false;
            }
            const tenths = Math.round(current.outlier.length / 10);
            this._outlierIndex = Math.max(this._outlierIndex - tenths, 0);
            return true;
        }
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
        const current = this.currentPoint;
        if (
            this._outlierMode &&
            isBoxDataPoint(current) &&
            "outlier" in current
        ) {
            if (this._outlierIndex >= current.outlier.length - 1) {
                this._outlierIndex = current.outlier.length - 1;
                return false;
            }
            const tenths = Math.round(current.outlier.length / 10);
            this._outlierIndex = Math.min(
                this._outlierIndex + tenths,
                current.outlier.length - 1
            );
            return true;
        }

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
     * Check if the user should be moved to outlier mode
     */
    private _checkOutlierMode() {
        const { statIndex, availableStats } =
            this._metadataByGroup[this._groupIndex];
        this._outlierMode = ["outlier", "xtremeOutlier"].includes(
            availableStats[statIndex]
        );
        this._outlierIndex = 0;
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

        this._checkOutlierMode();
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

        const newStat =
            availableStats[this._metadataByGroup[this._groupIndex].statIndex];
        const current = this._data[this._groupIndex][this._pointIndex];
        if (
            newStat === "outlier" &&
            !(
                "outlier" in current &&
                Array.isArray(current.outlier) &&
                current.outlier.length > 0
            )
        ) {
            this._metadataByGroup[this._groupIndex].statIndex--;
            return false;
        }

        this._checkOutlierMode();
        return true;
    }

    /**
     * Play all outliers to the left, if there are any
     */
    private _playLeftOutlier() {
        const min = 0;
        this._playListInterval = setInterval(() => {
            if (this._outlierIndex <= min) {
                this._outlierIndex = min;
                this._clearPlay();
            } else {
                this._outlierIndex--;
                this._playCurrent();
            }
        }, SPEEDS[this._speedRateIndex]) as NodeJS.Timeout;
        this._playCurrent();
    }

    /**
     * Play all data points to the left, if there are any
     */
    private _playLeft() {
        if (this._outlierMode) {
            this._playLeftOutlier();
            return;
        }
        if (this._xAxis.continuous) {
            this._playLeftContinuous();
            return;
        }
        const min = 0;
        this._playListInterval = setInterval(() => {
            if (this._pointIndex <= min) {
                this._pointIndex = min;
                this._clearPlay();
            } else {
                this._pointIndex--;
                this._playCurrent();
            }
        }, SPEEDS[this._speedRateIndex]) as NodeJS.Timeout;
        this._playCurrent();
    }

    /**
     * Play all outliers to the right, if there are any
     */
    private _playRightOutlier() {
        const currentPoint = this._data[this._groupIndex][this._pointIndex];
        if (!(isBoxDataPoint(currentPoint) && "outlier" in currentPoint)) {
            return;
        }
        const max = currentPoint.outlier?.length - 1 ?? 0;
        this._playListInterval = setInterval(() => {
            if (this._outlierIndex >= max) {
                this._outlierIndex = max;
                this._clearPlay();
            } else {
                this._outlierIndex++;
                this._playCurrent();
            }
        }, SPEEDS[this._speedRateIndex]);
        this._playCurrent();
    }

    /**
     * Play all data points to the right, if there are any, in continuous mode
     */
    private _playRightContinuous() {
        const startIndex = this._pointIndex;
        const startX = this.getCurrent().point.x;
        const row = this._data[this._groupIndex].slice(startIndex);
        const totalTime = SPEEDS[this._speedRateIndex] * 10;
        const xMin = this._xAxis.minimum;
        const range = this._xAxis.maximum - xMin;
        const change =
            this._xAxis.type === "linear"
                ? (x: number) => {
                      return (x - xMin) / range;
                  }
                : (x: number) => {
                      return (
                          (Math.log10(x) - Math.log10(xMin)) / Math.log10(range)
                      );
                  };
        const startingPct = change(startX);

        row.forEach((item, index) => {
            this._playListContinuous.push(
                setTimeout(() => {
                    this._pointIndex = startIndex + index;
                    this._playCurrent();
                }, (change(item.x) - startingPct) * totalTime)
            );
        });
    }

    /**
     * Play all data points to the right, if there are any, in continuous mode
     */
    private _playLeftContinuous() {
        const startIndex = this._pointIndex;
        const startX = this.getCurrent().point.x;
        const row = this._data[this._groupIndex].slice(0, startIndex + 1);
        const totalTime = SPEEDS[this._speedRateIndex] * 10;
        const xMin = this._xAxis.minimum;
        const range = this._xAxis.maximum - xMin;
        const change =
            this._xAxis.type === "linear"
                ? (x: number) => {
                      return 1 - (x - xMin) / range;
                  }
                : (x: number) => {
                      return (
                          1 -
                          (Math.log10(x) - Math.log10(xMin)) / Math.log10(range)
                      );
                  };
        const startingPct = change(startX);

        row.reverse().forEach((item, index) => {
            this._playListContinuous.push(
                setTimeout(() => {
                    this._pointIndex = startIndex - index;
                    this._playCurrent();
                }, (change(item.x) - startingPct) * totalTime)
            );
        });
    }

    /**
     * Play all data points to the right, if there are any
     */
    private _playRight() {
        if (this._outlierMode) {
            this._playRightOutlier();
            return;
        }
        if (this._xAxis.continuous) {
            this._playRightContinuous();
            return;
        }
        const max = this._data[this._groupIndex].length - 1;
        this._playListInterval = setInterval(() => {
            if (this._pointIndex >= max) {
                this._pointIndex = max;
                this._clearPlay();
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
            /* istanbul ignore next */
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

        /* istanbul ignore next */
        if (!this._audioEngine) {
            return;
        }

        if (isUnplayable(current.x, this._xAxis)) {
            return;
        }

        const hertzes = this._getHertzRange();

        const xPan =
            this._xAxis.type === "log10"
                ? calcPan(
                      (Math.log10(current.x) -
                          Math.log10(this._xAxis.minimum)) /
                          (Math.log10(this._xAxis.maximum) -
                              Math.log10(this._xAxis.minimum))
                  )
                : calcPan(
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

        if (
            isBoxDataPoint(current) &&
            this._outlierMode &&
            "outlier" in current
        ) {
            const yBin = interpolateBin(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                current.outlier[this._outlierIndex],
                this._yAxis.minimum,
                this._yAxis.maximum,
                hertzes.length - 1,
                this._yAxis.type
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
                if (
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    isUnplayable(current[stat], this._yAxis) ||
                    stat === "outlier"
                ) {
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
            slice: this._groups[this._visible_group_indices[this._groupIndex]],
            index: this._pointIndex,
            point: this.currentPoint
        });
    }

    /**
     * Update the screen reader on the current data point
     */
    private _speakCurrent() {
        if (!this._options.enableSpeech) {
            return;
        }

        // If we're flagged to announce a new group, but the group name is empty, ignore the flag
        if (
            this._flagNewGroup &&
            this._groups[this._visible_group_indices[this._groupIndex]] === ""
        ) {
            this._flagNewGroup = false;
        }

        const { statIndex, availableStats } =
            this._metadataByGroup[
                this._visible_group_indices[this._groupIndex]
            ];
        if (this._flagNewStat && availableStats.length === 0) {
            this._flagNewStat = false;
        }

        const current =
            this._data[this._visible_group_indices[this._groupIndex]][
                this._pointIndex
            ];

        const point = generatePointDescription(
            current,
            formatWrapper(this._xAxis),
            formatWrapper(
                isAlternateAxisDataPoint(current) ? this._y2Axis : this._yAxis
            ),
            availableStats[statIndex],
            this._outlierMode ? this._outlierIndex : null,
            this._announcePointLabelFirst
        );
        const text =
            (this._flagNewGroup
                ? `${
                      this._groups[
                          this._visible_group_indices[this._groupIndex]
                      ]
                  }, `
                : "") +
            (this._flagNewStat
                ? `${sentenceCase(availableStats[statIndex] ?? "all")}, `
                : "") +
            point;

        this._sr.render(text);

        this._flagNewGroup = false;
        this._flagNewStat = false;
    }
}

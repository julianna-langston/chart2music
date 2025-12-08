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
    StatBundle,
    c2mInfo,
    ChartContainerType
} from "./types";
import {
    calcPan,
    interpolateBin,
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
    checkForNumberInput,
    filteredJoin,
    generateChartSummary,
    generateInstructions,
    generateAxisSummary,
    detectIfMobile,
    determineCC
} from "./utils";
import { validateInput } from "./validate";
import {
    isAlternateAxisDataPoint,
    isBoxDataPoint,
    isHighLowDataPoint,
    isOHLCDataPoint,
    isSimpleDataPoint
} from "./dataPoint";
import type { SupportedDataPointType, SimpleDataPoint } from "./dataPoint";
import { launchOptionDialog } from "./optionDialog";
import { launchInfoDialog } from "./infoDialog";
import { AudioNotificationType } from "./audio/AudioEngine";
import {
    DEFAULT_LANGUAGE,
    AVAILABLE_LANGUAGES,
    TranslationManager
} from "./translator";

/**
 * Metadata about previous levels. Used to quickly return to parents.
 */
type HierarchyBreadcrumbType = {
    groupIndex: number;
    pointIndex: number;
};

/**
 * List of actions that could be activated by keyboard (or other, future means)
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
    DRILL_DOWN = "drill_down",
    DRILL_UP = "drill_up",
    GO_TO_ROOT = "go_to_root",
    SPEED_UP = "speed_up",
    SLOW_DOWN = "slow_down",
    MONITOR = "monitor",
    HELP = "help",
    OPTIONS = "options",
    INFO = "info"
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
    private _chartElement: ChartContainerType;
    private _ccElement: HTMLElement;
    private _chartSummary: string;
    private _instructions: string;
    private _groups: string[];
    private _visible_group_indices: number[] = [];
    private _data: SupportedDataPointType[][];
    private _visibleGroupIndex = 0;
    private _pointIndex = 0;
    private _sr: ScreenReaderBridge;
    private _xAxis: AxisData;
    private _yAxis: AxisData;
    private _y2Axis: AxisData;
    private _title: string;
    private _playListInterval: NodeJS.Timeout | null = null;
    private _playListContinuous: NodeJS.Timeout[] = [];
    private _speedRateIndex = 1;
    private _flagNewLevel = false;
    private _flagNewStat = false;
    private _keyEventManager: KeyboardEventManager;
    private _audioEngine: AudioEngine | null = null;
    private _metadataByGroup: groupedMetadata[];
    private _options: c2mOptions = {
        enableSound: true,
        enableSpeech: true,
        live: false,
        hertzes: HERTZ,
        stack: false,
        root: null,
        modifyHelpDialogText: (lang, text) => text,
        modifyHelpDialogKeyboardListing: (lang, headers, shortcuts) =>
            [headers].concat(shortcuts)
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
    private _info: c2mInfo = {};
    private _hierarchy = false;
    private _hierarchyRoot: string | null = null;
    private _hierarchyBreadcrumbs: HierarchyBreadcrumbType[] = [];
    private _language: string;
    private _cleanUpTasks: Array<() => void> = [];
    private _translator: TranslationManager;

    /**
     * Constructor
     * @param input - data/config provided by the invocation
     */
    constructor(input: SonifyTypes) {
        // Since we don't support mobile devices, don't do anything if we're on mobile
        if (detectIfMobile()) {
            return;
        }

        this._type = input.type;
        this._providedAudioEngine = input.audioEngine;
        this._title = input.title ?? "";
        this._chartElement = input.element;
        this._info = input.info ?? {};
        this._language = input.lang ?? DEFAULT_LANGUAGE;
        this._translator = new TranslationManager(this._language);

        this._ccElement = determineCC(
            this._chartElement,
            (fn) => {
                this._cleanUpTasks.push(fn);
            },
            input.cc
        );

        if (input?.options) {
            if (this._type === "scatter") {
                this._options.stack = true;
            }
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

            if (input.options.translationCallback) {
                this._translator.intercepterCallback =
                    input.options.translationCallback;
            }

            if (input.options.announcePointLabelFirst) {
                this._announcePointLabelFirst =
                    input.options.announcePointLabelFirst;
            }
        }

        prepChartElement({
            elem: this._chartElement,
            title: this._title,
            translationCallback: (code, evaluators) => {
                return this._translator.translate(code, evaluators);
            },
            addCleanupTask: (fn: () => void) => {
                this._cleanUpTasks.push(fn);
            }
        });

        this._setData(input.data, input.axes);

        if (this._options.root) {
            this._hierarchy = true;
            this._hierarchyRoot = this._options.root;
            this._updateToNewLevel(this._groups.indexOf(this._hierarchyRoot));
        }

        // Generate summary
        this._generateSummary();

        // Initialize SRB
        ScreenReaderBridge.addAriaAttributes(this._ccElement);
        this._ccElement.setAttribute("lang", this._language);
        this._sr = new ScreenReaderBridge(this._ccElement);

        this._availableActions = this._initializeActionMap();

        this._initializeKeyActionMap();
        this._startListening();
    }

    /**
     * The available languages. ie: "en", "es"
     */
    static get languages() {
        return AVAILABLE_LANGUAGES;
    }

    /**
     * Index for the current group
     */
    get _groupIndex() {
        return this._visible_group_indices.at(this._visibleGroupIndex);
    }

    /**
     * Clean up event listeners, and put the elements and attributes back the way they were before initialization
     */
    public cleanUp() {
        this._cleanUpTasks.forEach((fn) => fn());
    }

    /**
     * Get the chart type of the current group
     */
    private get _currentGroupType() {
        if (Array.isArray(this._type)) {
            // Example type: ["bar", "line"]
            return this._type.at(this._visibleGroupIndex);
        } else {
            // Example type: "bar"
            return this._type;
        }
    }

    /**
     * The current group's data
     */
    private get _currentDataRow() {
        return this._data.at(this._groupIndex);
    }

    /**
     * Is movement available based on the current context
     */
    private get _movementAvailable() {
        if (this._currentDataRow === null) {
            return false;
        }

        return true;
    }

    /**
     * Getter for current data point
     */
    get currentPoint() {
        if (this._currentDataRow === null) {
            return null;
        }
        return this._currentDataRow.at(this._pointIndex);
    }

    /**
     * Get the name of the current group
     */
    private get _currentGroupName() {
        return this._groups.at(this._groupIndex);
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
     * Establish what actions are available for the keyboard action listeners
     */
    private _initializeActionMap() {
        return {
            next_point: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                if (this._moveRight()) {
                    this._playAndSpeak();
                }
            },
            previous_point: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                if (this._moveLeft()) {
                    this._playAndSpeak();
                }
            },
            drill_down: () => {
                this._clearPlay();
                if (this._drillDown()) {
                    this._playAndSpeak();
                }
            },
            drill_up: () => {
                this._clearPlay();
                if (this._drillUp()) {
                    this._playAndSpeak();
                }
            },
            go_to_root: () => {
                this._clearPlay();
                if (this._drillToRoot()) {
                    this._playAndSpeak();
                }
            },
            play_right: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                this._playRight();
            },
            play_left: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                this._playLeft();
            },
            play_forward_category: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                const max = this._visible_group_indices.length - 1;
                this._playListInterval = setInterval(() => {
                    if (this._visibleGroupIndex >= max) {
                        this._visibleGroupIndex = max;
                        this._clearPlay();
                    } else {
                        this._visibleGroupIndex++;
                        this._playCurrent();
                    }
                }, SPEEDS.at(this._speedRateIndex));
                this._playCurrent();
            },
            play_backward_category: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                const min = 0;
                this._playListInterval = setInterval(() => {
                    if (this._visibleGroupIndex <= min) {
                        this._visibleGroupIndex = min;
                        this._clearPlay();
                    } else {
                        this._visibleGroupIndex--;
                        this._playCurrent();
                    }
                }, SPEEDS.at(this._speedRateIndex)) as NodeJS.Timeout;
                this._playCurrent();
            },
            stop_play: () => {
                this._clearPlay();
            },
            previous_stat: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                if (this._movePrevStat()) {
                    this._flagNewStat = true;
                    this._playAndSpeak();
                }
            },
            next_stat: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                if (this._moveNextStat()) {
                    this._flagNewStat = true;
                    this._playAndSpeak();
                }
            },
            previous_category: () => {
                this._clearPlay();
                if (this._visibleGroupIndex === 0) {
                    return;
                }
                const currentX = this.currentPoint?.x ?? this._pointIndex;
                this._visibleGroupIndex--;

                this._announceCategoryChange();
                this._cleanupAfterCategoryChange(currentX);
                this._onFocus();
            },
            next_category: () => {
                this._clearPlay();
                if (
                    this._visibleGroupIndex ===
                    this._visible_group_indices.length - 1
                ) {
                    return;
                }
                const currentX = this.currentPoint.x;
                this._visibleGroupIndex++;

                this._announceCategoryChange();
                this._cleanupAfterCategoryChange(currentX);
                this._onFocus();
            },
            first_category: () => {
                this._clearPlay();
                this._visibleGroupIndex = 0;
                this._playAndSpeak();
            },
            last_category: () => {
                this._clearPlay();
                this._visibleGroupIndex =
                    this._visible_group_indices.length - 1;
                this._playAndSpeak();
            },
            first_point: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                this._pointIndex = 0;
                this._playAndSpeak();
            },
            last_point: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                this._pointIndex = this._currentDataRow.length - 1;
                this._playAndSpeak();
            },
            replay: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                this._flagNewStat = true;
                this._playAndSpeak();
            },
            select: () => {
                if (!this._movementAvailable) {
                    return;
                }
                this._options.onSelectCallback?.({
                    slice: this._currentGroupName,
                    index: this._pointIndex,
                    point: this.currentPoint
                });
            },
            previous_tenth: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                this._moveLeftTenths();
                this._playAndSpeak();
            },
            next_tenth: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                this._moveRightTenths();
                this._playAndSpeak();
            },
            go_minimum: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
                if (this._moveToMinimum()) {
                    this._playAndSpeak();
                }
            },
            go_maximum: () => {
                this._clearPlay();
                if (!this._movementAvailable) {
                    return;
                }
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
                this._visibleGroupIndex = this._visible_group_indices.indexOf(
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
                this._visibleGroupIndex = this._visible_group_indices.indexOf(
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
                this._sr.render(
                    this._translator.translate("kbr-speed", {
                        rate_in_ms: SPEEDS.at(this._speedRateIndex)
                    })
                );
            },
            slow_down: () => {
                this._clearPlay();
                if (this._speedRateIndex > 0) {
                    this._speedRateIndex--;
                }
                this._sr.render(
                    this._translator.translate("kbr-speed", {
                        rate_in_ms: SPEEDS.at(this._speedRateIndex)
                    })
                );
            },
            monitor: () => {
                if (!this._options.live) {
                    this._sr.render(this._translator.translate("kbr-not-live"));
                    return;
                }
                this._monitorMode = !this._monitorMode;
                this._sr.render(
                    this._translator.translate("monitoring", {
                        switch: this._monitorMode
                    })
                );
            },
            help: () => {
                this._clearPlay();
                this._keyEventManager.launchHelpDialog(
                    this._language,
                    (id, ev) => this._translator.translate(id, ev)
                );
            },
            options: () => {
                this._checkAudioEngine();
                launchOptionDialog(
                    {
                        ...this._hertzClamps,
                        speedIndex: this._speedRateIndex,
                        continuousMode: this._xAxis.continuous,
                        labelPosition: this._announcePointLabelFirst,
                        language: this._language,
                        translationCallback: (id, ev) =>
                            this._translator.translate(id, ev)
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
                                this._translator.translate("kbr-speed", {
                                    rate_in_ms: SPEEDS.at(this._speedRateIndex)
                                })
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
                            this._options.hertzes.at(hertzIndex),
                            0,
                            NOTE_LENGTH
                        );
                    }
                );
            },
            info: () => {
                launchInfoDialog(this._info, (id, ev) =>
                    this._translator.translate(id, ev)
                );
            }
        };
    }

    /**
     * Make any necessary adjustments to the point index based on changing groups.
     * (This is necessary because groups are sometimes uneven. For example, if you're on group A at index 10, and you
     * move to group B, which only goes up to 5 items, you're going to need to adjust your index to account for the new, smaller group.)
     * @param previousX - the X value of the previous data point
     */
    private _cleanupAfterCategoryChange(previousX: number) {
        if (this._currentDataRow === null) {
            return;
        }

        if (
            this._xAxis.continuous &&
            (!this.currentPoint || this.currentPoint.x !== previousX)
        ) {
            const differences = this._currentDataRow.map(({ x }) =>
                Math.abs(previousX - x)
            );
            const smallestDifference = Math.min(...differences);
            const closestIndex = differences.indexOf(smallestDifference);
            this._pointIndex = closestIndex;
        }
        if (this._pointIndex >= this._currentDataRow.length) {
            this._pointIndex = this._currentDataRow.length - 1;
        }
    }

    /**
     * Generate (or regenerate) chart summary
     */
    private _generateSummary() {
        this._chartSummary = generateChartSummary({
            title: this._title,
            groupCount: this._visible_group_indices.length,
            live: this._options.live,
            hierarchy: this._hierarchy,
            translationCallback: (code, evaluators) => {
                return this._translator.translate(code, evaluators);
            }
        });
        this._instructions = generateInstructions({
            live: this._options.live,
            hierarchy: this._hierarchy,
            hasNotes: this._info?.notes?.length > 0,
            translationCallback: (code, evaluators) => {
                return this._translator.translate(code, evaluators);
            }
        });
    }

    /**
     * Create a frequency table from selected rows, summing y values for each x coordinate
     * @param rowFilter - Optional function to filter which rows to include
     * @returns Array of SimpleDataPoint with summed values
     */
    private _createFrequencyTable(
        rowFilter?: (row: SupportedDataPointType[], rowIndex: number) => boolean
    ): SimpleDataPoint[] {
        const freqTable: Record<number, number> = {};
        this._data.forEach((row, rowIndex) => {
            if (rowFilter && !rowFilter(row, rowIndex)) {
                return;
            }
            row.forEach((cell) => {
                if (!isSimpleDataPoint(cell)) {
                    return;
                }
                if (!(cell.x in freqTable)) {
                    freqTable[cell.x] = 0;
                }
                freqTable[cell.x] += cell.y;
            });
        });
        return Object.entries(freqTable).map(([x, total]) => {
            return {
                x: Number(x),
                y: total
            } as SimpleDataPoint;
        });
    }

    /**
     * Build a new group to represent the stack, or sum, of all other groups
     */
    private _buildStackBar() {
        const newRow = this._createFrequencyTable();
        this._data.unshift(newRow);
        this._groups.unshift("All");
        this._visible_group_indices.push(this._groups.length - 1);
    }

    /**
     * Build the "All" group for a scatter plot, where it is all of the scatter plot dots combined in one place
     */
    private _buildStackScatter() {
        const newGroup = this._data.flat();
        this._data.unshift(newGroup);
        this._groups.unshift("All");
        this._visible_group_indices.push(this._groups.length - 1);
    }

    /**
     * Assign or re-assign data values
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

        if (this._options.stack && this._data.length > 1) {
            if (this._type === "scatter") {
                this._buildStackScatter();
            } else {
                this._buildStackBar();
            }
        }

        this._xAxis = initializeAxis({
            data: this._data,
            axisName: "x",
            userAxis: this._explicitAxes.x,
            filterGroupIndex: this._groups.indexOf(this._options.root)
        });
        this._yAxis = initializeAxis({
            data: this._data,
            axisName: "y",
            userAxis: this._explicitAxes.y,
            filterGroupIndex: this._groups.indexOf(this._options.root)
        });
        if (usesAxis({ data: this._data, axisName: "y2" })) {
            this._y2Axis = initializeAxis({
                data: this._data,
                axisName: "y2",
                userAxis: this._explicitAxes.y2
            });
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

        if (this._info.annotations?.length > 0) {
            const annos = this._info.annotations.map(({ x, label }) => {
                return {
                    x,
                    label,
                    y: NaN,
                    type: "annotation",
                    custom: {
                        datasetIndex: 0,
                        index: 0
                    }
                } as SupportedDataPointType;
            });
            this._data.forEach((group, i) => {
                annos.forEach((a) => {
                    const index = group.findIndex((g) => g.x >= a.x);

                    if (index === -1) {
                        this._data[i].push(a);
                        return;
                    }

                    if (index === 0) {
                        this._data[i].unshift(a);
                        return;
                    }

                    this._data[i].splice(index, 0, a);
                });
            });
        }

        this._metadataByGroup = calculateMetadataByGroup(this._data);
        this._metadataByGroup = checkForNumberInput(
            this._metadataByGroup,
            data
        );

        // Generate summary
        this._generateSummary();
    }

    /**
     * Assign or re-assign data values
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
        this._visibleGroupIndex =
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

        if (this._title) {
            this._sr.render(
                this._translator.translate("updated", { title: this._title })
            );
        } else {
            this._sr.render(this._translator.translate("updated-untitled"));
        }
    }

    /**
     * Change the visibility of a category
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
                this._sr.render(
                    this._translator.translate("updated", {
                        title: this._title || "Chart"
                    })
                );
            }
        } else {
            if (this._visible_group_indices.includes(groupIndex)) {
                if (this._visible_group_indices.length === 1) {
                    return `Group "${name}" can not be hidden. It is the last visible group, and there must always be at least one group visible.`;
                }

                this._visible_group_indices.splice(
                    this._visible_group_indices.indexOf(groupIndex),
                    1
                );
                this._sr.render(
                    this._translator.translate("updated", {
                        title: this._title || "Chart"
                    })
                );
            }
        }

        // If this is a stacked chart with an "All" group, rebuild it to reflect new visibility
        if (this._options.stack && this._groups[0] === "All") {
            // Rebuild the "All" group by summing only visible datasets (excluding "All" itself)
            this._data[0] = this._createFrequencyTable((row, rowIndex) => {
                // Skip the "All" group itself (index 0) and hidden groups
                return (
                    rowIndex !== 0 &&
                    this._visible_group_indices.includes(rowIndex)
                );
            });
        }

        if (this._visibleGroupIndex >= this._visible_group_indices.length) {
            this._visibleGroupIndex = this._visible_group_indices.length - 1;
        }

        if (this._visibleGroupIndex === visibleGroupIndex) {
            this._silent = true;
            this._availableActions.previous_category();
            if (visibleGroupIndex > 0) this._availableActions.next_category();
            this._silent = false;
        }

        return "";
    }

    /**
     * Get the data point that the user is currently focused on
     * @returns - the current group name and data point
     */
    getCurrent() {
        const { statIndex, availableStats } =
            this._metadataByGroup[this._groupIndex];
        return {
            index: this._pointIndex,
            group: this._currentGroupName,
            point: this.currentPoint,
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
            this._xAxis.minimum = calculateAxisMinimum({
                data: this._data,
                prop: "x"
            });
            this._xAxis.maximum = calculateAxisMaximum({
                data: this._data,
                prop: "x"
            });
        }
        if (recalculateY) {
            this._yAxis.minimum = calculateAxisMinimum({
                data: this._data,
                prop: "y"
            });
            this._yAxis.maximum = calculateAxisMaximum({
                data: this._data,
                prop: "y"
            });
        }
        if (recalculateY2) {
            this._y2Axis.minimum = calculateAxisMinimum({
                data: this._data,
                prop: "y2"
            });
            this._y2Axis.maximum = calculateAxisMaximum({
                data: this._data,
                prop: "y2"
            });
        }

        if (this._pointIndex < 0) {
            this._pointIndex = 0;
        }
    }

    /**
     * Append data in a live chart
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
        this._keyEventManager = new KeyboardEventManager(
            this._chartElement,
            this._options.modifyHelpDialogText,
            this._options.modifyHelpDialogKeyboardListing
        );
        this._keyEventManager.registerKeyEvents(
            [
                {
                    title: this._translator.translate("key-point-next"),
                    key: "ArrowRight",
                    keyDescription: this._translator.translate(
                        "key-descr-ArrowRight"
                    ),
                    callback: this._availableActions.next_point
                },
                {
                    title: this._translator.translate("key-point-prev"),
                    key: "ArrowLeft",
                    keyDescription: this._translator.translate(
                        "key-descr-ArrowLeft"
                    ),
                    callback: this._availableActions.previous_point
                },
                {
                    title: this._translator.translate("key-point-first"),
                    key: "Home",
                    description:
                        this._translator.translate("key-descr-alt-Home"),
                    callback: this._availableActions.first_point
                },
                {
                    title: this._translator.translate("key-point-last"),
                    key: "End",
                    description:
                        this._translator.translate("key-descr-alt-Home"),
                    callback: this._availableActions.last_point
                },
                {
                    title: this._translator.translate("key-play-fwd"),
                    key: "Shift+End",
                    keyDescription: this._translator.translate(
                        "key-descr-Shift+End"
                    ),
                    description: this._translator.translate(
                        "key-descr-alt-Shift+End"
                    ),
                    callback: this._availableActions.play_right
                },
                {
                    title: this._translator.translate("key-play-back"),
                    key: "Shift+Home",
                    keyDescription: this._translator.translate(
                        "key-descr-Shift+Home"
                    ),
                    description: this._translator.translate(
                        "key-descr-alt-Shift+Home"
                    ),
                    callback: this._availableActions.play_left
                },
                {
                    title: this._translator.translate("key-play-cancel"),
                    key: "Ctrl+Control",
                    keyDescription:
                        this._translator.translate("key-descr-ctrl"),
                    callback: this._availableActions.stop_play
                },
                {
                    title: this._translator.translate("key-speed-incr"),
                    caseSensitive: false,
                    key: "q",
                    keyDescription: "Q",
                    callback: this._availableActions.speed_up
                },
                {
                    title: this._translator.translate("key-speed-decr"),
                    caseSensitive: false,
                    key: "e",
                    keyDescription: "E",
                    callback: this._availableActions.slow_down
                },
                {
                    title: this._translator.translate("key-replay"),
                    key: " ",
                    keyDescription:
                        this._translator.translate("key-descr-spacebar"),
                    callback: this._availableActions.replay
                },
                {
                    title: this._translator.translate("key-select"),
                    key: "Enter",
                    callback: this._availableActions.select
                },
                {
                    title: this._translator.translate("key-tenth-next"),
                    key: "Ctrl+ArrowRight",
                    keyDescription: this._translator.translate(
                        "key-descr-Ctrl+ArrowRight"
                    ),
                    callback: this._availableActions.next_tenth
                },
                {
                    title: this._translator.translate("key-tenth-prev"),
                    key: "Ctrl+ArrowLeft",
                    keyDescription: this._translator.translate(
                        "key-descr-Ctrl+ArrowLeft"
                    ),
                    callback: this._availableActions.previous_tenth
                },
                this._type === "matrix"
                    ? {
                          title: this._translator.translate("key-group-next"),
                          key: "ArrowDown",
                          keyDescription: this._translator.translate(
                              "key-descr-ArrowDown"
                          ),
                          callback: this._availableActions.next_category
                      }
                    : {
                          title: this._translator.translate("key-stat-next"),
                          key: "ArrowDown",
                          keyDescription: this._translator.translate(
                              "key-descr-ArrowDown"
                          ),
                          callback: this._availableActions.next_stat
                      },
                this._type === "matrix"
                    ? {
                          title: this._translator.translate("key-group-prev"),
                          key: "ArrowUp",
                          keyDescription:
                              this._translator.translate("key-descr-ArrowUp"),
                          callback: this._availableActions.previous_category
                      }
                    : {
                          title: this._translator.translate("key-stat-prev"),
                          key: "ArrowUp",
                          keyDescription:
                              this._translator.translate("key-descr-ArrowUp"),
                          callback: this._availableActions.previous_stat
                      },
                !this._hierarchy && {
                    title: this._translator.translate("key-group-next"),
                    key: "PageDown",
                    keyDescription:
                        this._translator.translate("key-descr-PageDown"),
                    description: this._translator.translate(
                        "key-descr-alt-PageDown"
                    ),
                    callback: this._availableActions.next_category
                },
                !this._hierarchy && {
                    title: this._translator.translate("key-group-prev"),
                    key: "PageUp",
                    keyDescription:
                        this._translator.translate("key-descr-PageUp"),
                    description: this._translator.translate(
                        "key-descr-alt-PageUp"
                    ),
                    callback: this._availableActions.previous_category
                },
                this._hierarchy
                    ? {
                          title: this._translator.translate("key-hier-root"),
                          key: "Alt+PageUp",
                          keyDescription: this._translator.translate(
                              "key-descr-Alt+PageUp"
                          ),
                          description: this._translator.translate(
                              "key-descr-alt-Alt+PageUp"
                          ),
                          callback: this._availableActions.go_to_root
                      }
                    : {
                          title: this._translator.translate("key-group-first"),
                          key: "Alt+PageUp",
                          keyDescription: this._translator.translate(
                              "key-descr-Alt+PageUp"
                          ),
                          description: this._translator.translate(
                              "key-descr-alt-Alt+PageUp"
                          ),
                          callback: this._availableActions.first_category
                      },
                !this._hierarchy && {
                    title: this._translator.translate("key-group-last"),
                    key: "Alt+PageDown",
                    keyDescription: this._translator.translate(
                        "key-descr-Alt+PageDown"
                    ),
                    description: this._translator.translate(
                        "key-descr-alt-Alt+PageDown"
                    ),
                    callback: this._availableActions.last_category
                },
                !this._hierarchy && {
                    title: this._translator.translate("key-play-fwd-group"),
                    key: "Shift+PageDown",
                    keyDescription: this._translator.translate(
                        "key-descr-Shift+PageDown"
                    ),
                    description: this._translator.translate(
                        "key-descr-alt-Shift+PageDown"
                    ),
                    callback: this._availableActions.play_forward_category
                },
                !this._hierarchy && {
                    title: this._translator.translate("key-play-back-group"),
                    key: "Shift+PageUp",
                    keyDescription: this._translator.translate(
                        "key-descr-Shift+PageUp"
                    ),
                    description: this._translator.translate(
                        "key-descr-alt-Shift+PageUp"
                    ),
                    callback: this._availableActions.play_backward_category
                },
                {
                    title: this._translator.translate(
                        `key-${this._hierarchy ? "level" : "group"}-min`
                    ),
                    key: "[",
                    callback: this._availableActions.go_minimum
                },
                {
                    title: this._translator.translate(
                        `key-${this._hierarchy ? "level" : "group"}-max`
                    ),
                    key: "]",
                    callback: this._availableActions.go_maximum
                },
                !this._hierarchy && {
                    title: this._translator.translate("key-chart-min"),
                    key: "Ctrl+[",
                    keyDescription:
                        this._translator.translate("key-descr-Ctrl+["),
                    callback: this._availableActions.go_total_minimum
                },
                !this._hierarchy && {
                    title: this._translator.translate("key-chart-max"),
                    key: "Ctrl+]",
                    keyDescription:
                        this._translator.translate("key-descr-Ctrl+]"),
                    callback: this._availableActions.go_total_maximum
                },
                this._hierarchy && {
                    title: this._translator.translate("key-level-decr"),
                    key: "Alt+ArrowDown",
                    keyDescription: this._translator.translate(
                        "key-descr-Alt+ArrowDown"
                    ),
                    callback: this._availableActions.drill_down
                },
                this._hierarchy && {
                    title: this._translator.translate("key-level-incr"),
                    key: "Alt+ArrowUp",
                    keyDescription: this._translator.translate(
                        "key-descr-Alt+ArrowUp"
                    ),
                    callback: this._availableActions.drill_up
                },
                {
                    title: this._translator.translate("key-monitor-toggle"),
                    caseSensitive: false,
                    key: "m",
                    keyDescription: "M",
                    callback: this._availableActions.monitor
                },
                {
                    title: this._translator.translate("key-dialog-help"),
                    caseSensitive: false,
                    key: "h",
                    keyDescription: "H",
                    callback: this._availableActions.help
                },
                {
                    title: this._translator.translate("key-dialog-options"),
                    caseSensitive: false,
                    key: "o",
                    keyDescription: "O",
                    callback: this._availableActions.options
                }
            ].filter((item) => Boolean(item))
        );

        if (this._info.notes?.length > 0) {
            this._keyEventManager.registerKeyEvent({
                title: this._translator.translate("info-open"),
                caseSensitive: false,
                key: "i",
                callback: this._availableActions.info
            });
        }

        const hotkeyCallbackWrapper = (cb: (args: c2mCallbackType) => void) => {
            cb({
                slice: this._currentGroupName,
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

        this._cleanUpTasks.push(() => {
            this._keyEventManager.cleanup();
        });
    }

    /**
     * Change the range of playable hertz
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
     * Generate a context summary for the current group
     */
    private generateGroupSummary() {
        if (this._currentGroupType === "unsupported") {
            return this._translator.translate("group-unknown", {
                title: this._currentGroupName
            });
        }

        const code = ["chart", this._currentGroupType];

        if (this._currentGroupName.length > 0) {
            code.push("labeled");
        }

        const text = [
            this._translator.translate(code.join("-"), {
                label: this._currentGroupName
            }),
            generateAxisSummary({
                axisLetter: "x",
                axis: this._xAxis,
                translationCallback: (code, evaluators) => {
                    return this._translator.translate(code, evaluators);
                }
            }),
            isAlternateAxisDataPoint(this.currentPoint)
                ? generateAxisSummary({
                      axisLetter: "y2",
                      axis: this._y2Axis,
                      translationCallback: (code, evaluators) => {
                          return this._translator.translate(code, evaluators);
                      }
                  })
                : generateAxisSummary({
                      axisLetter: "y",
                      axis: this._yAxis,
                      translationCallback: (code, evaluators) => {
                          return this._translator.translate(code, evaluators);
                      }
                  })
        ];

        return text.join(" ");
    }

    /**
     * Listen to various events, and drive interactions
     */
    private _startListening() {
        const focusEvent = () => {
            this._sr.clear();
            if (this._options.live) {
                this._generateSummary();
            }
            if (this._options.enableSpeech) {
                this._sr.render(
                    this._chartSummary +
                        " " +
                        this.generateGroupSummary() +
                        " " +
                        this._instructions
                );
            }
            if (window.__chart2music_options__?._hertzClamps) {
                const { lower, upper } =
                    window.__chart2music_options__._hertzClamps;
                this._setHertzClamps(lower, upper);
            }
            this._onFocus();
        };
        const blurEvent = () => {
            this._monitorMode = false;
        };
        this._chartElement.addEventListener("focus", focusEvent);
        this._chartElement.addEventListener("blur", blurEvent);
        this._cleanUpTasks.push(() => {
            this._chartElement.removeEventListener("focus", focusEvent);
            this._chartElement.removeEventListener("blur", blurEvent);
        });
    }

    /**
     * Speak the context for the new group
     */
    private _announceCategoryChange() {
        if (this._silent) {
            return;
        }

        this._sr.render(this.generateGroupSummary());
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
            this._speakCurrent(this.currentPoint);
        }, NOTE_LENGTH * 1000);
    }

    /**
     * Move focus to the next outlier, if there is one
     */
    private _moveNextOutlier() {
        if (
            isBoxDataPoint(this.currentPoint) &&
            "outlier" in this.currentPoint
        ) {
            const { outlier } = this.currentPoint;
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
        if (
            isBoxDataPoint(this.currentPoint) &&
            "outlier" in this.currentPoint
        ) {
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

        const max = this._currentDataRow.length - 1;
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

        if (this._pointIndex === this._currentDataRow.length - 1) {
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
        }, SPEEDS.at(this._speedRateIndex)) as NodeJS.Timeout;
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
        }, SPEEDS.at(this._speedRateIndex)) as NodeJS.Timeout;
        this._playCurrent();
    }

    /**
     * Play all outliers to the right, if there are any
     */
    private _playRightOutlier() {
        if (
            !(
                isBoxDataPoint(this.currentPoint) &&
                "outlier" in this.currentPoint
            )
        ) {
            return;
        }
        const max = this.currentPoint.outlier?.length - 1;
        this._playListInterval = setInterval(() => {
            if (this._outlierIndex >= max) {
                this._outlierIndex = max;
                this._clearPlay();
            } else {
                this._outlierIndex++;
                this._playCurrent();
            }
        }, SPEEDS.at(this._speedRateIndex));
        this._playCurrent();
    }

    /**
     * Play all data points to the right, if there are any, in continuous mode
     */
    private _playRightContinuous() {
        const startIndex = this._pointIndex;
        const startX = this.getCurrent().point.x;
        const row = this._currentDataRow.slice(startIndex);
        const totalTime = SPEEDS.at(this._speedRateIndex) * 10;
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
                setTimeout(
                    () => {
                        this._pointIndex = startIndex + index;
                        this._playCurrent();
                    },
                    (change(item.x) - startingPct) * totalTime
                )
            );
        });
    }

    /**
     * Play all data points to the right, if there are any, in continuous mode
     */
    private _playLeftContinuous() {
        const startIndex = this._pointIndex;
        const startX = this.getCurrent().point.x;
        const row = this._currentDataRow.slice(0, startIndex + 1);
        const totalTime = SPEEDS.at(this._speedRateIndex) * 10;
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
                setTimeout(
                    () => {
                        this._pointIndex = startIndex - index;
                        this._playCurrent();
                    },
                    (change(item.x) - startingPct) * totalTime
                )
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
        const max = this._currentDataRow.length - 1;
        this._playListInterval = setInterval(() => {
            if (this._pointIndex >= max) {
                this._pointIndex = max;
                this._clearPlay();
            } else {
                this._pointIndex++;
                this._playCurrent();
            }
        }, SPEEDS.at(this._speedRateIndex));
        this._playCurrent();
    }

    /**
     * Update metadata internally to adjust to a new hierarchical level
     * @param groupIndex - The new group index
     * @param [pointIndex] - The new point index
     */
    private _updateToNewLevel(groupIndex: number, pointIndex = 0) {
        this._visibleGroupIndex = groupIndex;
        this._pointIndex = pointIndex;
        this._flagNewLevel = true;

        // Update x range
        this._xAxis = initializeAxis({
            data: this._data,
            axisName: "x",
            userAxis: this._explicitAxes.x,
            filterGroupIndex: this._visibleGroupIndex
        });
        this._yAxis = initializeAxis({
            data: this._data,
            axisName: "y",
            userAxis: {
                ...this._explicitAxes.y,
                minimum: 0
            },
            filterGroupIndex: this._visibleGroupIndex
        });
        this._generateSummary();
    }

    /**
     * Drill down to the next level (hierarchy only)
     * @returns if possible
     */
    private _drillDown() {
        const { children } = this.currentPoint;

        if (!children) {
            return false;
        }

        // We already validated that 'children' properties validly point to group names that exist
        // and are not their own group. This was done with the input validation check.
        const groupIndex = this._groups.indexOf(children);

        this._hierarchyBreadcrumbs.push({
            groupIndex: this._visibleGroupIndex,
            pointIndex: this._pointIndex
        });
        this._updateToNewLevel(groupIndex);

        return true;
    }

    /**
     * Drill up to the previous level (hierarchy only)
     * @returns if possible
     */
    private _drillUp() {
        if (this._hierarchyBreadcrumbs.length === 0) {
            return false;
        }

        const { groupIndex, pointIndex } = this._hierarchyBreadcrumbs.pop();
        this._updateToNewLevel(groupIndex, pointIndex);

        return true;
    }

    /**
     * Go to the root level (hierarchy only)
     * @returns if possible
     */
    private _drillToRoot() {
        if (this._hierarchyBreadcrumbs.length === 0) {
            return false;
        }

        const { groupIndex, pointIndex } = this._hierarchyBreadcrumbs[0];
        this._updateToNewLevel(groupIndex, pointIndex);
        this._hierarchyBreadcrumbs = [];

        return true;
    }

    /**
     * Get the available hertzes
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

        this._playDataPoint(this.currentPoint, statIndex, availableStats);
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

        if (current.type === "annotation") {
            this._audioEngine.playNotification(
                AudioNotificationType.Annotation,
                xPan
            );
            return;
        }

        if (isSimpleDataPoint(current)) {
            if (isUnplayable(current.y, this._yAxis)) {
                return;
            }

            const yBin = interpolateBin({
                point: current.y,
                min: this._yAxis.minimum,
                max: this._yAxis.maximum,
                bins: hertzes.length - 1,
                scale: this._yAxis.type
            });

            this._audioEngine.playDataPoint(hertzes[yBin], xPan, NOTE_LENGTH);

            return;
        }

        if (isAlternateAxisDataPoint(current)) {
            if (isUnplayable(current.y2, this._y2Axis)) {
                return;
            }
            const yBin = interpolateBin({
                point: current.y2,
                min: this._y2Axis.minimum,
                max: this._y2Axis.maximum,
                bins: hertzes.length - 1,
                scale: this._y2Axis.type
            });

            this._audioEngine.playDataPoint(hertzes[yBin], xPan, NOTE_LENGTH);
            return;
        }

        if (
            isBoxDataPoint(current) &&
            this._outlierMode &&
            "outlier" in current
        ) {
            const yBin = interpolateBin({
                point: current.outlier[this._outlierIndex],
                min: this._yAxis.minimum,
                max: this._yAxis.maximum,
                bins: hertzes.length - 1,
                scale: this._yAxis.type
            });

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

                const yBin = interpolateBin({
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    point: current[stat],
                    min: this._yAxis.minimum,
                    max: this._yAxis.maximum,
                    bins: hertzes.length - 1,
                    scale: this._yAxis.type
                });

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
                const yBin = interpolateBin({
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    point: current[stat],
                    min: this._yAxis.minimum,
                    max: this._yAxis.maximum,
                    bins: hertzes.length - 1,
                    scale: this._yAxis.type
                });
                setTimeout(
                    () => {
                        this._audioEngine.playDataPoint(
                            hertzes[yBin],
                            xPan,
                            NOTE_LENGTH
                        );
                    },
                    SPEEDS.at(this._speedRateIndex) * interval * index
                );
            });
        }
    }

    /**
     * Perform actions when a new data point receives focus
     */
    private _onFocus() {
        if (this.currentPoint?.type === "annotation") {
            return;
        }

        this._options?.onFocusCallback?.({
            slice: this._currentGroupName,
            index: this._pointIndex,
            point: this.currentPoint
        });
    }

    /**
     * Update the screen reader on the current data point
     * @param current - the data point to speak about
     */
    private _speakCurrent(current: SupportedDataPointType) {
        if (!this._options.enableSpeech) {
            return;
        }

        if (current.type === "annotation") {
            this._sr.render(current.label);
            return;
        }

        const { statIndex, availableStats } = this._metadataByGroup.at(
            this._groupIndex
        );
        if (this._flagNewStat && availableStats.length === 0) {
            this._flagNewStat = false;
        }

        const point = generatePointDescription({
            translationCallback: (code, evaluators) => {
                return this._translator.translate(code, evaluators);
            },
            point: current,
            xFormat: formatWrapper({
                axis: this._xAxis,
                translationCallback: (code, evaluators) => {
                    return this._translator.translate(code, evaluators);
                }
            }),
            yFormat: formatWrapper({
                translationCallback: (code, evaluators) => {
                    return this._translator.translate(code, evaluators);
                },
                axis: isAlternateAxisDataPoint(current)
                    ? this._y2Axis
                    : this._yAxis
            }),
            stat: availableStats[statIndex],
            outlierIndex: this._outlierMode ? this._outlierIndex : null,
            announcePointLabelFirst: this._announcePointLabelFirst,
            pointIndex: this._pointIndex,
            groupIndex: this._groupIndex
        });

        const text = filteredJoin(
            [
                this._flagNewLevel && this._currentGroupName,
                this._flagNewStat &&
                    this._translator.translate(
                        `stat-${availableStats[statIndex] ?? "all"}`
                    ),
                point,
                this._hierarchy &&
                    current.children &&
                    this._translator.translate("nodeHasChildren")
            ],
            ", "
        );

        this._sr.render(text);

        this._flagNewLevel = false;
        this._flagNewStat = false;
    }
}

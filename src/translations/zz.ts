import type { translationDict } from ".";

const dictionary: translationDict = {
    description: "Z{title}, Sonified chartZ",
    updated: "Z{title} updatedZ",
    missing: "ZmissingZ",
    close: "ZCloseZ", // Used to close dialogs
    save: "ZSaveZ", // Used to save settings in dialogs

    tooLow: "Ztoo lowZ",
    tooHigh: "Ztoo highZ",
    nodeHasChildren: "Zhas childrenZ",
    instructionArrows: "ZUse arrow keys to navigate.Z",
    instructionHierarchy: "ZUse Alt + Up and Down to navigate between levels.Z",
    instructionLive: "ZPress M to toggle monitor mode.Z",
    instructionHotkeys: "ZPress H for more hotkeys.Z",

    "summ-chart": "ZSonified chart.Z",
    "summ-chart-live": "ZSonified live chart.Z",
    "summ-chart-hier": "ZSonified hierarchical chart.Z",
    "summ-chart-group": "ZSonified chart with {groupCount} groups.Z",
    "summ-chart-title": `ZSonified chart titled "Z{title}".Z`,
    "summ-chart-live-hier": "ZSonified live hierarchical chart.Z",
    "summ-chart-live-group": `ZSonified live chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    }.Z`,
    "summ-chart-live-title": `ZSonified live chart titled "Z{title}".Z`,
    "summ-chart-hier-group": `ZSonified hierarchical chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    }.Z`,
    "summ-chart-hier-title": `ZSonified hierarchical chart titled "Z{title}".Z`,
    "summ-chart-group-title": `ZSonified chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    } titled "Z{title}".Z`,
    "summ-chart-live-hier-group": `ZSonified live hierarchical chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    }.Z`,
    "summ-chart-live-hier-title": `ZSonified live hierarchical chart titled "Z{title}".Z`,
    "summ-chart-live-group-title": `ZSonified live chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    } titled" {title}".Z`,
    "summ-chart-hier-group-title": `ZSonified hierarchical chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    } titled "Z{title}".Z`,
    "summ-chart-live-hier-group-title": `ZSonified live hierarchical chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    } titled "Z{title}".Z`,

    "axis-desc": `Z{letter} is "Z{label}" from {min} to {max}.Z`,
    "axis-desc-log": `Z{letter} is "Z{label}" from {min} to {max} logarithmic.Z`,
    "axis-desc-con": `Z{letter} is "Z{label}" from {min} to {max} continuously.Z`,
    "axis-desc-log-con": `Z{letter} is "Z{label}" from {min} to {max} logarithmic continuously.Z`,

    "kbr-speed": `ZSpeed, {rate_in_ms}Z`,
    "kbr-not-live": "ZNot a live chartZ",
    monitoring:
        "ZMonitoring {switch, select, true {on} false {off} other {unknown}}Z",

    "group-unknown": `ZGroup titled "Z{title}" uses an unsupported chart type.Z`,

    "chart-line": "ZLine chart.Z",
    "chart-bar": "ZBar chart.Z",
    "chart-band": "ZBand chart.Z",
    "chart-pie": "ZPie chart.Z",
    "chart-candlestick": "ZCandlestick chart.Z",
    "chart-histogram": "ZHistogram chart.Z",
    "chart-box": "ZBox chart.Z",
    "chart-matrix": "ZMatrix chart.Z",
    "chart-scatter": "ZScatter chart.Z",
    "chart-treemap": "ZTreemap chart.Z",

    "chart-line-labeled": `ZLine chart showing "Z{label}".Z`,
    "chart-bar-labeled": `ZBar chart showing "Z{label}".Z`,
    "chart-band-labeled": `ZBand chart showing "Z{label}".Z`,
    "chart-pie-labeled": `ZPie chart showing "Z{label}".Z`,
    "chart-candlestick-labeled": `ZCandlestick chart showing "Z{label}".Z`,
    "chart-histogram-labeled": `ZHistogram showing "Z{label}".Z`,
    "chart-box-labeled": `ZBox plot showing "Z{label}".Z`,
    "chart-matrix-labeled": `ZMatrix plot showing "Z{label}".Z`,
    "chart-scatter-labeled": `ZScatter plot showing "Z{label}".Z`,
    "chart-treemap-labeled": `ZTreemap chart showing "Z{label}".Z`,

    "stat-all": "ZAllZ",
    // In Finance, OHLC (Open, High, Low, Close) charts are sometimes called candlestick charts.
    // https://en.wikipedia.org/wiki/Candlestick_chart
    "stat-open": "ZOpenZ",
    "stat-high": "ZHighZ",
    "stat-low": "ZLowZ",
    "stat-close": "ZCloseZ",

    // For box plots
    "stat-q1": "ZQ1Z", // Quartile 1
    "stat-median": "ZMedianZ",
    "stat-q3": "ZQ3Z",
    "stat-outlier": "ZOutlierZ",

    "point-xy": "Z{x}, {y}Z",
    "point-xohlc": "Z{x}, {open} - {high} - {low} - {close}Z",
    "point-outlier": "Z{x}, {y}, {index} of {count}Z",
    "point-xhl": "Z{x}, {high} - {low}Z",
    "point-xhl-outlier":
        "Z{x}, {high} - {low}, with {count, plural, =0 {no outliers} one {{count} outlier} other {{count} outliers}}Z",

    "info-open": "ZOpen info dialogZ",
    "info-title": "ZInfoZ",
    "info-notes": "ZNotesZ",

    "kbmg-title": "ZKeyboard ManagerZ",
    "key-point-next": "ZGo to next pointZ",
    "key-point-prev": "ZGo to previous pointZ",
    "key-play-fwd": "ZPlay rightZ",
    "key-play-back": "ZPlay leftZ",
    "key-play-cancel": "ZCancel playZ",
    "key-group-prev": "ZGo to previous groupZ",
    "key-stat-prev": "ZNavigate to previous statisticZ",
    "key-group-next": "ZGo to next groupZ",
    "key-stat-next": "ZNavigate to next statisticZ",
    "key-group-first": "ZGo to first groupZ",
    "key-group-last": "ZGo to last groupZ",
    "key-hier-root": "ZGo to rootZ",
    "key-play-fwd-group": "ZPlay forwards through groupsZ",
    "key-play-back-group": "ZPlay backwards through groupsZ",
    "key-point-first": "ZGo to first pointZ",
    "key-point-last": "ZGo to last pointZ",
    "key-replay": "ZReplayZ",
    "key-select": "ZSelect itemZ",
    "key-tenth-prev": "ZGo backward by a tenthZ",
    "key-tenth-next": "ZGo forward by a tenthZ",
    "key-level-min": "ZGo to level minimum valueZ",
    "key-level-max": "ZGo to level maximum valueZ",
    "key-group-min": "ZGo to group minimum valueZ",
    "key-group-max": "ZGo to group maximum valueZ",
    "key-chart-min": "ZGo to chart minimum valueZ",
    "key-chart-max": "ZGo to chart maximum valueZ",
    "key-level-decr": "ZGo down a levelZ",
    "key-level-incr": "ZGo up a levelZ",
    "key-speed-incr": "ZSpeed upZ",
    "key-speed-decr": "ZSlow downZ",
    "key-monitor-toggle": "ZToggle monitor modeZ",
    "key-dialog-help": "ZOpen help dialogZ",
    "key-dialog-options": "ZOpen options dialogZ",

    "options-title": "ZOptionsZ",
    "options-frontmatter":
        "ZWhile navigating this chart, you may find some sounds too low or too high to hear. Alternatively, you may want to expand the range of the sounds available. Use these sliders to adjust the range of sound:Z",
    "options-hertz-lower": "ZLower hertzZ",
    "options-hertz-upper": "ZUpper hertzZ",
    "options-speed-label": "ZPlay speed (aka, press 'Q' and 'E')Z",
    "options-set-global": "ZSave my options for other charts on this pageZ",
    "options-use-continuous": "ZUse continuous modeZ",
    "options-continuous-descr":
        "ZContinuous mode changes how values are played when you press Shift+Home and Shift+EndZ",
    "options-point-labels": "ZShow point labelsZ",
    "options-point-labels-before": `Zbefore values (eg: "ZCalifornia, 163,696 square miles, 39 million people" )Z`,
    "options-point-labels-after": `Zafter values (eg: "Z163,696 square miles, 39 million people, California" )`
};

export default dictionary;

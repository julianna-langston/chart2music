import type { translationDict } from ".";

const dictionary: translationDict = {
    description: "{title}, Sonified chart",
    updated: "{title} updated",
    "updated-untitled": "Chart updated",
    missing: "missing",
    close: "Close", // Used to close dialogs
    save: "Save", // Used to save settings in dialogs

    tooLow: "too low",
    tooHigh: "too high",
    nodeHasChildren: "has children",
    instructionArrows: "Use arrow keys to navigate.",
    instructionHierarchy: "Use Alt + Up and Down to navigate between levels.",
    instructionLive: "Press M to toggle monitor mode.",
    instructionHotkeys: "Press H for more hotkeys.",

    "summ-chart": "Sonified chart.",
    "summ-chart-live": "Sonified live chart.",
    "summ-chart-hier": "Sonified hierarchical chart.",
    "summ-chart-group": "Sonified chart with {groupCount} groups.",
    "summ-chart-title": `Sonified chart titled "{title}".`,
    "summ-chart-live-hier": "Sonified live hierarchical chart.",
    "summ-chart-live-group": `Sonified live chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    }.`,
    "summ-chart-live-title": `Sonified live chart titled "{title}".`,
    "summ-chart-hier-group": `Sonified hierarchical chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    }.`,
    "summ-chart-hier-title": `Sonified hierarchical chart titled "{title}".`,
    "summ-chart-group-title": `Sonified chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    } titled "{title}".`,
    "summ-chart-live-hier-group": `Sonified live hierarchical chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    }.`,
    "summ-chart-live-hier-title": `Sonified live hierarchical chart titled "{title}".`,
    "summ-chart-live-group-title": `Sonified live chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    } titled" {title}".`,
    "summ-chart-hier-group-title": `Sonified hierarchical chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    } titled "{title}".`,
    "summ-chart-live-hier-group-title": `Sonified live hierarchical chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    } titled "{title}".`,

    "axis-desc": `{letter} is "{label}" from {min} to {max}.`,
    "axis-desc-log": `{letter} is "{label}" from {min} to {max} logarithmic.`,
    "axis-desc-con": `{letter} is "{label}" from {min} to {max} continuously.`,
    "axis-desc-log-con": `{letter} is "{label}" from {min} to {max} logarithmic continuously.`,

    "kbr-speed": `Speed, {rate_in_ms}`,
    "kbr-not-live": "Not a live chart",
    monitoring:
        "Monitoring {switch, select, true {on} false {off} other {unknown}}",

    "group-unknown": `Group titled "{title}" uses an unsupported chart type.`,

    "chart-line": "Line chart.",
    "chart-bar": "Bar chart.",
    "chart-band": "Band chart.",
    "chart-pie": "Pie chart.",
    "chart-candlestick": "Candlestick chart.",
    "chart-histogram": "Histogram chart.",
    "chart-box": "Box chart.",
    "chart-matrix": "Matrix chart.",
    "chart-scatter": "Scatter chart.",
    "chart-treemap": "Treemap chart.",

    "chart-line-labeled": `Line chart showing "{label}".`,
    "chart-bar-labeled": `Bar chart showing "{label}".`,
    "chart-band-labeled": `Band chart showing "{label}".`,
    "chart-pie-labeled": `Pie chart showing "{label}".`,
    "chart-candlestick-labeled": `Candlestick chart showing "{label}".`,
    "chart-histogram-labeled": `Histogram showing "{label}".`,
    "chart-box-labeled": `Box plot showing "{label}".`,
    "chart-matrix-labeled": `Matrix plot showing "{label}".`,
    "chart-scatter-labeled": `Scatter plot showing "{label}".`,
    "chart-treemap-labeled": `Treemap chart showing "{label}".`,

    "stat-all": "All",
    // In Finance, OHLC (Open, High, Low, Close) charts are sometimes called candlestick charts.
    // https://en.wikipedia.org/wiki/Candlestick_chart
    "stat-open": "Open",
    "stat-high": "High",
    "stat-low": "Low",
    "stat-close": "Close",

    // For box plots
    "stat-q1": "Q1", // Quartile 1
    "stat-median": "Median",
    "stat-q3": "Q3",
    "stat-outlier": "Outlier",

    "point-xy": "{x}, {y}",
    "point-xohlc": "{x}, {open} - {high} - {low} - {close}",
    "point-outlier": "{x}, {y}, {index} of {count}",
    "point-xhl": "{x}, {high} - {low}",
    "point-xhl-outlier":
        "{x}, {high} - {low}, with {count, plural, =0 {no outliers} one {{count} outlier} other {{count} outliers}}",

    "info-open": "Open info dialog",
    "info-title": "Info",
    "info-notes": "Notes",

    "kbmg-title": "Keyboard Manager",
    "key-point-next": "Go to next point",
    "key-point-prev": "Go to previous point",
    "key-play-fwd": "Play right",
    "key-play-back": "Play left",
    "key-play-cancel": "Cancel play",
    "key-group-prev": "Go to previous group",
    "key-stat-prev": "Navigate to previous statistic",
    "key-group-next": "Go to next group",
    "key-stat-next": "Navigate to next statistic",
    "key-group-first": "Go to first group",
    "key-group-last": "Go to last group",
    "key-hier-root": "Go to root",
    "key-play-fwd-group": "Play forwards through groups",
    "key-play-back-group": "Play backwards through groups",
    "key-point-first": "Go to first point",
    "key-point-last": "Go to last point",
    "key-replay": "Replay",
    "key-select": "Select item",
    "key-tenth-prev": "Go backward by a tenth",
    "key-tenth-next": "Go forward by a tenth",
    "key-level-min": "Go to level minimum value",
    "key-level-max": "Go to level maximum value",
    "key-group-min": "Go to group minimum value",
    "key-group-max": "Go to group maximum value",
    "key-chart-min": "Go to chart minimum value",
    "key-chart-max": "Go to chart maximum value",
    "key-level-decr": "Go down a level",
    "key-level-incr": "Go up a level",
    "key-speed-incr": "Speed up",
    "key-speed-decr": "Slow down",
    "key-monitor-toggle": "Toggle monitor mode",
    "key-dialog-help": "Open help dialog",
    "key-dialog-options": "Open options dialog",

    "options-title": "Options",
    "options-frontmatter":
        "While navigating this chart, you may find some sounds too low or too high to hear. Alternatively, you may want to expand the range of the sounds available. Use these sliders to adjust the range of sound:",
    "options-hertz-lower": "Lower hertz",
    "options-hertz-upper": "Upper hertz",
    "options-speed-label": "Play speed (aka, press 'Q' and 'E')",
    "options-set-global": "Save my options for other charts on this page",
    "options-use-continuous": "Use continuous mode",
    "options-continuous-descr":
        "Continuous mode changes how values are played when you press Shift+Home and Shift+End",
    "options-point-labels": "Show point labels",
    "options-point-labels-before": `before values (eg: "California, 163,696 square miles, 39 million people" )`,
    "options-point-labels-after": `after values (eg: "163,696 square miles, 39 million people, California" )`
};

export default dictionary;

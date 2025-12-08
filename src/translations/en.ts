import type { translationDict } from ".";

const dictionary: translationDict = {
    description: "{title}, Sonified chart",
    "description-untitled": "Sonified chart",
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
    "summ-chart-group": `Sonified chart with {groupCount, plural,
        =0 {no groups}
        one {1 group}
        other {{groupCount} groups}
    }.`,
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
    "point-xy-label": "{announcePointLabelFirst, select, true {{label}, {x}, {y}} other {{x}, {y}, {label}}}",
    "point-xohlc": "{x}, {open} - {high} - {low} - {close}",
    "point-outlier": "{x}, {y}, {index} of {count}",
    "point-xhl": "{x}, {high} - {low}",
    "point-xhl-outlier": `{x}, {high} - {low}, with {count, plural,
        =0 {no outliers}
        one {{count} outlier}
        other {{count} outliers}
    }`,

    "info-open": "Open info dialog",
    "info-title": "Info",
    "info-notes": "Notes",

    "kbmg-title": "Keyboard Manager",
    "key-point-next": "Move to next point",
    "key-point-prev": "Move to previous point",
    "key-play-fwd": "Play to right edge of chart",
    "key-play-back": "Play to left edge of chart",
    "key-play-cancel": "Stop play",
    "key-group-prev": "Move to previous group",
    "key-stat-prev": "Move to previous statistic",
    "key-group-next": "Move to next group",
    "key-stat-next": "Move to next statistic",
    "key-group-first": "Move to first group",
    "key-group-last": "Move to last group",
    "key-hier-root": "Move to root",
    "key-play-fwd-group": "Play forwards through groups",
    "key-play-back-group": "Play backwards through groups",
    "key-point-first": "Move to left-most point",
    "key-point-last": "Move to right-most point",
    "key-replay": "Replay current point",
    "key-select": "Select item",
    "key-tenth-prev": "Move right by a tenth",
    "key-tenth-next": "Move left by a tenth",
    "key-level-min": "Move to level minimum value",
    "key-level-max": "Move to level maximum value",
    "key-group-min": "Move to group minimum value",
    "key-group-max": "Move to group maximum value",
    "key-chart-min": "Move to chart minimum value",
    "key-chart-max": "Move to chart maximum value",
    "key-level-decr": "Move down a level",
    "key-level-incr": "Move up a level",
    "key-speed-incr": "Increase playback speed",
    "key-speed-decr": "Decrease playback speed",
    "key-monitor-toggle": "Toggle monitor mode",
    "key-dialog-help": "Open help dialog",
    "key-dialog-options": "Open options dialog",
    "key-descr-ArrowRight": "Right arrow",
    "key-descr-ArrowLeft": "Left arrow",
    "key-descr-alt-Home": "Function + Left arrow",
    "key-descr-alt-End": "Function + Right arrow",
    "key-descr-Shift+End": "Shift + End",
    "key-descr-alt-Shift+End": "Shift + Function + Right arrow",
    "key-descr-Shift+Home": "Shift + Home",
    "key-descr-alt-Shift+Home": "Shift + Function + Left arrow",
    "key-descr-ctrl": "Control",
    "key-descr-spacebar": "Spacebar",
    "key-descr-Ctrl+ArrowRight": "Control + Right arrow",
    "key-descr-Ctrl+ArrowLeft": "Control + Left arrow",
    "key-descr-ArrowDown": "Down arrow",
    "key-descr-ArrowUp": "Up arrow",
    "key-descr-PageUp": "Page up",
    "key-descr-PageDown": "Page down",
    "key-descr-alt-PageUp": "Function + Up arrow",
    "key-descr-alt-PageDown": "Function + Down arrow",
    "key-descr-Alt+PageUp": "Alt + Page up",
    "key-descr-alt-Alt+PageUp": "Option + Function + Up arrow",
    "key-descr-Alt+PageDown": "Alt + Page down",
    "key-descr-alt-Alt+PageDown": "Option + Function + Down arrow",
    "key-descr-Shift+PageDown": "Shift + Page down",
    "key-descr-alt-Shift+PageDown": "Shift + Function + Down arrow",
    "key-descr-Shift+PageUp": "Shift + Page up",
    "key-descr-alt-Shift+PageUp": "Shift + Function + Up arrow",
    "key-descr-Ctrl+[": "Control + [",
    "key-descr-Ctrl+]": "Control + ]",
    "key-descr-Alt+ArrowDown": "Alt + Down arrow",
    "key-descr-Alt+ArrowUp": "Alt + Up arrow",

    "help-dialog-front-matter":
        "You can use the below keyboard shortcuts to navigate this chart more quickly. Please note, on some computers, the keys that you need to press may be called something else than what is listed below or may be emulated by a combination of keys. For example, on Apple keyboards without a physical home key, you can press the function key and the left arrow key at the same time to perform the same action. When possible, common alternate keyboard shortcuts will be provided in the below table.",
    "help-dialog-footer":
        "For information on making charts accessible and additional help, please visit ",

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

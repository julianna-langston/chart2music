import type { translationDict } from ".";

const dictionary: translationDict = {
    description: "{title}, Sonifizierte Grafik",
    "description-untitled": "Sonifizierte Grafik",
    updated: "{title} aktualisiert",
    "updated-untitled": "Aktualisierte Grafik",
    missing: "fehlt",
    close: "Schliessen", // Used to close dialogs
    save: "Speichern", // Used to save settings in dialogs

    tooLow: "zu tief",
    tooHigh: "zu hoch",
    nodeHasChildren: "hat Kinder",
    instructionArrows: "Verwenden Sie die Pfeiltasten zum Navigieren.",
    instructionHierarchy:
        "Verwenden Sie Alt+Up und Down, um zwischen den Ebenen zu navigieren.",
    instructionLive: "Drücken Sie M, um den Anzeigemodus zu wechseln.",
    instructionHotkeys: "Drücken Sie H für weitere Tastaturbefehle.",

    "summ-chart": "Sonifizierte Grafik.",
    "summ-chart-live": "Sonifizierte Live-Grafik.",
    "summ-chart-hier": "Sonifizierte hierarchische Grafik.",
    "summ-chart-group": `Sonifizierte Grafik mit {groupCount, plural,
        =0 {keinen Gruppen}
        one {1 Gruppe}
        other {{groupCount} Gruppen}
    }.`,
    "summ-chart-title": 'Sonifizierte Grafik mit dem Titel "{title}".',
    "summ-chart-live-hier": "Sonifizierte hierarchische Live-Grafik.",
    "summ-chart-live-group": `Sonifizierte Live-Grafik mit {groupCount, plural,
        =0 {keinen Gruppen}
        one {1 Gruppe}
        other {{groupCount} Gruppen}
    }.`,
    "summ-chart-live-title":
        'Sonifizierte Live-Grafik mit dem Titel "{title}".',
    "summ-chart-hier-group": `Sonifizierte hierarchische Grafik mit {groupCount, plural,
        =0 {keinen Gruppen}
        one {1 Gruppe}
        other {{groupCount} Gruppen}
    }.`,
    "summ-chart-hier-title":
        'Sonifizierte hierarchische Grafik mit dem Titel "{title}".',
    "summ-chart-group-title": `Sonifizierte Grafik mit {groupCount, plural,
        =0 {keinen Gruppen}
        one {1 Gruppe}
        other {{groupCount} Gruppen}
    } mit dem Titel "{title}".`,
    "summ-chart-live-hier-group": `Sonifizierte hierarchische Live-Grafik mit {groupCount, plural,
        =0 {keinen Gruppen}
        one {1 Gruppe}
        other {{groupCount} Gruppen}
    }.`,
    "summ-chart-live-hier-title":
        'Sonifizierte hierarchische Live-Grafik mit dem Titel "{title}".',
    "summ-chart-live-group-title": `Sonifizierte Live-Grafik mit {groupCount, plural,
        =0 {keinen Gruppen}
        one {1 Gruppe}
        other {{groupCount} Gruppen}
    } mit dem Titel "{title}".`,
    "summ-chart-hier-group-title": `Sonifizierte hierarchische Grafik mit {groupCount, plural,
        =0 {keinen Gruppen}
        one {1 Gruppe}
        other {{groupCount} Gruppen}
    } mit dem Titel "{title}".`,
    "summ-chart-live-hier-group-title": `Sonifizierte hierarchische Live-Grafik mit {groupCount, plural,
        =0 {keinen Gruppen}
        one {1 Gruppe}
        other {{groupCount} Gruppen}
    } mit dem Titel "{title}".`,

    "axis-desc": '{letter} ist "{label}" von {min} bis {max}.',
    "axis-desc-log":
        '{letter} ist "{label}" von {min} bis {max} logarithmisch.',
    "axis-desc-con":
        '{letter} ist "{label}" von {min} bis {max} kontinuierlich.',
    "axis-desc-log-con":
        '{letter} ist "{label}" von {min} bis {max} kontinuierlich logarithmisch.',

    "kbr-speed": "Geschwindigkeit, {rate_in_ms},",
    "kbr-not-live": "Keine Live-Grafik",
    monitoring:
        "Monitoring {switch, select, true {eingeschaltet} false {ausgeschaltet} other {unbekannt}}",

    "group-unknown":
        'Die Gruppe mit dem Titel "{Titel}" verwendet einen nicht unterstützten Diagrammtyp.',

    "chart-line": "Liniendiagramm",
    "chart-bar": "Balkendiagramm",
    "chart-band": "Banddiagramm",
    "chart-pie": "Kreisdiagramm",
    "chart-candlestick": "Kerzendiagramm",
    "chart-histogram": "Histogramm",
    "chart-box": "Kastendiagramm",
    "chart-matrix": "Matrixdiagramm",
    "chart-scatter": "Streudiagramm",
    "chart-treemap": "Kacheldiagramm",

    "chart-line-labeled": 'Liniendiagramm zeigt "{label}".',
    "chart-bar-labeled": 'Balkendiagramm zeigt "{label}".',
    "chart-band-labeled": 'Banddiagramm zeigt "{label}".',
    "chart-pie-labeled": 'Kreisdiagramm zeigt "{label}".',
    "chart-candlestick-labeled": 'Kerzendiagramm zeigt "{label}".',
    "chart-histogram-labeled": 'Histogramm zeigt "{label}".',
    "chart-box-labeled": 'Kastendiagramm zeigt "{label}".',
    "chart-matrix-labeled": 'Matrixdiagramm zeigt "{label}".',
    "chart-scatter-labeled": 'Streudiagramm zeigt "{label}".',
    "chart-treemap-labeled": 'Kacheldiagramm zeigt "{label}".',

    "stat-all": "Alles",
    // In Finance, OHLC (Open, High, Low, Close) charts are sometimes called candlestick charts.
    // https://en.wikipedia.org/wiki/Candlestick_chart
    "stat-open": "Öffnen",
    "stat-high": "Hoch",
    "stat-low": "Tief",
    "stat-close": "Schliessen",

    // For box plots
    "stat-q1": "Q1", // Quartile 1
    "stat-median": "Median",
    "stat-q3": "Q3",
    "stat-outlier": "Ausreisser",

    "point-xy": "{x}, {y}",
    "point-xy-label":
        "{announcePointLabelFirst, select, true {{label}, {x}, {y}} other {{x}, {y}, {label}}}",
    "point-xohlc": "{x}, {open} - {high} - {low} - {close}",
    "point-outlier": "{x}, {y}, {index} von {count}",
    "point-xhl": "{x}, {high} - {low}",
    "point-xhl-outlier": `{x}, {high} - {low}, mit {count, plural,
        =0 {keinem Ausreisser}
        one {{count} Ausreisser}
        other {{count} Ausreissern}
    }`,

    "info-open": "Info öffnen",
    "info-title": "Info",
    "info-notes": "Kommentare",

    "kbmg-title": "Tastatur-Manager",
    "key-point-next": "Zum nächsten Punkt wechseln",
    "key-point-prev": "Zum vorangehenden Punkt wechseln",
    "key-play-fwd": "Nach rechts wiedergeben",
    "key-play-back": "Nach links wiedergeben",
    "key-play-cancel": "Wiedergabe abbrechen",
    "key-group-prev": "Zur vorangehenden Gruppe wechseln ",
    "key-stat-prev": "Zur vorangehenden Statistik wechseln",
    "key-group-next": "Zur nächsten Gruppe wechseln",
    "key-stat-next": "Zur nächsten Statistik wechseln",
    "key-group-first": "Zur ersten Gruppe wechseln",
    "key-group-last": "Zur letzten Gruppe wechseln",
    "key-hier-root": "Zum Anfangselement zurückkehren",
    "key-play-fwd-group": "Gruppen vorwärts wiedergeben",
    "key-play-back-group": "Gruppen rückwärts wiedergeben",
    "key-point-first": "Zum ersten Punkt wechseln",
    "key-point-last": "Zum letzten Punkt wechseln",
    "key-replay": "Erneut wiedergeben",
    "key-select": "Element auswählen",
    "key-tenth-prev": "Um einen Zehntel zurückgehen",
    "key-tenth-next": "Um einen Zehntel vorwärts gehen",
    "key-level-min": "Zum tiefsten Wert der Ebene wechseln",
    "key-level-max": "Zum höchsten Wert der Ebene wechseln",
    "key-group-min": "Zum tiefsten Wert der Gruppe wechseln",
    "key-group-max": "Zum höchsten Wert der Gruppe wechseln",
    "key-chart-min": "Zum tiefsten Wert der Grafik wechseln ",
    "key-chart-max": "Zum höchsten Wert der Grafik wechseln ",
    "key-level-decr": "Eine Ebene nach unten gehen",
    "key-level-incr": "Eine Ebene nach oben gehen",
    "key-speed-incr": "Schneller",
    "key-speed-decr": "Langsamer",
    "key-monitor-toggle": "Anzeigemodus wechseln",
    "key-dialog-help": "Hilfe öffnen",
    "key-dialog-options": "Optionen öffnen",

    "options-title": "Optionen",
    "options-frontmatter":
        "Beim Navigieren in dieser Grafik kann es vorkommen, dass Sie einige Töne zu leise oder zu laut hören. Alternativ können Sie den Klangbereich mit diesen Schiebereglern erweitern:",
    "options-hertz-lower": "Tiefen",
    "options-hertz-upper": "Höhen",
    "options-speed-label": "Wiedergabegeschwindigkeit («Q» und «E» drücken)",
    "options-set-global":
        "Meine Optionen für andere Grafiken auf dieser Seite speichern",
    "options-use-continuous": "Dauermodus verwenden",
    "options-continuous-descr":
        "Im Dauermodus ändert sich die Wiedergabe der Werte, wenn Sie Umschalt+Home und Umschalt+End drücken.",
    "options-point-labels": "Punkt-Labels anzeigen:",
    "options-point-labels-before":
        "vor den Werten (z. B. «Kalifornien, 423’970 km², 39 Mio. Einwohner»)",
    "options-point-labels-after":
        "nach den Werten (z. B. «423’970 km², 39 Mio. Einwohner, Kalifornien»)"
};

export default dictionary;

import type { translationDict } from ".";

const dictionary: translationDict = {
    description: "{title}, grafico sonificato",
    "description-untitled": "Grafico sonificato",
    updated: "{title} aggiornato",
    "updated-untitled": "Grafico aggiornato",
    missing: "mancante",
    close: "Chiudi", // Used to close dialogs
    save: "Salva", // Used to save settings in dialogs

    tooLow: "troppo grave",
    tooHigh: "troppo acuto",
    nodeHasChildren: "ha figli",
    instructionArrows: "Usa le frecce per navigare.",
    instructionHierarchy:
        "Premi Alt + freccia su e freccia giù per passare da un livello all’altro.",
    instructionLive: "Premi M per cambiare modalità di visualizzazione.",
    instructionHotkeys: "Premi H per mostrare altre scorciatoie da tastiera.",

    "summ-chart": "Grafico sonificato.",
    "summ-chart-live": "Grafico sonificato in tempo reale.",
    "summ-chart-hier": "Grafico gerarchico sonificato.",
    "summ-chart-group": `Grafico sonificato con {groupCount, plural,
        =0 {nessun gruppo}
        one {un gruppo}
        other {{groupCount} gruppi}
    }.`,
    "summ-chart-title": 'Grafico sonificato intitolato "{title}".',
    "summ-chart-live-hier": "Grafico gerarchico sonificato in tempo reale.",
    "summ-chart-live-group": `Grafico sonificato in tempo reale con {groupCount, plural,
        =0 {nessun gruppo}
        one {un gruppo}
        other {{groupCount} gruppi}
    }.`,
    "summ-chart-live-title":
        'Grafico sonificato in tempo reale intitolato "{title}".',
    "summ-chart-hier-group": `Grafico gerarchico sonificato con {groupCount, plural,
        =0 {nessun gruppo}
        one {un gruppo}
        other {{groupCount} gruppi}
    }.`,
    "summ-chart-hier-title":
        'Grafico gerarchico sonificato intitolato "{title}".',
    "summ-chart-group-title": `Grafico sonificato con {groupCount, plural,
        =0 {nessun gruppo}
        one {un gruppo}
        other {{groupCount} gruppi}
    } intitolato "{title}".`,
    "summ-chart-live-hier-group": `Grafico gerarchico sonificato in tempo reale con {groupCount, plural,
        =0 {nessun gruppo}
        one {un gruppo}
        other {{groupCount} gruppi}
    }.`,
    "summ-chart-live-hier-title":
        'Grafico gerarchico sonificato in tempo reale intitolato "{title}".',
    "summ-chart-live-group-title": `Grafico sonificato in tempo reale con {groupCount, plural,
        =0 {nessun gruppo}
        one {un gruppo}
        other {{groupCount} gruppi}
    } intitolato "{title}".`,
    "summ-chart-hier-group-title": `Grafico gerarchico sonificato con {groupCount, plural,
        =0 {nessun gruppo}
        one {un gruppo}
        other {{groupCount} gruppi}
    } intitolato "{title}".`,
    "summ-chart-live-hier-group-title": `Grafico gerarchico sonificato in tempo reale con {groupCount, plural,
        =0 {nessun gruppo}
        one {un gruppo}
        other {{groupCount} gruppi}
    } intitolato "{title}".`,

    "axis-desc": '{letter} è "{label}" da {min} a {max}.',
    "axis-desc-log": '{letter} è "{label}" da {min} a {max} logaritmico.',
    "axis-desc-con":
        '{letter} è "{label}" da {min} a {max} in maniera continua.',
    "axis-desc-log-con":
        '{letter} è "{label}" da {min} a {max} logaritmico in maniera continua.',

    "kbr-speed": "Velocità, {rate_in_ms}",
    "kbr-not-live": "Non è un grafico in tempo reale",
    monitoring:
        "Monitoraggio {switch, select, true {attivato} false {disattivato} other {sconosciuto}}",

    "group-unknown":
        'Il gruppo intitolato "{title}" usa un tipo di grafico non supportato.',

    "chart-line": "Grafico a linee.",
    "chart-bar": "Ortogramma.",
    "chart-band": "Grafico a barre.",
    "chart-pie": "Diagramma a torta.",
    "chart-candlestick": "Candlestick.",
    "chart-histogram": "Istogramma.",
    "chart-box": "Diagramma a scatola e baffi.\n​",
    "chart-matrix": "Grafico a matrice.",
    "chart-scatter": "Grafico a dispersione.",
    "chart-treemap": "Treemap.",

    "chart-line-labeled": 'Grafico a linee che mostra "{label}".',
    "chart-bar-labeled": 'Ortogramma che mostra "{label}".',
    "chart-band-labeled": 'Grafico a barre che mostra "{label}".',
    "chart-pie-labeled": 'Diagramma a torta che mostra "{label}".',
    "chart-candlestick-labeled": 'Candlestick che mostra "{label}".',
    "chart-histogram-labeled": 'Istogramma che mostra "{label}".',
    "chart-box-labeled": 'Diagramma a scatola e baffi che mostra "{label}".',
    "chart-matrix-labeled": 'Grafico a matrice che mostra "{label}".',
    "chart-scatter-labeled": 'Grafico a dispersione che mostra "{label}".',
    "chart-treemap-labeled": 'Treemap che mostra "{label}".',

    "stat-all": "Tutto",
    // In Finance, OHLC (Open, High, Low, Close) charts are sometimes called candlestick charts.
    // https://en.wikipedia.org/wiki/Candlestick_chart
    "stat-open": "Apri",
    "stat-high": "Acuto",
    "stat-low": "Grave",
    "stat-close": "Chiudi",

    // For box plots
    "stat-q1": "Q1", // Quartile 1
    "stat-median": "Mediana",
    "stat-q3": "Q3",
    "stat-outlier": "Outlier",

    "point-xy": "{x}, {y}",
    "point-xy-label":
        "{announcePointLabelFirst, select, true {{label}, {x}, {y}} other {{x}, {y}, {label}}}",
    "point-xohlc": "{x}, {open} - {high} - {low} - {close}",
    "point-outlier": "{x}, {y}, {index} di {count}",
    "point-xhl": "{x}, {high} - {low}",
    "point-xhl-outlier": `{x}, {high} - {low}, con {count, plural,
        =0 {nessun outlier}
        one {{count} outlier}
        other {{count} outlier}
    }`,

    "info-open": "Apri info",
    "info-title": "Info",
    "info-notes": "Commenti",

    "kbmg-title": "Gestione tastiera",
    "key-point-next": "Vai al punto successivo",
    "key-point-prev": "Vai al punto precedente",
    "key-play-fwd": "Riproduci verso destra",
    "key-play-back": "Riproduci verso sinistra",
    "key-play-cancel": "Interrompi riproduzione",
    "key-group-prev": "Vai al gruppo precedente",
    "key-stat-prev": "Vai a statistica precedente",
    "key-group-next": "Vai al gruppo successivo",
    "key-stat-next": "Vai alla prossima statistica",
    "key-group-first": "Vai al primo gruppo",
    "key-group-last": "Vai all’ultimo gruppo",
    "key-hier-root": "Vai al primo elemento",
    "key-play-fwd-group": "Riproduci i gruppi procedendo in avanti",
    "key-play-back-group": "Riproduci i gruppi procedendo indietro",
    "key-point-first": "Vai al primo punto",
    "key-point-last": "Vai all’ultimo punto",
    "key-replay": "Riproduci di nuovo",
    "key-select": "Seleziona elemento",
    "key-tenth-prev": "Retrocedi di un decimo",
    "key-tenth-next": "Avanza di un decimo",
    "key-level-min": "Vai al valore minimo del livello",
    "key-level-max": "Vai al valore massimo del livello",
    "key-group-min": "Vai al valore minimo del gruppo",
    "key-group-max": "Vai al valore massimo del gruppo",
    "key-chart-min": "Vai al valore minimo del grafico",
    "key-chart-max": "Vai al valore massimo del grafico",
    "key-level-decr": "Scendi di un livello",
    "key-level-incr": "Sali di un livello",
    "key-speed-incr": "Aumenta velocità",
    "key-speed-decr": "Diminuisci velocità",
    "key-monitor-toggle": "Cambia modalità di visualizzazione",
    "key-dialog-help": "Apri finestra di aiuto",
    "key-dialog-options": "Apri opzioni",

    "options-title": "Opzioni",
    "options-frontmatter":
        "Durante la navigazione nel grafico, alcuni suoni potrebbero essere troppo gravi o troppo acuti per essere sentiti. In questo caso, si può espandere la gamma di suoni disponibili utilizzando i cursori seguenti:",
    "options-hertz-lower": "Toni gravi",
    "options-hertz-upper": "Toni acuti",
    "options-speed-label": "Velocità di riproduzione (premi Q ed E)",
    "options-set-global": "Salva le opzioni per altri grafici della pagina",
    "options-use-continuous": "Utilizza la modalità continua",
    "options-continuous-descr":
        "La modalità continua cambia il modo in cui i valori vengono riprodotti con le combinazioni Shift+Home e Shift+End",
    "options-point-labels": "Mostra etichette del punto",
    "options-point-labels-before":
        'prima dei valori (p. es. "California, 423 970 chilometri quadrati, 39 milioni di persone")',
    "options-point-labels-after":
        'dopo i valori (p. es. "423 970 chilometri quadrati, 39 milioni di persone, California")'
};

export default dictionary;

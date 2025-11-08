import type { translationDict } from ".";

const dictionary: translationDict = {
    description: "{title}, daim kab kos siv suab",
    "description-untitled": "Daim kab kos siv suab",
    updated: "{title} hloov tshiab",
    "updated-untitled": "Daim kab kos hloov tshiab",
    missing: "ploj lawm",
    close: "Kaw",
    save: "Tseg",

    tooLow: "tsawg dhau",
    tooHigh: "siab dhau",
    nodeHasChildren: "muaj menyuam kab",
    instructionArrows: "Siv tus yuam sij xub los txav.",
    instructionHierarchy: "Siv Alt + xub nce lossis nqis los hloov qib.",
    instructionLive: "Nias M los hloov hom saib ncaj qha.",
    instructionHotkeys: "Nias H kom pom cov yuam sij ntxiv.",

    "summ-chart": "Daim kab kos siv suab.",
    "summ-chart-live": "Daim kab kos siv suab ncaj qha.",
    "summ-chart-hier": "Daim kab kos siv suab muaj ntau qib.",
    "summ-chart-group": `Daim kab kos siv suab muaj {groupCount, plural,
        =0 {tsis muaj pab}
        one {1 pab}
        other {{groupCount} pab}
    }.`,
    "summ-chart-title": `Daim kab kos siv suab hu ua "{title}".`,
    "summ-chart-live-hier": "Daim kab kos siv suab muaj ntau qib ncaj qha.",
    "summ-chart-live-group": `Daim kab kos siv suab ncaj qha muaj {groupCount, plural,
        =0 {tsis muaj pab}
        one {1 pab}
        other {{groupCount} pab}
    }.`,
    "summ-chart-live-title": `Daim kab kos siv suab ncaj qha hu ua "{title}".`,
    "summ-chart-hier-group": `Daim kab kos siv suab muaj ntau qib muaj {groupCount, plural,
        =0 {tsis muaj pab}
        one {1 pab}
        other {{groupCount} pab}
    }.`,
    "summ-chart-hier-title": `Daim kab kos siv suab muaj ntau qib hu ua "{title}".`,
    "summ-chart-group-title": `Daim kab kos siv suab muaj {groupCount, plural,
        =0 {tsis muaj pab}
        one {1 pab}
        other {{groupCount} pab}
    } hu ua "{title}".`,
    "summ-chart-live-hier-group": `Daim kab kos siv suab muaj ntau qib ncaj qha muaj {groupCount, plural,
        =0 {tsis muaj pab}
        one {1 pab}
        other {{groupCount} pab}
    }.`,
    "summ-chart-live-hier-title": `Daim kab kos siv suab muaj ntau qib ncaj qha hu ua "{title}".`,
    "summ-chart-live-group-title": `Daim kab kos siv suab ncaj qha muaj {groupCount, plural,
        =0 {tsis muaj pab}
        one {1 pab}
        other {{groupCount} pab}
    } hu ua "{title}".`,
    "summ-chart-hier-group-title": `Daim kab kos siv suab muaj ntau qib muaj {groupCount, plural,
        =0 {tsis muaj pab}
        one {1 pab}
        other {{groupCount} pab}
    } hu ua "{title}".`,
    "summ-chart-live-hier-group-title": `Daim kab kos siv suab muaj ntau qib ncaj qha muaj {groupCount, plural,
        =0 {tsis muaj pab}
        one {1 pab}
        other {{groupCount} pab}
    } hu ua "{title}".`,

    "axis-desc": `{letter} yog "{label}" txij {min} mus {max}.`,
    "axis-desc-log": `{letter} yog "{label}" txij {min} mus {max} logarithmic.`,
    "axis-desc-con": `{letter} yog "{label}" txij {min} mus {max} txuas ntxiv.`,
    "axis-desc-log-con": `{letter} yog "{label}" txij {min} mus {max} logarithmic txuas ntxiv.`,

    "kbr-speed": `Ceev, {rate_in_ms}`,
    "kbr-not-live": "Tsis yog daim kab kos ncaj qha",
    monitoring:
        "Saib xyuas {switch, select, true {qhib} false {tawm} other {tsis paub}}",

    "group-unknown": `Pab hu ua "{title}" siv hom kab kos tsis txhawb.`,

    "chart-line": "Kab kos kab.",
    "chart-bar": "Kab kos kab ntev.",
    "chart-band": "Kab kos band.",
    "chart-pie": "Kab kos ncuav.",
    "chart-candlestick": "Kab kos teeb tswm ciab.",
    "chart-histogram": "Kab kos histogram.",
    "chart-box": "Kab kos lub thawv.",
    "chart-matrix": "Kab kos matrix.",
    "chart-scatter": "Kab kos tawg.",
    "chart-treemap": "Kab kos ntoo daim ntawv.",

    "chart-line-labeled": `Kab kos kab qhia "{label}".`,
    "chart-bar-labeled": `Kab kos kab ntev qhia "{label}".`,
    "chart-band-labeled": `Kab kos band qhia "{label}".`,
    "chart-pie-labeled": `Kab kos ncuav qhia "{label}".`,
    "chart-candlestick-labeled": `Kab kos teeb tswm ciab qhia "{label}".`,
    "chart-histogram-labeled": `Kab kos histogram qhia "{label}".`,
    "chart-box-labeled": `Kab kos lub thawv qhia "{label}".`,
    "chart-matrix-labeled": `Kab kos matrix qhia "{label}".`,
    "chart-scatter-labeled": `Kab kos tawg qhia "{label}".`,
    "chart-treemap-labeled": `Kab kos ntoo daim ntawv qhia "{label}".`,

    "stat-all": "Txhua yam",
    "stat-open": "Qhib",
    "stat-high": "Siab tshaj",
    "stat-low": "Tsawg tshaj",
    "stat-close": "Kaw",

    "stat-q1": "Q1",
    "stat-median": "Nruab nrab",
    "stat-q3": "Q3",
    "stat-outlier": "Tawm txawv",

    "point-xy": "{x}, {y}",
    "point-xohlc": "{x}, {open} - {high} - {low} - {close}",
    "point-outlier": "{x}, {y}, {index} ntawm {count}",
    "point-xhl": "{x}, {high} - {low}",
    "point-xhl-outlier": `{x}, {high} - {low}, nrog {count, plural,
        =0 {tsis muaj txawv}
        one {{count} qhov txawv}
        other {{count} qhov txawv}
    }`,

    "info-open": "Qhib ntaub ntawv",
    "info-title": "Ntaub ntawv",
    "info-notes": "Nco tseg",

    "kbmg-title": "Tus tswj keyboard",
    "key-point-next": "Txav mus rau qhov tom ntej",
    "key-point-prev": "Txav mus rau qhov dhau los",
    "key-play-fwd": "Qhib suab mus rau sab xis",
    "key-play-back": "Qhib suab rov qab rau sab laug",
    "key-play-cancel": "Tso tseg kev qhib suab",
    "key-group-prev": "Txav mus rau pab dhau los",
    "key-stat-prev": "Txav mus rau yam dhau los",
    "key-group-next": "Txav mus rau pab tom ntej",
    "key-stat-next": "Txav mus rau yam tom ntej",
    "key-group-first": "Txav mus rau pab thawj",
    "key-group-last": "Txav mus rau pab kawg",
    "key-hier-root": "Txav mus rau hauv paus",
    "key-play-fwd-group": "Qhib suab mus rau hauv cov pab",
    "key-play-back-group": "Qhib suab rov qab hauv cov pab",
    "key-point-first": "Txav mus rau qhov pib",
    "key-point-last": "Txav mus rau qhov kawg",
    "key-replay": "Qhib suab tam sim no dua",
    "key-select": "Xaiv yam khoom",
    "key-tenth-prev": "Txav sab laug me ntsis",
    "key-tenth-next": "Txav sab xis me ntsis",
    "key-level-min": "Mus rau tus nqi tsawg tshaj",
    "key-level-max": "Mus rau tus nqi siab tshaj",
    "key-group-min": "Mus rau tus nqi tsawg tshaj hauv pab",
    "key-group-max": "Mus rau tus nqi siab tshaj hauv pab",
    "key-chart-min": "Mus rau tus nqi tsawg tshaj ntawm daim kab kos",
    "key-chart-max": "Mus rau tus nqi siab tshaj ntawm daim kab kos",
    "key-level-decr": "Nqes ib qib",
    "key-level-incr": "Nce ib qib",
    "key-speed-incr": "Nce ceev qhib suab",
    "key-speed-decr": "Txo ceev qhib suab",
    "key-monitor-toggle": "Hloov hom saib xyuas",
    "key-dialog-help": "Qhib kev pab",
    "key-dialog-options": "Qhib kev xaiv",

    // Key names stay in English for clarity
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
        "Koj siv tau cov yuam sij hauv qab no los txav sai dua hauv daim kab kos. Qee lub keyboard yuav hu txawv lossis siv ob peb tus yuam sij ua ke. Piv txwv, rau Apple keyboard tsis muaj Home, siv Function + xub laug. Thaum ua tau, lwm txoj kev xaiv yuav raug qhia hauv qab no.",
    "help-dialog-footer":
        "Rau kev paub ntxiv txog kev nkag tau ntawm daim kab kos, thov mus xyuas ",

    "options-title": "Kev xaiv",
    "options-frontmatter":
        "Yog qee lub suab tsawg dhau lossis siab dhau, siv cov sliders no los kho suab nrov thiab siab:",
    "options-hertz-lower": "Hz qis dua",
    "options-hertz-upper": "Hz siab dua",
    "options-speed-label": "Ceev qhib suab (nias 'Q' thiab 'E')",
    "options-set-global": "Tseg kuv qhov kev xaiv rau lwm daim kab kos",
    "options-use-continuous": "Siv hom txuas ntxiv",
    "options-continuous-descr":
        "Hom txuas ntxiv hloov txoj kev qhib suab thaum nias Shift+Home thiab Shift+End",
    "options-point-labels": "Qhia npe ntawm cov ntsiab lus",
    "options-point-labels-before": `ua ntej tus nqi (piv txwv: "California, 163,696 square miles, 39 million people")`,
    "options-point-labels-after": `tom qab tus nqi (piv txwv: "163,696 square miles, 39 million people, California")`
};

export default dictionary;

import type { translationDict } from ".";

const dictionary: translationDict = {
    description: "{title}, graphique sonifié",
    "description-untitled": "Graphique sonifié",
    updated: "{title} mis à jour",
    "updated-untitled": "Graphique mis à jour",
    missing: "manquant",
    close: "Fermer", // Used to close dialogs
    save: "Enregistrer", // Used to save settings in dialogs

    tooLow: "trop grave",
    tooHigh: "trop aigu",
    nodeHasChildren: "a des enfants",
    instructionArrows: "Utilisez les flèches pour naviguer.",
    instructionHierarchy:
        "Utilisez Alt + Up et Down pour naviguer d’un niveau à l’autre.",
    instructionLive: "Pressez M pour changer de mode d’affichage.",
    instructionHotkeys:
        "Pressez H pour afficher d’autres touches de raccourci.",

    "summ-chart": "Graphique sonifié.",
    "summ-chart-live": "Graphique sonifié en direct.",
    "summ-chart-hier": "Graphique hiérarchique sonifié.",
    "summ-chart-group": `Graphique sonifié avec {groupCount, plural,
        =0 {aucun groupe}
        one {un groupe}
        other {{groupCount} groupes}
    }.`,
    "summ-chart-title": 'Graphique sonifié intitulé "{title}".',
    "summ-chart-live-hier": "Graphique hiérarchique sonifié en direct.",
    "summ-chart-live-group": `Graphique sonifié en direct avec {groupCount, plural,
        =0 {aucun groupe}
        one {un groupe}
        other {{groupCount} groupes}
    }.`,
    "summ-chart-live-title": 'Graphique sonifié en direct intitulé "{title}".',
    "summ-chart-hier-group": `Graphique hiérarchique sonifié avec {groupCount, plural,
        =0 {aucun groupe}
        one {un groupe}
        other {{groupCount} groupes}
    }.`,
    "summ-chart-hier-title":
        'Graphique hiérarchique sonifié intitulé "{title}".',
    "summ-chart-group-title": `Graphique sonifié avec {groupCount, plural,
        =0 {aucun groupe}
        one {un groupe}
        other {{groupCount} groupes}
    } intitulé "{title}".`,
    "summ-chart-live-hier-group": `Graphique hiérarchique sonifié en direct avec {groupCount, plural,
        =0 {aucun groupe}
        one {un groupe}
        other {{groupCount} groupes}
    }.`,
    "summ-chart-live-hier-title":
        'Graphique hiérarchique sonifié en direct intitulé "{title}".',
    "summ-chart-live-group-title": `Graphique sonifié en direct avec {groupCount, plural,
        =0 {aucun groupe}
        one {un groupe}
        other {{groupCount} groupes}
    } intitulé "{title}".`,
    "summ-chart-hier-group-title": `Graphique hiérarchique sonifié avec {groupCount, plural,
        =0 {aucun groupe}
        one {un groupe}
        other {{groupCount} groupes}
    } intitulé "{title}".`,
    "summ-chart-live-hier-group-title": `Graphique hiérarchique sonifié en direct avec {groupCount, plural,
        =0 {aucun groupe}
        one {un groupe}
        other {{groupCount} groupes}
    } intitulé "{title}".`,

    "axis-desc": '{letter} est "{label}" de {min} à {max}.',
    "axis-desc-log": '{letter} est "{label}" de {min} à {max} logarithmique.',
    "axis-desc-con": '{letter} est "{label}" de {min} à {max} en continu.',
    "axis-desc-log-con":
        '{letter} est "{label}" de {min} à {max} logarithmique en continu.',

    "kbr-speed": "Vitesse, {rate_in_ms}",
    "kbr-not-live": "Pas un graphique en direct",
    monitoring:
        "Monitoring {switch, select, true {activé} false {désactivé} other {inconnu}}",

    "group-unknown":
        'Le groupe intitulé "{title}" utilise un type de graphique incompatible.',

    "chart-line": "Graphique linéaire.",
    "chart-bar": "Graphique à barres.",
    "chart-band": "Graphique à bandes.",
    "chart-pie": "Camembert.",
    "chart-candlestick": "Graphique en chandeliers.",
    "chart-histogram": "Histogramme.",
    "chart-box": "Graphique en boîtes.",
    "chart-matrix": "Graphique matriciel.",
    "chart-scatter": "Nuage de points.",
    "chart-treemap": "Graphique treemap.",

    "chart-line-labeled": 'Graphique linéaire montrant "{label}".',
    "chart-bar-labeled": 'Graphique à barres montrant "{label}".',
    "chart-band-labeled": 'Graphique à bandes montrant "{label}".',
    "chart-pie-labeled": 'Camembert montrant "{label}".',
    "chart-candlestick-labeled": 'Graphique en chandeliers montrant "{label}".',
    "chart-histogram-labeled": 'Histogramme montrant "{label}".',
    "chart-box-labeled": 'Graphique en boîtes montrant "{label}".',
    "chart-matrix-labeled": 'Graphique matriciel montrant "{label}".',
    "chart-scatter-labeled": 'Nuage de points montrant "{label}".',
    "chart-treemap-labeled": 'Graphique treemap montrant "{label}".',

    "stat-all": "Tout",
    // In Finance, OHLC (Open, High, Low, Close) charts are sometimes called candlestick charts.
    // https://en.wikipedia.org/wiki/Candlestick_chart
    "stat-open": "Ouvrir",
    "stat-high": "Aigu",
    "stat-low": "Grave",
    "stat-close": "Fermer",

    // For box plots
    "stat-q1": "Q1", // Quartile 1
    "stat-median": "Médiane",
    "stat-q3": "Q3",
    "stat-outlier": "Valeur aberrante",

    "point-xy": "{x}, {y}",
    "point-xy-label":
        "{announcePointLabelFirst, select, true {{label}, {x}, {y}} other {{x}, {y}, {label}}}",
    "point-xohlc": "{x}, {open} - {high} - {low} - {close}",
    "point-outlier": "{x}, {y}, {index} de {count}",
    "point-xhl": "{x}, {high} - {low}",
    "point-xhl-outlier": `{x}, {high} - {low}, avec {count, plural, 
        =0 {aucune valeur aberrante} 
        one {{count} valeur aberrante} 
        other {{count} valeurs aberrantes}
    }`,

    "info-open": "Ouvrir info",
    "info-title": "Info",
    "info-notes": "Commentaires",

    "kbmg-title": "Gestionnaire de clavier",
    "key-point-next": "Aller au point suivant",
    "key-point-prev": "Aller au point précédent",
    "key-play-fwd": "Lire vers la droite",
    "key-play-back": "Lire vers la gauche",
    "key-play-cancel": "Annuler lecture",
    "key-group-prev": "Aller au groupe précédent",
    "key-stat-prev": "Aller à la statistique précédente",
    "key-group-next": "Aller au groupe suivant",
    "key-stat-next": "Aller à la statistique suivante",
    "key-group-first": "Aller au premier groupe",
    "key-group-last": "Aller au dernier groupe",
    "key-hier-root": "Aller à la racine",
    "key-play-fwd-group": "Lire vers l’avant à travers les groupes",
    "key-play-back-group": "Lire vers l’arrière à travers les groupes",
    "key-point-first": "Aller au premier point",
    "key-point-last": "Aller au dernier point",
    "key-replay": "Lire à nouveau",
    "key-select": "Sélectionner élément",
    "key-tenth-prev": "Reculer d’un dixième",
    "key-tenth-next": "Avancer d’un dixième",
    "key-level-min": "Aller à la valeur minimale du niveau",
    "key-level-max": "Aller à la valeur maximale du niveau",
    "key-group-min": "Aller à la valeur minimale du groupe",
    "key-group-max": "Aller à la valeur maximale du groupe",
    "key-chart-min": "Aller à la valeur minimale du graphique",
    "key-chart-max": "Aller à la valeur maximale du graphique",
    "key-level-decr": "Descendre d’un niveau",
    "key-level-incr": "Monter d’un niveau",
    "key-speed-incr": "Accélérer",
    "key-speed-decr": "Ralentir",
    "key-monitor-toggle": "Changer de mode d’affichage",
    "key-dialog-help": "Ouvrir aide",
    "key-dialog-options": "Ouvrir options",

    "options-title": "Options",
    "options-frontmatter":
        "Lorsque vous naviguez à travers ce graphique, il se peut que certains sons soient trop graves ou trop aigus pour être entendus. Vous avez également la possibilité d’étendre la gamme des sons disponibles en utilisant les curseurs suivants:",
    "options-hertz-lower": "Hertz plus grave",
    "options-hertz-upper": "Hertz plus aigu",
    "options-speed-label": "Vitesse de lecture (presser ’Q’ et ’E’)",
    "options-set-global":
        "Sauvegarder mes options pour d’autres graphiques sur cette page",
    "options-use-continuous": "Utiliser le mode continu",
    "options-continuous-descr":
        "Le mode continu modifie la façon dont les valeurs sont lues lorsque vous appuyez sur Majuscule+Home et Majuscule+End.",
    "options-point-labels": "Montrer les étiquettes du point",
    "options-point-labels-before":
        'avant valeurs (par exemple "Californie, 423 970 kilomètres carrés, 39 millions d’habitants" )',
    "options-point-labels-after":
        'après valeurs (par exemple "423 970 kilomètres carrés, 39 millions d’habitants, Californie" )'
};

export default dictionary;

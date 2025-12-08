import type { translationDict } from ".";

const dictionary: translationDict = {
    description: "{title}, Gráfico Sonificado",
    "description-title": "Gráfico Sonificado",
    updated: "{title} Actualizado",
    "updated-untitled": "Gráfico Actualizado",
    missing: "Falta",
    close: "Cerrar", // Used to close dialogs
    save: "Guardar", // Used to save settings in dialogs

    tooLow: "Muy bajo",
    tooHigh: "Muy alto",
    nodeHasChildren: "tiene hijos", // secundarios
    instructionArrows: "Use las flechas para navegar.",
    instructionHierarchy:
        "Use Alt + Arriba y Abajo para navegar entre niveles.",
    instructionLive: "Presione M para cambiar modo de pantalla.",
    instructionHotkeys: "Presione H para más atajos.",

    "summ-chart": "Gráfico Sonificado.",
    "summ-chart-live": "Gráfico Sonificado en vivo.",
    "summ-chart-hier": "Gráfico Jerárquico Sonificado.",
    "summ-chart-group": `Gráfico Sonificado {groupCount, plural,
        =0 {sin grupos}
        one {con 1 grupo}
        other {con {groupCount} grupos}
    }.`,
    "summ-chart-title": `Gráfico Sonificado llamado "{title}".`,
    "summ-chart-live-hier": "Gráfico Jerárquico Sonificado en vivo.",
    "summ-chart-live-group": `Gráfico Sonificado en vivo {groupCount, plural,
        =0 {sin grupos}
        one {con 1 grupo}
        other {con {groupCount} grupos}
    }.`,
    "summ-chart-live-title": `Gráfico Sonificado en vivo llamado "{title}".`,
    "summ-chart-hier-group": `Gráfico Jerárquico Sonificado {groupCount, plural,
        =0 {sin grupos}
        one {con 1 grupo}
        other {con {groupCount} grupos}
    }.`,
    "summ-chart-hier-title": `Gráfico Jerárquico Sonificado llamado "{title}".`,
    "summ-chart-group-title": `Gráfico Sonificado {groupCount, plural,
        =0 {sin grupos}
        one {con 1 grupo}
        other {con {groupCount} grupos}
    } llamado "{title}".`,
    "summ-chart-live-hier-group": `Gráfico Jerárquico Sonificado en vivo {groupCount, plural,
        =0 {sin grupos}
        one {con 1 grupo}
        other {con {groupCount} grupos}
    }.`,
    "summ-chart-live-hier-title": `Gráfico Jerárquico Sonificado en vivo llamado "{title}".`,
    "summ-chart-live-group-title": `Gráfico Sonificado en vivo {groupCount, plural,
        =0 {sin grupos}
        one {con 1 grupo}
        other {con {groupCount} grupos}
    } llamado" {title}".`,
    "summ-chart-hier-group-title": `Gráfico Jerárquico Sonificado {groupCount, plural,
        =0 {sin grupos}
        one {con 1 grupo}
        other {con {groupCount} grupos}
    } llamado "{title}".`,
    "summ-chart-live-hier-group-title": `Gráfico Jerárquico Sonificado en vivo {groupCount, plural,
        =0 {sin grupos}
        one {con 1 grupo}
        other {con {groupCount} grupos}
    } llamado "{title}".`,

    "axis-desc": `{letter} es "{label}" de {min} a {max}.`,
    "axis-desc-log": `{letter} es "{label}" de {min} a {max} logarítmico.`,
    "axis-desc-con": `{letter} es "{label}" de {min} a {max} continuo.`,
    "axis-desc-log-con": `{letter} is "{label}" from {min} to {max} logarítmico continuo.`,

    "kbr-speed": `Velocidad, {rate_in_ms}`,
    "kbr-not-live": "No es un gráfico en vivo",
    monitoring:
        "Reproducción {switch, select, true {encendida} false {apagada} other {desconocida}}",

    "group-unknown": `Grupo llamado "{title}" usa un tipo de gráfico no compatible.`,

    "chart-line": "Gráfico de líneas.",
    "chart-bar": "Gráfico de barras.",
    "chart-band": "Gráfico de bandas.",
    "chart-pie": "Gráfico de torta.",
    "chart-candlestick": "Gráfico de velas.",
    "chart-histogram": "Gráfico Histograma.",
    "chart-box": "Gráfico de cajas y bigotes.",
    "chart-matrix": "Gráfico Matriz.",
    "chart-scatter": "Gráfico de dispersión.",
    "chart-treemap": "Gráfico de árbol.",

    "chart-line-labeled": `Gráfico de líneas muestra "{label}".`,
    "chart-bar-labeled": `Gráfico de barras muestra "{label}".`,
    "chart-band-labeled": `Gráfico de bandas muestra "{label}".`,
    "chart-pie-labeled": `Gráfico de torta muestra "{label}".`,
    "chart-candlestick-labeled": `Gráfico de velas muestra "{label}".`,
    "chart-histogram-labeled": `Histograma muestra "{label}".`,
    "chart-box-labeled": `Gráfico de cajas y bigotes muestra "{label}".`,
    "chart-matrix-labeled": `Gráfico matriz muestra "{label}".`,
    "chart-scatter-labeled": `Gráfico de dispersión muestra "{label}".`,
    "chart-treemap-labeled": `Gráfico de árbol muestra "{label}".`,

    "stat-all": "Todo",
    // In Finance, OHLC (Open, High, Low, Close) charts are sometimes called candlestick charts.
    // https://en.wikipedia.org/wiki/Candlestick_chart
    "stat-open": "Abrir",
    "stat-high": "Alto",
    "stat-low": "Bajo",
    "stat-close": "Cerrar",

    // For box plots
    "stat-q1": "Q1", // Quartile 1
    "stat-median": "Mediana",
    "stat-q3": "Q3",
    "stat-outlier": "Valor Atípico",

    "point-xy": "{x}, {y}",
    "point-xy-label": "{announcePointLabelFirst, select, true {{label}, {x}, {y}} other {{x}, {y}, {label}}}",
    "point-xohlc": "{x}, {open} - {high} - {low} - {close}",
    "point-outlier": "{x}, {y}, {index} de {count}",
    "point-xhl": "{x}, {high} - {low}",
    "point-xhl-outlier": `{x}, {high} - {low}, con {count, plural,
        =0 {Sin valores atípicos}
        one {{count} valor atípico}
        other {{count} valores atípicos}
    }`,

    "info-open": "Abrir info",
    "info-title": "Info",
    "info-notes": "Notas",

    "kbmg-title": "Administrador de teclado",
    "key-point-next": "Ir al punto siguiente",
    "key-point-prev": "Ir al punto anterior",
    "key-play-fwd": "Reproducir a la derecha",
    "key-play-back": "Reproducir a la izquierda",
    "key-play-cancel": "Cancelar reproducción",
    "key-group-prev": "Ir al grupo anterior",
    "key-stat-prev": "Navegar a estadística anterior",
    "key-group-next": "Ir al grupo siguiente",
    "key-stat-next": "Navegar a la siguiente estadística",
    "key-group-first": "Ir al primer grupo",
    "key-group-last": "Ir al último grupo",
    "key-hier-root": "Ir a la raíz",
    "key-play-fwd-group": "Reproducir hacia adelante por los grupos",
    "key-play-back-group": "Reproducir hacia atrás por los grupos",
    "key-point-first": "Ir al primer punto",
    "key-point-last": "Ir al último punto",
    "key-replay": "Reproducir de nuevo",
    "key-select": "Seleccionar ítem",
    "key-tenth-prev": "Retroceder una décima",
    "key-tenth-next": "Adelantar una décima",
    "key-level-min": "Ir al menor valor del nivel",
    "key-level-max": "Ir al mayor valor del nivel",
    "key-group-min": "Ir al menor valor del grupo",
    "key-group-max": "Ir al mayor valor del grupo",
    "key-chart-min": "Ir al menor valor del gráfico",
    "key-chart-max": "Ir al mayor valor del gráfico",
    "key-level-decr": "Bajar un nivel",
    "key-level-incr": "Subir un nivel",
    "key-speed-incr": "Acelerar",
    "key-speed-decr": "Ralentizar",
    "key-monitor-toggle": "Cambiar modo de pantalla",
    "key-dialog-help": "Abrir diálogo de ayuda",
    "key-dialog-options": "Abrir diálogo de opciones",

    "options-title": "Opciones",
    "options-frontmatter":
        "Al navegar este gráfico algunos sonidos pueden reusltar muy altos o muy bajos para que los escuche. Adicionalmente, si desea expandir el rango de sonidos disponibles, deslice los controles para ajustar el rango de sonido:",
    "options-hertz-lower": "Hertz más bajo",
    "options-hertz-upper": "Hertz más alto",
    "options-speed-label": "Velocidad de reproducción (presione 'Q' y 'E')",
    "options-set-global":
        "Guardar mis opciones para otros gráficos en esta página",
    "options-use-continuous": "Usar modo continuo",
    "options-continuous-descr":
        "El modo continuo cambia cómo se reproducen los valores al presionar Shift+Home y Shift+End",
    "options-point-labels": "Mostrar etiquetas del punto",
    "options-point-labels-before": `valores anteriores (ejemplo: "California, 163,1802 kilómetros cuadrados, 39 millones de personas" )`,
    "options-point-labels-after": `valores siguientes (ejemplo: "163,1802 kilómetros cuadrados, 39 millones de personas, California" )`
};

export default dictionary;

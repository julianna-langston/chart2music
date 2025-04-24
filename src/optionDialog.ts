import { HERTZ } from "./constants";
import type { translateEvaluators } from "./translations";

export const launchOptionDialog = (
    {
        language,
        upper,
        lower,
        speedIndex,
        continuousMode,
        labelPosition,
        translationCallback
    }: {
        language: string;
        upper: number;
        lower: number;
        speedIndex: number;
        continuousMode: boolean;
        labelPosition: boolean;
        translationCallback: (
            code: string,
            evaluators?: translateEvaluators
        ) => string;
    },
    cb: (
        lower: number,
        upper: number,
        speed: number,
        continuousMode: boolean,
        labelPosition: boolean
    ) => void,
    playCb?: (hertz: number) => void
) => {
    const dialog = document.createElement("dialog");
    dialog.classList.add("chart2music-dialog");
    dialog.classList.add("chart2music-option-dialog");
    dialog.setAttribute("lang", language);
    const translatedOptionsTitle = translationCallback("options-title");
    dialog.setAttribute("aria-label", translatedOptionsTitle);

    const h1 = dialog.appendChild(document.createElement("h1"));
    h1.textContent = translatedOptionsTitle;

    const p = dialog.appendChild(document.createElement("p"));
    p.textContent = translationCallback("options-frontmatter");
    p.tabIndex = 0;

    const form = dialog.appendChild(document.createElement("form"));
    form.id = "optionForm";

    let div: HTMLDivElement, label: HTMLLabelElement, input: HTMLInputElement;

    div = form.appendChild(document.createElement("div"));
    label = div.appendChild(document.createElement("label"));
    label.appendChild(document.createTextNode(translationCallback("options-hertz-lower") + ":"));
    input = label.appendChild(document.createElement("input"));
    input.type = "range";
    input.min = "0";
    input.max = (upper - 1).toString();
    input.step = "1";
    input.id = "lowerRange";
    input.value = lower.toString();

    div = form.appendChild(document.createElement("div"));
    label = div.appendChild(document.createElement("label"));
    label.appendChild(document.createTextNode(translationCallback("options-hertz-upper") + ":"));
    input = label.appendChild(document.createElement("input"));
    input.type = "range";
    input.min = (lower + 1).toString();
    input.max = (HERTZ.length - 1).toString();
    input.step = "1";
    input.id = "upperRange";
    input.value = upper.toString();

    div = form.appendChild(document.createElement("div"));
    label = div.appendChild(document.createElement("label"));
    label.appendChild(document.createTextNode(translationCallback("options-speed-label") + ":"));
    input = label.appendChild(document.createElement("input"));
    input.type = "range";
    input.min = "0";
    input.max = "4";
    input.id = "speedRange";
    input.value = speedIndex.toString();

    div = form.appendChild(document.createElement("div"));
    label = div.appendChild(document.createElement("label"));
    input = label.appendChild(document.createElement("input"));
    input.type = "checkbox";
    input.id = "global";
    input.defaultChecked = true;
    label.appendChild(document.createTextNode(translationCallback("options-set-global")));

    div = form.appendChild(document.createElement("div"));
    label = div.appendChild(document.createElement("label"));
    input = label.appendChild(document.createElement("input"));
    input.type = "checkbox";
    input.id = "continuous";
    input.defaultChecked = continuousMode;
    label.appendChild(document.createTextNode(translationCallback("options-use-continuous")));
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createTextNode(translationCallback("options-continuous-descr")));

    div = form.appendChild(document.createElement("div"));
    const fieldset = div.appendChild(document.createElement("fieldset"));
    const legend = fieldset.appendChild(document.createElement("label"));
    legend.appendChild(document.createTextNode(translationCallback("options-point-labels")));
    label = fieldset.appendChild(document.createElement("label"));
    input = label.appendChild(document.createElement("input"));
    input.type = "radio";
    input.name = "point-labels";
    input.value = "before";
    input.defaultChecked = labelPosition;
    label.appendChild(document.createTextNode(translationCallback("options-point-labels-before")));
    fieldset.appendChild(document.createElement("br"));
    label = fieldset.appendChild(document.createElement("label"));
    input = label.appendChild(document.createElement("input"));
    input.type = "radio";
    input.name = "point-labels";
    input.value = "after";
    input.defaultChecked = !labelPosition;
    label.appendChild(document.createTextNode(translationCallback("options-point-labels-after")));
 
    input = form.appendChild(document.createElement("input"));
    input.type = "submit";
    input.id = "save";
    input.value = translationCallback("save");

    const lowerRange: HTMLInputElement = dialog.querySelector("#lowerRange");
    const upperRange: HTMLInputElement = dialog.querySelector("#upperRange");
    const speedRange: HTMLInputElement = dialog.querySelector("#speedRange");
    const global: HTMLInputElement = dialog.querySelector("#global");
    const continuous: HTMLInputElement = dialog.querySelector("#continuous");

    const save = () => {
        const lowerValue = Number(lowerRange.value);
        const upperValue = Number(upperRange.value);
        const speedIndex = Number(speedRange.value);
        const saveGlobal = global.checked;
        const continuousChecked = continuous.checked;

        const labelRadioButton: HTMLInputElement = dialog.querySelector(
            "input[name='point-labels']:checked"
        );
        const labelPosition: boolean = labelRadioButton.value === "before";
        cb(
            lowerValue,
            upperValue,
            speedIndex,
            continuousChecked,
            labelPosition
        );

        if (window && saveGlobal) {
            if (!window.__chart2music_options__) {
                window.__chart2music_options__ = {};
            }
            window.__chart2music_options__ = {
                _hertzClamps: {
                    lower: lowerValue,
                    upper: upperValue
                }
            };
        }

        dialog.close();
    };

    Array.from(dialog.querySelectorAll("input")).forEach((elem) => {
        elem.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                save();
            }
        });
    });

    dialog.querySelector("#optionForm").addEventListener("submit", (e) => {
        e.preventDefault();
        save();
    });

    dialog.querySelector("#save").addEventListener("click", (e) => {
        e.preventDefault();
        save();
    });

    if (playCb) {
        lowerRange.addEventListener("change", () => {
            playCb(Number(lowerRange.value));
            upperRange.min = String(Number(lowerRange.value) + 1);
        });
        upperRange.addEventListener("change", () => {
            playCb(Number(upperRange.value));
            lowerRange.max = String(Number(upperRange.value) - 1);
        });
    }

    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.focus();

    dialog.addEventListener("close", () => {
        dialog.parentElement.removeChild(dialog);
    });
};

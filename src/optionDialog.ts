import { HERTZ } from "./constants";
import { translate } from "./translator";

export const launchOptionDialog = (
    {
        language,
        upper,
        lower,
        speedIndex,
        continuousMode,
        labelPosition
    }: {
        language: string;
        upper: number;
        lower: number;
        speedIndex: number;
        continuousMode: boolean;
        labelPosition: boolean;
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
    dialog.setAttribute("aria-label", translate(language, "options-title"));
    dialog.innerHTML = `<h1>${translate(language, "options-title")}</h1>

    <p tabIndex="0">${translate(language, "options-frontmatter")}</p>

    <form id="optionForm">
        <div>
            <label>
                ${translate(language, "options-hertz-lower")}:
                <input type="range" min="0" max="${
                    upper - 1
                }" step="1" id="lowerRange" value="${lower}" />
            </label>
        </div>

        <div>
            <label>
            ${translate(language, "options-hertz-upper")}:
                <input type="range" min="${lower + 1}" max="${
                    HERTZ.length - 1
                }" step="1" id="upperRange" value="${upper}" />
            </label>
        </div>

        <div>
            <label>
            ${translate(language, "options-speed-label")}:
                <input type="range" min="0" max="4" id="speedRange" value="${speedIndex}" />
            </label>
        </div>

        <div>
            <label>
                <input type="checkbox" id="global" checked />
                ${translate(language, "options-set-global")}
            </label>
        </div>

        <div>
            <label>
                <input type="checkbox" id="continuous" ${
                    continuousMode ? "checked" : ""
                } />
                ${translate(language, "options-use-continuous")}
            </label>
            <br/>
            ${translate(language, "options-continuous-descr")}
        </div>

        <div>
            <fieldset>
                <legend>${translate(language, "options-point-labels")}</legend>

                <label>
                    <input type="radio" name="point-labels" value="before" ${
                        labelPosition ? "checked" : ""
                    } />
                    ${translate(language, "options-point-labels-before")}
                </label>
                
                <br/>

                <label>
                    <input type="radio" name="point-labels" value="after" ${
                        labelPosition ? "" : "checked"
                    } />
                    ${translate(language, "options-point-labels-after")}
                </label>
            </fieldset>
        </div>

        <input id="save" type="submit" value="${translate(language, "save")}" />
    </form>
    `;

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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

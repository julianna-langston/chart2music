import { HERTZ } from "./constants";

export const launchOptionDialog = (
    {
        upper,
        lower,
        speedIndex,
        continuousMode,
        labelPosition
    }: {
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
    dialog.setAttribute("aria-label", "Options");
    dialog.innerHTML = `<h1>Options</h1>

    <p tabIndex="0">While navigating this chart, you may find some sounds too low or too high to hear. Alternatively, you may want to expand the range of the sounds available. Use these sliders to adjust the range of sound:</p>

    <form id="optionForm">
        <div>
            <label>
                Lower hertz:
                <input type="range" min="0" max="${
                    upper - 1
                }" step="1" id="lowerRange" value="${lower}" />
            </label>
        </div>

        <div>
            <label>
                Upper hertz:
                <input type="range" min="${lower + 1}" max="${
        HERTZ.length - 1
    }" step="1" id="upperRange" value="${upper}" />
            </label>
        </div>

        <div>
            <label>
                Play speed (aka, press 'Q' and 'E'):
                <input type="range" min="0" max="4" id="speedRange" value="${speedIndex}" />
            </label>
        </div>

        <div>
            <label>
                <input type="checkbox" id="global" checked />
                Save my options for other charts on this page
            </label>
        </div>

        <div>
            <label>
                <input type="checkbox" id="continuous" ${
                    continuousMode ? "checked" : ""
                } />
                Use continuous mode
            </label>
            <br/>
            Continuous mode changes how values are played when you press Shift+Home and Shift+End
        </div>

        <div>
                <fieldset>
                    <legend>Show point labels</legend>

                    <label>
                        <input type="radio" name="point-labels" value="before" ${
                            labelPosition ? "checked" : ""
                        } />
                        before values (eg: "California, 163,696 square miles, 39 million people" )
                    </label>
                    
                    <br/>

                    <label>
                        <input type="radio" name="point-labels" value="after" ${
                            labelPosition ? "" : "checked"
                        } />
                        after values (eg: "163,696 square miles, 39 million people, California" )
                    </label>
                </fieldset>
        </div>

        <input id="save" type="submit" value="Save" />
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

import { HERTZ } from "./constants";

export const launchOptionDialog = (
    { upper, lower }: { upper: number; lower: number },
    cb: (lower: number, upper: number) => void,
    playCb?: (hertz: number) => void
) => {
    const previousElement = document.activeElement as HTMLElement;
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
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
                <input type="checkbox" id="global" checked />
                Save my options for other charts on this page
            </label>
        </div>

        <input id="save" type="submit" value="Save" />
    </form>
    `;

    const lowerRange: HTMLInputElement = dialog.querySelector("#lowerRange");
    const upperRange: HTMLInputElement = dialog.querySelector("#upperRange");
    const global: HTMLInputElement = dialog.querySelector("#global");

    if (!window) {
        global.parentElement.parentElement.style.display = " none";
    }

    const save = () => {
        const lowerValue = Number(lowerRange.value);
        const upperValue = Number(upperRange.value);
        const saveGlobal = global.checked;
        cb(lowerValue, upperValue);

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
        esc();
    };

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

    const esc = () => {
        previousElement.focus();
        dialog.parentElement.removeChild(dialog);
    };

    dialog.addEventListener("keydown", (evt) => {
        if (evt.key === "Escape") {
            esc();
        }
    });
    dialog.addEventListener("blur", esc);

    document.body.appendChild(dialog);
    const p: HTMLElement = dialog.querySelector("[tabIndex]");
    p.focus();
};

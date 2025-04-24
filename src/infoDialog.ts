import type { translateEvaluators } from "./translations";
import type { c2mInfo } from "./types";

export const launchInfoDialog = (
    info: c2mInfo,
    translationCallback: (
        code: string,
        evaluators?: translateEvaluators
    ) => string
) => {
    const dialog = document.createElement("dialog");
    dialog.classList.add("chart2music-dialog");
    dialog.classList.add("chart2music-info-dialog");
    const translatedInfoTitle = translationCallback("info-title");
    dialog.setAttribute("aria-label", translatedInfoTitle);
    const h1 = dialog.appendChild(document.createElement("h1"));
    h1.tabIndex = 0;
    h1.textContent = translatedInfoTitle;

    if ("notes" in info) {
        const h2 = dialog.appendChild(document.createElement("h2"));
        h2.textContent = translationCallback("info-notes");

        const ul = dialog.appendChild(document.createElement("ul"));
        info.notes.forEach((str) => {
            const li = ul.appendChild(document.createElement("li"));
	         li.textContent = str;
        });
    }

    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.focus();

    dialog.addEventListener("close", () => {
        dialog.parentElement.removeChild(dialog);
    });
};

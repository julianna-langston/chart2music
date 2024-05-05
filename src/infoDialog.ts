import type { translateEvaluators } from "./translations";
import type { c2mInfo } from "./types";

const toHtmlEntities = (str: string) => {
    return str.replace(/./gm, function (s) {
        // return "&#" + s.charCodeAt(0) + ";";
        return s.match(/[a-z0-9\s]+/i) ? s : `&#${s.charCodeAt(0)};`;
    });
};

export const launchInfoDialog = (info: c2mInfo, translationCallback: (
    code: string,
    evaluators?: translateEvaluators
) => string) => {
    const dialog = document.createElement("dialog");
    dialog.classList.add("chart2music-dialog");
    dialog.classList.add("chart2music-info-dialog");
    dialog.setAttribute("aria-label", translationCallback("info-title"));
    let content = `<h1 tabIndex='0'>${translationCallback("info-title")}</h1>`;

    if ("notes" in info) {
        content += `<h2>${translationCallback("info-notes")}</h2>

        <ul>
            ${info.notes
                .map((str) => `<li>${toHtmlEntities(str)}</li>`)
                .join("")}
        </ul>`;
    }

    dialog.innerHTML = content;

    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.focus();

    dialog.addEventListener("close", () => {
        dialog.parentElement.removeChild(dialog);
    });
};

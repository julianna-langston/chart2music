import { translate } from "./translator";
import type { c2mInfo } from "./types";

const toHtmlEntities = (str: string) => {
    return str.replace(/./gm, function (s) {
        // return "&#" + s.charCodeAt(0) + ";";
        return s.match(/[a-z0-9\s]+/i) ? s : `&#${s.charCodeAt(0)};`;
    });
};

export const launchInfoDialog = (info: c2mInfo, language: string) => {
    const dialog = document.createElement("dialog");
    dialog.setAttribute("aria-label", translate(language, "info-title"));
    let content = `<h1 tabIndex='0'>${translate(language, "info-title")}</h1>`;

    if ("notes" in info) {
        content += `<h2>${translate(language, "info-notes")}</h2>

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

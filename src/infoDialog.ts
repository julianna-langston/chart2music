import type { c2mInfo } from "./types";

const toHtmlEntities = (str: string) => {
    return str.replace(/./gm, function (s) {
        // return "&#" + s.charCodeAt(0) + ";";
        return s.match(/[a-z0-9\s]+/i) ? s : `&#${s.charCodeAt(0)};`;
    });
};

export const launchInfoDialog = (info: c2mInfo) => {
    const dialog = document.createElement("dialog");
    dialog.setAttribute("aria-label", "Info");
    let content = `<h1 tabIndex='0'>Info</h1>`;

    if ("notes" in info) {
        content += `<h2>Notes</h2>

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

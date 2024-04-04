import { translate } from "./translator";
import type { KeyDetails, KeyRegistration } from "./types";

/* eslint-disable @typescript-eslint/unbound-method */
export const keyboardEventToString = (e: KeyboardEvent) => {
    return `${e.altKey ? "Alt+" : ""}${e.ctrlKey ? "Ctrl+" : ""}${
        e.shiftKey ? "Shift+" : ""
    }${e.key}`;
};

/**
 * Keyboard event manager enables:
 * - registering/unregistering custom keyboard events
 * - generating documentations listing keyboard events
 * @internal
 */
export class KeyboardEventManager {
    private _keyMap: {
        [keyEvent: string]: KeyDetails;
    };
    private _target: HTMLElement;
    private _dialog: HTMLDialogElement | null;
    private _handler = (event: KeyboardEvent) => {
        this._handleKeyEvents(event);
    };

    /**
     * Initialize keyboard event manager
     * @param target - target element
     */
    constructor(target: HTMLElement) {
        this._keyMap = {};
        this._target = target;
        this._target.addEventListener("keydown", this._handler);
        if (!this._target.hasAttribute("tabIndex")) {
            this._target.setAttribute("tabIndex", "0");
        }
        this._dialog = null;
    }

    /**
     * Unregister keyboard events
     */
    cleanup() {
        this._target.removeEventListener("keydown", this._handler);
        if (this._dialog !== null) {
            document.body.removeChild(this._dialog);
        }
    }

    /**
     * Handle the keydown event
     * @param event - keydown event
     */
    private _handleKeyEvents(event: KeyboardEvent) {
        const keyPress = keyboardEventToString(event);
        if (keyPress in this._keyMap) {
            this._keyMap[keyPress].callback();
            event.preventDefault();
        } else if (keyPress.toUpperCase() in this._keyMap) {
            this._keyMap[keyPress.toUpperCase()].callback();
            event.preventDefault();
        }
    }

    /**
     * Register a key event
     * @param details - the details of the key event
     * @param details.key - the key event
     * @param details.callback - the function if the key event is pressed
     * @param details.title - the title of the event
     * @param details.description - the description of the event
     * @param details.keyDescription - the description of the key (eg, "Spacebar")
     * @param details.caseSensitive - should the keypress be case sensitive?
     * @param [details.force] - if the key event already exists, overwrite? (True if yes)
     */
    registerKeyEvent({
        key,
        callback,
        title = "",
        description = "",
        force = false,
        keyDescription,
        caseSensitive = true
    }: KeyRegistration) {
        const checkKey = caseSensitive ? key : key.toUpperCase();
        if (!force && checkKey in this._keyMap) {
            return;
        }
        this._keyMap[checkKey] = {
            title,
            description,
            callback,
            keyDescription
        };
    }

    /**
     * Register multiple key events
     * Effectively a shortcut to calling .registerKeyEvent multiple times
     * @param keyRegistrationList - list of key events to register
     */
    registerKeyEvents(keyRegistrationList: KeyRegistration[]) {
        keyRegistrationList.forEach((kr) => {
            this.registerKeyEvent(kr);
        });
    }

    /**
     * Build a help dialog
     * @param lang Language of the dialog - used in attribute, and for i18n
     */
    generateHelpDialog(lang: string) {
        const dialog = document.createElement("dialog");
        dialog.classList.add("chart2music-dialog");
        dialog.classList.add("chart2music-help-dialog");
        dialog.setAttribute("lang", lang);

        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.ariaLabel = translate(lang, "close");
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.addEventListener("click", () => {
            dialog.close();
        });
        dialog.appendChild(closeButton);

        const heading = translate(lang, "kbmg-title");
        const h1 = document.createElement("h1");
        h1.textContent = heading;
        dialog.setAttribute("aria-live", heading);
        dialog.appendChild(h1);

        const table = document.createElement("table");
        const tbody = document.createElement("tbody");
        Object.entries(this._keyMap).forEach(([keystroke, details]) => {
            const tr = document.createElement("tr");
            const th = document.createElement("th");
            th.scope = "row";
            th.textContent = details.title;
            tr.appendChild(th);

            const td1 = document.createElement("td");
            td1.textContent = details.keyDescription ?? keystroke;
            tr.appendChild(td1);

            const td2 = document.createElement("td");
            td2.textContent = details.description;
            tr.appendChild(td2);

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        dialog.appendChild(table);
        return dialog;
    }

    /**
     * Launch help dialog
     * @param lang Language of the dialog - used in attribute, and for i18n
     */
    launchHelpDialog(lang: string) {
        if (this._dialog === null) {
            this._dialog = this.generateHelpDialog(lang);
            document.body.appendChild(this._dialog);
        }
        this._dialog.showModal();
        this._dialog.focus();
    }
}

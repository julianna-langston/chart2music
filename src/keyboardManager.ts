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
 *
 * @internal
 */
export class KeyboardEventManager {
    private _keyMap: {
        [keyEvent: string]: KeyDetails;
    };
    private _target: HTMLElement;
    private _dialog: HTMLDialogElement | null;

    /**
     * Initialize keyboard event manager
     *
     * @param target - target element
     */
    constructor(target: HTMLElement) {
        this._keyMap = {};
        this._target = target;
        this._target.addEventListener("keydown", (event) => {
            this._handleKeyEvents(event);
        });
        if (!this._target.hasAttribute("tabIndex")) {
            this._target.setAttribute("tabIndex", "0");
        }
        this._dialog = null;
    }

    /**
     * Handle the keydown event
     *
     * @param event - keydown event
     */
    private _handleKeyEvents(event: KeyboardEvent) {
        const keyPress = keyboardEventToString(event);
        if (keyPress in this._keyMap) {
            this._keyMap[keyPress].callback();
            event.preventDefault();
        }
    }

    /**
     * Register a key event
     *
     * @param details - the details of the key event
     * @param details.key - the key event
     * @param details.callback - the function if the key event is pressed
     * @param details.title - the title of the event
     * @param details.description - the description of the event
     * @param details.keyDescription - the description of the key (eg, "Spacebar")
     * @param [details.force] - if the key event already exists, overwrite? (True if yes)
     */
    registerKeyEvent({
        key,
        callback,
        title = "",
        description = "",
        force = false,
        keyDescription
    }: KeyRegistration) {
        if (!force && key in this._keyMap) {
            return;
        }
        this._keyMap[key] = {
            title,
            description,
            callback,
            keyDescription
        };
    }

    /**
     * Register multiple key events
     * Effectively a shortcut to calling .registerKeyEvent multiple times
     *
     * @param keyRegistrationList - list of key events to register
     */
    registerKeyEvents(keyRegistrationList: KeyRegistration[]) {
        keyRegistrationList.forEach((kr) => {
            this.registerKeyEvent(kr);
        });
    }

    /**
     * Build a help dialog
     */
    generateHelpDialog() {
        const dialog = document.createElement("dialog");

        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.ariaLabel = "Close";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.addEventListener("click", () => {
            dialog.close();
        });
        dialog.appendChild(closeButton);

        const heading = "Keyboard Manager";
        const h1 = document.createElement("h1");
        h1.textContent = heading;
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
     */
    launchHelpDialog() {
        if (this._dialog === null) {
            this._dialog = this.generateHelpDialog();
            document.body.appendChild(this._dialog);
        }
        this._dialog.showModal();
        this._dialog.focus();
    }
}

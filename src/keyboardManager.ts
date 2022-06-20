/* eslint-disable @typescript-eslint/unbound-method */
const keyboardEventToString = (e: KeyboardEvent) => {
    return `${e.altKey ? "Alt+" : ""}${e.ctrlKey ? "Ctrl+" : ""}${
        e.shiftKey ? "Shift+" : ""
    }${e.key}`;
};

/**
 *
 */
type KeyDetails = {
    callback: () => void;
    force?: boolean;
    title?: string;
    description?: string;
};
/**
 *
 */
type KeyRegistration = {
    key: string;
} & KeyDetails;

/**
 * Keyboard event manager enables:
 * - registering/unregistering custom keyboard events
 * -
 */
export class KeyboardEventManager {
    private _keyMap: {
        [keyEvent: string]: KeyDetails;
    };
    private _target: HTMLElement;
    private _preLaunchActiveElement: HTMLElement;

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
    }

    /**
     * Handle the keydown event
     *
     * @param event - keydown event
     */
    _handleKeyEvents(event: KeyboardEvent) {
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
     * @param [details.force] - if the key event already exists, overwrite? (True if yes)
     */
    registerKeyEvent({
        key,
        callback,
        title = "",
        description = "",
        force = false
    }: KeyRegistration) {
        if (!force && key in this._keyMap) {
            return;
        }
        this._keyMap[key] = {
            title,
            description,
            callback
        };
    }

    /**
     * Unregister a key event
     *
     * @param key - the key to remove
     */
    unregisterKeyEvent(key: string) {
        delete this._keyMap[key];
    }

    /**
     * Build a help dialog
     */
    generateHelpDialog() {
        const dialog = document.createElement("div");
        dialog.setAttribute("role", "dialog");

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
            td1.textContent = keystroke;
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
        this._preLaunchActiveElement = document.activeElement as HTMLElement;

        const dialog = this.generateHelpDialog();
        document.body.appendChild(dialog);
        const km = new KeyboardEventManager(dialog);
        km.registerKeyEvent({
            key: "Escape",
            callback: () => {
                this._preLaunchActiveElement?.focus();
                document.body.removeChild(dialog);
            }
        });
        dialog.focus();
    }
}

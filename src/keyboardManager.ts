import type { translateEvaluators } from "./translations";
import type {
    c2mOptions,
    ChartContainerType,
    KeyDetails,
    KeyRegistration
} from "./types";

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
    private _target: ChartContainerType;
    private _dialog: HTMLDialogElement | null;
    private _handler = (event: KeyboardEvent) => {
        this._handleKeyEvents(event);
    };

    /**
     * Initialize keyboard event manager
     * @param target - target element
     * @param modifyHelpDialogText - callback function for modifying help dialog frontmatter
     * @param modifyHelpDialogKeyboardListing - callback function for modify help dialog keyboard shortcut table
     */
    constructor(
        target: ChartContainerType,
        private modifyHelpDialogText: c2mOptions["modifyHelpDialogText"],
        private modifyHelpDialogKeyboardListing: c2mOptions["modifyHelpDialogKeyboardListing"]
    ) {
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
     * @param [details.order] - the order the shortcut should appear in the shortcut table
     */
    registerKeyEvent({
        key,
        callback,
        title = "",
        description = "",
        force = false,
        keyDescription,
        caseSensitive = true,
        order = 100
    }: KeyRegistration) {
        const checkKey = caseSensitive ? key : key.toUpperCase();
        if (!force && checkKey in this._keyMap) {
            return;
        }
        this._keyMap[checkKey] = {
            title,
            description,
            callback,
            keyDescription,
            order
        };
    }

    /**
     * Register multiple key events
     * Effectively a shortcut to calling .registerKeyEvent multiple times
     * @param keyRegistrationList - list of key events to register
     */
    registerKeyEvents(keyRegistrationList: KeyRegistration[]) {
        keyRegistrationList.forEach((kr, order) => {
            this.registerKeyEvent({ order, ...kr });
        });
    }

    /**
     * Build a help dialog
     * @param lang Language of the dialog - used in attribute, and for i18n
     * @param translationCallback - get language-specific verbiage
     * @param keyboardListing - array of keyboard shortcut table contents
     */
    generateHelpDialog(
        lang: string,
        translationCallback: (
            code: string,
            evaluators?: translateEvaluators
        ) => string,
        keyboardListing: string[][]
    ) {
        const dialog = document.createElement("dialog");
        dialog.classList.add("chart2music-dialog");
        dialog.classList.add("chart2music-help-dialog");
        dialog.setAttribute("lang", lang);

        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.ariaLabel = translationCallback("close");
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.addEventListener("click", () => {
            dialog.close();
        });
        dialog.appendChild(closeButton);

        const heading = translationCallback("kbmg-title");
        const h1 = document.createElement("h1");
        h1.textContent = heading;
        dialog.setAttribute("aria-live", heading);
        dialog.appendChild(h1);

        const frontMatter = document.createElement("p");
        frontMatter.textContent = this.modifyHelpDialogText(
            lang,
            translationCallback("help-dialog-front-matter")
        );
        dialog.appendChild(frontMatter);

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tr1 = document.createElement("tr");
        (keyboardListing.at(0) ?? []).forEach((txt) => {
            const th = document.createElement("th");
            th.setAttribute("scope", "col");
            th.textContent = txt;
            tr1.appendChild(th);
        });
        thead.appendChild(tr1);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        keyboardListing.slice(1).forEach((row) => {
            const tr = document.createElement("tr");
            row.forEach((cell) => {
                const td = document.createElement("td");
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        dialog.appendChild(table);

        const footer = document.createElement("p");
        footer.appendChild(
            document.createTextNode(translationCallback("help_dialog_footer"))
        );
        const a = document.createElement("a");
        a.setAttribute("href", "https://www.chart2music.com/");
        a.textContent = "www.chart2music.com";
        footer.appendChild(a);
        footer.appendChild(document.createTextNode("."));
        dialog.appendChild(footer);

        return dialog;
    }

    /**
     * Launch help dialog
     * @param lang Language of the dialog - used in attribute, and for i18n
     * @param translationCallback - get language-specific verbiage
     */
    launchHelpDialog(
        lang: string,
        translationCallback: (
            code: string,
            evaluators?: translateEvaluators
        ) => string
    ) {
        const headings = [
            "Keyboard Shortcut",
            "Description",
            "Common Alternate Keyboard Shortcut"
        ];
        const listing = Object.entries(this._keyMap)
            .sort((left, right) => {
                if (left[1].order < right[1].order) {
                    return -1;
                }
                if (left[1].order > right[1].order) {
                    return 1;
                }
                return 0;
            })
            .map(([key, { title, keyDescription, description }]) => [
                title,
                keyDescription ?? key,
                description
            ]);

        if (this._dialog === null) {
            this._dialog = this.generateHelpDialog(
                lang,
                translationCallback,
                this.modifyHelpDialogKeyboardListing(lang, headings, listing)
            );
            document.body.appendChild(this._dialog);
        }
        this._dialog.showModal();
        this._dialog.focus();
    }
}

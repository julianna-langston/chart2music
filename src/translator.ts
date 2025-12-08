import type { IntlShape } from "@formatjs/intl";
import { createIntl } from "@formatjs/intl";
import * as translations from "./translations";
import type { translateEvaluators } from "./translations";
import type { c2mOptions } from "./types";

export const DEFAULT_LANGUAGE = "en";
export const AVAILABLE_LANGUAGES = Object.keys(translations);

/**
 * Manages translations, including importing content, switching languages, and returning translated strings
 */
export class TranslationManager {
    private _availableLanguageCodes: string[] = [];
    private _loadedLanguages: Map<string, IntlShape<string>> = new Map();
    private _language: string;
    private _intercepterCallback: c2mOptions["translationCallback"] = () =>
        false;

    /**
     * Create a TranslationManager
     * @param [language] - the language to translate into (default: "en")
     */
    constructor(language = DEFAULT_LANGUAGE) {
        this._availableLanguageCodes = Object.keys(translations);
        // Load the default language (which is the universal fallback)
        this.language = DEFAULT_LANGUAGE;
        // Load the requested language
        this.language = language;
    }

    get language() {
        return this._language;
    }

    /**
     * Assign a language
     * (loads the language's translations, if necessary)
     */
    set language(newValue: string) {
        this._language = newValue;
        if (!this._loadedLanguages.has(newValue)) {
            this.loadLanguage(newValue);
        }
    }

    /**
     * Set a translation interceptor
     */
    set intercepterCallback(newValue: c2mOptions["translationCallback"]) {
        this._intercepterCallback = newValue;
    }

    /**
     * What are the available languages?
     */
    get languages() {
        return this._availableLanguageCodes;
    }

    /**
     * What languages have already been loaded?
     */
    get loadedLanguages() {
        return [...this._loadedLanguages.keys()];
    }

    /**
     * Load the IntlShape of a given language
     * @param code - the language to load
     */
    private loadLanguage(code: string) {
        if (!(code in translations)) {
            return false;
        }

        this._loadedLanguages.set(
            code,
            createIntl({
                locale: code,
                onError: (...args) => {
                    // Suppress missing translation errors
                    if ((args[0].code as string) === "MISSING_DATA") {
                        return;
                    }
                },
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                messages: translations[code]
            })
        );

        return true;
    }

    /**
     * Translate into the already-set language
     * @param id - The id of the message
     * @param evaluators - options to evalaute to generate the translated string
     */
    public translate(id: string, evaluators: translateEvaluators = {}): string {
        const intercepted = this._intercepterCallback({
            language: this._language,
            id,
            evaluators
        });

        if (intercepted !== false) {
            return intercepted;
        }

        if (id in translations[this._language]) {
            return this._loadedLanguages
                .get(this._language)
                .formatMessage({ id }, evaluators);
        }

        if (id in translations[DEFAULT_LANGUAGE]) {
            return this._loadedLanguages
                .get(DEFAULT_LANGUAGE)
                .formatMessage({ id }, evaluators);
        }

        return "";
    }
}

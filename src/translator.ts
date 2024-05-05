import type { IntlShape} from "@formatjs/intl";
import { createIntl } from "@formatjs/intl";
import * as translations from "./translations";
import type { translateEvaluators } from "./translations";

export const DEFAULT_LANGUAGE = "en";
export const AVAILABLE_LANGUAGES = Object.keys(translations);

/**
 *
 */
export class TranslationManager {
    private _availableLanguageCodes: string[] = [];
    private _loadedLanguages: Map<string, IntlShape<string>> = new Map();
    private _language: string;

    /**
     *
     * @param language
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
     *
     */
    set language(newValue: string) {
        this._language = newValue;
        if(!this._loadedLanguages.has(newValue)){
            this.loadLanguage(newValue);
        }
    }

    /**
     *
     */
    get languages() {
        return this._availableLanguageCodes;
    }

    /**
     *
     */
    get loadedLanguages() {
        return [...this._loadedLanguages.keys()];
    }

    /**
     *
     * @param code
     */
    private loadLanguage(code: string){
        if(!(code in translations)){
            return false;
        }
        
        this._loadedLanguages.set(code, createIntl({
            locale: code,
            messages: translations[code]
        }));

        return true;
    }

    /**
     *
     * @param id
     * @param evaluators
     */
    public translate(id: string, evaluators: translateEvaluators = {}): string {
        if(id in translations[this._language]){
            return this._loadedLanguages.get(this._language).formatMessage(
                {id},
                evaluators
            );
        }

        if(id in translations[DEFAULT_LANGUAGE]){
            return this._loadedLanguages.get(DEFAULT_LANGUAGE).formatMessage(
                {id},
                evaluators
            );
        }

        return "";
    }
}
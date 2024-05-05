import { IntlShape, createIntl } from "@formatjs/intl";
import * as translations from "./translations";
import type { translateEvaluators } from "./translations";

export const DEFAULT_LANGUAGE = "en";
export const AVAILABLE_LANGUAGES = Object.keys(translations);

const translators = Object.fromEntries(
    Object.entries(translations).map(([locale, messages]) => [
        locale,
        createIntl({ locale, messages })
    ])
);

export const translate = (
    lang: string,
    verbiage_code: string,
    evaluators: translateEvaluators = {}
) => {
    if (verbiage_code in translations[lang]) {
        return translators[lang]?.formatMessage(
            { id: verbiage_code },
            evaluators
        );
    }
    if (verbiage_code in translations[DEFAULT_LANGUAGE]) {
        return translators[DEFAULT_LANGUAGE]?.formatMessage(
            { id: verbiage_code },
            evaluators
        );
    }
    return "";
};

export class TranslationManager {
    private _availableLanguageCodes: string[] = [];
    private _loadedLanguages: Map<string, IntlShape<string>> = new Map();
    private _language = DEFAULT_LANGUAGE;

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

    set language(newValue: string) {
        this._language = newValue;
        if(!this._loadedLanguages.has(newValue)){
            this.loadLanguage(newValue);
        }
    }

    get languages() {
        return this._availableLanguageCodes;
    }

    get loadedLanguages() {
        return [...this._loadedLanguages.keys()];
    }

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

    public translate(id: string, evaluators: translateEvaluators = {}){
        if(id in translations[this._language]){
            return this._loadedLanguages.get(this._language)?.formatMessage(
                {id},
                evaluators
            );
        }

        if(id in translations[DEFAULT_LANGUAGE]){
            return this._loadedLanguages.get(DEFAULT_LANGUAGE)?.formatMessage(
                {id},
                evaluators
            );
        }

        return "";
    }
}
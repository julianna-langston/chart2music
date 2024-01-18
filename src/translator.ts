/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as translations from "./translations";
import type {
    translateEvaluators,
    translationDict,
    translationLibrary
} from "./translations";

const DEFAULT_LANGUAGE = "en";

const replace = (str: string, evaluators: translateEvaluators) => {
    let tmp = `${str}`;
    Object.entries(evaluators).forEach(([entity, replacement]) => {
        tmp = tmp.replace(new RegExp(`{{${entity}}}`), `${replacement}`);
    });
    return tmp;
};

export const translate = (
    lang: string,
    verbiage_code: string,
    evaluators: translateEvaluators = {}
) =>
    replace(
        translations[lang]?.[verbiage_code] ??
            translations[DEFAULT_LANGUAGE]?.[verbiage_code],
        evaluators
    ) ?? "";

/**
 * Manages translations
 */
export class Translator {
    dict: translationDict;

    /**
     * Initialize translator, including which language to translate into
     * @param language_code - which language should be in focus
     * @param customTranslations - custom verbiage
     */
    constructor(
        language_code: keyof typeof translations,
        customTranslations: translationLibrary
    ) {
        this.dict =
            customTranslations?.[language_code] ??
            translations?.[language_code] ??
            {};
    }

    /**
     * Write out expected text
     * @param verbiage_code - Which line to translate
     * @param [evaluators] - entities to interpolate into the translation
     * @returns - text in default language
     */
    translate(verbiage_code: string, evaluators: translateEvaluators = {}) {
        return (
            replace(
                this.dict[verbiage_code] ??
                    translations[DEFAULT_LANGUAGE][verbiage_code],
                evaluators
            ) ?? ""
        );
    }
}

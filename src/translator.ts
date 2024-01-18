import { createIntl } from "@formatjs/intl";
import * as translations from "./translations";
import type { translateEvaluators } from "./translations";

export const DEFAULT_LANGUAGE = "en";

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

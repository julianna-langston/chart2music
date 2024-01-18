/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
) => translators[lang].formatMessage({ id: verbiage_code }, evaluators);

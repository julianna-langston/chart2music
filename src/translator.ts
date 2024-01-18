/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as translations from "./translations";
import type { translateEvaluators } from "./translations";

export const DEFAULT_LANGUAGE = "en";

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

import en from "./en";

/**
 *
 */
export type translationDict = Record<string, string>;
/**
 *
 */
export type translationLibrary = Record<string, translationDict>;
/**
 *
 */
export type translatableEntity = string | number;
/**
 *
 */
export type translateEvaluators = Record<string, translatableEntity>;

export { en };

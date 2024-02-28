// Default language
import en from "./en";

// Translations
import de from "./de";
import es from "./es";
import fr from "./fr";
import it from "./it";

/**
 * A dictionary of messages, which will be used by the i18n formatter
 */
export type translationDict = Record<string, string>;
/**
 * Entities to be interpolated into translations. For example, in the ICU message "hello {world}", the entity is "world".
 */
export type translateEvaluators = Record<string, string | number | boolean>;

export { en, de, es, fr, it };

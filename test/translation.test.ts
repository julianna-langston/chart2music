import { translate } from "../src/translator";

const customDictionary = {
    custom: {
        no_entity: "Hello world",
        with_entity: "Hello {{title}}"
    },
    custom2: {
        no_entity: "Hello World!"
    }
};

describe("translation", () => {
    test("no entities", () => {
        expect(translate("custom", "no_entity", {}, customDictionary)).toBe(
            "Hello world"
        );
        expect(translate("custom2", "no_entity", {}, customDictionary)).toBe(
            "Hello World!"
        );
    });
    test("check english dictionary", () => {
        expect(translate("en", "tooHigh")).toBe("too high");
    });
    test("check entities", () => {
        expect(
            translate(
                "custom",
                "with_entity",
                { title: "universe" },
                customDictionary
            )
        ).toBe("Hello universe");
    });
});

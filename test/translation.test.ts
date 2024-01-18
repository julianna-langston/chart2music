import { translate } from "../src/translator";

const customDictionary = {
    custom: {
        no_entity: "Hello world",
        with_entity: "Hello {{title}}"
    }
};

describe("translation", () => {
    test("no entities", () => {
        expect(translate("custom", "no_entity", {}, customDictionary)).toBe(
            "Hello world"
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

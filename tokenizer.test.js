import moo from "moo";
import lexer from "./tokenizer";

describe("Basic Lexing", () => {
    it("detects commas", () => {
        lexer.reset(",");
        expect(lexer.next()).toHaveProperty("type", "comma");
    });
    it("detects periods", () => {
        lexer.reset(".");
        expect(lexer.next()).toHaveProperty("type", "period");
    });
    it("detects question marks", () => {
        lexer.reset("?");
        expect(lexer.next()).toHaveProperty("type", "qmark");
    });
    it("handles unicode", () => {
        lexer.reset("Dàvid");
        expect(lexer.next()).toHaveProperty("type", "string");
    });
    it("lexes correctly", () => {
        lexer.reset("David Newbury, 1990?.");
        let val = "";
        val = lexer.next();
        expect(val).toHaveProperty("type", "string");
        expect(val).toHaveProperty("value", "David");
        val = lexer.next();
        expect(val).toHaveProperty("type", "WS");
        val = lexer.next();
        expect(val).toHaveProperty("type", "string");
        expect(val).toHaveProperty("value", "Newbury");
        val = lexer.next();
        expect(val).toHaveProperty("type", "comma");
        val = lexer.next();
        expect(val).toHaveProperty("type", "WS");
        val = lexer.next();
        expect(val).toHaveProperty("type", "number");
        expect(val).toHaveProperty("value", 1990);
        val = lexer.next();
        expect(val).toHaveProperty("type", "qmark");
        val = lexer.next();
        expect(val).toHaveProperty("type", "period");
        val = lexer.next();
        expect(val).toBeUndefined();
    });
});

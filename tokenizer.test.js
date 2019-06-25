import moo from "moo";
import lexer from "./tokenizer";

describe("Basic Lexing", () => {
    it("lexes correctly", () => {
        lexer.reset("while (10");
        const val1 = lexer.next();
        expect(val1).toHaveProperty("type", "keyword");
        expect(val1).toHaveProperty("value", "while");
        const val2 = lexer.next();
        expect(val2).toHaveProperty("type", "WS");
        expect(val2).toHaveProperty("value", " ");
        const val3 = lexer.next();
        expect(val3).toHaveProperty("type", "lparen");
        const val4 = lexer.next();
        expect(val4).toHaveProperty("type", "number");
        expect(val4).toHaveProperty("value", "10");
        const val5 = lexer.next();
        expect(val5).toBeUndefined();
    });
});

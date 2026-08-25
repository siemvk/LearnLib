import { describe, it, expect } from "bun:test";
import { urlSafeString, Grade, fase } from "../types";
import { Grade, fase } from "../types";

describe("urlSafeString", () => {
    it("accepts valid URL-safe strings", () => {
        const str1 = new urlSafeString("simple_method-123");
        expect(str1.value).toBe("simple_method-123");
        expect(str1.toString()).toBe("simple_method-123");
    });

    it("throws an error for strings with invalid characters", () => {
        expect(() => new urlSafeString("invalid string with spaces")).toThrow("Value must be URL safe");
        expect(() => new urlSafeString("invalid/slash")).toThrow("Value must be URL safe");
        expect(() => new urlSafeString("special!@#")).toThrow("Value must be URL safe");
    });
});

describe("Enums", () => {
    it("has correct values for Grade enum", () => {
        expect(Grade.Fout).toBe(0);
        expect(Grade.GoedMoeilijk).toBe(1);
        expect(Grade.GoedPrima).toBe(2);
        expect(Grade.GoedMakkelijk).toBe(3);
    });

    it("has correct values for fase enum", () => {
        expect(fase.Leer).toBe(0);
        expect(fase.Review).toBe(1);
    });
});

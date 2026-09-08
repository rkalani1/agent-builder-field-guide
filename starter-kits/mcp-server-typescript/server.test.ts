import { validateName } from "./server.js";

describe("validateName", () => {
  it("should return valid for a normal string", () => {
    const result = validateName("Alice");
    expect(result).toEqual({ valid: true, name: "Alice" });
  });

  it("should trim whitespace from a valid string", () => {
    const result = validateName("  Bob  ");
    expect(result).toEqual({ valid: true, name: "Bob" });
  });

  it("should return error for non-string input", () => {
    expect(validateName(123)).toEqual({
      valid: false,
      error: "Error: name must be a non-empty string.",
    });
    expect(validateName(null)).toEqual({
      valid: false,
      error: "Error: name must be a non-empty string.",
    });
    expect(validateName({})).toEqual({
      valid: false,
      error: "Error: name must be a non-empty string.",
    });
  });

  it("should return error for empty string", () => {
    const result = validateName("");
    expect(result).toEqual({
      valid: false,
      error: "Error: name must be a non-empty string.",
    });
  });

  it("should return error for names longer than 100 characters", () => {
    const longName = "A".repeat(101);
    const result = validateName(longName);
    expect(result).toEqual({
      valid: false,
      error: "Error: name must be 100 characters or fewer.",
    });
  });

  it("should return valid for names exactly 100 characters", () => {
    const hundredChars = "A".repeat(100);
    const result = validateName(hundredChars);
    expect(result).toEqual({ valid: true, name: hundredChars });
  });

  it("should return error for names with forbidden characters", () => {
    const forbiddenChars = ["\n", "\r", "\x00", ";", "<", ">", "&", "|", "`", "$", "(", ")", "{", "}", "[", "]"];

    for (const char of forbiddenChars) {
      const result = validateName(`Test${char}Name`);
      expect(result).toEqual({
        valid: false,
        error: "Error: name contains invalid characters.",
      });
    }
  });
});

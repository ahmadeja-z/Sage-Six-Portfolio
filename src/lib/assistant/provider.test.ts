import { describe, it, expect } from "vitest";
import { runAssistant } from "./index";
import fs from "fs";
import path from "path";

// Load .env.local for testing
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const idx = line.indexOf("=");
    if (idx > 0 && !line.startsWith("#")) {
      process.env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }
}

describe("runAssistant Live Integration", () => {
  it("should return a structured response from Gemini", async () => {
    const result = await runAssistant({
      message: "What services does Sage Six offer?",
      sessionId: "test-vitest",
    });

    console.log("Integration test result:", JSON.stringify(result, null, 2));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.message).toBeTruthy();
      expect(Array.isArray(result.data.suggestedPrompts)).toBe(true);
    }
  }, 30000);
});

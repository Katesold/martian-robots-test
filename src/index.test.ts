import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("index", () => {
  it("logs the correct output for correct input", () => {
    const input = "5 3\n1 1 E\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL\n";

    const result = spawnSync(process.execPath, ["--import", "tsx", "src/index.ts"], { input, encoding: "utf8" });

    expect(result.status).toBe(0);
    expect(result.stdout).toBe("1 1 E\n3 3 N LOST\n2 3 S\n");
    expect(result.stderr).toBe("");
  });

  it("logs input errors to stderr and exits with 1", () => {
    const input = "5 3\n1 1 E\nRFX\n";

    const result = spawnSync(process.execPath, ["--import", "tsx", "src/index.ts"], { input, encoding: "utf8" });

    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe('Invalid input. Line 3: Invalid robot instructions "RFX": use L, R, F\n');
  });
});

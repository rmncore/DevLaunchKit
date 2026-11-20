import { test, before, after } from "node:test";
import * as assert from "node:assert";
import * as fs from "node:fs";
import * as path from "node:path";
import { tmpdir } from "node:os";
import { handleCreateCommand } from "../src/commands/create.js";
import { handleAddCommand } from "../src/commands/add.js";
import { handleDoctorCommand } from "../src/commands/doctor.js";

const originalCwd = process.cwd();
let testDirectory: string | undefined;

before(() => {
  testDirectory = fs.mkdtempSync(path.join(tmpdir(), "devlaunchkit-cli-"));
  process.chdir(testDirectory);
});

after(() => {
  process.chdir(originalCwd);
  if (testDirectory) fs.rmSync(testDirectory, { recursive: true, force: true });
});

test("CLI Create command simulation", () => {
  let logOutput = "";
  const originalLog = console.log;
  console.log = (msg: string) => {
    logOutput += msg + "\n";
  };

  try {
    handleCreateCommand("saas-demo", false);
    assert.ok(logOutput.includes("Initializing new SaaS application"));
    assert.ok(logOutput.includes("saas-demo"));
    assert.ok(fs.existsSync("saas-demo/package.json"));
  } finally {
    console.log = originalLog;
  }
});

test("CLI Add command simulation", () => {
  let logOutput = "";
  const originalLog = console.log;
  console.log = (msg: string) => {
    logOutput += msg + "\n";
  };

  try {
    handleAddCommand("stripe", false);
    assert.ok(logOutput.includes("Configuring provider module"));
    assert.match(fs.readFileSync(".env", "utf8"), /^STRIPE_API_KEY=/m);
    assert.ok(logOutput.includes("stripe"));
  } finally {
    console.log = originalLog;
  }
});

test("CLI Doctor command simulation", async () => {
  let logOutput = "";
  const originalLog = console.log;
  console.log = (msg: string) => {
    logOutput += msg + "\n";
  };

  try {
    await handleDoctorCommand(false);
    assert.ok(logOutput.includes("system health"));
    assert.ok(logOutput.includes("Node.js runtime: OK"));
  } finally {
    console.log = originalLog;
  }
});

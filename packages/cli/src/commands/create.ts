import { cpSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const template = fileURLToPath(new URL("../../templates/nextjs/", import.meta.url));

export function handleCreateCommand(projectName: string, shouldExit = true): void {
  console.log(`Initializing new SaaS application: "${projectName}"`);

  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(projectName)) {
    console.error("Use a lowercase project name with letters, numbers, or hyphens.");
    if (shouldExit) process.exitCode = 1;
    return;
  }

  const targetDir = resolve(process.cwd(), projectName);

  try {
    mkdirSync(targetDir);
    for (const entry of readdirSync(template)) {
      cpSync(join(template, entry), join(targetDir, entry === "gitignore" ? ".gitignore" : entry), {
        recursive: true,
        force: false,
        errorOnExist: true,
      });
    }
    const manifest = {
      name: projectName,
      version: "0.1.0",
      private: true,
      packageManager: "pnpm@9.15.0",
      scripts: { dev: "next dev", build: "next build", start: "next start" },
      dependencies: { next: "^15.5.29", react: "^19.3.0", "react-dom": "^19.3.0" },
      devDependencies: {
        "@types/node": "^22.20.1",
        "@types/react": "^19.3.0",
        "@types/react-dom": "^19.3.0",
        typescript: "^5.9.3",
      },
    };
    writeFileSync(join(targetDir, "package.json"), JSON.stringify(manifest, null, 2) + "\n");
    writeFileSync(
      join(targetDir, "README.md"),
      `# ${projectName}\n\nRun \`pnpm install\` and \`pnpm dev\` to start developing.\n\nBuild with \`pnpm build\`.\n`
    );
    console.log(`Created ${projectName}. Run cd ${projectName}, pnpm install, then pnpm dev.`);
  } catch (error) {
    console.error(
      "Could not scaffold the project:",
      error instanceof Error ? error.message : error
    );
    if (shouldExit) process.exitCode = 1;
  }
}

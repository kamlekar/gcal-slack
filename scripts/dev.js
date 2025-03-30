import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const remixPath = join(
  __dirname,
  "..",
  "node_modules",
  "@remix-run",
  "dev",
  "dist",
  "cli.js"
);

try {
  execSync(
    `node "${remixPath}" vite:dev --host=app.integrate.local --port=3000`,
    {
      stdio: "inherit",
    }
  );
} catch (error) {
  console.error("Failed to start Remix development server:", error);
  process.exit(1);
}

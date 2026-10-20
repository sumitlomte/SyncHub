import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import watch from "node-watch";

const prettierPath = fileURLToPath(
  new URL("../node_modules/prettier/bin/prettier.cjs", import.meta.url),
);

watch(
  ".",
  {
    recursive: true,
    filter(filePath, skip) {
      const pathParts = filePath.split(/[\\/]/);
      if (pathParts.some((part) => part === "node_modules" || part === ".git")) {
        return skip;
      }

      return /\.(js|ts|json)$/.test(filePath);
    },
  },
  (event, filePath) => {
    if (event !== "update") return;

    const prettier = spawn(
      process.execPath,
      [prettierPath, "--write", filePath],
      { stdio: "inherit" },
    );

    prettier.on("error", (error) => {
      console.error(`Failed to format ${filePath}:`, error);
    });
  },
);

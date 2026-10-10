import { spawnSync } from "node:child_process";

const config = JSON.parse(process.env.NEXT_PUBLIC_CONFIG_JSON || "{}");
if (!config || Array.isArray(config) || typeof config !== "object") {
  throw new Error("NEXT_PUBLIC_CONFIG_JSON must be an object");
}
for (const [key, value] of Object.entries(config)) {
  if (!/^NEXT_PUBLIC_[A-Z0-9_]+$/.test(key) || key === "NEXT_PUBLIC_DEPLOYMENT_ENV" || typeof value !== "string") {
    throw new Error(`Invalid public configuration key: ${key}`);
  }
}
const env = { ...process.env, ...config };
for (const args of [["exec", "fumadocs-mdx"], ["build"]]) {
  const result = spawnSync("pnpm", args, { stdio: "inherit", env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

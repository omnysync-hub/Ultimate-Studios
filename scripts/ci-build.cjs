/**
 * Vercel → next build
 * Cloudflare Workers Builds → opennextjs-cloudflare build (produces .open-next)
 * Local → next build
 */
const { execSync } = require("node:child_process");

const onCloudflare = Boolean(
  process.env.CF_PAGES ||
    process.env.WORKERS_CI ||
    // Workers Builds checkout path seen in CF logs
    (process.env.CI && process.cwd().startsWith("/opt/buildhome"))
);

const onVercel = Boolean(process.env.VERCEL);

const cmd =
  onCloudflare && !onVercel
    ? "npx opennextjs-cloudflare build"
    : "npx next build";

execSync(cmd, { stdio: "inherit", env: process.env });

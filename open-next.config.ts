import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import type { OpenNextConfig } from "@opennextjs/cloudflare";

// OpenNext invokes buildCommand for the Next.js compile step.
// Keep this as `next build` — never `npm run build` — to avoid recursion
// when package.json `build` is/was wired to OpenNext.
const cloudflare = defineCloudflareConfig({});

const config: OpenNextConfig = {
  ...cloudflare,
  buildCommand: "npx next build"
};

export default config;

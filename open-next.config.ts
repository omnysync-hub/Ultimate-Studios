import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config — add R2 incremental cache later if ISR revalidation needs it.
// https://opennext.js.org/cloudflare/caching
export default defineCloudflareConfig({});

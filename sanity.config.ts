import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pbq9a26l";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/**
 * Embedded Studio at /studio (login required — Sanity project members only).
 * CORS: allow https://ultimatecineverse.com in https://www.sanity.io/manage
 */
export default defineConfig({
  name: "ultimate-cineverse",
  title: "Ultimate Cineverse",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes
  }
});

import { createClient } from "next-sanity";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pbq9a26l";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
/** Keep hard-coded per Sanity guidance — bump intentionally when you change API surface. */
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export function isSanityConfigured() {
  return Boolean(sanityProjectId && sanityProjectId !== "missing-project-id");
}

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
  perspective: "published"
});

/** Token client for drafts / migration scripts (server only). */
export function getSanityWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) return null;
  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    useCdn: false,
    token,
    perspective: "previewDrafts"
  });
}

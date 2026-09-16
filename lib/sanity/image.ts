import imageUrlBuilder from "@sanity/image-url";
import { sanityClient, isSanityConfigured, sanityProjectId, sanityDataset } from "./client";

const builder = isSanityConfigured()
  ? imageUrlBuilder(sanityClient)
  : imageUrlBuilder({ projectId: sanityProjectId || "x", dataset: sanityDataset });

export function urlForImage(source: Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0]) {
  if (!isSanityConfigured()) return null;
  return builder.image(source);
}

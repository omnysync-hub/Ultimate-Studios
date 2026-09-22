import type { Metadata, Viewport } from "next";
import {
  metadata as studioMetadata,
  viewport as studioViewport
} from "next-sanity/studio";
import { StudioApp } from "@/components/studio/StudioApp";

export const dynamic = "force-static";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Studio | Ultimate Cineverse"
};

export const viewport: Viewport = {
  ...studioViewport,
  interactiveWidget: "resizes-content"
};

export default function StudioPage() {
  return <StudioApp />;
}

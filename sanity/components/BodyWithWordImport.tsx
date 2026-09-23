"use client";

import { useCallback, useRef, useState } from "react";
import { Stack, Button, Card, Text, Flex, Box } from "@sanity/ui";
import { useClient } from "sanity";
import type { ArrayOfObjectsInputProps } from "sanity";
import { set } from "sanity";
import mammoth from "mammoth";

type PtSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

type PtBlock = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: { _type: string; _key: string; href?: string }[];
  children: PtSpan[];
  listItem?: "bullet" | "number";
  level?: number;
};

type PtImage = {
  _type: "image";
  _key: string;
  asset: { _type: "reference"; _ref: string };
  alt: string;
};

type PtNode = PtBlock | PtImage;

function key() {
  return Math.random().toString(36).slice(2, 10);
}

function textToSpans(text: string, marks: string[] = []): PtSpan[] {
  return [{ _type: "span", _key: key(), text, marks }];
}

/** Minimal HTML → Portable Text (Word/mammoth output). */
function htmlToPortableText(html: string, imageRefBySrc: Map<string, string>): PtNode[] {
  const doc = new DOMParser().parseFromString(`<div id="root">${html}</div>`, "text/html");
  const root = doc.getElementById("root");
  if (!root) return [];

  const nodes: PtNode[] = [];

  const walkInline = (
    el: Node,
    marks: string[] = [],
    markDefs: PtBlock["markDefs"] = []
  ): { children: PtSpan[]; markDefs: PtBlock["markDefs"] } => {
    const children: PtSpan[] = [];
    const defs = [...markDefs];

    el.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const t = child.textContent || "";
        if (t) children.push(...textToSpans(t, marks));
        return;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      const element = child as HTMLElement;
      const tag = element.tagName.toLowerCase();

      if (tag === "strong" || tag === "b") {
        const inner = walkInline(element, [...marks, "strong"], defs);
        children.push(...inner.children);
        return;
      }
      if (tag === "em" || tag === "i") {
        const inner = walkInline(element, [...marks, "em"], defs);
        children.push(...inner.children);
        return;
      }
      if (tag === "a") {
        const href = element.getAttribute("href") || "";
        const markKey = key();
        defs.push({ _type: "link", _key: markKey, href });
        const inner = walkInline(element, [...marks, markKey], defs);
        children.push(...inner.children);
        return;
      }
      if (tag === "br") {
        children.push(...textToSpans("\n", marks));
        return;
      }
      const inner = walkInline(element, marks, defs);
      children.push(...inner.children);
    });

    return { children, markDefs: defs };
  };

  const pushBlock = (
    style: string,
    el: HTMLElement,
    listItem?: "bullet" | "number"
  ) => {
    const { children, markDefs } = walkInline(el);
    if (!children.length) return;
    nodes.push({
      _type: "block",
      _key: key(),
      style,
      markDefs,
      children,
      ...(listItem ? { listItem, level: 1 } : {})
    });
  };

  root.childNodes.forEach((child) => {
    if (child.nodeType !== Node.ELEMENT_NODE) {
      const t = child.textContent?.trim();
      if (t) {
        nodes.push({
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: textToSpans(t)
        });
      }
      return;
    }

    const el = child as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === "h1" || tag === "h2") return pushBlock("h2", el);
    if (tag === "h3" || tag === "h4") return pushBlock("h3", el);
    if (tag === "blockquote") return pushBlock("blockquote", el);
    if (tag === "p") return pushBlock("normal", el);
    if (tag === "ul") {
      el.querySelectorAll(":scope > li").forEach((li) => pushBlock("normal", li as HTMLElement, "bullet"));
      return;
    }
    if (tag === "ol") {
      el.querySelectorAll(":scope > li").forEach((li) => pushBlock("normal", li as HTMLElement, "number"));
      return;
    }
    if (tag === "img") {
      const src = el.getAttribute("src") || "";
      const alt = el.getAttribute("alt") || "Article image";
      const ref = imageRefBySrc.get(src);
      if (ref) {
        nodes.push({
          _type: "image",
          _key: key(),
          asset: { _type: "reference", _ref: ref },
          alt
        });
      }
      return;
    }
    if (tag === "figure") {
      const img = el.querySelector("img");
      if (img) {
        const src = img.getAttribute("src") || "";
        const alt = img.getAttribute("alt") || el.querySelector("figcaption")?.textContent || "Article image";
        const ref = imageRefBySrc.get(src);
        if (ref) {
          nodes.push({
            _type: "image",
            _key: key(),
            asset: { _type: "reference", _ref: ref },
            alt
          });
        }
      }
      return;
    }
    pushBlock("normal", el);
  });

  return nodes;
}

export function BodyWithWordImport(props: ArrayOfObjectsInputProps) {
  const client = useClient({ apiVersion: "2025-01-01" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onFile = useCallback(
    async (file: File) => {
      setBusy(true);
      setMessage(null);
      try {
        const buffer = await file.arrayBuffer();
        const imageRefBySrc = new Map<string, string>();
        let imgIndex = 0;

        const result = await mammoth.convertToHtml(
          { arrayBuffer: buffer },
          {
            convertImage: mammoth.images.imgElement(async (image) => {
              const bytes = await image.read();
              const raw = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes as unknown as ArrayBuffer);
              const copy = new Uint8Array(raw.byteLength);
              copy.set(raw);
              const blob = new Blob([copy], {
                type: image.contentType || "image/png"
              });
              const filename = `word-import-${Date.now()}-${imgIndex++}.${(image.contentType || "image/png").split("/")[1] || "png"}`;
              const asset = await client.assets.upload("image", blob, { filename });
              const placeholder = `sanity-asset://${asset._id}`;
              imageRefBySrc.set(placeholder, asset._id);
              return { src: placeholder };
            })
          }
        );

        const blocks = htmlToPortableText(result.value, imageRefBySrc);
        if (!blocks.length) {
          setMessage("No content found in that Word file.");
          return;
        }
        props.onChange(set(blocks));
        setMessage(`Imported ${blocks.length} blocks. Review the body, then fill Google & Answers tabs.`);
      } catch (err) {
        console.error(err);
        setMessage("Import failed. Try saving as .docx and upload again.");
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [client, props]
  );

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} shadow={1} tone="transparent" border>
        <Flex align="center" gap={3} wrap="wrap">
          <Button
            text={busy ? "Importing…" : "Import from Word (.docx)"}
            tone="primary"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          />
          <Text size={1} muted>
            Best path when your draft has images. Paste still works for text styles.
          </Text>
          <input
            ref={inputRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onFile(file);
            }}
          />
        </Flex>
        {message ? (
          <Box marginTop={3}>
            <Text size={1}>{message}</Text>
          </Box>
        ) : null}
      </Card>
      {props.renderDefault(props)}
    </Stack>
  );
}

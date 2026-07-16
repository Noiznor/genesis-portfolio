"use client";

import { KeyboardEvent, useState } from "react";
import type { GalleryGroup, GalleryItem } from "@/types";

type GalleryProps = {
  galleryGroups: GalleryGroup[];
};

function isVideoItem(item: GalleryItem) {
  if (item.mediaType === "video") return true;

  return /\.(mp4|webm|mov)(\?|$)/i.test(item.imageUrl);
}

function mediaLabel(group: GalleryGroup) {
  const videoCount = group.items.filter(isVideoItem).length;
  const imageCount = group.items.length - videoCount;

  if (imageCount > 0 && videoCount > 0) {
    return `${imageCount} photos ? ${videoCount} videos`;
  }

  if (videoCount > 0) {
    return `${videoCount} videos`;
  }

  return `${imageCount} photos`;
}

function MediaPreview({
  item,
  title,
  className,
  controls = false
}: {
  item: GalleryItem;
  title: string;
  className: string;
  controls?: boolean;
}) {
  if (isVideoItem(item)) {
    return (
      <video
        src={item.imageUrl}
        className={className}
        controls={controls}
        muted={!controls}
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <img
      src={item.imageUrl}
      alt={item.caption || title}
      className={className}
    />
  );
}

function GalleryPreviewStack({ group }: { group: GalleryGroup }) {
  const previewItems = group.items.slice(0, 3);
  const remainingCount = Math.max(group.items.length - 3, 0);

  if (previewItems.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-emerald-400/10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_60%)]">
        <div className="text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
            Gallery
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Add media in sudo edit
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-56 grid-cols-3 gap-2 overflow-hidden rounded-2xl">
      {previewItems.map((item, index) => (
        <div
          key={item.id}
          className={
            index === 0
              ? "relative col-span-2 overflow-hidden bg-slate-900"
              : "relative overflow-hidden bg-slate-900"
          }
        >
          <MediaPreview
            item={item}
            title={group.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {isVideoItem(item) ? (
            <div className="absolute left-3 top-3 rounded-full border border-cyan-300/30 bg-slate-950/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
              Video
            </div>
          ) : null}

          {index === previewItems.length - 1 && remainingCount > 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/65">
              <span className="rounded-full border border-emerald-300/30 bg-slate-950/80 px-4 py-2 font-mono text-sm font-bold text-emerald-200">
                +{remainingCount}
              </span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function Gallery({ galleryGroups }: GalleryProps) {
  const [selectedGroup, setSelectedGroup] = useState<GalleryGroup | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  function openGroup(group: GalleryGroup) {
    setSelectedGroup(group);
    setSelectedItem(null);
  }

  function handleGroupKeyDown(
    event: KeyboardEvent<HTMLElement>,
    group: GalleryGroup
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGroup(group);
    }
  }

  return (
    <section id="gallery" className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
        Gallery
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-50">
        Highlights, photos, and videos
      </h2>

      <p className="mt-4 max-w-3xl leading-7 text-slate-400">
        A collection of visual highlights from projects, events, internship
        experiences, campus moments, and personal milestones.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {galleryGroups.length > 0 ? (
          galleryGroups.map((group) => (
            <article
              key={group.id}
              role="button"
              tabIndex={0}
              onClick={() => openGroup(group)}
              onKeyDown={(event) => handleGroupKeyDown(event, group)}
              className="group cursor-pointer rounded-3xl border border-emerald-400/10 bg-slate-950/75 p-4 shadow-lg shadow-emerald-500/5 outline-none transition hover:-translate-y-1 hover:border-emerald-400/35 hover:bg-emerald-400/[0.03] hover:shadow-emerald-500/15 focus-visible:border-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-300/40"
            >
              <GalleryPreviewStack group={group} />

              <div className="mt-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold text-slate-50">
                    {group.title}
                  </h3>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 font-mono text-xs text-emerald-200">
                    {mediaLabel(group)}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                  {group.description || "A quick highlight collection."}
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-emerald-400/10 bg-slate-950/75 p-8 text-slate-400 md:col-span-2 xl:col-span-3">
            Gallery highlights will appear here after they are added in admin mode.
          </div>
        )}
      </div>

      {selectedGroup ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/90 px-6 py-10 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-emerald-400/10 bg-slate-950 p-6 shadow-2xl shadow-emerald-500/10">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
                  Gallery Highlight
                </p>
                <h3 className="mt-2 text-3xl font-bold text-slate-50">
                  {selectedGroup.title}
                </h3>
                <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                  {selectedGroup.description || "A quick highlight collection."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedGroup(null);
                  setSelectedItem(null);
                }}
                className="rounded-full border border-emerald-400/20 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-emerald-300 hover:text-emerald-200"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedGroup.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="group overflow-hidden rounded-2xl border border-emerald-400/10 bg-slate-950 text-left shadow-lg shadow-emerald-500/5 outline-none transition hover:-translate-y-1 hover:border-emerald-400/30 focus-visible:ring-2 focus-visible:ring-emerald-300/40"
                >
                  <div className="relative">
                    <MediaPreview
                      item={item}
                      title={selectedGroup.title}
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {isVideoItem(item) ? (
                      <div className="absolute left-3 top-3 rounded-full border border-cyan-300/30 bg-slate-950/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
                        Video
                      </div>
                    ) : null}
                  </div>

                  {item.caption ? (
                    <p className="p-4 text-sm text-slate-300">{item.caption}</p>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {selectedItem ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-6 backdrop-blur-xl"
          onClick={() => setSelectedItem(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedItem(null)}
            className="absolute right-6 top-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"
          >
            Close
          </button>

          <div
            className="max-h-[85vh] max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            {isVideoItem(selectedItem) ? (
              <video
                src={selectedItem.imageUrl}
                controls
                playsInline
                className="max-h-[80vh] w-full rounded-2xl object-contain shadow-2xl"
              />
            ) : (
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.caption || "Gallery image"}
                className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
              />
            )}

            {selectedItem.caption ? (
              <p className="mt-4 text-center text-sm text-slate-300">
                {selectedItem.caption}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

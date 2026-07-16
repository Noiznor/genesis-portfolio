"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { GalleryGroup } from "@/types";

type SaveStatus = "idle" | "saving" | "success" | "error";
type GalleryMediaType = "image" | "video";

type GalleryItemFormData = {
  id: string;
  imageUrl: string;
  imagePath: string;
  mediaType: GalleryMediaType;
  caption: string;
};

type GalleryGroupFormData = {
  id: string;
  title: string;
  description: string;
  items: GalleryItemFormData[];
};

function createBrowserSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createClient(supabaseUrl, supabaseKey);
}

type GalleryAdminEditorProps = {
  galleryGroups: GalleryGroup[];
  adminPassword: string;
};

function mapGalleryGroupToForm(group: GalleryGroup): GalleryGroupFormData {
  return {
    id: group.id,
    title: group.title,
    description: group.description,
    items: group.items.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      imagePath: item.imagePath ?? "",
      mediaType: item.mediaType === "video" || /\\.(mp4|webm|mov)(\\?|$)/i.test(item.imageUrl) ? "video" : "image",
      caption: item.caption ?? ""
    }))
  };
}

function slugifyGalleryValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function createGalleryGroupDraft(index: number): GalleryGroupFormData {
  return {
    id: `gallery-highlight-${index + 1}`,
    title: `Gallery Highlight ${index + 1}`,
    description: "",
    items: []
  };
}

function createGalleryItemDraft(index: number): GalleryItemFormData {
  return {
    id: `manual-gallery-image-${Date.now()}-${index}`,
    imageUrl: "",
    imagePath: "",
    mediaType: "image",
    caption: ""
  };
}

export function GalleryAdminEditor({
  galleryGroups,
  adminPassword
}: GalleryAdminEditorProps) {
  const router = useRouter();
  const [galleryFormData, setGalleryFormData] = useState<GalleryGroupFormData[]>(
    () => galleryGroups.map(mapGalleryGroupToForm)
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setGalleryFormData(galleryGroups.map(mapGalleryGroupToForm));
    setSaveStatus("idle");
    setStatusMessage("");
  }, [galleryGroups]);

  const inputClass =
    "mt-2 w-full rounded-xl border border-emerald-400/15 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20";

  const labelClass =
    "text-xs font-bold uppercase tracking-[0.16em] text-slate-400";

  function statusClass(status: SaveStatus) {
    return `rounded-2xl border px-4 py-3 text-sm ${
      status === "success"
        ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
        : status === "error"
          ? "border-red-400/25 bg-red-400/10 text-red-200"
          : "border-slate-700 bg-slate-900 text-slate-300"
    }`;
  }

  function updateGalleryGroupField(
    groupIndex: number,
    field: keyof Pick<GalleryGroupFormData, "id" | "title" | "description">,
    value: string
  ) {
    setGalleryFormData((current) =>
      current.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              [field]: field === "id" ? slugifyGalleryValue(value) : value
            }
          : group
      )
    );
  }

  function updateGalleryItemField(
    groupIndex: number,
    itemIndex: number,
    field: keyof Pick<GalleryItemFormData, "imageUrl" | "caption">,
    value: string
  ) {
    setGalleryFormData((current) =>
      current.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              items: group.items.map((item, currentItemIndex) =>
                currentItemIndex === itemIndex
                  ? {
                      ...item,
                      [field]: value
                    }
                  : item
              )
            }
          : group
      )
    );
  }

  function addGalleryGroup() {
    setGalleryFormData((current) => [
      ...current,
      createGalleryGroupDraft(current.length)
    ]);
    setSaveStatus("success");
    setStatusMessage("New gallery group added. Upload images, then click Save Gallery.");
  }

  function addManualGalleryImage(groupIndex: number) {
    setGalleryFormData((current) =>
      current.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              items: [...group.items, createGalleryItemDraft(group.items.length)]
            }
          : group
      )
    );
  }

  function removeGalleryItem(groupIndex: number, itemIndex: number) {
    const confirmed = window.confirm(
      "Remove this image from the gallery group? Click Save Gallery after this to publish the change."
    );

    if (!confirmed) return;

    setGalleryFormData((current) =>
      current.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              items: group.items.filter(
                (_, currentItemIndex) => currentItemIndex !== itemIndex
              )
            }
          : group
      )
    );

    setSaveStatus("success");
    setStatusMessage("Image removed from this draft. Click Save Gallery to publish the change.");
  }

  function deleteGalleryGroup(groupIndex: number) {
    const group = galleryFormData[groupIndex];

    if (!group) return;

    const confirmed = window.confirm(
      `Delete gallery group "${group.title || group.id}" and its images? Click Save Gallery after this to publish the change.`
    );

    if (!confirmed) return;

    setGalleryFormData((current) =>
      current.filter((_, index) => index !== groupIndex)
    );

    setSaveStatus("success");
    setStatusMessage("Gallery group removed from this draft. Click Save Gallery to publish the change.");
  }

  async function uploadGalleryImages(
    event: ChangeEvent<HTMLInputElement>,
    groupIndex: number
  ) {
    const files = Array.from(event.target.files ?? []);
    const group = galleryFormData[groupIndex];

    if (!group || files.length === 0) return;

    setSaveStatus("saving");
    setStatusMessage(`Uploading ${files.length} gallery media file(s) directly to Supabase...`);

    try {
      const supabase = createBrowserSupabaseClient();
      const uploadedItems: GalleryItemFormData[] = [];

      for (const file of files) {
        const tokenResponse = await fetch("/api/admin/gallery-upload-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            password: adminPassword,
            groupSlug: group.id || group.title || "gallery",
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
          })
        });

        const tokenResult = (await tokenResponse.json()) as {
          path?: string;
          token?: string;
          publicUrl?: string;
          mediaType?: GalleryMediaType;
          error?: string;
        };

        if (
          !tokenResponse.ok ||
          !tokenResult.path ||
          !tokenResult.token ||
          !tokenResult.publicUrl
        ) {
          throw new Error(tokenResult.error || "Failed to prepare direct gallery upload.");
        }

        const { error: uploadError } = await supabase.storage
          .from("portfolio-gallery")
          .uploadToSignedUrl(tokenResult.path, tokenResult.token, file, {
            contentType: file.type
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        uploadedItems.push({
          id: tokenResult.path,
          imageUrl: tokenResult.publicUrl,
          imagePath: tokenResult.path,
          mediaType: tokenResult.mediaType === "video" ? "video" : "image",
          caption: ""
        });
      }

      setGalleryFormData((current) =>
        current.map((currentGroup, index) =>
          index === groupIndex
            ? {
                ...currentGroup,
                items: [...currentGroup.items, ...uploadedItems]
              }
            : currentGroup
        )
      );

      setSaveStatus("success");
      setStatusMessage("Gallery media uploaded directly to Supabase. Click Save Gallery to publish it.");
    } catch (error) {
      setSaveStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while uploading gallery media."
      );
    } finally {
      event.target.value = "";
    }
  }

  async function handleGallerySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaveStatus("saving");
    setStatusMessage("Saving gallery to Supabase...");

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          galleryGroups: galleryFormData
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to save gallery.");
      }

      setSaveStatus("success");
      setStatusMessage("Gallery saved successfully.");
      router.refresh();
    } catch (error) {
      setSaveStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while saving gallery."
      );
    }
  }

  return (
    <form onSubmit={handleGallerySubmit} className="space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-50">Gallery Highlights</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Create Facebook-style highlight groups, upload multiple images,
            add captions, and save them to Supabase.
          </p>
        </div>

        <button
          type="button"
          onClick={addGalleryGroup}
          className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-3 text-sm font-bold text-emerald-200 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-400/10"
        >
          Add Gallery Group
        </button>
      </div>

      {galleryFormData.length > 0 ? (
        <div className="space-y-6">
          {galleryFormData.map((group, groupIndex) => (
            <div
              key={group.id || groupIndex}
              className="rounded-3xl border border-emerald-400/10 bg-slate-950/70 p-5"
            >
              <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor={`gallerySlug-${groupIndex}`} className={labelClass}>
                      Group Slug
                    </label>
                    <input
                      id={`gallerySlug-${groupIndex}`}
                      value={group.id}
                      onChange={(event) =>
                        updateGalleryGroupField(groupIndex, "id", event.target.value)
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor={`galleryTitle-${groupIndex}`} className={labelClass}>
                      Group Title
                    </label>
                    <input
                      id={`galleryTitle-${groupIndex}`}
                      value={group.title}
                      onChange={(event) =>
                        updateGalleryGroupField(groupIndex, "title", event.target.value)
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor={`galleryDescription-${groupIndex}`} className={labelClass}>
                      Quick Description
                    </label>
                    <textarea
                      id={`galleryDescription-${groupIndex}`}
                      value={group.description}
                      onChange={(event) =>
                        updateGalleryGroupField(groupIndex, "description", event.target.value)
                      }
                      rows={3}
                      className={inputClass}
                      placeholder="Short highlight description, like a Facebook story/highlight caption."
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteGalleryGroup(groupIndex)}
                  className="rounded-xl border border-red-400/30 bg-red-400/5 px-5 py-3 text-sm font-bold text-red-200 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-400/10"
                >
                  Delete Group
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <label
                  htmlFor={`galleryUpload-${groupIndex}`}
                  className="inline-flex cursor-pointer rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-4 py-2 text-xs font-bold text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-400/10"
                >
                  Upload Images / Videos
                  <input
                    id={`galleryUpload-${groupIndex}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                    multiple
                    className="hidden"
                    onChange={(event) => uploadGalleryImages(event, groupIndex)}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => addManualGalleryImage(groupIndex)}
                  className="rounded-xl border border-slate-600 px-4 py-2 text-xs font-bold text-slate-200 transition hover:border-emerald-300 hover:text-emerald-200"
                >
                  Add Media URL Manually
                </button>

                <span className="rounded-xl border border-slate-700 px-4 py-2 font-mono text-xs text-slate-400">
                  {group.items.length} media item(s)
                </span>
              </div>

              {group.items.length > 0 ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((item, itemIndex) => (
                    <div
                      key={item.id || itemIndex}
                      className="overflow-hidden rounded-2xl border border-emerald-400/10 bg-slate-950"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.caption || group.title}
                          className="h-48 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center bg-slate-900 text-sm text-slate-500">
                          Paste media URL below
                        </div>
                      )}

                      <div className="space-y-3 p-4">
                        <div>
                          <label
                            htmlFor={`galleryImageUrl-${groupIndex}-${itemIndex}`}
                            className={labelClass}
                          >
                            Media URL
                          </label>
                          <input
                            id={`galleryImageUrl-${groupIndex}-${itemIndex}`}
                            value={item.imageUrl}
                            onChange={(event) =>
                              updateGalleryItemField(
                                groupIndex,
                                itemIndex,
                                "imageUrl",
                                event.target.value
                              )
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`galleryCaption-${groupIndex}-${itemIndex}`}
                            className={labelClass}
                          >
                            Caption
                          </label>
                          <textarea
                            id={`galleryCaption-${groupIndex}-${itemIndex}`}
                            value={item.caption}
                            onChange={(event) =>
                              updateGalleryItemField(
                                groupIndex,
                                itemIndex,
                                "caption",
                                event.target.value
                              )
                            }
                            rows={2}
                            className={inputClass}
                            placeholder="Optional image caption"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeGalleryItem(groupIndex, itemIndex)}
                          className="w-full rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-2 text-xs font-bold text-red-200 transition hover:border-red-300 hover:bg-red-400/10"
                        >
                          Remove Media
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-500">
                  No media in this group yet. Upload images/videos or add a media URL manually.
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-emerald-400/10 bg-slate-950/75 p-8 text-slate-400">
          No gallery groups yet. Click Add Gallery Group to create your first highlight.
        </div>
      )}

      {statusMessage ? (
        <div className={statusClass(saveStatus)}>{statusMessage}</div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-emerald-400/10 pt-6 md:flex-row md:items-center md:justify-between">
        <p className="text-xs leading-5 text-slate-500">
          Images upload to Supabase Storage with a 20 MB limit per image.
          Click Save Gallery after changes.
        </p>
        <button
          type="submit"
          disabled={saveStatus === "saving"}
          className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saveStatus === "saving" ? "Saving..." : "Save Gallery"}
        </button>
      </div>
    </form>
  );
}

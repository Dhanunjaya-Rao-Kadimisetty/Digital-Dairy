import dynamic from "next/dynamic";
import { Camera, ImagePlus } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionCard } from "@/components/ui/section-card";
import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import { getGalleryMemories } from "@/lib/data/gallery";

const GalleryGrid = dynamic(
  () => import("@/components/gallery/gallery-grid").then((module) => module.GalleryGrid),
  {
    loading: () => <div className="glass-panel h-96 animate-pulse" />
  }
);

const GalleryUploadForm = dynamic(
  () =>
    import("@/components/forms/gallery-upload-form").then((module) => module.GalleryUploadForm),
  {
    loading: () => <div className="glass-panel h-72 animate-pulse" />
  }
);

export default async function GalleryPage() {
  const { profile } = await getViewerOrRedirect();
  const memories = await getGalleryMemories(profile);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Gallery"
        title="Photographs with a little context around them."
        description="A warm masonry archive for images, dates, and captions that keep the feeling of the day attached."
      />

      <SectionCard className="space-y-5">
        <div className="flex items-center gap-3">
          <ImagePlus className="size-5 text-[#ffd9ba]" />
          <h2 className="font-serif text-3xl text-parchment">Add a new memory</h2>
        </div>
        <GalleryUploadForm userId={profile.id} />
      </SectionCard>

      {memories.length ? (
        <GalleryGrid items={memories} currentUserId={profile.id} />
      ) : (
        <EmptyState
          icon={Camera}
          title="The gallery is still waiting"
          description="Upload the first image and it will appear here with a caption and date, ready to be reopened later."
        />
      )}
    </div>
  );
}

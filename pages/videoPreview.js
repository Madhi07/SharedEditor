import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CanvasStoreProvider } from "../components/DashboardMain/Media/context/CanvasStoreContext";
import VideoPreview from "../components/DashboardMain/Media/SharedComponent/VideoPreview";

export default function VideoPreviewPage() {
  const router = useRouter();
  const { id } = router.query;

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    async function loadProject() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://media-v2.episyche.com/media/reels/${id}/`
        );

        if (!res.ok) throw new Error("Failed to load project");

        const json = await res.json();
        setProjectData(json.data);
        
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
    console.log("project data", projectData);
  }, [router.isReady, id]);

  return (
    <CanvasStoreProvider
      editor="preview"
      initialProject={projectData?.canvas_data ?? {}}
      pageId={projectData?.canvas_data?.activePageId || "video-page"}
    >
      <VideoPreview initialProject={projectData} pageId={projectData?.canvas_data?.activePageId || "video-page"} />
    </CanvasStoreProvider>
  );
}

import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

const VideoPreview = dynamic(() => import("@/components/previews/VideoPreview.js"), {
    ssr: false,
    loading: () => <Loader />
});

function Viewer() {
    return <VideoPreview />
}

Viewer.auth = true;

export default Viewer
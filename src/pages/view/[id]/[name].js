import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import withAuth from "@/components/Auth";

const VideoPreview = dynamic(() => import("@/components/previews/VideoPreview.js"), {
    ssr: false,
    loading: () => <Loader />
});

function Viewer() {
    return <VideoPreview />
}

export default withAuth(Viewer)
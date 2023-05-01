import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import withAuth from "@/components/Auth";

const MyFileBrowser = dynamic(() => import("@/components/MyFileBrowser"), {
    ssr: false,
    loading: () => <Loader />
});

function FileBrowser() {
    return <MyFileBrowser />
}

export default withAuth(FileBrowser)
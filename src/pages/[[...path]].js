import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";

const MyFileBrowser = dynamic(() => import("@/components/MyFileBrowser"), {
    ssr: false,
    loading: () => <Loader />
});

function FileBrowser() {

    const router = useRouter()

    const { asPath, pathname } = router

    if (asPath === pathname) return null

    return <MyFileBrowser />
}

FileBrowser.auth = true;

export default FileBrowser
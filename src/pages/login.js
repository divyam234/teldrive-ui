import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

const SignIn = dynamic(() => import("@/components/SignIn"), {
    ssr: false,
    loading: () => <Loader />
});

export default function Main() {
    return <SignIn />
}

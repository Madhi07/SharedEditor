import { useAuthContext } from "@/context/useAuthContext"
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import { LuLoaderCircle } from "react-icons/lu";

export default function AuthGuard({ children }) {

    const { loginUser, loading, setLoading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {

        if (loading) return;

        if (!loginUser || !loginUser?.token) {
            router.replace("/login");
        }

    }, [loading]);


    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <LuLoaderCircle className="size-10 text-secondary animate-spin" />
            </div>
        )
    }


    if (!loading && (!loginUser || !loginUser?.token)) return;

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}

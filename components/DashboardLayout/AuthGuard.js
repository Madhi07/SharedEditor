import { userInfoApiPath } from "@/constants/apiPaths";
import { useAuthContext } from "@/context/useAuthContext"
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import { LuLoaderCircle } from "react-icons/lu";

export default function AuthGuard({ children }) {

    const { loginUser, loading, setLoading, updateSessionLoginUser } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        initialRequirements();
    }, [router.query]);


    useEffect(() => {

        if (loading || router.query["user-token"]) return;

        if (!loginUser || !loginUser?.token) {
            router.replace("/login");
        }

    }, [loading, router.query]);

    const initialRequirements = async () => {
        const userToken = router.query["user-token"];
        if (!userToken) return; // no token param, skip

        // ✅ Skip fetch if same token already present
        if (loginUser?.token === userToken) {
            // remove the query param silently (no fetch)
            const newQuery = { ...router.query };
            delete newQuery['user-token'];

            router.replace({
                pathname: router.pathname,
                query: newQuery
            });
            return;
        }

        setLoading(true);

        const resultUser = await getUserInfoByToken(userToken);
        if (!resultUser) {
            setLoading(false);
            router.replace("/login");
            return;
        }

        const newQuery = { ...router.query };
        delete newQuery['user-token'];

        router.replace({
            pathname: router.pathname,
            query: newQuery
        });
        setLoading(false);
        updateSessionLoginUser(resultUser)
    }


    const getUserInfoByToken = async (user_token = null) => {
        if (!user_token) return false;

        try {

            const res = await fetch(`${process.env.API_URL}${userInfoApiPath}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${user_token}`,
                    },
                }
            );

            if (!res.ok) return false;

            const resData = await res?.json();

            return resData?.data || false;
        }
        catch (err) {
            return false
        }

    }


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

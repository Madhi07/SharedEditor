import clsx from "clsx";
import { useRouter } from "next/router";

export default function SubmenuPanel({ data = [] }) {

    const router = useRouter();

    const handleClickMenu = (path = "") => {
        if (!path.trim()) return;

        const justUpdatePaths = window.location.pathname.includes("/dashboard/chatbots/")
        if (justUpdatePaths) {
            router.push({
                pathname: path,
                query: {
                    ...(router?.query?.id && { id: router.query.id })
                }
            });
        }
        else {
            router.push(path);
        }

    }

    return (
        <div className="h-full px-4 py-8 flex flex-col overflow-y-auto overflow-x-hidden bg-gray-200/50 shadow-sm group border-r border-light-border-primary">
            <div className="lg:group-hover:w-[175px] h-full w-10 transition-all duration-300 ease-in-out text-nowrap whitespace-nowrap">
                {/* <div className="mb-6 flex w-full items-center justify-center">
                    <button
                        type="button"
                        className="w-8 h-8 rounded-full flex items-center justify-center p-2 text-white from-primary to-secondary bg-gradient-to-r group-hover:mr-4"
                    >
                        <FaPlus className="w-full h-full flex-shrink-0" />
                    </button>
                </div> */}
                <div className="space-y-1">
                    {data.map((nav, navIndex) => (
                        <button
                            type={"button"}
                            key={navIndex}
                            onClick={() => handleClickMenu(nav.href)}
                            className={clsx("p-2 flex-shrink-0 rounded-lg group/menu flex items-center justify-center lg:group-hover:justify-normal w-full",
                                (router.query?.index?.[1] === nav.id) ? "from-primary/20 to-secondary/20 bg-gradient-to-r" : "hover:from-primary/20 hover:to-secondary/20 hover:bg-gradient-to-r"
                            )}
                        >
                            <nav.icon
                                className={clsx("size-6 lg:group-hover:mr-4 m-0 flex-shrink-0",
                                    (router.query?.index?.[1] === nav.id) ? "text-primary/80" : "text-light-text-primary group-hover/menu:text-primary/80"
                                )}
                            />
                            <span className={clsx("lg:group-hover:block hidden text-base",
                                (router.query?.index?.[1] === nav.id) ? "text-black font-[500]" : "text-light-text-primary group-hover/menu:text-black group-hover/menu:font-[500]"
                            )}>
                                {nav.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

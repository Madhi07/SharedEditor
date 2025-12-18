import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";

export default function SubmenuTootip({ id = "", data = [], onMouseLeave }) {
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
    <Tooltip
      id={id}
      role={"menu"}
      place="right"
      clickable
      offset={15}
      arrowSize={18}
      positionStrategy="fixed"
      classNameArrow="border-r border-b border-light-border-primary"
      opacity={1}
      className="!w-[200px] z-30 !bg-white !shadow-card !rounded-xl border border-light-border-primary !p-0"

    >
      <div
        onMouseLeave={onMouseLeave}
        className="w-full h-full p-4 space-y-1"
      >
        {data.map((nav, navIndex) => (
          <button
            type={"button"}
            onClick={() => handleClickMenu(nav.href)}
            key={navIndex}
            className={clsx("p-2 w-full flex-shrink-0 rounded-lg group/submenu flex items-center",
              (router.query?.index?.[1] === nav.id) ? "from-primary/20 to-secondary/20 bg-gradient-to-r" : "hover:from-primary/20 hover:to-secondary/20 hover:bg-gradient-to-r"
            )}
          >
            <nav.icon
              className={clsx("size-6 flex-shrink-0 mr-4",
                (router.query?.index?.[1] === nav.id) ? "text-primary/80" : "text-light-text-primary group-hover/submenu:text-primary/80"
              )}
            />
            <span className={clsx("text-base",
              (router.query?.index?.[1] === nav.id) ? "text-black font-[500]" : "text-light-text-primary group-hover/submenu:text-black group-hover/submenu:font-[500]"
            )}>
              {nav.name}
            </span>
          </button>
        ))}
      </div>
    </Tooltip>

  )
}

import clsx from "clsx";

export default function IntegrationCardSkeleton({ count = 6 }) {
    return (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex flex-col border border-light-border-primary rounded-xl bg-light-card-primary shadow md:p-6 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 inline-flex items-center justify-center bg-gray-200 animate-pulse rounded-full" />
                        <div className="flex items-center space-x-2 animate-pulse">
                            <div className={clsx("w-2 h-2 rounded-full bg-gray-200")} />
                            <span className={clsx("text-sm font-medium rounded-lg h-2 w-10 bg-gray-200")} />
                        </div>
                    </div>

                    <span className=" mb-2 rounded-lg w-[60%] h-2.5 bg-gray-200 animate-pulse" />

                    <span className=" mb-4 w-full h-2 bg-gray-200 animate-pulse" />

                    <div className="mt-auto w-full h-6 bg-gray-200 animate-pulse rounded-lg " />
                </div>
            ))}
        </div>
    )
}

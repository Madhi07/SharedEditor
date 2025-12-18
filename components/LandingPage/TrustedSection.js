import Image from "next/image";
import { trustedCompanies } from "./constants";
import clsx from "clsx";

export default function TrustedSection() {
    return (
        <div id="trusted-by" className="relative">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <p className="text-gray-400 uppercase tracking-wider text-sm mb-2">Trusted by innovative companies</p>
                    <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
                    {trustedCompanies.map((company, index) => (
                        <div key={index} className={clsx("flex justify-center items-center",
                            (trustedCompanies.length === (index + 1) && "md:col-span-1 col-span-2")
                        )}>

                            <Image
                                src={company?.icon}
                                quality={100}
                                width={1024}
                                height={1024}
                                alt={company.name}
                                className="h-12 w-auto mx-auto"
                            />

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

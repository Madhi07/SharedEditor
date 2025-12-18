import { features } from "@/components/LandingPage/constants";
import AdvancedAIIntelligence from "@/components/LandingPage/FeaturesSection/Features/AdvancedAIIntelligence";
import AnalyticsDashboard from "@/components/LandingPage/FeaturesSection/Features/AnalyticsDashboard";
import EnterpriseSecurity from "@/components/LandingPage/FeaturesSection/Features/EnterpriseSecurity";
import MultiModalCommunication from "@/components/LandingPage/FeaturesSection/Features/MultiModalCommunication";
import NoCodeIntegration from "@/components/LandingPage/FeaturesSection/Features/NoCodeIntegration";
import Realistic3DModels from "@/components/LandingPage/FeaturesSection/Features/Realistic3DModels";
import MainLayout from "@/components/MainLayout";
import WatchDemo from "@/components/Modals/WatchDemo";
import { seoData } from "@/constants/seoData";
import useUpdateQueryParams from "@/hooks/updateQueryParams";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight, FaChevronRight } from "react-icons/fa";

const mapComponent = {
    'advanced-ai-intelligence': {
        component: AdvancedAIIntelligence,
        seoData: seoData.feature1Page
    },
    'realistic-3d-models': {
        component: Realistic3DModels,
        seoData: seoData.feature2Page
    },
    'no-code-integration': {
        component: NoCodeIntegration,
        seoData: seoData.feature3Page
    },
    "multi-modal-communication": {
        component: MultiModalCommunication,
        seoData: seoData.feature4Page
    },
    "analytics-dashboard": {
        component: AnalyticsDashboard,
        seoData: seoData.feature5Page
    },
    "enterprise-security": {
        component: EnterpriseSecurity,
        seoData: seoData.feature6Page
    },
};

export default function FeaturePage(props) {
    const updateQueryParams = useUpdateQueryParams();
    const { index } = props.queryParams;
    const router = useRouter();

    // useEffect(() => {

    //     const widgetRoot = document.getElementById("agentzee-widget-root");

    //     if (widgetRoot) {
    //         widgetRoot.style.display = "none";
    //         return () => widgetRoot.style.display = "block";
    //     }

    // }, [])

    const content = features.find(item => item.link.includes(index[0]));

    const mapKeys = Object.keys(mapComponent);

    const previousClick = () => {
        const currentIndex = mapKeys.indexOf(index[0]);
        router.push(`/features/${mapKeys[currentIndex - 1]}`);
    };

    const nextClick = () => {
        const currentIndex = mapKeys.indexOf(index[0]);
        router.push(`/features/${mapKeys[currentIndex + 1]}`);
    }

    return (
        <Fragment>
            <NextSeo {...mapComponent[index[0]].seoData} />
            <MainLayout>
                <section className="md:py-40 py-24 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-bg-secondary to-dark-bg-primary z-0"></div>

                    <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-primary/20 filter blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-secondary/20 filter blur-[100px] animate-pulse-slow"></div>

                    <div className="container mx-auto px-4 md:px-8 relative z-10">
                        <div className="mb-8">
                            <nav className="flex items-center space-x-2 text-sm text-gray-400">
                                <Link
                                    href={'/'}
                                    className="hover:text-white transition-colors cursor-pointer"
                                >
                                    Home
                                </Link>
                                <FaChevronRight />
                                <Link
                                    href={'/#features'}
                                    className="hover:text-white transition-colors cursor-pointer"
                                >
                                    Features
                                </Link>
                                <FaChevronRight />
                                <span className="text-secondary">{content?.title}</span>
                            </nav>
                        </div>

                        {mapComponent?.[index?.[0]] &&
                            <div className="max-w-6xl mx-auto mb-8">
                                <div className="text-center mb-16">
                                    <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-6">
                                        <p className="text-sm font-medium flex items-center justify-center">
                                            <content.icon className=" text-primary mr-2" />
                                            {content.shortTitle}
                                        </p>
                                    </div>

                                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                                        <span>{content.title.split(" ").splice(0, 1)}</span>
                                        {" "}
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                            {content.title.split(" ").splice(1).join(" ")}
                                        </span>
                                    </h1>

                                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                                        {content.description}
                                    </p>
                                </div>

                                {(() => {
                                    const Component = mapComponent[index[0]].component;
                                    return (
                                        <Component
                                            lineChartData={content?.lineChartData}
                                            doughnutChartData={content?.doughnutChartData}
                                        />
                                    )
                                })()}
                            </div>
                        }

                        <div className="flex items-center justify-between">
                            {(index[0] !== mapKeys[0]) &&
                                <button
                                    type="submit"
                                    onClick={previousClick}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors px-4 py-2 rounded-full text-white font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FaChevronCircleLeft />
                                    Previous
                                </button>
                            }
                            {(index[0] !== mapKeys[mapKeys.length - 1]) &&
                                <button
                                    type="submit"
                                    onClick={nextClick}
                                    className="ml-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors px-4 py-2 rounded-full text-white font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    Next
                                    <FaChevronCircleRight />
                                </button>
                            }
                        </div>
                    </div>
                </section>
                <WatchDemo
                    onClose={() => updateQueryParams({ demo: null })}
                    open={router.query.demo === "true" ? true : false}
                />
            </MainLayout>
        </Fragment>
    )
}

export async function getServerSideProps(context) {
    const { query } = context;
    return {
        props: {
            queryParams: query
        },
    };
}

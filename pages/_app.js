import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react"
import { defaultSeoData } from "@/constants/seoData";
import { AuthProvider } from "@/context/useAuthContext";
import { AvatarProvider } from "@/context/useAvatarContext";
import { IpProvider } from "@/context/useIpContext";
import { DefaultSeo, OrganizationJsonLd } from "next-seo";
import { Fragment, useEffect, useMemo, useState } from "react";
import OfferPopup from "@/components/Modals/OfferPopup";
import { useRouter } from "next/router";
import CompanyInfoPopup from "@/components/Modals/CompanyInfoPopup";
import { widgetDisabledPaths } from "@/constants";
import Script from "next/script";
import WelcomeAvatar from "@/components/Modals/WelcomeAvatar";
import UserAnalytics from "@/components/UserActivity";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {

  const router = useRouter();


  useEffect(() => {

    handleWidgetShowHide();

  }, [router.pathname]);


  const handleWidgetShowHide = () => {
    const widgetRoot = document.getElementById("agentzee-widget-root");
    if (widgetRoot) {
      widgetRoot.style.display = widgetDisabledPaths.some(path => router.asPath.includes(path)) ? "none" : "block";
    }
  };


  const shouldLoadWidget = useMemo(() => {
    return !widgetDisabledPaths.some(path => router.asPath.includes(path));
  }, [router.pathname]);


  return (
    <Fragment>
      <OrganizationJsonLd
        useAppDir={false}
        {...defaultSeoData.schemaMarkupJSON}
      />
      <DefaultSeo
        twitter={defaultSeoData.twitter}
      />
      <SessionProvider session={session}>
        <IpProvider>
          <AuthProvider>
            <AvatarProvider>
              <Component {...pageProps} />

              {/* <OfferPopup /> */}

              {/* <CompanyInfoPopup /> */}
            </AvatarProvider>
          </AuthProvider>
        </IpProvider>
      </SessionProvider>

      {/* {shouldLoadWidget && (
        <Script
          src={`${process.env.WIDGET_SCRIPT_URL}?agentId=${process.env.WIDGET_AGENT_ID}`}
          strategy="afterInteractive"
        />
      )} */}

      {/* {process.env.NODE_ENV === 'development' && <UserAnalytics />} */}

    </Fragment>
  );
}

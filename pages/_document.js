import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth font-inter">

      <script async src="https://www.googletagmanager.com/gtag/js?id=G-SNC0YVLT1M"></script>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SNC0YVLT1M');
          `
        }}
      ></script>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(h,o,t,j,a,r){
            h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
            h._hjSettings={hjid:6451807,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `
        }}
      ></script>

      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"></link>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </Head>
      <body className="transition-all duration-[250ms] ease-in-out antialiased overflow-x-hidden text-dark-text-primary bg-dark-bg-primary">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

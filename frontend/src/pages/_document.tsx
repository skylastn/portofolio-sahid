import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-scroll-behavior="smooth">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://portofolio.skytech.my.id/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://portofolio.skytech.my.id/" />
        <meta property="og:title" content="SkyDeveloper - Software Engineer Portfolio" />
        <meta property="og:description" content="Production-ready web experiences with thoughtful execution. Full-stack developer specialized in Next.js, NestJS, TypeScript, and modern web technologies." />
        <meta property="og:image" content="https://portofolio.skytech.my.id/og-image.png" />
        <meta property="og:site_name" content="SkyDeveloper Portfolio" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://portofolio.skytech.my.id/" />
        <meta name="twitter:title" content="SkyDeveloper - Software Engineer Portfolio" />
        <meta name="twitter:description" content="Production-ready web experiences with thoughtful execution. Full-stack developer specialized in Next.js, NestJS, TypeScript, and modern web technologies." />
        <meta name="twitter:image" content="https://portofolio.skytech.my.id/og-image.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

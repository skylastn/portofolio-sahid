import { HomeProvider } from "@/features/core/presentation/front_office/home/home_logic";
import HomeUI from "@/features/core/presentation/front_office/home/home_ui";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>SkyDeveloper - Software Engineer Portfolio</title>
        <meta name="description" content="Full-Stack Software Engineer specializing in Flutter, with experience across backend, web, and cloud-based development. Skilled in building scalable applications, integrating APIs and payment systems, and improving deployment workflows through CI/CD. Interested in AI, Blockchain, clean architecture, and innovative digital solutions." />
        <meta name="keywords" content="software engineer, full-stack developer, nextjs, nestjs, typescript, react, nodejs, web development, portfolio, indonesia developer" />
      </Head>
      <HomeProvider>
        <HomeUI />
      </HomeProvider>
    </>
  );
}
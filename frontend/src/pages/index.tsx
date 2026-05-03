import { HomeProvider } from "@/features/core/presentation/front_office/home/home_logic";
import HomeUI from "@/features/core/presentation/front_office/home/home_ui";

export default function Home() {
  return (
    <HomeProvider>
      <HomeUI />
    </HomeProvider>
  );
}
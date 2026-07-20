import { GreetingHeader } from "../components/dashboard/GreetingHeader";
import { OnboardingChecklist } from "../components/onboarding/OnboardingChecklist";
import { DashboardGrid } from "../components/dashboard/DashboardGrid";
import { ActivityFeed } from "../components/activity/ActivityFeed";
import { RecommendationsSection } from "../components/recommendations/RecommendationsSection";
import "./home.css";

export function Home() {
  return (
    <div className="home-page">
      <GreetingHeader />
      <OnboardingChecklist />
      <DashboardGrid />
      <div className="home-page__lower">
        <RecommendationsSection />
        <ActivityFeed />
      </div>
    </div>
  );
}

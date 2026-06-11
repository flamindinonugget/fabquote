import { EarlyAccessBanner } from "@/components/EarlyAccessBanner";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StorageWarningBanner } from "@/components/StorageWarningBanner";

type PageLayoutProps = {
  children: React.ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink focus:shadow-soft"
      >
        Skip to content
      </a>
      <EarlyAccessBanner />
      <Header />
      <StorageWarningBanner />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <FeedbackWidget />
    </div>
  );
}

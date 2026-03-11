import { Navigation } from '@/components/navigation';
import { HeroCarousel } from '@/components/ui/hero-carousel';
import { FeaturedCards } from '@/components/ui/featured-cards';
import { LandingAboutSection } from '@/components/landing-about-section';
import { LandingAssessmentSection } from '@/components/landing-assessment-section';
import { Footer } from '@/components/footer';
import { getServerUser } from '@/lib/server-auth';

// Force dynamic rendering - this page fetches data from database
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const serverUser = await getServerUser();

  const mappedUser = serverUser ? {
    id: serverUser.id,
    name: (serverUser.name as string) || 'User',
    age: (serverUser.age as number) ?? undefined,
    role: (serverUser.role as string) || 'guest',
  } : null;

  return (
    <div className="min-h-screen flex-col">
      <Navigation />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Carousel - Already server-rendered (fast) */}
        <section className="mb-12">
          <HeroCarousel />
        </section>

        {/* Featured Cards */}
        <section className="mb-12">
          <FeaturedCards serverUser={mappedUser} />
        </section>

        {/* About Sections - Removed Suspense to render seamlessly on SSR */}
        <LandingAboutSection />

        {/* Assessment Section - Uses server auth state */}
        <LandingAssessmentSection serverUser={mappedUser} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

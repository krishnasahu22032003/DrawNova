import AboutSection from "../components/Landing/About";
import FeaturesSection from "../components/Landing/Features";
import Header from "../components/Landing/Header";
import HeroSection from "../components/Landing/Hero";
import TestimonialsSection from "../components/Landing/Testimonial";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
     
      <Header />
      <HeroSection/>
      <AboutSection/>
      <FeaturesSection/>
      <TestimonialsSection/>
    </main>
  );
}
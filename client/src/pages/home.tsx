import { useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import SkillsSection from "@/components/skills-section";
import GitHubStatsSection from "@/components/github-stats-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    // Add smooth scroll behavior and intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all sections except hero
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      if (index === 0) {
        // Keep hero section visible immediately
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      } else {
        // Hide other sections initially for animation
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
      }
    });

    // Add CSS for animate-in class
    const style = document.createElement('style');
    style.textContent = `
      .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}

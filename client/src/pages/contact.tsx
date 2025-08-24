import Navigation from "@/components/navigation";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-portfolio-background">
      <Navigation />
      <main className="pt-20">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
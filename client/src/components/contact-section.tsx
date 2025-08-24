import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, ExternalLink, Users } from "lucide-react";
import type { SocialLink } from "@shared/schema";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });

  const { data: socialLinks = [] } = useQuery<SocialLink[]>({
    queryKey: ["/api/social-links"],
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon!",
      });
      setFormData({ name: "", email: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSocialIcon = (platform: string) => {
    const iconMap: { [key: string]: string } = {
      Twitter: "text-blue-400",
      LinkedIn: "text-blue-600", 
      GitHub: "text-slate-300",
      "Stack Overflow": "text-orange-500",
      Instagram: "text-pink-500",
    };
    return iconMap[platform] || "text-slate-300";
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-portfolio-primary" data-testid="contact-section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center justify-center" data-testid="contact-title">
            <Users className="mr-3 text-portfolio-accent" size={32} />
            Connect With <span className="text-portfolio-accent ml-2">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-portfolio-accent to-portfolio-success mx-auto mb-4"></div>
          <p className="text-slate-400 max-w-2xl mx-auto" data-testid="contact-description">
            Let's connect and build something amazing together. Feel free to reach out for collaborations or just to say hi!
          </p>
        </div>
        
        {/* Social Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass p-6 rounded-lg text-center hover-lift group border-portfolio-accent/20"
              data-testid={`social-link-${link.platform.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <i className={`${link.icon} text-3xl ${getSocialIcon(link.platform)} mb-3 group-hover:animate-bounce-slow`}></i>
              <p className="text-sm text-slate-300">{link.platform}</p>
            </a>
          ))}
        </div>
        
        {/* Contact Form */}
        <Card className="glass border-portfolio-accent/20 hover-lift">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center" data-testid="contact-form-title">
              <Mail className="mr-2 text-portfolio-accent" size={24} />
              Get In Touch
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-slate-300">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-portfolio-secondary border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-portfolio-accent focus:border-portfolio-accent"
                    placeholder="Your Name"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-portfolio-secondary border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-portfolio-accent focus:border-portfolio-accent"
                    placeholder="your.email@example.com"
                    data-testid="input-email"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="message" className="text-slate-300">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="bg-portfolio-secondary border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-portfolio-accent focus:border-portfolio-accent resize-none"
                  placeholder="Your message..."
                  rows={5}
                  data-testid="textarea-message"
                />
              </div>
              
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="bg-portfolio-accent hover:bg-blue-600 text-white px-8 py-3 font-semibold transition-all duration-300 hover-lift"
                  data-testid="button-send-message"
                >
                  {contactMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2" size={16} />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [location, setLocation] = useLocation();
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/skills", label: "Skills" },
    { href: "/github", label: "GitHub" },
    { href: "/contact", label: "Contact" },
    { href: "/projects", label: "Projects" },
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-[60] glass" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-portfolio-accent" data-testid="logo">
              Atul Mahankal
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <button
                    onClick={handleNavClick}
                    className={`transition-colors duration-300 px-3 py-2 ${
                      location === link.href 
                        ? 'text-portfolio-accent' 
                        : 'text-slate-300 hover:text-portfolio-accent'
                    }`}
                    data-testid={`nav-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-portfolio-accent"
              data-testid="mobile-menu-toggle"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden" data-testid="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-portfolio-primary/90 backdrop-blur-lg rounded-lg mt-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <button
                    onClick={handleNavClick}
                    className={`block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-300 ${
                      location === link.href 
                        ? 'text-portfolio-accent' 
                        : 'text-slate-300 hover:text-portfolio-accent'
                    }`}
                    data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

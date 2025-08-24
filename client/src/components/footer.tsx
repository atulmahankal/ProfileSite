import { ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-portfolio-background border-t border-slate-700" data-testid="footer">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <p className="text-slate-400 mb-4" data-testid="footer-copyright">
            &copy; {new Date().getFullYear()} Atul Devichand Mahankal. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center justify-center" data-testid="footer-built-with">
            Built with <Heart className="mx-1 text-red-500" size={16} /> using React & Tailwind CSS
          </p>
          <div className="mt-4">
            <a 
              href="https://github.com/atulmahankal/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-portfolio-accent hover:text-blue-400 transition-colors duration-300 inline-flex items-center"
              data-testid="footer-github-repo"
            >
              <ExternalLink className="mr-1" size={16} />
              Github Profile
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

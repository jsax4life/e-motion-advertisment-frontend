import React from "react";
import { Separator } from "../../../../../components/ui/separator";

export const FooterSection = (): JSX.Element => {
  // Footer navigation links
  const footerLinks = ["About", "Careers", "Policy", "Contact"];

  return (
    <footer className="w-full py-4 bg-white border-t">
      <div className="container mx-auto px-6">
        <Separator className="mb-6" />

        <div className="flex items-center justify-between">
          <div className="font-description text-sm">
            <span className="text-neutralneutral-400-day">© 2025 - </span>
            <span className="text-brandbrand-1">Siitech</span>
            <span className="text-neutralneutral-400-day"> ERP Dashboard</span>
          </div>

          <nav>
            <ul className="flex items-center gap-[15px]">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="font-description text-neutralneutral-400-day text-sm hover:text-brandbrand-1 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

"use client"
import { Sun, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: [
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "FAQ", href: "#" },
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Disclaimer", href: "#" },
    ],
  }

  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Sun className="w-8 h-8 text-orange-500" />
              <span className="font-bold text-xl text-white">SolarAI Leads</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Connecting homeowners with trusted solar installers and savings.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-orange-500" />
                <a href="mailto:info@solarai.co.uk" className="text-gray-400 hover:text-orange-500">
                  info@solarai.co.uk
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-orange-500" />
                <a href="tel:+442071234567" className="text-gray-400 hover:text-orange-500">
                  +44 (0) 20 7123 4567
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <span className="text-gray-400">
                  123 Green Street
                  <br />
                  London, UK
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} SolarAI Leads. All rights reserved.
          </p>

          {/* Language / Region selector placeholder */}
          <div className="flex gap-6">
            <select className="bg-gray-800 text-gray-300 px-3 py-2 rounded text-sm border border-gray-700 hover:border-orange-500 transition-colors">
              <option>UK</option>
              <option>Ireland</option>
              <option>EU</option>
            </select>
            <select className="bg-gray-800 text-gray-300 px-3 py-2 rounded text-sm border border-gray-700 hover:border-orange-500 transition-colors">
              <option>English</option>
              <option>Cymraeg</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-gray-950 py-4 px-6 text-center text-xs text-gray-500">
        <p>
          SolarAI Leads is a lead generation service. We are not solar installers. Quotes and services are provided by our partner companies.
        </p>
      </div>
    </footer>
  )
}

export default Footer

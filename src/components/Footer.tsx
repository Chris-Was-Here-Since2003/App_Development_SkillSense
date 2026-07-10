import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="home-footer text-slate-400 mt-12 bg-[#1E3A8A]">
      <div className="footer-grid max-w-[1200px] mx-auto px-4 md:px-6 py-12 grid grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="col-span-2 space-y-4">
          <div className="logo text-white text-2xl font-black">
            Skill<span className="text-blue-300">Sense</span>
          </div>
          <p className="text-sm text-slate-300 max-w-xs leading-relaxed">
            AI-powered job matching that connects the right talent with the right opportunity.
          </p>
        </div>

        <div className="footer-col space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-white transition-colors">About SkillSense</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>

        <div className="footer-col space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Report a Bug</a></li>
          </ul>
        </div>

        <div className="footer-col space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom border-t border-white/10 py-6 text-center text-xs text-slate-300/60">
        © 2026 SkillSense — Group Tung Tung Sahur | [CS/IT] 3105N App Development
      </div>
    </footer>
  );
};

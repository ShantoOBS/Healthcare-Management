import nurseStaffImage from '@/assets/nurse-staff.png';
import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const companyLinks = ['About Us', 'Doctors', 'Appointments', 'Blog', 'FAQ'];
const serviceLinks = [
  'General Consultation',
  'Preventive Care',
  'Emergency Support',
  'Specialist Visits',
  'Home Healthcare',
];
const quickLinks = ['Help Center', 'Patient Portal', 'Insurance & Billing', 'Terms & Conditions', 'Privacy Policy'];

function PublicFooter() {
  return (
    <footer className="mx-auto relative w-full max-w-[1280px] px-5 pb-8 sm:px-6 lg:px-8">
    
     
      <div className="overflow-hidden rounded-[38px]
       bg-[#0a5f87] text-white">
        <div className="grid gap-8 px-6 py-8 sm:px-8 
        lg:grid-cols-4 lg:px-10 lg:py-10 ">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {companyLinks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Services</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {serviceLinks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {quickLinks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (234) 567-890</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@CuraMedhospital.com</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 123 Health Street, City</li>
            </ul>

            <div className="mt-5 flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border-b border-white/60 bg-transparent px-0 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none"
              />
              <button type="button" className="whitespace-nowrap text-sm font-semibold text-white/90">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p className="text-sm text-white/80">Copyright ©PenoLab. All rights reserved.</p>

          <div className="flex items-center gap-3 text-white/90">
            {[Twitter, Facebook, Instagram].map((Icon, index) => (
              <span key={index} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 pb-4 
        text-[clamp(6rem,15vw,22rem)] 
        font-black leading-[0.75]
         tracking-[0.2em]
          text-white/12 sm:px-8 lg:px-10">
         DocLink
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
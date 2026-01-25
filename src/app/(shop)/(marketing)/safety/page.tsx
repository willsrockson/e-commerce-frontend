"use client";

import { siteMaxWidth } from "@/lib/constants";
import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  Banknote,
  AlertTriangle,
  Eye,
  MessageSquareWarning,
  Lock,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SafetyTipsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* 1. HERO SECTION */}
      <section className="bg-blue-600 py-16 text-center text-white">
        <div className={`container ${siteMaxWidth} mx-auto px-5`}>
          <div className="mx-auto max-w-2xl">
            <ShieldCheck className="mx-auto mb-6 h-16 w-16 opacity-90" />
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              Your Safety is Our Priority
            </h1>
            <p className="text-blue-100 md:text-lg">
              Tonmame is dedicated to providing a safe marketplace. Please read
              these guidelines to protect yourself from scams and fraud.
            </p>
          </div>
        </div>
      </section>

      <div className={`container ${siteMaxWidth} mx-auto -mt-10 px-5`}>
        {/* 2. THE GOLDEN RULES (Cards) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SafetyCard
            icon={<MapPin className="text-blue-600" size={32} />}
            title="Meet in Public"
            description="Always meet in a safe, public location like a mall, fuel station, or police station. Avoid secluded areas or private homes."
          />
          <SafetyCard
            icon={<Eye className="text-blue-600" size={32} />}
            title="Inspect First"
            description="Check the item thoroughly before paying. Ensure it meets the description and works as expected."
          />
          <SafetyCard
            icon={<Banknote className="text-blue-600" size={32} />}
            title="Cash on Delivery"
            description="Do not pay in advance. Pay only when you have met the seller and inspected the item."
          />
        </div>

        {/* 3. BUYER & SELLER GUIDES */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Tips for Buyers */}
          <div>
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                1
              </span>
              Tips for Buyers
            </h2>
            <ul className="space-y-4">
              <ListItem text="Never send money before receiving the item (no bank transfers, mobile money deposits, or Western Union)." />
              <ListItem text="Be wary of prices that seem 'too good to be true'." />
              <ListItem text="Ask for clear, recent photos of the item if the ad images are blurry or look generic." />
              <ListItem text="Keep all conversations inside the Tonmame chat for your protection." />
            </ul>
          </div>

          {/* Tips for Sellers */}
          <div>
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 text-sm font-bold">
                2
              </span>
              Tips for Sellers
            </h2>
            <ul className="space-y-4">
              <ListItem text="Wait until you have the cash in hand before handing over the item." />
              <ListItem text="Count the money carefully at the meeting place." />
              <ListItem text="Do not accept checks or promises of future bank transfers." />
              <ListItem text="If a buyer claims to have sent a payment, verify your own balance independently before releasing the item." />
            </ul>
          </div>
        </div>

        {/* 4. RED FLAGS SECTION (Warning Style) */}
        <div className="mt-16 rounded-2xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="shrink-0 rounded-full bg-amber-100 p-3 text-amber-600">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Recognizing Scams
              </h3>
              <p className="mt-2 text-gray-600">
                Fraudsters often use specific tactics to trick users. If you
                encounter any of these, stop communication immediately.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex gap-3">
                  <MessageSquareWarning
                    className="shrink-0 text-amber-500"
                    size={20}
                  />
                  <span className="text-sm text-gray-700">
                    Requests to move chat to WhatsApp or Email immediately.
                  </span>
                </div>
                <div className="flex gap-3">
                  <Lock className="shrink-0 text-amber-500" size={20} />
                  <span className="text-sm text-gray-700">
                    Asking for your OTP codes, passwords, or ID card photos.
                  </span>
                </div>
                <div className="flex gap-3">
                  <Banknote className="shrink-0 text-amber-500" size={20} />
                  <span className="text-sm text-gray-700">
                    Asking for a &apos;delivery fee&apos; or &apos;reservation
                    fee&apos; upfront.
                  </span>
                </div>
                <div className="flex gap-3">
                  <Flag className="shrink-0 text-amber-500" size={20} />
                  <span className="text-sm text-gray-700">
                    Buyer claims they are &apos;out of town&apos; and will send
                    a courier.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. CTA / REPORTING */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold text-gray-900">
            Did you spot something suspicious?
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-gray-600">
            Help us keep Tonmame safe. If you see an ad or user that violates
            our policies, report them immediately.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/contact-us">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- HELPER COMPONENTS ---

function SafetyCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 inline-block rounded-lg bg-blue-50 p-3">{icon}</div>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
      <span className="text-gray-700">{text}</span>
    </li>
  );
}

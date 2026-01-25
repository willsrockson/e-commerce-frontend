"use client";

import { useState } from "react";
import { siteMaxWidth } from "@/lib/constants";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, ShoppingBag, Tag, UserCircle, HelpCircle } from "lucide-react";
import Link from "next/link";

const faqCategories = [
  {
    id: "selling",
    title: "Selling on Tonmame",
    icon: <Tag className="text-blue-600" size={24} />,
    questions: [
      {
        q: "How do I post an ad?",
        a: "To post an ad, click the 'Post Ad' button in the top right corner. You will need to log in or register first. Fill in the details, upload clear photos, and submit. Your ad will go live instantly!",
      },
      {
        q: "How much does it cost to sell?",
        a: "Posting standard ads on Tonmame is 100% free! We may offer premium promotion options in the future to help your items sell faster.",
      },
      {
        q: "How do I edit or delete my ad?",
        a: "Go to your Profile and click on 'My Ads'. Find the item you want to change, and click the 'Edit' (pencil) icon or the 'Delete' (trash) icon.",
      },
      {
        q: "My images are not uploading. Why?",
        a: "Please ensure your images are in JPG or PNG format and are under 5MB each. If you are still having trouble, try refreshing the page or using a different browser.",
      },
    ],
  },
  {
    id: "buying",
    title: "Buying Items",
    icon: <ShoppingBag className="text-green-600" size={24} />,
    questions: [
      {
        q: "How do I contact a seller?",
        a: "Click on the ad you are interested in. You will see a 'Show Phone Number' button or a 'Chat' option to send a message directly through Tonmame.",
      },
      {
        q: "Is delivery included?",
        a: "Delivery depends on the seller. You must discuss and agree on a meeting place or delivery method with the seller directly.",
      },
      {
        q: "I found a suspicious ad. What should I do?",
        a: "Please report it immediately! Click the 'Report this Ad' button on the product page, or contact our support team via the Contact Us page.",
      },
    ],
  },
  {
    id: "account",
    title: "My Account",
    icon: <UserCircle className="text-purple-600" size={24} />,
    questions: [
      {
        q: "I forgot my password.",
        a: "Go to the Login page and click 'Forgot Password'. Enter your email address, and we will send you a link to reset it.",
      },
      {
        q: "How do I change my profile picture?",
        a: "Log in and go to your 'Profile'. Click on the camera icon next to your current avatar to upload a new photo.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. If you wish to leave Tonmame, go to Profile > Delete Account. Please note this action is permanent and cannot be undone.",
      },
    ],
  },
];

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter logic: Checks if search term matches Category Title OR Question OR Answer
  const filteredCategories = faqCategories
    .map((cat) => {
      const isCatMatch = cat.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const filteredQuestions = cat.questions.filter(
        (qa) =>
          qa.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          qa.a.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      // If category matches, show all questions. If not, show only matching questions.
      if (isCatMatch) return cat;
      if (filteredQuestions.length > 0)
        return { ...cat, questions: filteredQuestions };

      return null;
    })
    .filter((cat) => cat !== null); // Remove empty categories

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* HERO SECTION WITH SEARCH */}
      <div className="bg-blue-600 py-16 text-center text-white">
        <div className={`container ${siteMaxWidth} mx-auto px-5`}>
          <div className="mx-auto max-w-2xl">
            <HelpCircle className="mx-auto mb-4 h-12 w-12 opacity-80" />
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              How can we help you?
            </h1>

            {/* SEARCH BAR */}
            <div className="relative mx-auto mt-8 max-w-lg">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="text-gray-400" size={20} />
              </div>
              <Input
                type="text"
                placeholder="Search for answers (e.g., 'password', 'sell')..."
                className="h-12 w-full rounded-full border-none bg-white pl-10 text-gray-900 shadow-lg placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ CONTENT */}
      <div className={`container ${siteMaxWidth} mx-auto -mt-8 mb-20 px-5`}>
        <div className="grid gap-8">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div
                key={category!.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Category Header */}
                <div className="border-b bg-gray-50/50 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 shadow-sm">
                      {category!.icon}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {category!.title}
                    </h2>
                  </div>
                </div>

                {/* Questions Accordion */}
                <div className="px-6 py-2">
                  <Accordion type="single" collapsible className="w-full">
                    {category!.questions.map((qa, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category!.id}-${index}`}
                      >
                        <AccordionTrigger className="text-left text-gray-700 hover:text-blue-600 hover:no-underline">
                          {qa.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {qa.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            ))
          ) : (
            // EMPTY STATE (If search finds nothing)
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No results found
              </h3>
              <p className="text-gray-500">
                We couldn&apos;t find any articles matching &quot;{searchTerm}
                &quot;. Try a different keyword or contact support.
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Still need help?
          </h3>
          <p className="mt-2 text-gray-500">
            Our support team is just a message away.
          </p>
          <Link
            href="/contact-us"
            className="mt-4 inline-block rounded-lg bg-white border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

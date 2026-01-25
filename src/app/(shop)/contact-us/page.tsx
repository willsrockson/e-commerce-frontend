"use client";

import React from "react";
import Footer from "@/components/Footer";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, ShieldAlert, LifeBuoy, Send, Flame } from "lucide-react";
import { toastSuccess } from "@/components/toasts/toasts";
import { Spinner } from "@/components/ui/spinner";

type ContactFormData = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactUs() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: {
      subject: "general",
    },
  });

  const selectedSubject = watch("subject");

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Form Submitted:", data);
    toastSuccess({
      message: "Message sent successfully! We will get back to you soon.",
    });
    reset();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* HEADER SECTION */}
      <div className="bg-white border-b py-12 md:py-20">
        <div className="container mx-auto max-w-5xl px-5 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500 md:text-lg">
            We are here to help. Whether you have a question about a product,
            need to report an issue, or want to suggest a new feature, our team
            is ready to listen.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto max-w-5xl px-5 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* LEFT COLUMN: CONTACT INFO & CARDS */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Contact Information
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Choose the right channel for your needs to ensure the fastest
                response.
              </p>
            </div>

            <div className="space-y-4">
              {/* Support Card */}
              <div className="flex gap-4 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <LifeBuoy size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Customer Support
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 mb-2">
                    For general inquiries, account issues, or feedback.
                  </p>
                  <a
                    href="mailto:support@tonmame.com"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    support@tonmame.com
                  </a>
                </div>
              </div>

              {/* Security Card */}
              <div className="flex gap-4 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Security & Fraud
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 mb-2">
                    To report suspicious activity, scams, or vulnerabilities.
                  </p>
                  <a
                    href="mailto:security@tonmame.com"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    security@tonmame.com
                  </a>
                </div>
              </div>

              {/* General Inquiry Card */}
              <div className="flex gap-4 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-600">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Media & Business
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 mb-2">
                    For press inquiries or partnership opportunities.
                  </p>
                  <a
                    href="mailto:contact@tonmame.com"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    contact@tonmame.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: THE FORM */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Send us a message
              </h2>
              <p className="mt-1 text-sm text-gray-500 mb-6">
                Fill out the form below and we will get back to you within 24
                hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Subject Selector */}
                <div className="space-y-1.5">
                  <Label>I want to...</Label>
                  <Select
                    onValueChange={(val) => setValue("subject", val)}
                    defaultValue="general"
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">
                        Ask a general question
                      </SelectItem>
                      <SelectItem value="support">
                        Report an account issue
                      </SelectItem>
                      <SelectItem value="fraud">
                        Report a scam or fraud
                      </SelectItem>
                      <SelectItem value="feature">
                        Request a new Feature <Flame className="text-red-500" />
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      className={`h-11 ${errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      placeholder="e.g. John Doe"
                      {...register("fullName", {
                        required: "Name is required",
                      })}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      className={`h-11 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      placeholder="you@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">
                    {selectedSubject === "feature"
                      ? "Describe the feature you need"
                      : "How can we help?"}
                  </Label>
                  <Textarea
                    id="message"
                    className={`min-h-[160px] resize-y text-base ${errors.message ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    placeholder={
                      selectedSubject === "feature"
                        ? "I think Tonmame should add..."
                        : "Please describe your issue in detail..."
                    }
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters",
                      },
                    })}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="h-11 w-full bg-blue-600 text-base font-medium hover:bg-blue-700 md:w-auto md:px-8"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Spinner className="text-white h-4 w-4" /> Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Send Message <Send size={16} />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

// import React from 'react'

// import Footer from "@/components/Footer";
// import {Label} from "@/components/ui/label";
// import {Textarea} from "@/components/ui/textarea";
// import {Input} from "@/components/ui/input";
// import {Button} from "@/components/ui/button";

// export default function ContactUS() {
//     return (
//         <div className="w-full">
//             <div className="w-full flex flex-col justify-center items-center p-2 sm:p-10 mb-80">
//                 <div className="max-w-3xl w-full px-1 flex flex-col gap-3">
//                     <p className="font-semibold text-lg">Contact Us</p>
//                     <div className="flex flex-col gap-1.5">
//                         <p>At Tonmame, we&#39;re always here to help! Whether you have questions, suggestions, or
//                             need assistance, our support team is ready to assist you.</p>
//                         <div className="space-y-2 text-gray-800">
//                             <p><span className="font-semibold">Customer Support:</span> For general inquiries,
//                                 feedback, or assistance, email us at <a href="mailto:support@tonmame.com"
//                                                                         className="text-blue-600 hover:underline">support@tonmame.com</a>.
//                             </p>

//                             <p><span className="font-semibold">Security Concerns:</span> If you encounter any
//                                 security-related issues or vulnerabilities, please report them to <a
//                                     href="mailto:security@tonmame.com"
//                                     className="text-blue-600 hover:underline">security@tonmame.com</a>.</p>
//                         </div>

//                     </div>
//                 </div>

//                 <div className="max-w-3xl w-full px-1 flex flex-col gap-3 mt-8">

//                     <div className="w-full">
//                         <p className="font-semibold text-lg">Feature Request</p>
//                         <span className="text-sm text-gray-400 text-center">Have something in mind that’s not listed? We’re all ears! Feel free
//                          to send us a feature request — we’re here to build what you need.</span>

//                     </div>
//                      <div className="w-full flex flex-col gap-1">
//                          <Label>Full Name</Label>
//                          <Input type={"text"} className="rounded" />
//                      </div>
//                      <div>
//                          <Textarea className="min-h-40 rounded"  placeholder="Tell us now and we will do it as soon as possible"/>
//                      </div>
//                      <div>
//                          <Button className="w-fit rounded bg-blue-500">Submit</Button>
//                      </div>
//                 </div>
//             </div>
//             <Footer/>
//         </div>
//     )
// }

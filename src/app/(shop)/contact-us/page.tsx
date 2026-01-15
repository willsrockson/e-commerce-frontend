import React from 'react'

import Footer from "@/components/Footer";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function ContactUS() {
    return (
        <div className="w-full">
            <div className="w-full flex flex-col justify-center items-center p-2 sm:p-10 mb-80">
                <div className="max-w-3xl w-full px-1 flex flex-col gap-3">
                    <p className="font-semibold text-lg">Contact Us</p>
                    <div className="flex flex-col gap-1.5">
                        <p>At Tonmame, we&#39;re always here to help! Whether you have questions, suggestions, or
                            need assistance, our support team is ready to assist you.</p>
                        <div className="space-y-2 text-gray-800">
                            <p><span className="font-semibold">Customer Support:</span> For general inquiries,
                                feedback, or assistance, email us at <a href="mailto:support@tonmame.com"
                                                                        className="text-blue-600 hover:underline">support@tonmame.com</a>.
                            </p>

                            <p><span className="font-semibold">Security Concerns:</span> If you encounter any
                                security-related issues or vulnerabilities, please report them to <a
                                    href="mailto:security@tonmame.com"
                                    className="text-blue-600 hover:underline">security@tonmame.com</a>.</p>
                        </div>

                    </div>
                </div>

                <div className="max-w-3xl w-full px-1 flex flex-col gap-3 mt-8">

                    <div className="w-full">
                        <p className="font-semibold text-lg">Feature Request</p>
                        <span className="text-sm text-gray-400 text-center">Have something in mind that’s not listed? We’re all ears! Feel free
                         to send us a feature request — we’re here to build what you need.</span>

                    </div>
                     <div className="w-full flex flex-col gap-1">
                         <Label>Full Name</Label>
                         <Input type={"text"} className="rounded" />
                     </div>
                     <div>
                         <Textarea className="min-h-40 rounded"  placeholder="Tell us now and we will do it as soon as possible"/>
                     </div>
                     <div>
                         <Button className="w-fit rounded bg-blue-500">Submit</Button>
                     </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

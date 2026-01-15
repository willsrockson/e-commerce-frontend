import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export default function ProcessingUi() {
    return (
        <form>
            <div className="w-full">
                <div className="max-w-md text-gray-600 text-sm mb-8">
                    <p>
                        Verifying your identity helps protect both buyers and sellers from fraud,
                        ensuring a secure and trustworthy marketplace for everyone.
                    </p>
                </div>

                <div className="w-full mb-6">
                    <Label className="block text-sm font-medium text-gray-400" htmlFor="ghanaCard">Ghana Card No.</Label>
                    <Input
                        className={`w-full`}
                        type={"text"}
                        placeholder="GHA-000000000-0"
                        disabled
                    />
                </div>

                <div className="w-full mb-6">
                    <Label className="block text-sm font-medium text-gray-400" htmlFor="ghanaCard">D.0.B</Label>
                    <Input
                        disabled
                        className={`w-full`}
                        type={"date"}
                    />
                </div>

                {/* <div className="mb-6 rounded-md border border-amber-400 bg-amber-50 p-3">
                    <p className="font-semibold text-amber-700">
                        ⚠️ Important: Verification Requirements
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
                        <li>
                            Upload <span className="font-medium">front of Ghana Card</span> (clear &
                            visible).
                        </li>
                        <li>
                            Upload <span className="font-medium">back of Ghana Card</span> (barcode
                            must be visible).
                        </li>
                        <li>
                            Upload a{" "}
                            <span className="font-medium">selfie holding the Ghana Card</span>{" "}
                            (front side visible).
                        </li>
                        <li>
                            <span className="font-medium">
                                Profile name must match Ghana Card name exactly.
                            </span>
                        </li>
                        <li>
                            Blurry, cropped, or mismatched uploads will be{" "}
                            <span className="text-red-600 font-medium">rejected</span>.
                        </li>
                    </ul>
                </div> */}

                <div className="w-full">
                    <Label className="block text-sm font-medium text-gray-400">
                        Upload Required Images <span className="text-red-500">*</span>
                    </Label>
                    <p className="mt-1 text-xs text-gray-500 mb-1">
                        Please upload <span className="font-medium">3 files</span>: front, back, and
                        a selfie with the Ghana Card.
                    </p>
                    <Input
                        type="file"
                        multiple
                        disabled
                        className={`w-full cursor-pointer`}
                        accept="image/*"
                        placeholder="Four files expected"
                    />
                </div>

                <div className="w-full mt-5">
                    <Button
                        type="submit"
                        disabled
                        className="w-full bg-testing hover:bg-blue-400"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    );
}

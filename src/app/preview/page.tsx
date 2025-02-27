"use client";
import ResumePreview from "@/components/ResumePreview";
import { useResumeContext } from "@/context/ResumeContext";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

const Preview = () => {
  const { resumeData } = useResumeContext();
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Resume",
  });

  return (
    <div className="w-full mx-auto px-3 py-6 bg-gray-300">
      <div className="flex items-center justify-end px-2 gap-2  w-full max-w-[850px] mx-auto sm:px-4 py-2 mb-3">
        <Button className="bg-[#E6ECF8] hover:bg-[#E6ECF8]/90 text-primary h-[50]  flex items-center justify-center">
          <Share className="w-5 h-5  text-primary " />
          <span className="text-primary font-normal">Share</span>
        </Button>
        <Button
          className="bg-primary text-white h-[50]  flex items-center justify-center"
          asChild
        >
          <Button onClick={() => reactToPrintFn()}>
            <Download className="w-5 h-5  text-white" />
            <span className="text-white font-normal">Download</span>
          </Button>
        </Button>
      </div>
      <div className="md:w-1/2 mx-auto">
        <ResumePreview contentRef={contentRef} resumeData={resumeData} />
      </div>
    </div>
  );
};

export default Preview;

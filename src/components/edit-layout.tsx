import { CircleUser, Play, X } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const EditLayout = () => {
  return (
    <>
      <nav className="flex items-center justify-between px-2 sm:max-w-7xl sm:px-4 py-4">
        <span className="hidden md:opacity-0 md:block">Rezlinks</span>
        <div className="flex gap-2">
          <Image src={"/logo.png"} alt="Logo" width={135} height={40} />{" "}
        </div>

        <div className="flex gap-1 items-center">
          <span className="text-primary text-base font-medium">
            500 credits left
          </span>
          <CircleUser className="text-primary w-7 h-7" />
        </div>
      </nav>
      <div className="flex items-center justify-end px-2 gap-2   w-full max-w-[850px] mx-auto sm:px-4 py-2">
        <Button className="bg-[#E6ECF8] hover:bg-[#E6ECF8]/90 text-primary h-[50]  flex items-center justify-center">
          <X className="w-5 h-5  text-primary " />
          <span className="text-primary font-normal">Cancel</span>
        </Button>
        <Button className="bg-primary text-white h-[50]  flex items-center justify-center">
          <Play className="w-5 h-5  text-white" />
          <span className="text-white font-normal">Preview</span>
        </Button>
      </div>
    </>
  );
};

export default EditLayout;

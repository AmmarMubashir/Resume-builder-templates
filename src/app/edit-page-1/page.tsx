import EditLayout from "@/components/edit-layout";
import { Button } from "@/components/ui/button";
import EditResume from "@/components/ui/edit-resume";
import { CircleUser, Play, X } from "lucide-react";
import Image from "next/image";
import React from "react";

const ResumePage = () => {
  return (
    <div className="flex flex-col gap-1 ">
      <EditLayout />
      <EditResume />
    </div>
  );
};

export default ResumePage;

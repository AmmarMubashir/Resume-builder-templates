import EditLayout from "@/components/edit-layout";
import ResumeTemplate2 from "@/components/template-2/edit-resume-2";

import React from "react";

const ResumePage = () => {
  return (
    <div className="flex flex-col gap-1 ">
      <EditLayout />
      <ResumeTemplate2 />
    </div>
  );
};

export default ResumePage;

import EditLayout from "@/components/edit-layout";
import ResumeTemplate3 from "@/components/template-3/edit-resume";

import React from "react";

const ResumePage = () => {
  return (
    <div className="flex flex-col gap-1 ">
      <EditLayout />
      <ResumeTemplate3 />
    </div>
  );
};

export default ResumePage;

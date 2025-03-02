import EditLayout from "@/components/edit-layout";
import EditResume from "@/components/template-1/edit-resume";

import React from "react";

const ResumePage = () => {
  return (
    <div className="flex flex-col gap-1 ">
      <EditLayout previewLink="preview" />
      <EditResume />
    </div>
  );
};

export default ResumePage;

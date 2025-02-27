"use client";
import { useResumeContext } from "@/context/ResumeContext";
import React, { RefObject, useRef } from "react";
import type { ResumeData, Section, Link } from "./types";
import useDimensions from "@/hooks/useDimension";
import { cn } from "@/lib/utils";

interface resumeDataProps {
  contentRef?: React.Ref<HTMLDivElement>;
  resumeData: ResumeData;
}
const ResumePreview = ({ contentRef, resumeData }: resumeDataProps) => {
  // const { resumeData } = useResumeContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef as RefObject<HTMLElement>);
  // console.log("WEIDTH", width);
  // console.log("WIDTH", width || "No width yet");

  const renderSectionTitle = (section: Section) => (
    <div className="flex justify-between items-center mb-1 group relative">
      <div className="flex-1 flex justify-center">
        <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
      </div>
      <div className="hidden group-hover:flex gap-2"></div>
    </div>
  );

  const renderSection = (section: Section) => {
    switch (section.type) {
      case "education":
        return (
          <div className="group relative mb-1">
            {resumeData.education.map((edu: any) => (
              <div key={edu.id} className="group/item relative p-2 rounded-md ">
                <>
                  <div className="flex justify-between">
                    <div className="font-bold">{edu.institution}</div>
                    <div>{edu.location}</div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      {edu.degree}: GPA: {edu.gpa}
                    </div>
                    <div className="font-bold">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </>
              </div>
            ))}
          </div>
        );
      case "skills":
        return (
          <div className="group relative mb-1">
            <ul className="list-disc ml-5 space-y-1">
              {Object.entries(resumeData.skills).map(
                ([category, skills]: [any, any]) => (
                  <li key={category} className="group/item relative ">
                    <span className="font-bold capitalize">{category}:</span>{" "}
                    {skills.join(", ")}
                  </li>
                )
              )}
            </ul>
          </div>
        );
      case "experience":
      case "projects":
      case "certificates":
        return (
          <div className="group relative mb-1">
            {resumeData[section.type].map((item: any) => (
              <div
                key={item.id}
                className="group/item relative p-2 rounded-md "
              >
                <>
                  <div className="flex justify-between">
                    <div className="font-bold">
                      {item.title || item.name}
                      {item.company && ` | ${item.company}`}
                      {(item.link.text || item.link.url) && " | "}
                      {/* {renderLink(item.link, section.type, item.id)} */}
                    </div>
                    <div className="font-bold">
                      {item.duration || item.date}
                    </div>
                  </div>
                  {item.points && (
                    <ul className="list-disc ml-5 mt-1">
                      {item.points.map((point: string, index: number) => (
                        <li key={index} className="text-sm">
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.description && (
                    <div className="text-sm mt-1">{item.description}</div>
                  )}
                </>
              </div>
            ))}
          </div>
        );
      case "custom":
        return (
          <div className="group relative mb-1">
            {resumeData.custom.map((item: any) => (
              <div key={item.id} className="group/item relative p-2 ">
                <>
                  <div className="font-bold">{item.title}</div>
                  <div className="text-sm mt-1">{item.content}</div>
                </>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // if (!resumeData) {
  //   console.log("JELLO");
  //   return;
  // }

  return (
    <>
      <div
        className="aspect-[210/297] h-fit w-full bg-white "
        ref={containerRef}
      >
        <div
          className={cn("space-y-6 p-6", !width && "invisible")}
          style={{
            zoom: (1 / 794) * width,
          }}
          ref={contentRef}
          id="resumePreviewContent"
        >
          {/* Personal Info Section */}
          <div className="group relative mb-1 break-inside-avoid">
            <div className=" p-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {resumeData && resumeData.personalInfo.name}
              </h1>
              <div className="mt-2 grid grid-cols-2 gap-2 justify-between">
                {Object.entries(resumeData.personalInfo.links).map(
                  ([key, link]: [any, any]) => (
                    <div key={key} className="text-blue-600">
                      {link.text}:{" "}
                      <a
                        href={link.url}
                        className="text-blue-600 hover:underline"
                      >
                        {link.url}
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-300" />

          {resumeData &&
            resumeData.sections.map(
              (section: Section, index: number) =>
                section.isVisible && (
                  <>
                    <div className="group relative p-1 break-inside-avoid">
                      {renderSectionTitle(section)}
                      {renderSection(section)}
                    </div>
                    {index < resumeData.sections.length - 1 && (
                      <hr className="border-t border-gray-300 my-1" />
                    )}
                  </>
                )
            )}
        </div>
      </div>
    </>
  );
};

export default ResumePreview;

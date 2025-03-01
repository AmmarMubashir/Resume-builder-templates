"use client";
import { useResumeContext } from "@/context/ResumeContext";
import React, { RefObject, useRef } from "react";
import type { ResumeData, Section, Link } from "./types";
import useDimensions from "@/hooks/useDimension";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Linkedin,
  LinkIcon,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

interface resumeDataProps {
  contentRef?: React.Ref<HTMLDivElement>;
  resumeData: ResumeData;
}
const ResumePreview2 = ({ contentRef, resumeData }: resumeDataProps) => {
  // const { resumeData } = useResumeContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef as RefObject<HTMLElement>);
  // console.log("WEIDTH", width);
  // console.log("WIDTH", width || "No width yet");

  const renderSectionTitle = (section: Section) => (
    <div className="flex justify-between items-center  group relative">
      <div className="flex-1">
        <h2 className="text-lg font-bold text-[#26B6A5] uppercase border-b-2 border-[#26B6A5] pb-1 inline-block">
          {section.title}
        </h2>
      </div>
    </div>
  );

  const renderLink = (link: Link, section: string, id: string) => {
    return (
      <span className="inline-flex items-center gap-1">
        {link.text && link.url && (
          <>
            <a href={link.url} className="text-[#26B6A5] hover:underline">
              <ExternalLink className=" w-5 h-5 text-[#26B6A5] hover:underline" />
            </a>
          </>
        )}
      </span>
    );
  };

  const renderSection = (section: Section) => {
    switch (section.type) {
      case "education":
        return (
          <div className="group relative ">
            {resumeData.education.map((edu) => (
              <div
                key={edu.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent break-inside-avoid"
              >
                <>
                  <div className="flex justify-between">
                    <div className="font-bold">{edu.institution}</div>
                    <div className="text-right">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                  <div className="text-sm">
                    {edu.degree}- GPA: {edu.gpa}
                  </div>
                </>
              </div>
            ))}
          </div>
        );
      case "skills":
        return (
          <div className="group relative ">
            <ul className="list-none space-y-1">
              {Object.entries(resumeData.skills).map(([category, skills]) => (
                <li key={category} className="group/item relative ">
                  {Array.isArray(skills) ? skills.join(", ") : skills}
                </li>
              ))}
            </ul>
          </div>
        );
      case "experience":
      case "projects":
        return (
          <div className="group relative">
            {resumeData[section.type].map((item: any) => (
              <div
                key={item.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent   break-inside-avoid"
              >
                <>
                  <div className="flex justify-between items-center">
                    <div className="font-bold flex items-center">
                      {section.type === "experience" ? (
                        <>{item.title}</>
                      ) : (
                        <>
                          {item.title}
                          {item.link.text && (
                            <span className="ml-2 inline-flex items-center">
                              {renderLink(item.link, section.type, item.id)}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-right">{item.duration}</div>
                  </div>
                  {section.type === "experience" && (
                    <div className="text-sm">{item.company}</div>
                  )}
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
      case "certificates":
        return (
          <div className="group relative ">
            {resumeData.certificates.map((item) => (
              <div
                key={item.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent break-inside-avoid"
              >
                <>
                  <div className="flex justify-between">
                    <div className="font-bold">
                      {item.name}
                      {item.link.text && (
                        <span className="ml-2">
                          {renderLink(item.link, "certificates", item.id)}
                        </span>
                      )}
                    </div>
                    <div>{item.date}</div>
                  </div>
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
          <div className="group relative ">
            {resumeData.customSections.map((item) => (
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

  console.log(resumeData);

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
          className={cn("space-y-2 p-6", !width && "invisible")}
          style={{
            zoom: (1 / 794) * width,
          }}
          ref={contentRef}
          id="resumePreviewContent"
        >
          {/* Personal Info Section */}
          <div className="group relative  break-inside-avoid">
            <div className="p-2">
              <h1 className="text-3xl font-bold text-center text-gray-900">
                {resumeData.personalInfo.name}
              </h1>
              <p className="text-center text-sm mb-2">
                {resumeData.personalInfo.title}
              </p>
              <div className="flex justify-center gap-4 text-sm">
                {resumeData.personalInfo.links.email && (
                  <div className="flex items-center gap-1 text-[#26B6A5]">
                    <Mail className="w-4 h-4" />
                    <a
                      href={`mailto:${resumeData.personalInfo.links.email.url}`}
                      className="hover:underline"
                    >
                      {resumeData.personalInfo.links.email.text}
                    </a>
                  </div>
                )}
                {resumeData.personalInfo.links.phone && (
                  <div className="flex items-center gap-1 text-[#26B6A5]">
                    <Phone className="w-4 h-4" />
                    <a
                      href={`tel:${resumeData.personalInfo.links.phone.url}`}
                      className="hover:underline"
                    >
                      {resumeData.personalInfo.links.phone.text}
                    </a>
                  </div>
                )}
                {resumeData.personalInfo.links.location && (
                  <div className="flex items-center gap-1 text-[#26B6A5]">
                    <MapPin className="w-4 h-4" />
                    <span>{resumeData.personalInfo.links.location.text}</span>
                  </div>
                )}
                {resumeData.personalInfo.links.linkedin && (
                  <div className="flex items-center gap-1 text-[#26B6A5]">
                    <Linkedin className="w-4 h-4" />
                    <a
                      href={`https://linkedin.com/in/${resumeData.personalInfo.links.linkedin.url}`}
                      className="hover:underline"
                    >
                      {resumeData.personalInfo.links.linkedin.text}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {resumeData.sections.map(
            (section, index) =>
              section.isVisible && (
                <>
                  <div
                    className={`group relative p-2 ${
                      section.type === "skills" ? "break-inside-avoid" : ""
                    }`}
                  >
                    {renderSectionTitle(section)}
                    {renderSection(section)}
                  </div>
                  {index < resumeData.sections.length - 1 && (
                    <hr className="border-t border-gray-200 " />
                  )}
                </>
              )
          )}
        </div>
      </div>
    </>
  );
};

export default ResumePreview2;

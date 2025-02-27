"use client";
import useDimensions from "@/hooks/useDimension";
import { Phone, Mail, LinkIcon, MapPin, Calendar } from "lucide-react";
import { RefObject, useRef } from "react";

export default function Resume() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef as RefObject<HTMLElement>);
  return (
    <div
      className="aspect-[210/97] h-fit w-full bg-white text-black border-2"
      ref={containerRef}
    >
      <div
        className="space-y-6 p-6"
        style={{
          zoom: (1 / 794) * width,
        }}
      >
        <PersonalInfo />

        {/* Summary Section */}
        <ProfessionalSummary />

        {/* Experience Section */}
        <Experience />

        {/* Education Section */}
        <Education />
      </div>
    </div>
  );
}

function PersonalInfo() {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-bold text-slate-900">YOUR NAME</h1>
      <h2 className="text-2xl text-blue-600">The role you are applying for?</h2>
      <div className="flex flex-wrap gap-4 text-slate-600">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-500" />
          <span>Phone</span>
        </div>
        <div className="flex items-center gap-2 ">
          <Mail className="w-4 h-4 text-blue-500" />
          <span>Email</span>
        </div>
        <div className="flex items-center gap-2 ">
          <LinkIcon className="w-4 h-4 text-blue-500" />
          <span>LinkedIn/Portfolio</span>
        </div>
        <div className="flex items-center gap-2 ">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span>Location</span>
        </div>
      </div>
    </div>
  );
}

function ProfessionalSummary() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900  mb-1">SUMMARY</h2>
      <div className="h-1 bg-slate-900" />
      <p className="text-slate-600">
        Briefly explain why you're a great fit for the role - use the AI
        assistant to tailor this summary for each job posting.
      </p>
    </section>
  );
}

function Experience() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900  ">EXPERIENCE</h2>
      <div className="h-1 bg-slate-900" />
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold">Title</h3>
          <div className="text-blue-500">Company Name</div>
          <div className="flex flex-wrap gap-4 text-slate-600 text-sm mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Date period</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </div>
          </div>
          <p className="mt-2 text-slate-600">Company Description</p>
          <ul className="list-disc list-inside mt-2 text-slate-600">
            <li>Highlight your accomplishments, using numbers if possible.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">EDUCATION</h2>
      <div className="h-1 bg-slate-900" />

      <div>
        <h3 className="text-xl font-semibold">Degree and Field of Study</h3>
        <div className="text-blue-600">School or University</div>
        <div className="flex items-center gap-1 text-slate-600 text-sm mt-1">
          <Calendar className="w-4 h-4" />
          <span>Date period</span>
        </div>
      </div>
    </section>
  );
}

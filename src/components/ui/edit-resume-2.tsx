"use client";

import { useState } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  Check,
  LinkIcon,
  X,
  ArrowUpDown,
  Mail,
  Phone,
  MapPin,
  Linkedin,
} from "lucide-react";
import type { ResumeData, Section, Link } from "../types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const initialSections: Section[] = [
  { id: "1", title: "WORK EXPERIENCE", isVisible: true, type: "experience" },
  { id: "2", title: "EDUCATION", isVisible: true, type: "education" },
  { id: "3", title: "PROJECT", isVisible: true, type: "projects" },
  { id: "4", title: "SKILLS", isVisible: true, type: "skills" },
  { id: "5", title: "Achievement", isVisible: true, type: "certificates" },
];

const initialData: ResumeData = {
  personalInfo: {
    name: "Rahul Kumar",
    title:
      "Full Stack Developer | Integrated Dual Degree (BTech+MTech) | CSE IIT Kharagpur",
    links: {
      email: {
        text: "rahulkumar2007@gmail.com",
        url: "rahulkumar2007@gmail.com",
      },
      phone: { text: "+918117244114", url: "+918117244114" },
      location: { text: "India", url: "India" },
      linkedin: { text: "rahul.kumar", url: "rahul.kumar" },
    },
  },
  sections: initialSections,
  education: [
    {
      id: "1",
      institution: "IIT Kharagpur",
      location: "",
      degree: "Integrated Dual Degree (BTech+Mtech) - 9.2/10",
      gpa: "",
      startDate: "2019",
      endDate: "2024",
    },
  ],
  skills: {
    languages: ["Languages: C/C++, Python, Javascript, Java, Scala"],
    frameworks: [
      "Frameworks: React.Js, Django, Vue.Js, Springboot, Flink, Spark",
    ],
    cloud: [
      "Cloud/Databases/Tech-Stack: Postgres, MS-SQL, Mysql, AWS Services, Azure Services, ELK Stack, Prometheus, Kubernetes, Docker, Aerospike, Airflow, Helm",
    ],
  },
  experience: [
    {
      id: "1",
      title: "Software Development Intern",
      company: "TechSolve Solutions",
      link: { text: "", url: "" },
      duration: "July 2024 - Dec 2024",
      points: [
        "Developed a responsive web application using React.js and TailwindCSS, improving user engagement by 15%.",
        "Collaborated with a team of 4 to implement a RESTful API using Node.js and Express, ensuring seamless data flow between the frontend and backend.",
        "Optimized database queries in MongoDB, reducing query response time by 20%.",
        "Implemented JWT-based authentication, securing user access for 500+ accounts.",
        "Participated in code reviews and followed Agile methodologies, improving code quality and development efficiency.",
        "Deployed the application on AWS S3 and EC2, ensuring scalability and 99.9% uptime.",
      ],
    },
  ],
  projects: [
    {
      id: "1",
      title: "TaskManager Pro",
      link: { text: "", url: "" },
      duration: "2019 - 2020",
      points: [
        "Developed TaskManager Pro, a task management web application to streamline daily task organization and communication.",
        "Implemented user authentication (signup, login, and password recovery) with secure JWT-based access, ensuring data protection for 1,000+ users.",
        "Designed an intuitive task management system with CRUD operations, improving task completion efficiency by 25%.",
        "Enabled team collaboration by allowing task sharing and assignments, boosting team productivity by 30%.",
        "Integrated email notifications for task updates and deadlines, reducing missed deadlines by 20%.",
        "Built using React.js, Node.js (Express), MongoDB, AWS S3/EC2, and JWT authentication, ensuring scalability and performance.",
      ],
    },
    {
      id: "2",
      title: "Portfolio Builder",
      link: { text: "", url: "" },
      duration: "2020 - 2021",
      points: [
        "Developed a dynamic web application enabling users to create and customize professional portfolios with real-time previews.",
        "Integrated drag-and-drop features using React.js, enhancing user experience and reducing portfolio creation time by 40%.",
        "Built with React.js, Node.js, and MongoDB, and deployed on AWS S3/EC2, ensuring fast load times and scalability.",
      ],
    },
  ],
  certificates: [
    {
      id: "1",
      name: "AIR 756 in JEE Advance 2019",
      link: { text: "", url: "" },
      date: "",
      description: "",
    },
  ],
  custom: [],
};

const DragHandle = ({ id }: any) => {
  const { attributes, listeners } = useSortable({ id });

  return (
    <div
      className="absolute left-1/2 -top-3 rounded-md transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move bg-[#E6F7F5] p-1"
      {...attributes}
      {...listeners}
    >
      <ArrowUpDown className="w-5 h-5 text-[#26B6A5]" />
    </div>
  );
};

const SortableItem = ({ id, children }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export default function EditResume() {
  const [data, setData] = useState(initialData);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<{
    section: string;
    id: string;
  } | null>(null);

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setData((prevData) => {
        const oldIndex = prevData.sections.findIndex(
          (section) => section.id === active.id
        );
        const newIndex = prevData.sections.findIndex(
          (section) => section.id === over.id
        );

        return {
          ...prevData,
          sections: arrayMove(prevData.sections, oldIndex, newIndex),
        };
      });
    }

    setActiveId(null);
  };

  const handleSectionVisibility = (sectionId: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, isVisible: !section.isVisible }
          : section
      ),
    }));
  };

  const handleEditSectionTitle = (sectionId: string) => {
    setEditingTitle(sectionId);
  };

  const handleEditLink = (section: string, id: string) => {
    setEditingLink({ section, id });
  };

  const handleSaveLink = (section: string, id: string, link: Link) => {
    setData((prev: any) => ({
      ...prev,
      [section]: prev[section].map((item: any) =>
        item.id === id ? { ...item, link } : item
      ),
    }));
  };

  const handleEdit = (section: string, id: string | null = null) => {
    setEditingSection(section);
    setEditingId(id);
  };

  const handleAdd = (section: string) => {
    const newId = Math.random().toString(36).substr(2, 9);
    let newItem: any = { id: newId };

    switch (section) {
      case "education":
        newItem = {
          ...newItem,
          institution: "",
          location: "",
          degree: "",
          gpa: "",
          startDate: "",
          endDate: "",
        };
        break;
      case "experience":
        newItem = {
          ...newItem,
          title: "",
          company: "",
          link: { text: "", url: "" },
          duration: "",
          points: [""],
        };
        break;
      case "projects":
        newItem = {
          ...newItem,
          title: "",
          link: { text: "", url: "" },
          duration: "",
          points: [""],
        };
        break;
      case "certificates":
        newItem = {
          ...newItem,
          name: "",
          link: { text: "", url: "" },
          date: "",
          description: "",
        };
        break;
      case "skills":
        const newCategory = prompt("Enter new skill category name:");
        if (newCategory) {
          setData((prev) => ({
            ...prev,
            skills: {
              ...prev.skills,
              [newCategory.toLowerCase()]: [],
            },
          }));
        }
        return;
      case "custom":
        newItem = {
          ...newItem,
          title: "",
          content: "",
        };
        break;
      default:
        return;
    }

    setData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
    setEditingSection(section);
    setEditingId(newId);
  };

  const handleDelete = (section: string, id: string) => {
    setData((prev: any) => {
      const updatedSection = { ...prev };
      if (Array.isArray(updatedSection[section])) {
        updatedSection[section] = updatedSection[section].filter(
          (item: any) => item.id !== id
        );
      }
      return updatedSection;
    });
    setEditingSection(null);
    setEditingId(null);
  };

  const handleSave = (section: string, newData: any) => {
    setData((prev) => ({
      ...prev,
      [section]: newData,
    }));
  };

  const handleAddSection = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newSection: Section = {
      id: newId,
      title: "New Section",
      isVisible: true,
      type: "custom",
    };
    setData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
      custom: [
        ...prev.custom,
        { id: newId, title: "New Section", content: "" },
      ],
    }));
    setEditingSection("custom");
    setEditingId(newId);
  };

  // Update the renderSectionTitle function
  const renderSectionTitle = (section: Section) => (
    <div className="flex justify-between items-center mb-4 group relative">
      <DragHandle id={section.id} />
      <div className="flex-1">
        {editingTitle === section.id ? (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={section.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setData((prev) => ({
                  ...prev,
                  sections: prev.sections.map((s) =>
                    s.id === section.id ? { ...s, title: newTitle } : s
                  ),
                }));
              }}
              onBlur={() => setEditingTitle(null)}
              className="w-full p-2 border rounded hover-border transition-colors duration-200 text-center font-bold text-lg"
              autoFocus
            />
          </div>
        ) : (
          <h2 className="text-lg font-bold text-[#26B6A5] uppercase border-b-2 border-[#26B6A5] pb-1 inline-block">
            {section.title}
          </h2>
        )}
      </div>
      <div className="hidden group-hover:flex gap-2">
        {section.type !== "skills" && (
          <button
            onClick={() => handleAdd(section.type)}
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 text-[#26B6A5]" />
          </button>
        )}
        <button
          onClick={() => handleEditSectionTitle(section.id)}
          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
        >
          <Edit2 className="w-4 h-4 text-[#26B6A5]" />
        </button>
        <button
          onClick={() => handleSectionVisibility(section.id)}
          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );

  const renderLink = (link: Link, section: string, id: string) => {
    if (editingLink?.section === section && editingLink?.id === id) {
      return (
        <div className="inline-flex items-center gap-2">
          <input
            type="text"
            value={link.text}
            onChange={(e) => {
              const newLink = { ...link, text: e.target.value };
              handleSaveLink(section, id, newLink);
            }}
            className="w-20 p-2 border rounded hover-border transition-colors duration-200 text-[#26B6A5]"
          />
          <input
            type="text"
            value={link.url}
            onChange={(e) => {
              const newLink = { ...link, url: e.target.value };
              handleSaveLink(section, id, newLink);
            }}
            className="w-32 p-2 border rounded hover-border transition-colors duration-200"
            placeholder="URL"
          />
          <button
            onClick={() => setEditingLink(null)}
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
          >
            <Check className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={() => {
              handleSaveLink(section, id, { text: "", url: "" });
              setEditingLink(null);
            }}
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      );
    }

    return (
      <span className="inline-flex items-center gap-1">
        {link.text && link.url ? (
          <>
            <a href={link.url} className="text-[#26B6A5] hover:underline">
              {link.text}
            </a>
            <button
              onClick={() => handleEditLink(section, id)}
              className="ml-2 p-2 hover:bg-gray-100 rounded opacity-0 group-hover/item:opacity-100"
            >
              <LinkIcon className="w-3 h-3 text-[#26B6A5]" />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleEditLink(section, id)}
            className="text-[#26B6A5] hover:underline opacity-0 group-hover/item:opacity-100"
          >
            Add link
          </button>
        )}
      </span>
    );
  };

  const handleCloseEdit = () => {
    setEditingSection(null);
    setEditingId(null);
  };

  const renderSection = (section: Section) => {
    switch (section.type) {
      case "education":
        return (
          <div className="group relative mb-6">
            {data.education.map((edu) => (
              <div
                key={edu.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-[#26B6A5]"
              >
                <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
                  <button
                    onClick={() => handleEdit("education", edu.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 text-[#26B6A5]" />
                  </button>
                  <button
                    onClick={() => handleDelete("education", edu.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                {editingSection === "education" && editingId === edu.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEducation = data.education.map((item) =>
                          item.id === edu.id
                            ? { ...item, institution: e.target.value }
                            : item
                        );
                        handleSave("education", newEducation);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="Institution"
                    />
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = data.education.map((item) =>
                            item.id === edu.id
                              ? { ...item, degree: e.target.value }
                              : item
                          );
                          handleSave("education", newEducation);
                        }}
                        className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="Degree"
                      />
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => {
                          const newEducation = data.education.map((item) =>
                            item.id === edu.id
                              ? { ...item, gpa: e.target.value }
                              : item
                          );
                          handleSave("education", newEducation);
                        }}
                        className="w-20 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="GPA"
                      />
                    </div>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => {
                          const newEducation = data.education.map((item) =>
                            item.id === edu.id
                              ? { ...item, startDate: e.target.value }
                              : item
                          );
                          handleSave("education", newEducation);
                        }}
                        className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="Start Date"
                      />
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => {
                          const newEducation = data.education.map((item) =>
                            item.id === edu.id
                              ? { ...item, endDate: e.target.value }
                              : item
                          );
                          handleSave("education", newEducation);
                        }}
                        className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="End Date"
                      />
                    </div>
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCloseEdit()}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        onClick={() => handleCloseEdit()}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <div className="font-bold">{edu.institution}</div>
                      <div className="text-right">
                        {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                    <div className="text-sm">{edu.degree}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        );
      case "skills":
        return (
          <div className="group relative mb-6">
            {editingSection === "skills" ? (
              <div className="space-y-4" data-section="skills">
                {Object.entries(data.skills).map(([category, skills]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium capitalize">
                        {category}
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newSkills = { ...data.skills };
                            delete newSkills[category];
                            handleSave("skills", newSkills);
                          }}
                          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={Array.isArray(skills) ? skills.join(", ") : skills}
                      onChange={(e) => {
                        const newSkills = {
                          ...data.skills,
                          [category]: e.target.value
                            .split(",")
                            .map((skill) => skill.trim())
                            .filter(Boolean),
                        };
                        handleSave("skills", newSkills);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      rows={3}
                      placeholder="Enter skills separated by commas"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleAdd("skills")}
                  className="flex items-center gap-2 text-[#26B6A5] hover:text-[#1a8a7c]"
                >
                  <Plus className="w-4 h-4" /> Add new skill category
                </button>
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    onClick={() => handleCloseEdit()}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                  <button
                    onClick={() => handleCloseEdit()}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </div>
            ) : (
              <ul className="list-none space-y-1">
                {Object.entries(data.skills).map(([category, skills]) => (
                  <li
                    key={category}
                    className="group/item relative hover-border-resume"
                  >
                    {Array.isArray(skills) ? skills.join(", ") : skills}
                    <button
                      onClick={() => handleEdit("skills")}
                      className="ml-2 p-2 hover:bg-gray-100 rounded opacity-0 group-hover/item:opacity-100"
                    >
                      <Edit2 className="w-4 h-4 text-[#26B6A5]" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case "experience":
      case "projects":
        return (
          <div className="group relative mb-6">
            {data[section.type].map((item: any) => (
              <div
                key={item.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-[#26B6A5] mb-4"
              >
                <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
                  <button
                    onClick={() => handleEdit(section.type, item.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 text-[#26B6A5]" />
                  </button>
                  <button
                    onClick={() => handleDelete(section.type, item.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                {editingSection === section.type && editingId === item.id ? (
                  <div
                    className="space-y-2"
                    data-section={section.type}
                    data-id={item.id}
                  >
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={item.title || item.name}
                        onChange={(e) => {
                          const newData = (
                            data[section.type as keyof ResumeData] as any[]
                          ).map((dataItem: any) =>
                            dataItem.id === item.id
                              ? {
                                  ...dataItem,
                                  [item.title ? "title" : "name"]:
                                    e.target.value,
                                }
                              : dataItem
                          );
                          handleSave(section.type, newData);
                        }}
                        className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder={item.title ? "Title" : "Name"}
                      />
                      {item.company && (
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => {
                            const newData = (
                              data[section.type as keyof ResumeData] as any[]
                            ).map((dataItem: any) =>
                              dataItem.id === item.id
                                ? { ...dataItem, company: e.target.value }
                                : dataItem
                            );
                            handleSave(section.type, newData);
                          }}
                          className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                          placeholder="Company"
                        />
                      )}
                      {item.duration && (
                        <input
                          type="text"
                          value={item.duration}
                          onChange={(e) => {
                            const newData = (
                              data[section.type as keyof ResumeData] as any[]
                            ).map((dataItem: any) =>
                              dataItem.id === item.id
                                ? { ...dataItem, duration: e.target.value }
                                : dataItem
                            );
                            handleSave(section.type, newData);
                          }}
                          className="w-32 p-2 border rounded hover-border transition-colors duration-200"
                          placeholder="Duration"
                        />
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium">Link:</span>
                      {renderLink(item.link, section.type, item.id)}
                    </div>
                    {item.points && (
                      <textarea
                        value={item.points.join("\n")}
                        onChange={(e) => {
                          const newData = (
                            data[section.type as keyof ResumeData] as any[]
                          ).map((dataItem: any) =>
                            dataItem.id === item.id
                              ? {
                                  ...dataItem,
                                  points: e.target.value
                                    .split("\n")
                                    .filter(Boolean),
                                }
                              : dataItem
                          );
                          handleSave(section.type, newData);
                        }}
                        className="w-full p-2 border rounded hover-border transition-colors duration-200"
                        rows={4}
                        placeholder="Enter points (one per line)"
                      />
                    )}
                    {item.description && (
                      <textarea
                        value={item.description}
                        onChange={(e) => {
                          const newData = (
                            data[section.type as keyof ResumeData] as any[]
                          ).map((dataItem: any) =>
                            dataItem.id === item.id
                              ? { ...dataItem, description: e.target.value }
                              : dataItem
                          );
                          handleSave(section.type, newData);
                        }}
                        className="w-full p-2 border rounded hover-border transition-colors duration-200"
                        rows={4}
                        placeholder="Description"
                      />
                    )}
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCloseEdit()}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        onClick={() => handleCloseEdit()}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <div className="font-bold">
                        {section.type === "experience" ? (
                          <>{item.title}</>
                        ) : (
                          <>
                            {item.title}
                            {item.link.text && (
                              <span className="ml-2 inline-flex items-center">
                                <LinkIcon className="w-3 h-3 text-[#26B6A5] mr-1" />
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
                )}
              </div>
            ))}
          </div>
        );
      case "certificates":
        return (
          <div className="group relative mb-6">
            {data.certificates.map((item) => (
              <div
                key={item.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-[#26B6A5]"
              >
                <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
                  <button
                    onClick={() => handleEdit("certificates", item.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 text-[#26B6A5]" />
                  </button>
                  <button
                    onClick={() => handleDelete("certificates", item.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                {editingSection === "certificates" && editingId === item.id ? (
                  <div
                    className="space-y-2"
                    data-section="certificates"
                    data-id={item.id}
                  >
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const newData = data.certificates.map((cert) =>
                            cert.id === item.id
                              ? { ...cert, name: e.target.value }
                              : cert
                          );
                          handleSave("certificates", newData);
                        }}
                        className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="Certificate Name"
                      />
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) => {
                          const newData = data.certificates.map((cert) =>
                            cert.id === item.id
                              ? { ...cert, date: e.target.value }
                              : cert
                          );
                          handleSave("certificates", newData);
                        }}
                        className="w-32 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="Date"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium">Link:</span>
                      {renderLink(item.link, "certificates", item.id)}
                    </div>
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const newData = data.certificates.map((cert) =>
                          cert.id === item.id
                            ? { ...cert, description: e.target.value }
                            : cert
                        );
                        handleSave("certificates", newData);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      rows={4}
                      placeholder="Description"
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCloseEdit()}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        onClick={() => handleCloseEdit()}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
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
                )}
              </div>
            ))}
          </div>
        );
      case "custom":
        return (
          <div className="group relative mb-6">
            {data.custom.map((item) => (
              <div key={item.id} className="group/item relative p-2 ">
                <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
                  <button
                    onClick={() => handleEdit("custom", item.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 text-[#26B6A5]" />
                  </button>
                  <button
                    onClick={() => handleDelete("custom", item.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                {editingSection === "custom" && editingId === item.id ? (
                  <div
                    className="space-y-2"
                    data-section="custom"
                    data-id={item.id}
                  >
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newCustom = data.custom.map((customItem) =>
                          customItem.id === item.id
                            ? { ...customItem, title: e.target.value }
                            : customItem
                        );
                        handleSave("custom", newCustom);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="Title"
                    />
                    <textarea
                      value={item.content}
                      onChange={(e) => {
                        const newCustom = data.custom.map((customItem) =>
                          customItem.id === item.id
                            ? { ...customItem, content: e.target.value }
                            : customItem
                        );
                        handleSave("custom", newCustom);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      rows={4}
                      placeholder="Content"
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCloseEdit()}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        onClick={() => handleCloseEdit()}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-bold">{item.title}</div>
                    <div className="text-sm mt-1">{item.content}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[850px] mx-auto p-8 bg-white mb-4 shadow-lg rounded-lg">
      <style jsx global>{`
        input:focus,
        textarea:focus {
          outline: none;
          border-color: #26b6a5;
          box-shadow: 0 0 0 2px rgba(38, 182, 165, 0.2);
        }
        .hover-border:hover {
          border-color: #26b6a5;
          border: 2px solid #26b6a5;
        }
      `}</style>
      {/* Personal Info Section */}
      <div className="group relative mb-8">
        <div className="absolute hidden group-hover:flex gap-2 -right-4 -top-2">
          <button
            onClick={() =>
              setEditingSection(
                editingSection === "personalInfo" ? null : "personalInfo"
              )
            }
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
          >
            {editingSection === "personalInfo" ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Edit2 className="w-5 h-5 text-[#26B6A5]" />
            )}
          </button>
          {editingSection === "personalInfo" && (
            <button
              onClick={() => setEditingSection(null)}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-red-600" />
            </button>
          )}
        </div>
        {editingSection === "personalInfo" ? (
          <div className="space-y-4">
            <input
              type="text"
              value={data.personalInfo.name}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, name: e.target.value },
                }))
              }
              className="w-full p-2 border rounded hover-border transition-colors duration-200 text-2xl font-bold"
              placeholder="Name"
            />
            <input
              type="text"
              value={data.personalInfo.title}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, title: e.target.value },
                }))
              }
              className="w-full p-2 border rounded hover-border transition-colors duration-200"
              placeholder="Title/Position"
            />
            <div className="space-y-2">
              {Object.entries(data.personalInfo.links).map(([key, link]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={link.text}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          links: {
                            ...prev.personalInfo.links,
                            [key]: { ...link, text: e.target.value },
                          },
                        },
                      }))
                    }
                    className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                    placeholder="Link text"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          links: {
                            ...prev.personalInfo.links,
                            [key]: { ...link, url: e.target.value },
                          },
                        },
                      }))
                    }
                    className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                    placeholder="URL"
                  />
                  <button
                    onClick={() => {
                      setData((prev) => {
                        const newLinks = { ...prev.personalInfo.links };
                        delete newLinks[key];
                        return {
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            links: newLinks,
                          },
                        };
                      });
                    }}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newKey = `link${
                    Object.keys(data.personalInfo.links).length + 1
                  }`;
                  setData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      links: {
                        ...prev.personalInfo.links,
                        [newKey]: { text: "", url: "" },
                      },
                    },
                  }));
                }}
                className="flex items-center gap-2 text-[#26B6A5] hover:text-[#1a8a7c]"
              >
                <Plus className="w-5 h-5" /> Add new link
              </button>
            </div>
          </div>
        ) : (
          <div className="hover-border-resume p-2">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
              {data.personalInfo.name}
            </h1>
            <p className="text-center text-sm mb-4">
              {data.personalInfo.title}
            </p>
            <div className="flex justify-center gap-4 text-sm">
              {data.personalInfo.links.email && (
                <div className="flex items-center gap-1 text-[#26B6A5]">
                  <Mail className="w-4 h-4" />
                  <a
                    href={`mailto:${data.personalInfo.links.email.url}`}
                    className="hover:underline"
                  >
                    {data.personalInfo.links.email.text}
                  </a>
                </div>
              )}
              {data.personalInfo.links.phone && (
                <div className="flex items-center gap-1 text-[#26B6A5]">
                  <Phone className="w-4 h-4" />
                  <a
                    href={`tel:${data.personalInfo.links.phone.url}`}
                    className="hover:underline"
                  >
                    {data.personalInfo.links.phone.text}
                  </a>
                </div>
              )}
              {data.personalInfo.links.location && (
                <div className="flex items-center gap-1 text-[#26B6A5]">
                  <MapPin className="w-4 h-4" />
                  <span>{data.personalInfo.links.location.text}</span>
                </div>
              )}
              {data.personalInfo.links.linkedin && (
                <div className="flex items-center gap-1 text-[#26B6A5]">
                  <Linkedin className="w-4 h-4" />
                  <a
                    href={`https://linkedin.com/in/${data.personalInfo.links.linkedin.url}`}
                    className="hover:underline"
                  >
                    {data.personalInfo.links.linkedin.text}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.sections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          {data.sections.map(
            (section, index) =>
              section.isVisible && (
                <SortableItem key={section.id} id={section.id}>
                  <div className="group relative mb-4 hover-border-resume p-2">
                    {renderSectionTitle(section)}
                    {renderSection(section)}
                  </div>
                  {index < data.sections.length - 1 && (
                    <hr className="border-t border-gray-200 my-4" />
                  )}
                </SortableItem>
              )
          )}
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-[#26B6A5]">
              {data.sections.find((section) => section.id === activeId)?.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add New Section button */}
      <div className="relative mt-8 pt-6 border-t border-gray-300">
        <button
          onClick={handleAddSection}
          className="absolute left-1/2 top-0 text-[#26B6A5] transform -translate-x-1/2 -translate-y-1/2 bg-[#E6F7F5] px-4 py-2 flex items-center gap-2 text-sm hover:text-[#1a8a7c] border border-gray-300 rounded-full shadow-sm hover:shadow transition-all duration-200"
        >
          <Plus className="w-5 h-5 text-[#26B6A5]" />
          Add New Section
        </button>
      </div>
    </div>
  );
}

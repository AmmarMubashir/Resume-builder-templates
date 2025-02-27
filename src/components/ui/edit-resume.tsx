"use client";

import type React from "react";

import { useState } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  Check,
  LinkIcon,
  X,
  ArrowUpDown,
} from "lucide-react";
import type { Link } from "../types";
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
import { useResumeContext } from "@/context/ResumeContext";

// Define types
interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
}

interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
}

interface Section {
  id: string;
  title: string;
  isVisible: boolean;
  type: string;
}

interface Education {
  id: string;
  institution: string;
  location: string;
  degree: string;
  gpa: string;
  startDate: string;
  endDate: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  link: Link;
  duration: string;
  points: string[];
}

interface Project {
  id: string;
  title: string;
  link: Link;
  duration: string;
  points: string[];
}

interface Certificate {
  id: string;
  name: string;
  link: Link;
  date: string;
  description: string;
}

interface Skills {
  [key: string]: string[];
}

interface PersonalInfo {
  name: string;
  links: {
    [key: string]: Link;
  };
}

interface ResumeData {
  personalInfo: PersonalInfo;
  sections: Section[];
  education: Education[];
  skills: Skills;
  experience: Experience[];
  projects: Project[];
  certificates: Certificate[];
  customSections: CustomSection[];
}

const initialSections: Section[] = [
  { id: "1", title: "EDUCATION", isVisible: true, type: "education" },
  { id: "2", title: "SKILLS SUMMARY", isVisible: true, type: "skills" },
  { id: "3", title: "WORK EXPERIENCE", isVisible: true, type: "experience" },
  { id: "4", title: "PROJECTS", isVisible: true, type: "projects" },
  { id: "5", title: "CERTIFICATES", isVisible: true, type: "certificates" },
];

const initialData: ResumeData = {
  personalInfo: {
    name: "Syed Moazam Ali",
    links: {
      linkedin: { text: "LinkedIn", url: "linkedin" },
      github: { text: "Github/ Behance", url: "github" },
      email: { text: "Email", url: "abc123@gmail.com" },
      phone: { text: "Phone", url: "+92345-9087654" },
    },
  },
  sections: initialSections,
  education: [
    {
      id: "1",
      institution: "Vellore Institute of Technology",
      location: "Chennai, India",
      degree: "Master of Computer Application",
      gpa: "8.06",
      startDate: "June 2022",
      endDate: "August 2024",
    },
  ],
  skills: {
    languages: ["Python", "SQL", "JAVA"],
    frameworks: ["Pandas", "Numpy", "Scikit-Learn", "Matplotlib"],
    tools: ["Power BI", "Excel", "PowerPoint", "Tableau", "MySQL", "SQLite"],
    platforms: [
      "PyCharm",
      "Jupyter Notebook",
      "Visual Studio Code",
      "IntelliJ IDEA",
    ],
    softSkills: [
      "Rapport Building",
      "Strong Stakeholder management",
      "People Management",
      "Excellent communication",
    ],
  },
  experience: [
    {
      id: "1",
      title: "BUSINESS ANALYST INTERN",
      company: "WS",
      link: { text: "LINK", url: "#" },
      duration: "January 24- March 24",
      points: [
        "Streamlined data collection and reporting procedures, reducing processing time by 20% enhancing efficiency.",
        "Implemented process improvements and automation solutions, resulting in 15% increase in productivity.",
        "Collaborated with 3+ cross-functional teams to gather requirements, define project scopes, and ensure alignment with business objectives.",
      ],
    },
  ],
  projects: [
    {
      id: "1",
      title: "Student Performance Prediction",
      link: { text: "LINK", url: "#" },
      duration: "December 23- February 2024",
      points: [
        "Achieved a 96% accuracy in predicting student performance using machine learning.",
        "Managed data integration from multiple sources, improving data quality by 30%.",
      ],
    },
  ],
  certificates: [
    {
      id: "1",
      name: "Programming in Python (Meta)",
      link: { text: "CERTIFICATE", url: "#" },
      date: "March 2023",
      description:
        "Mastered fundamental Python syntax, proficiently utilizing control flow, loops, functions, and data structures.",
    },
  ],
  customSections: [
    {
      id: "custom-section-1",
      sectionTitle: "Custom Section Title",
      items: [
        {
          id: "1",
          title: "",
          content: "",
        },
      ],
    },
  ],
};

const DragHandle = ({ id }: { id: string }) => {
  const { attributes, listeners } = useSortable({ id });

  return (
    <div
      className="absolute left-1/2 -top-3 rounded-md transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move bg-[#E6ECF8] p-1"
      {...attributes}
      {...listeners}
    >
      <ArrowUpDown className="w-5 h-5 text-primary " />
    </div>
  );
};

const SortableItem = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
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
  const [data, setData] = useState<ResumeData>(initialData);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<{
    section: string;
    id: string;
  } | null>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [newCustomSection, setNewCustomSection] =
    useState<CustomSection | null>(null);
  const [newCustomItem, setNewCustomItem] = useState<{
    sectionId: string;
    item: CustomSectionItem;
  } | null>(null);

  const { setResumeData } = useResumeContext();

  setResumeData(data);

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
    setData((prev: ResumeData) => ({
      ...prev,
      [section]: (prev[section as keyof ResumeData] as any).map((item: any) =>
        item.id === id ? { ...item, link } : item
      ),
    }));
  };

  const handleEdit = (
    section: string,
    id: string | null = null,
    sectionId: string | null = null
  ) => {
    setEditingSection(section);
    setEditingId(id);
    setEditingSectionId(sectionId);
  };

  const handleAdd = (section: string, sectionId: string | null = null) => {
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
      case "customItem":
        if (sectionId) {
          const newCustomItem: CustomSectionItem = {
            id: newId,
            title: "",
            content: "",
          };
          setNewCustomItem({
            sectionId,
            item: newCustomItem,
          });
          setEditingSection("customItem");
          setEditingId(newId);
          setEditingSectionId(sectionId);
        }
        return;
      default:
        return;
    }

    setData((prev) => ({
      ...prev,
      [section]: [...(prev[section as keyof ResumeData] as any[]), newItem],
    }));
    setEditingSection(section);
    setEditingId(newId);
  };

  const handleDelete = (
    section: string,
    id: string,
    sectionId: string | null = null
  ) => {
    if (section === "customItem" && sectionId) {
      setData((prev: ResumeData) => {
        const updatedCustomSections = prev.customSections.map(
          (customSection) => {
            if (customSection.id === sectionId) {
              return {
                ...customSection,
                items: customSection.items.filter((item) => item.id !== id),
              };
            }
            return customSection;
          }
        );
        return {
          ...prev,
          customSections: updatedCustomSections,
        };
      });
    } else if (section === "customSection") {
      setData((prev: ResumeData) => ({
        ...prev,
        customSections: prev.customSections.filter(
          (section) => section.id !== id
        ),
        sections: prev.sections.filter((section) => section.id !== id),
      }));
    } else {
      setData((prev: ResumeData) => {
        const updatedSection = { ...prev };
        if (Array.isArray(updatedSection[section as keyof ResumeData])) {
          (updatedSection[section as keyof ResumeData] as any) = (
            updatedSection[section as keyof ResumeData] as any[]
          ).filter((item: any) => item.id !== id);
        }
        return updatedSection;
      });
    }
    setEditingSection(null);
    setEditingId(null);
    setEditingSectionId(null);
  };

  const handleSave = (section: string, newData: any) => {
    setData((prev) => ({
      ...prev,
      [section]: newData,
    }));
  };

  const handleAddSection = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setNewCustomSection({
      id: newId,
      sectionTitle: "New Section",
      items: [],
    });
    setEditingSection("customSection");
    setEditingId(newId);
  };

  const handleCloseEdit = (confirm = false) => {
    if (newCustomSection && confirm && editingSection === "customSection") {
      const newSection: Section = {
        id: newCustomSection.id,
        title: newCustomSection.sectionTitle,
        isVisible: true,
        type: "customSection",
      };

      setData((prev) => ({
        ...prev,
        sections: [...prev.sections, newSection],
        customSections: [...prev.customSections, newCustomSection],
      }));
      setNewCustomSection(null);
    } else if (newCustomItem && confirm && editingSection === "customItem") {
      setData((prev: ResumeData) => {
        const updatedCustomSections = prev.customSections.map((section) => {
          if (section.id === newCustomItem.sectionId) {
            return {
              ...section,
              items: [...section.items, newCustomItem.item],
            };
          }
          return section;
        });
        return {
          ...prev,
          customSections: updatedCustomSections,
        };
      });
      setNewCustomItem(null);
    }

    setEditingSection(null);
    setEditingId(null);
    setEditingSectionId(null);
  };

  const renderSectionTitle = (section: Section) => (
    <div className="flex justify-between items-center mb-4 group relative">
      <DragHandle id={section.id} />
      <div className="flex-1 flex justify-center">
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
                  // Also update the custom section title if this is a custom section
                  customSections:
                    section.type === "customSection"
                      ? prev.customSections.map((cs) =>
                          cs.id === section.id
                            ? { ...cs, sectionTitle: newTitle }
                            : cs
                        )
                      : prev.customSections,
                }));
              }}
              onBlur={() => setEditingTitle(null)}
              className="w-full p-2 border rounded hover-border transition-colors duration-200 text-center font-bold text-lg"
              autoFocus
            />
          </div>
        ) : (
          <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
        )}
      </div>
      <div className="hidden group-hover:flex gap-2">
        {section.type !== "skills" && (
          <button
            onClick={() =>
              section.type === "customSection"
                ? handleAdd("customItem", section.id)
                : handleAdd(section.type)
            }
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        )}
        <button
          onClick={() => handleEditSectionTitle(section.id)}
          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
        >
          <Edit2 className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() =>
            section.type === "customSection"
              ? handleDelete("customSection", section.id)
              : handleSectionVisibility(section.id)
          }
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
            className="w-20 p-2 border rounded hover-border transition-colors duration-200 text-blue-600"
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
            <a href={link.url} className="text-blue-600 hover:underline">
              {link.text}
            </a>
            <button
              onClick={() => handleEditLink(section, id)}
              className="ml-2 p-2 hover:bg-gray-100 rounded opacity-0 group-hover/item:opacity-100"
            >
              <LinkIcon className="w-3 h-3 text-gray-600" />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleEditLink(section, id)}
            className="text-blue-600 hover:underline opacity-0 group-hover/item:opacity-100"
          >
            Add link
          </button>
        )}
      </span>
    );
  };

  const renderSection = (section: Section) => {
    switch (section.type) {
      case "education":
        return (
          <div className="group relative mb-6">
            {data.education.map((edu) => (
              <div
                key={edu.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-[#356CB5]"
              >
                <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
                  <button
                    onClick={() => handleEdit("education", edu.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
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
                        onClick={() => handleCloseEdit(false)}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        onClick={() => handleCloseEdit(true)}
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
                      value={skills.join(", ")}
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
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <Plus className="w-4 h-4" /> Add new skill category
                </button>
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    onClick={() => handleCloseEdit(false)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                  <button
                    onClick={() => handleCloseEdit(true)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </div>
            ) : (
              <ul className="list-disc ml-5 space-y-1">
                {Object.entries(data.skills).map(([category, skills]) => (
                  <li
                    key={category}
                    className="group/item relative hover-border-resume"
                  >
                    <span className="font-bold capitalize">{category}:</span>{" "}
                    {skills.join(", ")}
                    <button
                      onClick={() => handleEdit("skills")}
                      className="ml-2 p-2 hover:bg-gray-100 rounded opacity-0 group-hover/item:opacity-100"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case "experience":
      case "projects":
      case "certificates":
        return (
          <div className="group relative mb-6">
            {Array.isArray(data[section.type as keyof ResumeData]) &&
              (data[section.type as keyof ResumeData] as any[]).map(
                (item: any) => (
                  <div
                    key={item.id}
                    className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-[#356CB5]"
                  >
                    <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
                      <button
                        onClick={() => handleEdit(section.type, item.id)}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(section.type, item.id)}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                    {editingSection === section.type &&
                    editingId === item.id ? (
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
                                  data[
                                    section.type as keyof ResumeData
                                  ] as any[]
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
                                  data[
                                    section.type as keyof ResumeData
                                  ] as any[]
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
                          {item.date && (
                            <input
                              type="date"
                              value={item.date}
                              onChange={(e) => {
                                const newData = (
                                  data[
                                    section.type as keyof ResumeData
                                  ] as any[]
                                ).map((dataItem: any) =>
                                  dataItem.id === item.id
                                    ? { ...dataItem, date: e.target.value }
                                    : dataItem
                                );
                                handleSave(section.type, newData);
                              }}
                              className="w-32 p-2 border rounded hover-border transition-colors duration-200"
                              placeholder="Date"
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
                            onClick={() => handleCloseEdit(false)}
                            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                          <button
                            onClick={() => handleCloseEdit(true)}
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
                            {item.title || item.name}
                            {item.company && ` | ${item.company}`}
                            {(item.link.text || item.link.url) && " | "}
                            {renderLink(item.link, section.type, item.id)}
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
                    )}
                  </div>
                )
              )}
          </div>
        );
      case "customSection":
        const customSection = data.customSections.find(
          (cs) => cs.id === section.id
        );
        if (!customSection) return null;

        return (
          <div className="group relative mb-6">
            {/* Render existing items */}
            {customSection.items.map((item) => (
              <div
                key={item.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-[#356CB5] mb-4"
              >
                <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
                  <button
                    onClick={() =>
                      handleEdit("customItem", item.id, section.id)
                    }
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete("customItem", item.id, section.id)
                    }
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                {editingSection === "customItem" &&
                editingId === item.id &&
                editingSectionId === section.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          customSections: prev.customSections.map((cs) =>
                            cs.id === section.id
                              ? {
                                  ...cs,
                                  items: cs.items.map((i) =>
                                    i.id === item.id
                                      ? { ...i, title: e.target.value }
                                      : i
                                  ),
                                }
                              : cs
                          ),
                        }));
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="Title"
                    />
                    <textarea
                      value={item.content}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          customSections: prev.customSections.map((cs) =>
                            cs.id === section.id
                              ? {
                                  ...cs,
                                  items: cs.items.map((i) =>
                                    i.id === item.id
                                      ? { ...i, content: e.target.value }
                                      : i
                                  ),
                                }
                              : cs
                          ),
                        }));
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      rows={4}
                      placeholder="Content"
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCloseEdit(false)}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        onClick={() => handleCloseEdit(true)}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {item.title && (
                      <div className="font-bold">{item.title}</div>
                    )}
                    {item.content && (
                      <div className="text-sm mt-1">{item.content}</div>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Render new item being added */}
            {newCustomItem &&
              newCustomItem.sectionId === section.id &&
              editingSection === "customItem" &&
              editingId === newCustomItem.item.id && (
                <div className="space-y-2 p-2 border-2 border-primary rounded-md">
                  <input
                    type="text"
                    value={newCustomItem.item.title}
                    onChange={(e) => {
                      setNewCustomItem({
                        ...newCustomItem,
                        item: {
                          ...newCustomItem.item,
                          title: e.target.value,
                        },
                      });
                    }}
                    className="w-full p-2 border rounded hover-border transition-colors duration-200"
                    placeholder="Title"
                  />
                  <textarea
                    value={newCustomItem.item.content}
                    onChange={(e) => {
                      setNewCustomItem({
                        ...newCustomItem,
                        item: {
                          ...newCustomItem.item,
                          content: e.target.value,
                        },
                      });
                    }}
                    className="w-full p-2 border rounded hover-border transition-colors duration-200"
                    rows={4}
                    placeholder="Content"
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button
                      onClick={() => handleCloseEdit(false)}
                      className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                    <button
                      onClick={() => handleCloseEdit(true)}
                      className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                </div>
              )}
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
          border-color: #356cb5;
          box-shadow: 0 0 0 2px rgba(53, 108, 181, 0.2);
        }
        .hover-border:hover {
          border-color: #356cb5;
          border: 2px solid #356cb5;
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
              <Edit2 className="w-5 h-5 text-gray-600" />
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
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-5 h-5" /> Add new link
              </button>
            </div>
          </div>
        ) : (
          <div className="hover-border-resume p-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {data.personalInfo.name}
            </h1>
            <div className="mt-2 space-y-1 grid grid-cols-2 gap-2 justify-between">
              {Object.entries(data.personalInfo.links).map(([key, link]) => (
                <div key={key} className="text-blue-600">
                  {link.text}:{" "}
                  <a href={link.url} className="text-blue-600 hover:underline">
                    {link.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <hr className="border-t border-gray-300 my-6" />

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
                    <hr className="border-t border-gray-300 my-6" />
                  )}
                </SortableItem>
              )
          )}
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-blue-500">
              {data.sections.find((section) => section.id === activeId)?.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* New custom section being added */}
      {newCustomSection && editingSection === "customSection" && (
        <div className="space-y-2 p-4 border-2 border-primary rounded-md my-6">
          <input
            type="text"
            value={newCustomSection.sectionTitle}
            onChange={(e) => {
              setNewCustomSection({
                ...newCustomSection,
                sectionTitle: e.target.value,
              });
            }}
            className="w-full p-2 border rounded hover-border transition-colors duration-200 text-xl font-bold"
            placeholder="Section Title"
          />
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => handleCloseEdit(false)}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
            <button
              onClick={() => handleCloseEdit(true)}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
          </div>
        </div>
      )}

      {/* Add New Section button */}
      <div className="relative mt-8 pt-6 border-t border-gray-300">
        <button
          onClick={handleAddSection}
          className="absolute left-1/2 top-0 text-primary transform -translate-x-1/2 -translate-y-1/2 bg-[#E6ECF8] px-4 py-2 flex items-center gap-2 text-sm hover:text-primary/90 border border-gray-300 rounded-full shadow-sm hover:shadow transition-all duration-200"
        >
          <Plus className="w-5 h-5 text-primary" />
          Add New Section
        </button>
      </div>
    </div>
  );
}

export interface Link {
  text: string;
  url: string;
  icon?: any;
}

export interface Section {
  id: string;
  title: string;
  isVisible: boolean;
  type: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  personalInfo: {
    name: string;
    title?: string;
    links: {
      [key: string]: Link;
    };
  };
  sections: Section[];
  education: any[];
  skills: {
    [key: string]: string[];
  };
  experience: any[];
  achievements?: any[];
  projects: any[];
  certificates: any[];
  custom: any[];
  customSections: CustomSection[];
}

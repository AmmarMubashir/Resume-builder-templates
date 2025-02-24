export interface Link {
  text: string;
  url: string;
}

export interface Section {
  id: string;
  title: string;
  isVisible: boolean;
  type: string;
}

export interface ResumeData {
  personalInfo: {
    name: string;
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
  projects: any[];
  certificates: any[];
  custom: any[];
}

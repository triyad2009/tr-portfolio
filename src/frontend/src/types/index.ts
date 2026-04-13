// App state machine
export type AppState = "loading" | "sound-prompt" | "enter" | "intro" | "main";

// Project type for portfolio items
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  github?: string;
  demo?: string;
  tags: string[];
  featured?: boolean;
}

// Skill type for skills section
export interface Skill {
  name: string;
  icon: string;
  color: string;
  level?: number; // 0–100
}

// Social link type
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

// Nav link type
export interface NavLink {
  label: string;
  href: string;
  id: string;
}

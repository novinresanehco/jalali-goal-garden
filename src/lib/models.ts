
// Firestore data models for our application

export interface Goal {
  id?: string;
  title: string;
  description: string;
  status: 'Active' | 'Achieved' | 'On Hold';
  targetDateJalali: string; // YYYY-MM-DD format
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Idea {
  id?: string;
  title: string;
  description: string;
  status: 'Captured' | 'Exploring' | 'Discarded' | 'Actionable';
  tags: string[];
  createdAt: Date;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  type: 'Personal' | 'Client';
  clientName?: string;
  status: 'Planning' | 'Active' | 'Completed' | 'Archived';
  deadlineJalali: string; // YYYY-MM-DD format
  goalId?: string; // Reference to goal
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubTask {
  title: string;
  done: boolean;
}

export interface Task {
  id?: string;
  title: string;
  description?: string;
  status: 'ToDo' | 'Done';
  dueDateJalali: string; // YYYY-MM-DD format
  dueTimeJalali?: string; // HH:MM format - new field for specific time
  priority: 'High' | 'Medium' | 'Low' | 'None';
  projectId?: string; // Reference to project
  projectTitle?: string; // Project title for display purposes
  isRecurring: boolean;
  recurringRule?: string; // e.g., "daily", "weekly", "monthly", "yearly"
  reminderSettings?: {
    enabled: boolean;
    remindAtJalali: string; // YYYY-MM-DD HH:MM format
  };
  completionDateJalali?: string;
  tags: string[];
  subTasks: SubTask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  name: string;
  color?: string; // Hex code
}

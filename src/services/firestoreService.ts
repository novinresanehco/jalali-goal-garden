import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  setDoc,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Goal, Idea, Project, Task, Tag } from '@/lib/models';

// Generic types for our collections
export type CollectionType = 'goals' | 'ideas' | 'projects' | 'tasks' | 'tags';

// Goals functions
export const addGoal = async (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await addDoc(collection(db, 'goals'), {
    ...goal,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateGoal = async (id: string, goal: Partial<Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>>) => {
  const docRef = doc(db, 'goals', id);
  return await updateDoc(docRef, {
    ...goal,
    updatedAt: serverTimestamp()
  });
};

export const deleteGoal = async (id: string) => {
  const docRef = doc(db, 'goals', id);
  return await deleteDoc(docRef);
};

export const getGoal = async (id: string) => {
  const docRef = doc(db, 'goals', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Goal;
  }
  return null;
};

export const getGoals = async () => {
  const q = query(collection(db, 'goals'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
};

export const getGoalsByStatus = async (status: Goal['status']) => {
  const q = query(
    collection(db, 'goals'),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
};

// Ideas functions
export const addIdea = async (idea: Omit<Idea, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, 'ideas'), {
    ...idea,
    createdAt: serverTimestamp()
  });
};

export const updateIdea = async (id: string, idea: Partial<Omit<Idea, 'id' | 'createdAt'>>) => {
  const docRef = doc(db, 'ideas', id);
  return await updateDoc(docRef, idea);
};

export const deleteIdea = async (id: string) => {
  const docRef = doc(db, 'ideas', id);
  return await deleteDoc(docRef);
};

export const getIdea = async (id: string) => {
  const docRef = doc(db, 'ideas', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Idea;
  }
  return null;
};

export const getIdeas = async () => {
  const q = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Idea));
};

export const getIdeasByStatus = async (status: Idea['status']) => {
  const q = query(
    collection(db, 'ideas'),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Idea));
};

// Projects functions
export const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await addDoc(collection(db, 'projects'), {
    ...project,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateProject = async (id: string, project: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => {
  const docRef = doc(db, 'projects', id);
  return await updateDoc(docRef, {
    ...project,
    updatedAt: serverTimestamp()
  });
};

export const deleteProject = async (id: string) => {
  const docRef = doc(db, 'projects', id);
  return await deleteDoc(docRef);
};

export const getProject = async (id: string) => {
  const docRef = doc(db, 'projects', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Project;
  }
  return null;
};

export const getProjects = async () => {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

export const getProjectsByGoal = async (goalId: string) => {
  const q = query(
    collection(db, 'projects'),
    where('goalId', '==', goalId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

export const getProjectsByStatus = async (status: Project['status']) => {
  const q = query(
    collection(db, 'projects'),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

// Tasks functions
export const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await addDoc(collection(db, 'tasks'), {
    ...task,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateTask = async (id: string, task: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
  const docRef = doc(db, 'tasks', id);
  return await updateDoc(docRef, {
    ...task,
    updatedAt: serverTimestamp()
  });
};

export const completeTask = async (id: string, completionDateJalali: string) => {
  const docRef = doc(db, 'tasks', id);
  const taskSnap = await getDoc(docRef);
  
  if (taskSnap.exists()) {
    const taskData = taskSnap.data() as Task;
    
    // If task is recurring, create next occurrence
    if (taskData.isRecurring && taskData.recurringRule) {
      // Create the next occurrence based on the recurring rule
      const nextOccurrence = calculateNextOccurrence(taskData.dueDateJalali, taskData.recurringRule);
      
      // Create a new task with the next occurrence date
      const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        ...taskData,
        status: 'ToDo',
        dueDateJalali: nextOccurrence,
        completionDateJalali: undefined
      };
      
      await addTask(newTask);
    }
    
    // Mark the current task as done
    return await updateDoc(docRef, {
      status: 'Done',
      completionDateJalali,
      updatedAt: serverTimestamp()
    });
  }
};

export const calculateNextOccurrence = (currentDateJalali: string, recurringRule: string): string => {
  // Split the date into parts
  const [year, month, day] = currentDateJalali.split('/').map(Number);
  
  // Create a Date object
  const date = new Date(year, month - 1, day);
  
  // Apply recurring rule logic
  switch (recurringRule) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      // For custom rules, a more complex calculation would be needed
      date.setDate(date.getDate() + 1); // Default to daily
  }
  
  // Format the date back to Jalali
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
};

export const deleteTask = async (id: string) => {
  const docRef = doc(db, 'tasks', id);
  return await deleteDoc(docRef);
};

export const getTask = async (id: string) => {
  const docRef = doc(db, 'tasks', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Task;
  }
  return null;
};

export const getTasks = async () => {
  const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

export const getTasksByProject = async (projectId: string) => {
  const q = query(
    collection(db, 'tasks'),
    where('projectId', '==', projectId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

export const getTasksByDueDate = async (dueDateJalali: string) => {
  const q = query(
    collection(db, 'tasks'),
    where('dueDateJalali', '==', dueDateJalali),
    orderBy('priority'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

export const getTodayTasks = async (todayJalali: string) => {
  const q = query(
    collection(db, 'tasks'),
    where('dueDateJalali', '==', todayJalali),
    where('status', '==', 'ToDo'),
    orderBy('priority')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

export const getOverdueTasks = async (todayJalali: string) => {
  const q = query(
    collection(db, 'tasks'),
    where('dueDateJalali', '<', todayJalali),
    where('status', '==', 'ToDo'),
    orderBy('dueDateJalali', 'desc'),
    orderBy('priority')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

export const getActiveTasks = async (collectionName: string, status: string) => {
  const q = query(
    collection(db, collectionName),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Tags functions
export const addTag = async (tag: Tag) => {
  const docRef = doc(db, 'tags', tag.name.toLowerCase());
  await setDoc(docRef, tag);
  return docRef;
};

export const updateTag = async (name: string, tag: Partial<Tag>) => {
  const docRef = doc(db, 'tags', name.toLowerCase());
  return await updateDoc(docRef, tag);
};

export const deleteTag = async (name: string) => {
  const docRef = doc(db, 'tags', name.toLowerCase());
  return await deleteDoc(docRef);
};

export const getTag = async (name: string) => {
  const docRef = doc(db, 'tags', name.toLowerCase());
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as Tag;
  }
  return null;
};

export const getTags = async () => {
  const querySnapshot = await getDocs(collection(db, 'tags'));
  return querySnapshot.docs.map(doc => doc.data() as Tag);
};

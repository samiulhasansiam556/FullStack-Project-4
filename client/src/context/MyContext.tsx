// MyContext.tsx
import { createContext } from "react";
import { University,Material,StudentProfile,User} from "@/app/types/type";

interface KnownTypes {
  user: User | null; 
  setUser: (user: User | null) => void; 
  universities: University[];
  setUniversities: (u: University[]) => void;
  materials?: Material[];
  setMaterials?: (m: Material[]) => void;
  studentProfile?: StudentProfile | null;
  setStudentProfile?: (p: StudentProfile | null) => void;
}

interface FlexibleContextType extends KnownTypes {
  [key: string]: any;
}

// Create context with defaults that match MyState
const MyContext = createContext<FlexibleContextType>({
  universities: [],
  setUniversities: () => {},
  materials: [], 
  setMaterials: () => {}, 
  studentProfile: null,
  setStudentProfile: () => {}, 
  user: null, 
  setUser: () => {}, 
  search: 0,
  setSearch: () => {},
});

export default MyContext;
export type { FlexibleContextType };

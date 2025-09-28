// MyContext.tsx
import { createContext } from "react";
import { University,Material,StudentProfile,User} from "@/app/types/type";

interface KnownTypes {
user: User | null; // Added user
  setUser: (user: User | null) => void; // Added setUser
  theme?: "light" | "dark";
  universities: University[];
  setUniversities: (u: University[]) => void;
  materials?: Material[];
  setMaterials?: (m: Material[]) => void;
  studentProfile?: StudentProfile | null;
  setStudentProfile?: (p: StudentProfile | null) => void;
  search: number;
  setSearch: (s: number) => void;
}

interface FlexibleContextType extends KnownTypes {
  [key: string]: any;
}

// ✅ Create context with defaults that match MyState
const MyContext = createContext<FlexibleContextType>({
  universities: [],
  setUniversities: () => {},
  materials: [], // Added default
  setMaterials: () => {}, // Added default
  studentProfile: null, // Added default
  setStudentProfile: () => {}, // Added default
  user: null, // Added default
  setUser: () => {}, // Added default
  search: 0,
  setSearch: () => {},
});

export default MyContext;
export type { FlexibleContextType };

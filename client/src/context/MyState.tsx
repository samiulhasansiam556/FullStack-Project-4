// MyState.tsx
"use client";

import { useState, ReactNode,useEffect } from "react";
import MyContext from "./MyContext";
import api from "@/services/axios";
import { University,Material,StudentProfile,User,UserProfileResponse } from "@/app/types/type";

interface MyStateProps {
  children: ReactNode;
}

function MyState({ children }: MyStateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [search, setSearch] = useState<number>(0);



  // Fetch my Profile once when app starts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<UserProfileResponse>("/user/get-profile"); // your getUniversityHierarchy endpoint
        if (res.status===200) {
          setUser(res.data?.user);
          console.log(res.data?.user)
        } else {
          console.error(res.data?.message || "Failed to fetch universities");
        }
      } catch (err) {
        console.error("Error fetching universities:", err);
      }
    };
    
    fetchUser();
  }, []);
  
  // console.log(user)

  
// Fetch universities once when app starts
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get<{universities:any,message:string}>("/user/get-universityhierarchy"); // your getUniversityHierarchy endpoint
       
        if (res.status===200) {
          setUniversities(res.data?.universities);
        } else {
          console.error(res.data?.message || "Failed to fetch universities");
        }
      } catch (err) {
        console.error("Error fetching universities:", err);
      }
    };

    fetchUniversities();
  }, []);
 
 // console.log(universities)






  return (
    <MyContext.Provider
      value={{
        universities,
        setUniversities,
        materials,
        setMaterials,
        studentProfile,
        setStudentProfile,
        user,
        setUser,
        search,
        setSearch,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export default MyState;




import { Request, Response } from "express";
import prisma from "../lib/PrismaClient";




// Create University
export const createUniversity = async (req: Request, res: Response) => {
  try {
    const { name} = req.body;

    if(!name) return res.status(404).json({ message: "name is required" });

    const uniCheck = await prisma.university.findFirst({ where: { name } })

         if(uniCheck) return res.status(404).json({ message: "Already exixt this University" });

    const uni = await prisma.university.create({
      data: { name},
    });
    if(!uni) return res.status(404).json("University is not found")

    res.status(201).json({ message: "University created", university: uni });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
};

// Get all Universities
export const getUniversities = async (_req: Request, res: Response) => {
  try {
    const unis = await prisma.university.findMany();
    res.json(unis);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update University
export const updateUniversity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name} = req.body;

    const uni = await prisma.university.update({
      where: { id :Number(id)},
      data: { name},
    });

    res.json({ message: "University updated", university: uni });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
};

// Delete University
export const deleteUniversity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const uniId = Number(id);

    if (isNaN(uniId)) {
      return res.status(400).json({ message: "Invalid university ID" });
    }

    const university = await prisma.university.findUnique({ where: { id: uniId } });
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    await prisma.university.delete({ where: { id: uniId } });

    res.json({ message: "University deleted successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};







// Create Department
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, universityId } = req.body;
    if(!name || !universityId) return res.status(400).json({message: "name and university id must be required"})
  
    // Validate universityId is a valid university
    const university = await prisma.university.findUnique({ where: { id: Number(universityId) } });
    if (!university) {
      return res.status(404).json({ message: "Invalid university ID" });
    }
      const dept = await prisma.department.create({
      data: { name, universityId },
    });

    res.json({ message: "Department created", department: dept });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
};

// Get all Departments for a University
export const getDepartmentsByUniversity = async (req: Request, res: Response) => {
  try {
    const { universityId } = req.params;

    const depts = await prisma.department.findMany({ where: { universityId : Number(universityId)} });
    res.json(depts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};





// Create Course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { name, code, departmentId } = req.body;

    if(!name || !code || !departmentId) {
        return res.status(404).json({message: "name,code and departmentId must be required"})
    }
      const department= await prisma.department.findUnique({ where: { id: Number(departmentId) } });
    if (!department) {
      return res.status(404).json({ message: "Invalid department ID" });
    }

     const courseCheck = await prisma.course.findFirst({ where: { code } });
     
   if (courseCheck) {
      return res.status(404).json({ message: "this course is already exix" });
    }
     
     const course = await prisma.course.create({
      data: { name, code, departmentId },
    });

    res.json({ message: "Course created", course });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
};

// Get Courses by Department
export const getCoursesByDepartment = async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.params;

    const courses = await prisma.course.findMany({ where: { departmentId : Number(departmentId) } });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};







// Get all users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true}
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single user
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id : Number(id)},
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // "admin" | "user"

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
    });

    res.json({ message: "User role updated", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};








// Get all materials
export const getAllMaterials = async (_req: Request, res: Response) => {
  try {
    const materials = await prisma.material.findMany({
      include: {
        uploader: {
          select: { id: true, name: true, email: true, username: true },
        },
        course: {
          select: {
            id: true,
            name: true,
            department: {
              select: {
                id: true,
                name: true,
                university: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//getMaterialsByUniversityId
export const getMaterialsByUniversityId = async (req: Request, res: Response) => {
  try {
    const { universityId } = req.params;

    const materials = await prisma.material.findMany({
      where: {
        course: {
          department: {
            universityId: Number(universityId), // indirect relation chain
          },
        },
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(materials);
  } catch (error) {
    console.error("Error fetching materials by universityId:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// Delete material
export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const material = await prisma.material.findUnique({ where: { id: Number(id)} });
    if (!material) return res.status(404).json({ message: "Material not found" });

    await prisma.material.delete({ where: { id: Number(id) } });
    res.json({ message: "Material deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

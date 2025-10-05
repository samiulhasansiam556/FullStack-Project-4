


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
// export const deleteUniversity = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const uniId = Number(id);

//     if (isNaN(uniId)) {
//       return res.status(400).json({ message: "Invalid university ID" });
//     }

//     const university = await prisma.university.findUnique({ where: { id: uniId } });
//     if (!university) {
//       return res.status(404).json({ message: "University not found" });
//     }

//     await prisma.university.delete({ where: { id: uniId } });

//     res.json({ message: "University deleted successfully" });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Server error", error: (error as Error).message });
//   }
// };







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


// Get all Departments
export const getDepartments = async (_req: Request, res: Response) => {
  try {
    const dept = await prisma.department.findMany();
    res.json(dept);
  } catch (error) {
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


// Get all Course
export const getCourses = async (_req: Request, res: Response) => {
  try {
    const course = await prisma.course.findMany();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};






// Get all users
// export const getAllUsers = async (_req: Request, res: Response) => {
//   try {
//     const users = await prisma.user.findMany({
//       select: { id: true, name: true, email: true, role: true}
//     });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

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
// export const deleteUser = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     await prisma.user.delete({ where: { id: Number(id) } });
//     res.json({ message: "User deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };








// Get all materials
// export const getAllMaterials = async (_req: Request, res: Response) => {
//   try {
//     const materials = await prisma.material.findMany({
//       include: {
//         uploader: {
//           select: { id: true, name: true, email: true, username: true },
//         },
//         course: {
//           select: {
//             id: true,
//             name: true,
//             department: {
//               select: {
//                 id: true,
//                 name: true,
//                 university: {
//                   select: {
//                     id: true,
//                     name: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     res.json(materials);
//   } catch (error) {
//     console.error("Error fetching materials:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


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
// export const deleteMaterial = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const material = await prisma.material.findUnique({ where: { id: Number(id)} });
//     if (!material) return res.status(404).json({ message: "Material not found" });

//     await prisma.material.delete({ where: { id: Number(id) } });
//     res.json({ message: "Material deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };










// Helper: last N days array
function lastNDays(n: number) {
  const arr: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10)); // 'YYYY-MM-DD'
  }
  return arr;
}

/**
 * GET /admin/users/analytics
 * returns multiple stats for admin dashboard
 */
export const getUserAnalytics = async (req: Request, res: Response) => {
  console.log(88)
  try {
    // totals
    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });
    const totalStudents = totalUsers - totalAdmins;

    const totalMaterials = await prisma.material.count();

    // role distribution (pie)
    const roleCountsRaw = await prisma.$queryRaw<
      { role: string; count: bigint }[]
    >`SELECT "role", COUNT(*) FROM "User" GROUP BY "role"`;
    const roleCounts = roleCountsRaw.map((r) => ({
      role: r.role,
      count: Number(r.count),
    }));

    // top contributors (materials uploaded per user) - top 10
    const topContributors = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        _count: {
          select: { materials: true },
        },
      },
      orderBy: {
        materials: { _count: "desc" } as any,
      },
      take: 10,
    });
    // normalize
    const topContribNormalized = topContributors.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      materialsCount: u._count.materials,
    }));

    // uploads over time (last 30 days) — group by day using raw SQL (Postgres)
    // returns array of { date, count }
    const days = lastNDays(30);
    const uploadsRaw: { day: string; count: string }[] = await prisma.$queryRaw`
      SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day,
             COUNT(*)::text as count
      FROM "Material"
      WHERE "createdAt" >= now() - interval '30 days'
      GROUP BY day
      ORDER BY day;
    `;
    // map to object with all days (fill missing with 0)
    const uploadsMap: Record<string, number> = {};
    uploadsRaw.forEach((r) => (uploadsMap[r.day] = Number(r.count)));
    const uploadsOverTime = days.map((d) => ({ date: d, count: uploadsMap[d] ?? 0 }));

    // top voters (users who voted most)
    const topVotersRaw = await prisma.$queryRaw<
      { userId: number; name: string; username: string; votes: string }[]
    >`SELECT u.id as "userId", u.name, u.username, COUNT(v.*)::text as votes
       FROM "Vote" v
       JOIN "User" u ON u.id = v."userId"
       GROUP BY u.id, u.name, u.username
       ORDER BY COUNT(v.*) DESC
       LIMIT 10;`;
    const topVoters = topVotersRaw.map((r) => ({
      userId: r.userId,
      name: r.name,
      username: r.username,
      votes: Number(r.votes),
    }));

    // top commenters
    const topCommentersRaw = await prisma.$queryRaw<
      { userId: number; name: string; username: string; comments: string }[]
    >`SELECT u.id as "userId", u.name, u.username, COUNT(c.*)::text as comments
       FROM "Comment" c
       JOIN "User" u ON u.id = c."userId"
       GROUP BY u.id, u.name, u.username
       ORDER BY COUNT(c.*) DESC
       LIMIT 10;`;
    const topCommenters = topCommentersRaw.map((r) => ({
      userId: r.userId,
      name: r.name,
      username: r.username,
      comments: Number(r.comments),
    }));

    // materials per university (for extra insight)
    const materialsByUniversityRaw = await prisma.$queryRaw<
      { universityId: number; universityName: string; count: string }[]
    >`SELECT uni.id as "universityId", uni.name as "universityName", COUNT(m.*)::text as count
      FROM "Material" m
      JOIN "Course" c ON c.id = m."courseId"
      JOIN "Department" d ON d.id = c."departmentId"
      JOIN "University" uni ON uni.id = d."universityId"
      GROUP BY uni.id, uni.name
      ORDER BY COUNT(m.*) DESC;`;
    const materialsByUniversity = materialsByUniversityRaw.map((r) => ({
      universityId: r.universityId,
      universityName: r.universityName,
      count: Number(r.count),
    }));

    return res.json({
      totals: {
        totalUsers,
        totalAdmins,
        totalStudents,
        totalMaterials,
      },
      roleCounts,
      topContributors: topContribNormalized,
      uploadsOverTime,
      topVoters,
      topCommenters,
      materialsByUniversity,
    });
  } catch (err) {
    console.error("getUserAnalytics error:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};




export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// DELETE /api/admin/users/:id
// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // optional: prevent deleting self if admin
    if (req.user?.id === Number(id)) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    
    // check if user exists
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const isadmin = await prisma.user.findUnique({where:{id: Number(id)} })
  
    if(isadmin?.role==="ADMIN") return res.status(400).json({ message: "You cannot delete Admin" });

    await prisma.user.delete({ where: { id: Number(id) } });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};





// Get all materials
export const getAllMaterials = async (req: Request, res: Response) => {
  try {
    const materials = await prisma.material.findMany({
      include: {
        course: {
          include: {
            department: {
              include: { university: true }
            }
          }
        },
        uploader: true
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch materials" });
  }
};

// Delete material by ID
export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const material = await prisma.material.findUnique({ where: { id: Number(id) } });
    if (!material) return res.status(404).json({ message: "Material not found" });

    await prisma.material.delete({ where: { id: Number(id) } });
    res.json({ message: "Material deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete material" });
  }
};


// Delete University
export const deleteUniversity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const uni = await prisma.university.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "University deleted successfully", university: uni });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error?.meta?.cause || "Server error" });
  }
};

// Delete Department
export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dept = await prisma.department.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Department deleted successfully", department: dept });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error?.meta?.cause || "Server error" });
  }
};

// Delete Course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Course deleted successfully", course });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error?.meta?.cause || "Server error" });
  }
};

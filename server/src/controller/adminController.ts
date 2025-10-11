// src/controller/adminController.ts
import { Request, Response } from "express";
import prisma from "../lib/PrismaClient";

// Helper function
function lastNDays(n: number) {
  const arr: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

// ==================== UNIVERSITY CONTROLLERS ====================
export const createUniversity = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const uniCheck = await prisma.university.findFirst({ where: { name } });
    if (uniCheck) return res.status(400).json({ message: "University already exists" });

    const uni = await prisma.university.create({ data: { name } });
    res.status(201).json({ message: "University created", university: uni });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUniversities = async (_req: Request, res: Response) => {
  try {
    const unis = await prisma.university.findMany();
    res.json(unis);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUniversity = async (req: Request, res: Response) => {
  try {
    const uni = await prisma.university.update({
      where: { id: Number(req.params.id) },
      data: { name: req.body.name },
    });
    res.json({ message: "University updated", university: uni });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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

export const getUniversityHierarchy = async (_req: Request, res: Response) => {
  try {
    const universities = await prisma.university.findMany({
      include: {
        departments: {
          include: {
            courses: true,
          },
        },
      },
    });
    res.json({ universities });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== DEPARTMENT CONTROLLERS ====================
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, universityId } = req.body;
    if (!name || !universityId) {
      return res.status(400).json({ message: "Name and university ID are required" });
    }

    const university = await prisma.university.findUnique({
      where: { id: Number(universityId) },
    });
    if (!university) {
      return res.status(404).json({ message: "Invalid university ID" });
    }

    const dept = await prisma.department.create({
      data: { name, universityId: Number(universityId) },
    });
    res.json({ message: "Department created", department: dept });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDepartments = async (_req: Request, res: Response) => {
  try {
    const dept = await prisma.department.findMany();
    res.json(dept);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getDepartmentsByUniversity = async (req: Request, res: Response) => {
  try {
    const { universityId } = req.params;
    const depts = await prisma.department.findMany({
      where: { universityId: Number(universityId) },
    });
    res.json(depts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const dept = await prisma.department.update({
      where: { id: Number(req.params.id) },
      data: { name: req.body.name },
    });
    res.json({ message: "Department updated", department: dept });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

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

// ==================== COURSE CONTROLLERS ====================
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { name, code, departmentId } = req.body;
    if (!name || !code || !departmentId) {
      return res.status(400).json({ message: "Name, code and department ID are required" });
    }

    const department = await prisma.department.findUnique({
      where: { id: Number(departmentId) },
    });
    if (!department) {
      return res.status(404).json({ message: "Invalid department ID" });
    }

    const courseCheck = await prisma.course.findFirst({ where: { code } });
    if (courseCheck) {
      return res.status(400).json({ message: "Course code already exists" });
    }

    const course = await prisma.course.create({
      data: { name, code, departmentId: Number(departmentId) },
    });
    res.json({ message: "Course created", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCourses = async (_req: Request, res: Response) => {
  try {
    const course = await prisma.course.findMany();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCoursesByDepartment = async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.params;
    const courses = await prisma.course.findMany({
      where: { departmentId: Number(departmentId) },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await prisma.course.update({
      where: { id: Number(req.params.id) },
      data: {
        name: req.body.name,
        code: req.body.code,
      },
    });
    res.json({ message: "Course updated", course });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

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

// ==================== USER CONTROLLERS ====================
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
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        profileImage: true,
        role: true,
        materials: {
          include: {
            course: {
              include: {
                department: {
                  include: {
                    university: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log("user",user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
    });
    res.json({ message: "User role updated", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user?.id === Number(id)) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "ADMIN") {
      return res.status(400).json({ message: "You cannot delete Admin" });
    }

    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserAnalytics = async (req: Request, res: Response) => {
  try {
    // Totals
    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });
    const totalStudents = totalUsers - totalAdmins;
    const totalMaterials = await prisma.material.count();

    // Role distribution
    const roleCountsRaw = await prisma.$queryRaw<
      { role: string; count: bigint }[]
    >`SELECT "role", COUNT(*) FROM "User" GROUP BY "role"`;
    const roleCounts = roleCountsRaw.map((r) => ({
      role: r.role,
      count: Number(r.count),
    }));

    // Top contributors
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
    const topContribNormalized = topContributors.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      materialsCount: u._count.materials,
    }));

    // Uploads over time (last 30 days)
    const days = lastNDays(30);
    const uploadsRaw: { day: string; count: string }[] = await prisma.$queryRaw`
      SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day,
             COUNT(*)::text as count
      FROM "Material"
      WHERE "createdAt" >= now() - interval '30 days'
      GROUP BY day
      ORDER BY day;
    `;
    const uploadsMap: Record<string, number> = {};
    uploadsRaw.forEach((r) => (uploadsMap[r.day] = Number(r.count)));
    const uploadsOverTime = days.map((d) => ({ date: d, count: uploadsMap[d] ?? 0 }));

    // Top voters
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

    // Top commenters
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

    // Users per university
    const usersByUniversityRaw = await prisma.$queryRaw<
      { universityId: number; universityName: string; count: string }[]
    >`SELECT uni.id as "universityId", uni.name as "universityName", COUNT(DISTINCT u.id)::text as count
      FROM "User" u
      JOIN "Material" m ON m."uploaderId" = u.id
      JOIN "Course" c ON c.id = m."courseId"
      JOIN "Department" d ON d.id = c."departmentId"
      JOIN "University" uni ON uni.id = d."universityId"
      GROUP BY uni.id, uni.name
      ORDER BY COUNT(DISTINCT u.id) DESC;`;
    const usersByUniversity = usersByUniversityRaw.map((r) => ({
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
      usersByUniversity,
    });
  } catch (error) {
    console.error("getUserAnalytics error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==================== MATERIAL CONTROLLERS ====================
export const getAllMaterials = async (req: Request, res: Response) => {
  try {
    const materials = await prisma.material.findMany({
      include: {
        course: {
          include: {
            department: {
              include: { university: true },
            },
          },
        },
        uploader: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch materials" });
  }
};

export const getMaterialsByUniversityId = async (req: Request, res: Response) => {
  try {
    const { universityId } = req.params;
    const materials = await prisma.material.findMany({
      where: {
        course: {
          department: {
            universityId: Number(universityId),
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

export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const material = await prisma.material.findUnique({
      where: { id: Number(id) },
    });
    if (!material) return res.status(404).json({ message: "Material not found" });

    await prisma.material.delete({ where: { id: Number(id) } });
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete material" });
  }
};
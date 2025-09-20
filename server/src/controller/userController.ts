

import { Request, Response } from 'express';
import prisma from '../lib/PrismaClient';
import bcrypt from "bcryptjs";
import cloudinary from '../config/cloudinaryConfig';
import fs from "fs";


// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface User {
      id: number;
      role: string;
      // add other user properties if needed
    }
    interface Request {
      user: User;
    }
  }
}






// 👤 Get own profile
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        profileImage: true,
        phone: true,
        bio: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ Update profile
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { name, username, phone, bio, profileImage } = req.body;
 
         const userName = await prisma.user.findUnique({ where: { username } });
         if(userName) return res.status(400).json({message: "USERNAME ALREADY EXIST"})

        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data: { name, username, phone, bio, profileImage },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
                profileImage: true,
                phone: true,
                bio: true,
                createdAt: true,
            },
        });

        res.json({ message: "Profile updated", user: updated });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 🔑 Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
console.log(oldPassword,newPassword)
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: "Old password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
};





// upload materials

export const uploadMaterial = async (req: Request, res: Response) => {
  try {
    const { title, description, courseId } = req.body;

    if (!req.file) return res.status(400).json({ message: "File required" });


     //find course with department and university
     const course = await prisma.course.findUnique({
      where: {
        id: Number(courseId)
      },
      include: {
        department: {
          include: {
            university: true,
          }
        }
      }
     })

     if(!course) return res.status(404).json({message: "course not found"})

// create folder path
    const folderPath = `materials/${course.department.university.name}/${course.department.name}/${course.name}`;

    // upload to Cloudinary in dynamic folder
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderPath,
      resource_type: "auto",
    });

    // remove local temp file
    fs.unlinkSync(req.file.path);

    const material = await prisma.material.create({
      data: {
        title,
        description,
        fileUrl: result.secure_url,
        fileType: req.file.mimetype,
        uploaderId: req.user.id,
        courseId: Number(courseId),
      },
    });

    res.status(201).json(material);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Upload failed", error: err });
  }
}


export const getUniversity = async (req: Request, res: Response) => {
    try {
        const universities = await prisma.university.findMany();

        if (!universities || universities.length === 0) {
            return res.status(400).json({ message: "There is no University" });
        }

        return res.status(200).json({ message: "Universities exist", universities });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
}


export const getMaterialsByUniversity = async (req: Request, res: Response) => {
  try {
    const { universityId } = req.params;
    
    // Validate universityId
    const uniId = Number(universityId);
    if (isNaN(uniId)) {
      return res.status(400).json({ message: "Invalid university ID" });
    }

    const materials = await prisma.material.findMany({
      where: {
        course: {
          department: {
            universityId: uniId // ← Use the converted number
          }
        }
      },
      include: {
        course: {
          include: {
            department: {
              include: { university: true }
            }
          }
        }
      }
    });

    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// Get all materials uploaded by the logged-in user
export const getMaterialsByUniversityForOne = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // comes from auth middleware

    const materials = await prisma.material.findMany({
      where: {
        uploaderId: userId,
      },
      include: {
        course: {
          include: {
            department: {
              include: { university: true }
            }
          }
        }
      }
    });

    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your materials", error });
  }
};




// Get a student's public profile with uploaded materials
export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const student = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        profileImage: true,
        materials: {
          include: {
            course: {
              include: {
                department: {
                  include: { university: true }
                }
              }
            }
          }
        }
      }
    });

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student profile", error });
  }
};



// delete metarials
export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const material = await prisma.material.findUnique({ where: { id: Number(id) } });
    if (!material) return res.status(404).json({ message: "Material not found" });

    if (material.uploaderId !== userId && userRole !== "ADMIN || STUDENT") {
      return res.status(403).json({ message: "Not authorized to delete this material" });
    }

    await prisma.material.delete({ where: { id: Number(id) } });

    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting material", error });
  }
};



;

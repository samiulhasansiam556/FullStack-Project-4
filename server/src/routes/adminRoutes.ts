// src/routes/adminRoutes.ts
import { Router } from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware";
import { createUniversity, getUniversities, updateUniversity, deleteUniversity, getAllUsers, getUserById, updateUserRole, deleteUser } from "../controller/adminController";
import { createDepartment, getDepartmentsByUniversity } from "../controller/adminController";
import { createCourse, getCoursesByDepartment } from "../controller/adminController";
import { getAllMaterials,getMaterialsByUniversityId, deleteMaterial } from "../controller/adminController";

const router = Router();

// University
router.post("/create-university", protect, adminOnly, createUniversity);
router.get("/get-universities", protect, adminOnly, getUniversities);
router.put("/university/:id", protect, adminOnly, updateUniversity);
router.delete("/university/:id", protect, adminOnly, deleteUniversity);

// Department
router.post("/create-department", protect, adminOnly, createDepartment);
router.get("/departments/:universityId", protect, adminOnly, getDepartmentsByUniversity);

// Course
router.post("/create-course", protect, adminOnly, createCourse);
router.get("/courses/:departmentId", protect, adminOnly, getCoursesByDepartment);



// Users
router.get("/get-all-users", protect, adminOnly, getAllUsers);
router.get("/get-one-user/:id", protect, adminOnly, getUserById);
router.put("/update-user-role/:id", protect, adminOnly, updateUserRole);
router.delete("/delete-user/:id", protect, adminOnly, deleteUser);


//Materials
router.get("/get-all-materials",protect,adminOnly,getAllMaterials)
router.get("/get-all-materials-by-uniId/:universityId",protect,adminOnly,getMaterialsByUniversityId)
router.delete("/delete-materials/:id",protect,adminOnly,deleteMaterial)


export default router;

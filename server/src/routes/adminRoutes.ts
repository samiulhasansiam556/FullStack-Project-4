
import { Router } from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware";
import { createUniversity, getUniversities, deleteUniversity, getAllUsers, getUserByUsername, updateUserRole, deleteUser, getUserAnalytics, getDepartments, deleteDepartment, deleteCourse, getCourses } from "../controller/adminController";
import { createDepartment, getDepartmentsByUniversity } from "../controller/adminController";
import { createCourse, getCoursesByDepartment } from "../controller/adminController";
import { getAllMaterials,getMaterialsByUniversityId, deleteMaterial,getUniversityHierarchy,
        updateUniversity,updateDepartment,updateCourse} from "../controller/adminController";

const router = Router();

// University
router.post("/create-university", protect, adminOnly, createUniversity);
router.get("/get-universities", protect, adminOnly, getUniversities);
router.put("/update-university/:id", protect, adminOnly, updateUniversity);
router.delete("/delete-university/:id", protect, adminOnly, deleteUniversity);
router.get("/get-universityhierarchy", protect, adminOnly, getUniversityHierarchy);

// Department
router.post("/create-department", protect, adminOnly, createDepartment);
router.get("/get-departments", protect, adminOnly, getDepartments);
router.put("/update-department/:id", protect, adminOnly, updateDepartment);
router.delete("/delete-department/:id", protect, adminOnly, deleteDepartment);
router.get("/departments/:universityId", protect, adminOnly, getDepartmentsByUniversity); //not use


// Course
router.post("/create-course", protect, adminOnly, createCourse);
router.get("/get-courses", protect, adminOnly, getCourses);
router.put("/update-course/:id", protect, adminOnly, updateCourse);
router.delete("/delete-course/:id", protect, adminOnly, deleteCourse);
router.get("/courses/:departmentId", protect, adminOnly, getCoursesByDepartment); //not use


// Users
router.get("/get-all-users", protect, adminOnly, getAllUsers);
router.delete("/delete-user/:id", protect, adminOnly, deleteUser);
router.get("/analytics",protect,adminOnly,getUserAnalytics)
router.get("/get-user-by-username/:username", protect, adminOnly, getUserByUsername);  
router.put("/update-user-role/:id", protect, adminOnly, updateUserRole);  //not use

//Materials
router.get("/get-all-materials",protect,adminOnly,getAllMaterials)
router.delete("/delete-materials/:id",protect,adminOnly,deleteMaterial)
router.get("/get-all-materials-by-uniId/:universityId",protect,adminOnly,getMaterialsByUniversityId)  //not use


export default router;

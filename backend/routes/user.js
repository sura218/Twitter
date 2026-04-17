import { Router } from "express";
import { createUser, getMe, updateUser, deleteAccount } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";



const useRouter = Router();

useRouter.post("/", createUser);
useRouter.get("/",protect, getMe);
useRouter.put('/', protect, updateUser)
useRouter.delete("/", protect, deleteAccount);

export default useRouter;
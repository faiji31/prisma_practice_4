import { Router } from "express";



const router = Router()

router.post("/")
router.get("/author/:authorId")
router.patch("/:commentId")
router.delete("/:commentId")
router.put("/:commentId/moderate")


export const commentRoutes = router
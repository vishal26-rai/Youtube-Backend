import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller";
import { verifyJWT } from "../middlewares/auth.jwt";
import { upload } from "../middlewares/multer";

const router = Router();

router.use(verifyJWT, upload.none());
router.route("/:videoId").get(verifyJWT,getVideoComments).post(addComment);
router.route("/:commentId").delete(verifyJWT, deleteComment).patch(updateComment);

export default router;

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  publishAVideo,
  togglePublishStatus,
} from "../controllers/video.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router
  .route("/")
  .get(getAllVideos)
  .post(
    verifyJWT,
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

router
  .route("/v/:videoId")
  .get(verifyJWT, getVideoById)
  .delete(verifyJWT, deleteVideo)
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router;

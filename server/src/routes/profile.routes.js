import { Router } from "express";
import { allUsersProfiles, userFollow, userProfile } from "../controllers/profile.controller.js";

const router = Router()

router.route('/user/:username').get(userProfile)
router.route('/user/follow/:username').get(userFollow)
router.route('/all-users').get(allUsersProfiles)

export default router
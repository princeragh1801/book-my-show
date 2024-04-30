import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createEvent, deleteEvent, getAllUpcomingEvents, getEventDetails } from "../controllers/event.controller.js";


const router = Router();

router.use(verifyJWT)
router.route("/create-event").post(createEvent);
router.route("/events").get(getAllUpcomingEvents)

router.route("/delete-event").post(deleteEvent);
router.route("/event-detail").get(getEventDetails)

export default router
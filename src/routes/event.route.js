import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createEvent, deleteEvent, getAllUpcomingEvents, getEventDetails } from "../controllers/event.controller.js";
import { bookEventTicket } from "../controllers/booking.controller.js";


const router = Router();

router.use(verifyJWT)
router.route("/create-event").post(createEvent);
router.route("/get-events").get(getAllUpcomingEvents)

router.route("/delete-event").post(deleteEvent);
router.route("/event-detail").get(getEventDetails);
router.route("/book-event").post(bookEventTicket)

export default router

import asyncHandler from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Event } from "../models/event.model.js"
import { User } from "../models/user.model.js"

const createEvent = asyncHandler(async(req, res) => {
    const user = req.user;
    if(!user){
        throw new ApiError(400, "Invalid request for creating a new event")
    }
    const userId = user?._id;
    
    const isAdmin = await User.findById(userId);
    if(isAdmin.role !== "admin"){
        throw new ApiError(400, "You can't create an event");
    }

    const { name, description, date, time, venue, total_seats, ticket_price } = req.body;

    if(!name || !description || !date || !time || !venue || !total_seats || !ticket_price){
        throw new ApiError(404, "All fields are required");
    }

    const newEvent = await Event.create({
        name,
        description,
        date,
        time,
        venue,
        total_seats,
        available_seats : total_seats,
        ticket_price
    })

    await newEvent.save();
    if(!newEvent){
        throw new ApiError(500, "Error while creating new event");
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {event},
            "Event created successfully"
        )
    )
})

const getEventDetails = asyncHandler(async(req, res) =>{
    const {eventId} = req.body;
    if(!eventId){
        throw new ApiError(400, "Invalid request");
    }
    const event = await Event.findById(eventId);
    if(!event){
        throw new ApiError(500, "Error while fetching the event details");
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {event},
            "Event details fetched successfully"
        )
    )
})

const deleteEvent = asyncHandler(async(req, res) => {
    const {eventId} = req.body;
    if(!eventId){
        throw new ApiError(400, "Invalid request");
    }
    await Event.deleteOne({id : eventId});

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Event deleted successfully"
        )
    )
})

const getAllUpcomingEvents = asyncHandler(async(req, res) => {
    const date = Date.now();
    const events = await Event.find({date : {$gte : date}});
    return res.status(200).json(
        new ApiResponse(
            200,
            {events},
            "Event deleted successfully"
        )
    )
})


export {
    createEvent,
    getEventDetails,
    deleteEvent,
    getAllUpcomingEvents
}
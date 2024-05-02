
import asyncHandler from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Event } from "../models/event.model.js"
import { User } from "../models/user.model.js"
import { Venue } from "../models/venue.model.js"
import { Phase } from "../models/phase.model.js"

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

    const { name, description, date, time, venue, total_seats, ticket_price, phases=[] } = req.body;

    if(!name || !description || !date || !time || !venue || !total_seats){
        throw new ApiError(404, "All fields are required");
    }
    if(!phases && !ticket_price){
        throw new ApiError(404, "All fields are required");
    }
    
    // if we have phases then
    let eventPhases = [];
    if(phases.length){
        await Promise.all(phases.map(async(phase)=> {
            if(!phase.name || !phase.price || !phase.phase_tickets){
                throw new ApiError(404, "Please provide the enough details for phases")
            }
            const newPhase = await Phase.create({
               name : phase.name,
               phase_tickets : phase.phase_tickets,
               available_phase_tickets : phase.phase_tickets,
               price : phase.price
           });
           if(newPhase){
               eventPhases.push(newPhase);
           }else{
            throw new ApiError(500, "Error while creating the phases")
           }
       }))
    }

    let newVenue;
    if(venue.venue_id){
        newVenue = await Venue.findById(venue.venue_id);
    }

    // venue is already in database
    if(!newVenue){
        newVenue = await Venue.create({
            name : venue.name,
            address : venue.address,
            city : venue.city,
            country : venue.country,
            capacity : venue.capacity,
            state : venue.state || undefined,
        })
        await newVenue.save();
    }
    if(!newVenue){
        throw new ApiError(500, "Error occured while creating new venue")
    }
    
    // creating the new event
    const newEvent = await Event.create({
        name,
        description,
        date,
        time,
        venue : newVenue,
        total_seats,
        available_seats : total_seats,
        ticket_price,
        phases : eventPhases,
        phase_system : eventPhases.length,
        current_phase : 0,
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
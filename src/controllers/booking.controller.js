import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {Event} from "../models/event.model.js"
import { Booking } from "../models/booking.model.js";

const bookEventTicket = asyncHandler(async(req, res) => {
    const { event_id, num_tickets} = req.body;
    const user = req.user;
    if(!user){
        throw new ApiError(400, "Invalid request for booking a new event");
    }
    const user_id = user._id;
    if(!event_id || !user_id || !num_tickets){
        throw new ApiError(400, "Provide all the details to book an event");
    }

    const event = await Event.findById(event_id);
    const availableSeats = event.available_seats;
    if(num_tickets > availableSeats){
        throw new ApiError(500, "Sorry for inconvinience, Enough seats are not available");
    }
    const total_price = event.ticket_price*num_tickets;
    // add payment logic here
    
    const booking = await Booking.create({
        user_id,
        event_id,
        num_tickets,
        status : "confirmed",
        total_price
    })

    await booking.save();
    if(!booking){
        throw new ApiError(500, "Unable to create booking");
    }

    const updateEvent = await Event.findByIdAndUpdate(
        event_id, 
        {
            available_seats : availableSeats-num_tickets,
            sold_out_seats : event.sold_out_seats+num_tickets
        }
    )
    updateEvent.save();
    if(!updateEvent){
        throw new ApiError(500, "Error while updating the event after booking")
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {booking},
            "Tickets booked!"
        )
    )
})

export {
    bookEventTicket
}
import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {Event} from "../models/event.model.js"
import { Booking } from "../models/booking.model.js";
import { Phase } from "../models/phase.model.js";

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

    // if we have a phase system
    let total_price;
    if(event.phase_system){
        const current_phase = event.current_phase;
        const phaseId = event.phases[current_phase]._id;
        const phase = await Phase.findById(phaseId);
        if(num_tickets > phase.available_phase_tickets){
            // it should be improvised
            throw new ApiError(500, "Not enough seats available for this phase");
        }
        total_price = phase.price*num_tickets;
        phase.available_phase_tickets -= num_tickets;
        await phase.save();
    }else{
        if(num_tickets > event.available_seats){
            throw new ApiError(500, "Not enough tickets available");
        }
        total_price = event.ticket_price*num_tickets;
    }

    // 
    let updateEvent = await Event.findByIdAndUpdate(
        event_id, 
        {
            available_seats : availableSeats-num_tickets,
        }
    )
    
    const booking = await Booking.create({
        user_id,
        event_id,
        num_tickets,
        status : "locked",
        total_price
    })
    
    // add payment logic here
    const paymentDone = true;
    // if payment is failed
    // update available tickets
    if(!paymentDone){
        if(event.phase_system){
            const phaseId = event.phases[event.current_phase]._id;
            const phase = await Phase.findById(phaseId);
            phase.available_phase_tickets += num_tickets;
            await phase.save();
        }else{
            event.available_seats += num_tickets;
            await event.save();
        }
        throw new ApiError(500, "Unable to proceed the booking");
    }else{
        if(event.phase_system){
            const phase = event.phases[event.current_phase]._id;
            const vacant_phase_seats = phase.available_phase_tickets
            if(vacant_phase_seats == 0){
                event.current_phase++;
                await event.save();
            }
        }
    }
    booking.status = 'confirmed'
    await booking.save();
    // send the booking details to user

    updateEvent = await Event.findByIdAndUpdate(
        event_id, 
        {
            sold_out_seats : event.sold_out_seats+num_tickets
        }
    )
    await updateEvent.save();
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
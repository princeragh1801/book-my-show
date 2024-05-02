import mongoose, {Schema} from "mongoose";

const bookingSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  event_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true
  },
  num_tickets: { 
    type: Number, 
    required: true
  },
  total_price: { 
    type: Number, 
    required: true
  },
  booking_date: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['pending', 'locked', 'confirmed', 'canceled'], 
    default: 'pending'
 }
});

export const Booking = mongoose.model('Booking', bookingSchema);


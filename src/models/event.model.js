import mongoose, {Schema} from "mongoose";

const eventSchema = new Schema({
  name: { 
    type: String, 
    required: true
  },
  description: { 
    type: String
  },
  date: { 
    type: Date, 
    required: true
  },
  time: { 
    type: String, 
    required: true
  },
  venue: { 
    type: String, 
    required: true
  },
  available_seats: { 
    type: Number, 
    required: true
  },
  ticket_price: { 
    type: Number, 
    required: true
  }
});

export const Event = mongoose.model('Event', eventSchema);

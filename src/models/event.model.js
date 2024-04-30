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
  total_seats: { 
    type: Number, 
    required: true
  },
  available_seats: { 
    type: Number, 
    required: true
  },
  sold_out_seats : {
    type : Number,
    default : 0
  },
  ticket_price: { 
    type: Number, 
    required: true
  }
});

export const Event = mongoose.model('Event', eventSchema);

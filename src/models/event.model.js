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
    type: Schema.Types.ObjectId,
    ref : "Venue",
    required : true,
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
  },
  category: { 
    type: String, 
    enum: ['Concert', 'Standup', 'Movie', 'Match', 'Other'], default: 'Other' 
  },
  phases: [
    {
      type : Schema.Types.ObjectId,
      ref : "Phase"
    }
  ],
  phase_system : {
    type : Boolean,
    default : false,
  },
  current_phase : {
    type : Number,
    default : 0,
  }
});

export const Event = mongoose.model('Event', eventSchema);

// someone wants to books more seats than available in the current phase so what should i do?
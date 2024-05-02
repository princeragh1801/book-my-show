import mongoose, {Schema} from "mongoose";

const phaseSchema = new Schema({
    name: { type: String, required: true },
    phase_tickets: { type: Number, required: true },
    price: { type: Number, required: true },
    available_phase_tickets : {type : Number}
  });
  
export const Phase = mongoose.model("Phase", phaseSchema)
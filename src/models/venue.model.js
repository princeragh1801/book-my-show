import mongoose, {Schema} from "mongoose";

const venueSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  country: { type: String, required: true },
  capacity: { type: Number, required: true },
  // Add other fields as needed
});

export const Venue = mongoose.model('Venue', venueSchema);


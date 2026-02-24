import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", EnquirySchema);
export default Enquiry;

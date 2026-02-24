import Enquiry from "../models/Enquiry.js";

const EnquiryCtrl = {
    createEnquiry: async (req, res) => {
        try {
            const { firstName, email, message } = req.body;
            if (!firstName || !email || !message) {
                return res.status(400).json({ err: "All fields are required." });
            }

            const newEnquiry = new Enquiry({ firstName, email, message });
            await newEnquiry.save();

            res.status(201).json({ success: true, message: "Inquiry submitted successfully." });
        } catch (err) {
            console.error("Enquiry submission error:", err);
            res.status(500).json({ err: "Internal server error." });
        }
    },

    getAllEnquiries: async (req, res) => {
        try {
            const enquiries = await Enquiry.find().sort({ createdAt: -1 });
            res.status(200).json(enquiries);
        } catch (err) {
            console.error("Fetch enquiries error:", err);
            res.status(500).json({ err: "Internal server error." });
        }
    }
};

export default EnquiryCtrl;

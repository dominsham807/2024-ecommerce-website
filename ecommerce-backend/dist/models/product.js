import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter Product name"],
    },
    photo: {
        type: String,
        required: [true, "Please enter Product photo"],
    },
    price: {
        type: Number,
        required: [true, "Please enter Product price"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter Product stock"],
    },
    category: {
        type: String,
        required: [true, "Please enter Product category"],
        trim: true,
    },
}, {
    timestamps: true
});
export const Product = mongoose.model("Product", schema);

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
    },
    paymentMethod: {
      type: String,
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
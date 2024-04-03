import mongoose, { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    profilePicture: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Admin = models.Admin || model("Admin", AdminSchema);

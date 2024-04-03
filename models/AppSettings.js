import mongoose, { Schema, model, models } from "mongoose";

const AppSettingsSchema = new Schema(
  {
    deliveryPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const AppSettings = models.AppSettings || model("AppSettings", AppSettingsSchema);

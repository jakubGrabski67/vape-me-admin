import { mongooseConnect } from "@/lib/mongoose";
import { AppSettings } from "@/models/AppSettings";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await AppSettings.findOne({ _id: req.query.id }));
    } else {
      res.json(await AppSettings.find());
    }
  }

  if (method === "POST") {
    const { deliveryPrice } = req.body;
    const appSettingsDoc = await AppSettings.create({
      deliveryPrice,
    });
    res.json(appSettingsDoc);
  }

  if (method === "PUT") {
    try {
      const { deliveryPrice } = req.body;
      const existingSettings = await AppSettings.findOne();
      if (existingSettings) {
        existingSettings.deliveryPrice = deliveryPrice;
        await existingSettings.save();
        res.json(existingSettings);
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania ustawień:", error);
      res
        .status(500)
        .json({ error: "Wystąpił błąd podczas zapisywania ustawień." });
    }
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await AppSettings.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}

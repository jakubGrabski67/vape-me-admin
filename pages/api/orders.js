import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Order.findOne({ _id: req.query.id }));
    } else {
      res.json(await Order.find().sort({ createdAt: -1 }));
    }
  }

  if (method === "POST") {
    const {
      line_items,
      name,
      lastName,
      city,
      email,
      postalCode,
      streetAddress,
      country,
      deliveryPrice,
      paid,
      archived,
    } = req.body;
    const orderDoc = await Order.create({
      line_items,
      name,
      lastName,
      city,
      email,
      postalCode,
      streetAddress,
      country,
      deliveryPrice,
      paid,
      archived,
    });
    res.json(orderDoc);
  }

  if (method === "PUT") {
    const {
      _id,
      line_items,
      name,
      lastName,
      city,
      email,
      postalCode,
      streetAddress,
      country,
      deliveryPrice,
      paid,
      archived,
    } = req.body;
    await Order.updateOne(
      { _id },
      {
        line_items,
        name,
        lastName,
        city,
        email,
        postalCode,
        streetAddress,
        country,
        deliveryPrice,
        paid,
        archived,
      }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Order.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}

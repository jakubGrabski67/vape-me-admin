import { mongooseConnect } from "@/lib/mongoose";
import { Admin } from "@/models/Admin";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Admin.findOne({ _id: req.query.id }));
    } else {
      res.json(await Admin.find());
    }
  }

  if (method === "POST") {
    const { name, surname, email, profilePicture } = req.body;
    const adminDoc = await Admin.create({
      name,
      surname,
      email,
      profilePicture,
    });
    res.json(adminDoc);
  }

  if (method === "PUT") {
    const { _id, name, surname, email, profilePicture } = req.body;
    await Admin.updateOne({ _id }, { name, surname, email, profilePicture });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Admin.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}

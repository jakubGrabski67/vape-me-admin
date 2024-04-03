import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    const { title, description, price, images, category, properties, isFeatured } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
      isFeatured
    });
    res.json(productDoc);
  }

  if (method === "PUT") {
    const { title, description, price, images, category, properties, isFeatured, _id } = req.body;
    await Product.updateOne({ _id }, { title, description, price, images, category, properties,isFeatured });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
    await Product.deleteOne({ _id:req.query?.id });
    res.json(true);
  }
}
}

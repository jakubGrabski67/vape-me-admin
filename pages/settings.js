import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FeaturedProductSelector() {
  const [products, setProducts] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [isTableLoading, setIsTableLoading] = useState(false);

  useEffect(() => {
    setIsTableLoading(true);
    axios.get("/api/products").then((response) => {
      setProducts(response.data);
      setIsTableLoading(false);
    });
  }, []);

  useEffect(() => {
    const featuredProduct = products.find(
      (product) => product.isFeatured === true
    );
    setFeaturedProduct(featuredProduct);
  }, [products]);

  useEffect(() => {
    axios.get("/api/appSettings").then((response) => {
      if (response.data && response.data.length > 0) {
        const firstSettingsObject = response.data[0];
        const { deliveryPrice, updatedAt } = firstSettingsObject;
        setDeliveryPrice(deliveryPrice);
        setUpdatedAt(updatedAt);
      } else {
        return;
      }
    });
  }, []);

  const handleInputChange = (event) => {
    setDeliveryPrice(event.target.value);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put("/api/appSettings", { deliveryPrice });
      if (response.data) {
        window.location.reload();
      } else {
      }
    } catch (error) {
      //
    }
  };

  return (
    <Layout>
      <h1>Wybrany produkt na stronie głównej:</h1>
      {isTableLoading && (
        <div className="h-24 p-1 flex items-center">
          <Spinner />
        </div>
      )}
      {featuredProduct ? (
        <>
          <input
            className="mb-4"
            type="text"
            value={featuredProduct.title}
            readOnly
          />
          <Link href={`/products/edit/${featuredProduct._id}`}>
            <button className="btn-primary" type="button">
              Zobacz
            </button>
          </Link>
        </>
      ) : (
        <h2>Nie wybrano produktu.</h2>
      )}

      <form onSubmit={handleSave}>
        <h1 className="mt-4">Cena przesyłki zamówienia (PLN):</h1>
        <input
          type="number"
          placeholder="Wprowadź kwotę przesyłki..."
          value={deliveryPrice}
          onChange={handleInputChange}
        />
        <div>
          <span>
            Ostatnia aktualizacja: {new Date(updatedAt).toLocaleString("pl-PL")}{" "}
          </span>
        </div>
        <button type="submit" className="btn-primary mt-2">
          Zapisz
        </button>
      </form>
    </Layout>
  );
}

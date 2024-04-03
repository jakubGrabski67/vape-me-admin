import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
  isFeatured: existingIsFeatured,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [isFeatured, setIsFeatured] = useState(existingIsFeatured || false);
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const router = useRouter();
  const [existingFeatured, setExistingFeatured] = useState(false);
  const [featuredProductTitle, setFeaturedProductTitle] = useState(null);
  const [featuredProductId, setFeaturedProductId] = useState("");

  useEffect(() => {
    axios.get("/api/products/").then((result) => {
      const isExistingFeatured = result.data.some(
        (product) => product.isFeatured
      );
      setExistingFeatured(isExistingFeatured);
    });
  }, []);

  useEffect(() => {
    axios.get("/api/products/").then((result) => {
      const featuredProduct = result.data.find(
        (product) => product.isFeatured === true
      );

      if (featuredProduct) {
        setFeaturedProductTitle(featuredProduct.title);
        setFeaturedProductId(featuredProduct._id);
      }
    });
  }, []);

  useEffect(() => {
    setIsTableLoading(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setIsTableLoading(false);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();

    const existingFeaturedProducts = await axios.get("/api/products/");
    const isExistingFeatured = existingFeaturedProducts.data.some(
      (product) => product.isFeatured
    );

    if ((!isExistingFeatured || existingIsFeatured) && isFeatured) {
      saveChanges();
      return;
    }

    if (isExistingFeatured && isFeatured) {
      alert("Istnieje już rekord z polem isFeatured ustawionym na true.");
      return;
    }
    saveChanges();
  }

  async function saveChanges() {
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
      isFeatured,
    };

    if (_id) {
      //edit an existing product
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create a new product
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      {isTableLoading && (
        <div className="h-24 p-1 flex items-center">
          <Spinner />
        </div>
      )}
      <label>Nazwa produktu</label>
      <input
        type="text"
        placeholder="Wprowadź nazwę produktu..."
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Kategoria produktu</label>

      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Brak kategorii</option>
        {categories.length > 0 &&
          categories.map((c) => <option value={c._id}>{c.name}</option>)}
      </select>
      {isTableLoading && (
        <div className="h-24 p-1 flex items-center">
          <Spinner />
        </div>
      )}
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div>
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <label>Zdjęcia produktu</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="" className="rounded-lg"></img>
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 p-1 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Dodaj zdjęcie</div>
          <input type="file" onChange={uploadImages} className="hidden"></input>
        </label>
      </div>
      <label>Opis</label>
      <textarea
        placeholder="Wprowadź opis produktu..."
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Cena (brutto)</label>
      <input
        type="number"
        placeholder="Wprowadź cenę produktu..."
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <label>Czy produkt jest promowany na stronie głównej?</label>
      <select
        value={isFeatured}
        onChange={(ev) => setIsFeatured(ev.target.value)}
        disabled={existingFeatured && !existingIsFeatured}
      >
        <option value={true} disabled={existingFeatured}>
          Tak
        </option>
        <option value={false}>Nie</option>
      </select>
      {existingFeatured && !existingIsFeatured && (
        <p className=" mb-2 p-1">
          Aby wybrać ten produkt na stronie głównej najpierw usuń z niej:{" "}
          <a
            href={`/products/edit/${featuredProductId}`}
            className="text-red-500"
          >
            {featuredProductTitle}
          </a>
        </p>
      )}

      <button type="submit" className="btn-primary">
        Zapisz
      </button>
    </form>
  );
}

import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function OrderForm({
  _id,
  line_items: existingLineItems,
  name: existingName,
  lastName: existingLastName,
  city: existingCity,
  email: existingEmail,
  postalCode: existingPostalCode,
  streetAddress: existingStreetAddress,
  country: existingCountry,
  paid: isPaid,
  createdAt: existingCreatedAt,
  archived: isArchived,
}) {
  const [line_items, setLineItems] = useState(existingLineItems || []);
  const [name, setName] = useState(existingName || "");
  const [lastName, setLastName] = useState(existingLastName || "");
  const [city, setCity] = useState(existingCity || "");
  const [email, setEmail] = useState(existingEmail || "");
  const [postalCode, setPostalCode] = useState(existingPostalCode || "");
  const [streetAddress, setStreetAddress] = useState(
    existingStreetAddress || ""
  );
  const [country, setCountry] = useState(existingCountry || "");
  const [paid, setPaid] = useState(isPaid || false);
  const [createdAt, setCreatedAt] = useState(existingCreatedAt || "");
  const [archived, setArchived] = useState(isArchived || false);

  const [goToOrders, setGoToOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const router = useRouter();

  const totalPrice = (
    line_items.reduce(
      (acc, item) => acc + item.price_data.unit_amount * item.quantity,
      0
    ) / 100
  ).toFixed(2);

  useEffect(() => {
    setIsTableLoading(true);
    axios.get("/api/orders").then((result) => {
      console.log(totalPrice);
      setOrders(result.data);
      setIsTableLoading(false);
    });
  }, []);

  async function saveOrder(ev) {
    ev.preventDefault();
    const data = {
      //   line_items,
      name,
      lastName,
      city,
      email,
      postalCode,
      streetAddress,
      country,
      paid,
      archived,
    };
    if (_id) {
      //edit an existing order
      await axios.put("/api/orders", { ...data, _id });
    } else {
      //create a new order
      await axios.post("/api/orders", data);
    }
    setGoToOrders(true);
  }
  if (goToOrders) {
    router.push("/orders");
  }

  return (
    <form onSubmit={saveOrder}>
      <h2 className="mt-4 mb-4">Zamówione produkty</h2>
      <table className="basic">
        <thead>
          <tr>
            <td>Ilość</td>
            <td>Zamówione produkty</td>
            <td>Kwota zamówienia</td>
            <td>Data zamówienia</td>
          </tr>
        </thead>
        <tbody>
          {isTableLoading && (
            <div className="h-24 p-1 flex items-center">
              <Spinner />
            </div>
          )}

          <tr>
            <td>
              {line_items.map((l, index) => (
                <div key={index}>{l.quantity}</div>
              ))}
            </td>

            <td>
              {line_items.map((l, index) => (
                <div key={index}>{l.price_data?.product_data.name}</div>
              ))}
            </td>

            <td>{totalPrice} PLN</td>

            <td>{new Date(createdAt).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <h2 className="mt-4">Dane osobowe klienta</h2>

      <label>Imię</label>
      <input
        type="text"
        placeholder="Wprowadź imię..."
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />

      <label>Nazwisko</label>
      <input
        type="text"
        placeholder="Wprowadź nazwisko..."
        value={lastName}
        onChange={(ev) => setLastName(ev.target.value)}
      />

      <label>Miasto</label>
      <input
        type="text"
        placeholder="Wprowadź miasto..."
        value={city}
        onChange={(ev) => setCity(ev.target.value)}
      />

      <label>Adres email</label>
      <input
        type="email"
        placeholder="Wprowadź adres email..."
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />

      <label>Kod pocztowy</label>
      <input
        type="text"
        placeholder="Wprowadź kod pocztowy..."
        value={postalCode}
        onChange={(ev) => setPostalCode(ev.target.value)}
      />

      <label>Adres zamieszkania</label>
      <input
        type="text"
        placeholder="Wprowadź adres zamieszkania..."
        value={streetAddress}
        onChange={(ev) => setStreetAddress(ev.target.value)}
      />

      <label>Kraj</label>
      <input
        type="text"
        placeholder="Wprowadź kraj..."
        value={country}
        onChange={(ev) => setCountry(ev.target.value)}
      />

      <label>Czy zamówienie zostało opłacone?</label>
      <select
        value={paid}
        onChange={(ev) => setPaid(ev.target.value === "true")}
      >
        <option value={true}>Tak</option>
        <option value={false}>Nie</option>
      </select>

      <label>Czy chcesz zarchiwizować zamówienie?</label>
      <select value={archived} onChange={(ev) => setArchived(ev.target.value)}>
        <option value={true}>Tak</option>
        <option value={false}>Nie</option>
      </select>

      <button type="submit" className="btn-primary">
        Zapisz
      </button>
    </form>
  );
}

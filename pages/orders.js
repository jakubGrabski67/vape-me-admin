import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);

  useEffect(() => {
    setIsTableLoading(true);
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setIsTableLoading(false);
    });
  }, []);

  const handleArchiveOrder = async (orderId) => {
    const response = await axios.get("/api/orders?id=" + orderId);
    const order = response.data;

    order.archived = true;

    await axios.put("/api/orders?id=" + orderId, order);

    setOrders((prevOrders) =>
      prevOrders.map((o) => (o._id === orderId ? { ...o, archived: true } : o))
    );
  };

  const handleArchiveOrderFalse = async (orderId) => {
    const response = await axios.get("/api/orders?id=" + orderId);
    const order = response.data;

    order.archived = false;

    await axios.put("/api/orders?id=" + orderId, order);

    setOrders((prevOrders) =>
      prevOrders.map((o) => (o._id === orderId ? { ...o, archived: false } : o))
    );
  };

  return (
    <Layout>
      <h1>Lista aktywnych zamówień</h1>

      <table className="basic">
        <thead>
          <tr>
            <td className="text-start">Data zamówienia</td>
            <td className="text-start">Status płatności</td>
            <td className="text-start desktop-only">Klient</td>
            <td className="text-start">Zamówione produkty</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {isTableLoading && (
            <div className="h-24 p-1 flex items-center">
              <Spinner />
            </div>
          )}
          {orders.length > 0 &&
            orders
              .filter((order) => order.archived === false)
              .map((order) => (
                <tr key={order._id}>
                  <td className="text-start" key={`${order._id}_createdAt`}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td
                    className={
                      order.paid
                        ? "text-green-600 text-start"
                        : "text-red-600 text-start"
                    }
                    key={`${order._id}_paymentStatus`}
                  >
                    {order.paid ? "Zapłacono " : "Nie zapłacono"}
                  </td>
                  <td
                    className="text-start desktop-only"
                    key={`${order._id}_customerInfo`}
                  >
                    {order.name} {order.lastName}
                    <br />
                    {order.email}
                    <br />
                    {order.city}, {order.streetAddress}
                    <br />
                    {order.postalCode}, {order.country}
                  </td>
                  <td
                    className="text-start"
                    key={`${order._id}_orderedProducts`}
                  >
                    {order.line_items.map((l, index) => (
                      <React.Fragment key={`${order._id}_product_${index}`}>
                        <span>
                          x{l.quantity} {l.price_data?.product_data.name}
                        </span>
                        <br key={`${order._id}_br_${index}`} />
                      </React.Fragment>
                    ))}
                  </td>
                  <td key={`${order._id}_actions`}>
                    <Link legacyBehavior href="#">
                      <a
                        className="btn-default w-32"
                        onClick={() => handleArchiveOrder(order._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                          />
                        </svg>
                        Archiwizuj
                      </a>
                    </Link>
                    <Link
                      className="btn-default w-32"
                      href={"/orders/edit/" + order._id}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Edytuj
                    </Link>
                    <Link
                      className="btn-red w-32"
                      href={"/orders/delete/" + order._id}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Usuń
                    </Link>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      <h1 className="mt-4">Lista zarchiwizowanych zamówień</h1>

      <table className="basic">
        <thead>
          <tr>
            <td className="text-start">Data zamówienia</td>
            <td className="text-start">Status płatności</td>
            <td className="text-start desktop-only">Klient</td>
            <td className="text-start">Zamówione produkty</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {isTableLoading && (
            <div className="h-24 p-1 flex items-center">
              <Spinner />
            </div>
          )}
          {orders.length > 0 &&
            orders
              .filter((order) => order.archived === true)
              .map((order) => (
                <tr key={order._id}>
                  <td className="text-start" key={`${order._id}_createdAt`}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td
                    className={
                      order.paid
                        ? "text-green-600 text-start"
                        : "text-red-600 text-start"
                    }
                    key={`${order._id}_paymentStatus`}
                  >
                    {order.paid ? "Zapłacono " : "Nie zapłacono"}
                  </td>
                  <td
                    className="text-start desktop-only"
                    key={`${order._id}_customerInfo`}
                  >
                    {order.name} {order.lastName}
                    <br />
                    {order.email}
                    <br />
                    {order.city}, {order.streetAddress}
                    <br />
                    {order.postalCode}, {order.country}
                  </td>
                  <td
                    className="text-start"
                    key={`${order._id}_orderedProducts`}
                  >
                    {order.line_items.map((l, index) => (
                      <React.Fragment key={`${order._id}_product_${index}`}>
                        <span>
                          x{l.quantity} {l.price_data?.product_data.name}
                        </span>
                        <br key={`${order._id}_br_${index}`} />
                      </React.Fragment>
                    ))}
                  </td>
                  <td key={`${order._id}_actions`}>
                    <Link legacyBehavior href="#">
                      <a
                        className="btn-default w-32"
                        onClick={() => handleArchiveOrderFalse(order._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 mr-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                          />
                        </svg>
                        Przywróć
                      </a>
                    </Link>
                    <Link
                      className="btn-default w-32"
                      href={"/orders/edit/" + order._id}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Edytuj
                    </Link>
                    <Link
                      className="btn-red  w-32"
                      href={"/orders/delete/" + order._id}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Usuń
                    </Link>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </Layout>
  );
}

import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteOrderPage() {
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
        console.log(orderinfo)
      return;
    }
    axios.get("/api/orders?id=" + id).then((response) => {
      setOrderInfo(response.data);
    });
  });
  function goBack() {
    router.push("/orders");
  }

  async function deleteOrder() {
    await axios.delete("/api/orders?id=" + id);
    goBack();
  }

  return (

    <Layout>
      <h1 className="text-center">
        Czy na pewno chcesz usunąć zamówienie "{orderInfo?.id}"?
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteOrder}>
          Tak
        </button>
        <button className="btn-default" onClick={goBack}>
          Nie
        </button>
      </div>
    </Layout>
  );
}

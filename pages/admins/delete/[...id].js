import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteAdminPage() {
  const router = useRouter();
  const [adminInfo, setAdminInfo] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/admins?id=" + id).then((response) => {
      setAdminInfo(response.data);
    });
  });
  function goBack() {
    router.push("/admins");
  }

  async function deleteAdmin() {
    await axios.delete("/api/admins?id=" + id);
    goBack();
  }

  return (
    <Layout>
      <h1 className="text-center">
        Czy na pewno chcesz usunąć pracownika "{adminInfo?.name}{" "}
        {adminInfo?.surname}"?
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteAdmin}>
          Tak
        </button>
        <button className="btn-default" onClick={goBack}>
          Nie
        </button>
      </div>
    </Layout>
  );
}

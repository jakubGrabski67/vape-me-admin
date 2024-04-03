import Layout from "@/components/Layout";
import AdminForm from "@/components/AdminForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditAdminPage() {
  const [adminInfo, setAdminInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/admins?id=" + id).then((response) => {
      setAdminInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Formularz edycji pracownika</h1>
      {adminInfo && <AdminForm {...adminInfo} />}
    </Layout>
  );
}

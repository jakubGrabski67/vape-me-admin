import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage(){
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const {id} = router.query;
    useEffect(() => {
        if (!id){
            return;
        }
        axios.get('/api/products?id='+id).then(response => {
            setProductInfo(response.data);
        })
    })
    function goBack(){
router.push('/products');
    }

    async function deleteProduct(){
        await axios.delete('/api/products?id='+id);
        goBack();
    }

    return(
        <Layout>
            <h1 className="text-center">Czy na pewno chcesz usunąć produkt "{productInfo?.title}"?</h1>
            <div className="flex gap-2 justify-center">
            <button className="btn-red" onClick={deleteProduct}>Tak</button>
            <button className="btn-default" onClick={goBack}>Nie</button>
            </div>
        </Layout>
    )
}
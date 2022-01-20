import React from "react";
import EditProductForm from "../components/EditProductForm";
//เรียกใช้ EditProductForm จากโฟลเดอร์ components ไฟล์ EditProductForm
import { useParams } from "react-router-dom";
//เรียกใช้ useParams จาก react-router-dom

function EditProduct() {
  const param = useParams();
  //รับ param ที่ยูสเซอร์ส่งมา
  return (
    <>
      <main>
        <EditProductForm id={param.id} />
        //ส่งพารามิเตอร์ id ไปให้EditProductForm
      </main>
    </>
  );
}

export default EditProduct;

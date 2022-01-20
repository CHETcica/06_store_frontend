import axios from "axios";
import React, { useState } from "react";
import { useFormik } from "formik";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import * as yup from "yup";
//เรียกใช้ ทังหมดจาก yup
import {
  Container,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  FormText,
  Progress,
} from "reactstrap";
import { renderIntoDocument } from "react-dom/cjs/react-dom-test-utils.production.min";

function AddProductForm() {
  //ตังค่าเบื้องต้น
  const initProductState = {
    name: "",
    category: "",
    price: "",
    tags: [""],
    file: "",
  };
  //ตั่งค่า useState ค่าเริ่มต้นเป็น false
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFileToFirebase = async (file) => {
    //Prepare unique file name
    const userId = "001";
    const timestamp = Math.floor(Date.now() / 1000);
    const newName = userId + "_" + timestamp;

    //uploading file
    const storageRef = ref(storage, `images/${newName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    //get URL
    await uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          saveProduct(downloadURL);
        });
      }
    );
  };

  const FILE_SIZE = 2000 * 2024;
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/gif",
  ];
  //
  const formik = useFormik({
    //ตั่งค่าเริ่มต้น ให้มีค่าเท่ากับ initProductState
    initialValues: initProductState,
    // กำหนดค่าให้ผู้ใช้ กรอกข้อมูลให้ถูกต้อง
    validationSchema: yup.object().shape({
      name: yup.string().required("กรุณากรอกข้อมูล"),
      category: yup.string().required("กรุณากรอกข้อมูล"),
      price: yup
        .number("กรุณากรอก Number")
        .positive("ไม่สามารถติดลบได้")
        .required("กรุณากรอกข้อมูล"),
      tags: yup.string(),
      file: yup
        .mixed()
        .test("fileSize", "ไฟล์ใหญ่เกิ้น", (file) => {
          if (file) {
            return file?.size <= FILE_SIZE;
          } else {
            return true;
          }
        })
        .test("fileType", "รูปเท่านั้น", (file) => {
          if (file) {
            return SUPPORTED_FORMATS.includes(file.type);
          } else {
            return true;
          }
        }),
    }),
    onSubmit: () => {
      if (formik.values.file) {
        console.log("Uploading");
        uploadFileToFirebase(formik.values.file);
      }else{
        saveProduct("");
      }
      //saveProduct();
    },
  });

  const saveProduct = (url) => {
    const param = {
      name: formik.values.name,
      category: formik.values.category,
      price: formik.values.price,
      tags: formik.values.tags,
      imageURL: url,
    };
    axios
      .post("https://store-backend-chet008.herokuapp.com/api/products", param)
      .then((response) => {
        console.log(response.data);
        // setProduct(initProductState);
        setSubmitted(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const newProduct = () => {
    // setProduct(initProductState);
    setSubmitted(false);
  };
  return (
    <Container>
      <Row>
        <h3>ProductName</h3>
      </Row>
      {submitted ? (
        <>
          <Alert color="success">U have submitted successfully !!</Alert>
          <Button className="btn btn-success" onClick={newProduct}>
            Add new Product
          </Button>
        </>
      ) : (
        <>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="productName">ProductName</Label>
              <Input
                type="text"
                name="name"
                id="productName"
                value={formik.values.name || ""}
                onChange={formik.handleChange}
              />
              {formik.errors.name && formik.touched.name && (
                <p>{formik.errors.name}</p>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="product Category">ProductCategory</Label>
              <Input
                type="text"
                name="category"
                id="category"
                value={formik.values.category || ""}
                onChange={formik.handleChange}
              />
              {formik.errors.category && formik.touched.category && (
                <p>{formik.errors.category}</p>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="product Price">ProductPrice</Label>
              <Input
                type="text"
                name="price"
                id="price"
                value={formik.values.price || ""}
                onChange={formik.handleChange}
              />
              {formik.errors.price && formik.touched.price && (
                <p>{formik.errors.price}</p>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="product Tags">ProductTags</Label>
              <Input
                type="text"
                name="tags"
                id="tags"
                value={formik.values.tags || ""}
                onChange={formik.handleChange}
              />
              {formik.errors.tags && formik.touched.tags && (
                <p>{formik.errors.tags}</p>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="product File">Productimage</Label>
              <Input
                type="file"
                name="file"
                onChange={(event) => {
                  formik.setFieldValue("file", event.currentTarget.files[0]);
                }}
              />
              <FormText color="muted">
                รองรับเฉพาะไฟล์ภาพ และขนาดไม่เกิน 2mb
              </FormText>
              {formik.errors.file && formik.touched.file && (
                <p>{formik.errors.file}</p>
              )}
              {progress != 0 && (
                <Progress value={progress} max="100" animated>
                  {progress} %
                </Progress>
              )}
            </FormGroup>
            <Button>add</Button>
          </Form>
        </>
      )}
    </Container>
  );
}

export default AddProductForm;

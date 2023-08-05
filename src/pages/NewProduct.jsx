import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

function NewProduct() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState(0);
  const [images, setImages] = useState(null);
  const [imgUrls, setImgUrls] = useState("");

  //   * image urls seperated by , spilts into array
  const handleInputChange = (e) => {
    const value = e.target.value;
    setImgUrls(value);
    setImages(value.split(",").map((item) => item.trim()));
  };

  //   * uploading images => firebase =>images
  const handleFileUpload = (event) => {
    const selectedFiles = event.target.files;

    if (selectedFiles.length > 0) {
      const storageRef = firebase.storage().ref();

      const uploadPromises = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const selectedFile = selectedFiles[i];
        const fileRef = storageRef.child(selectedFile.name);

        uploadPromises.push(fileRef.put(selectedFile));
      }

      Promise.all(uploadPromises)
        .then((snapshots) => {
          const downloadURLs = [];

          for (let i = 0; i < snapshots.length; i++) {
            const snapshot = snapshots[i];
            downloadURLs.push(snapshot.ref.getDownloadURL());
          }

          return Promise.all(downloadURLs);
        })
        .then((downloadURLs) => {
          console.log(downloadURLs);
          setImages(downloadURLs);
        })
        .catch((error) => {
          console.error("Error occurred during file upload:", error);
        });
    } else {
      console.log("No files selected. Please select one or more files!");
    }
  };

  //   * function to add the product to the db
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("${process.env.REACT_APP_BASE_URL}/NewProduct", {
      method: "POST",
      body: JSON.stringify({
        uid: user.uid,
        title,
        description,
        price,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("product added");
        const productId = data.product._id;

        // * add images if they exist
        if (images) {
          console.log("into fetching");
          fetch("${process.env.REACT_APP_BASE_URL}/addImages", {
            method: "POST",
            body: JSON.stringify({
              uid: user.uid,
              productId,
              images,
            }),
            headers: {
              "Content-type": "application/json",
            },
          })
            .then(() => {
              console.log("product has been added along with images");
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
  }, [user, loading]);

  return (
    <div>
      <form
        method="POST"
        className="flex flex-col p-5 space-y-5"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="title"
          className="outline-none bg-[white] text-black p-3 rounded border-2 border-gray-700 font-semibold"
          value={title}
          onChange={(e) => settitle(e.target.value)}
        />
        <textarea
          rows={5}
          type="text"
          placeholder="description"
          className="outline-none bg-[white] text-black p-3 rounded border-2 border-gray-700 font-semibold"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
        />
        <div className="space-x-2 items-center">
          <span>$</span>
          <input
            type="number"
            className="outline-none bg-[white] text-black p-3 rounded border-2 border-gray-700 font-semibold"
            placeholder="price $"
            value={price}
            onChange={(e) => setprice(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 items-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="block text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
          />
          <h1>OR</h1>
          <input
            type="text"
            className="flex-1 outline-none bg-[white] text-black p-3 rounded border-2 border-gray-700 font-semibold"
            placeholder="add image urls seperated by ,"
            value={imgUrls}
            onChange={handleInputChange}
          />
        </div>
        <button
          type="submit"
          className="bg-orange-400 font-bold px-5 py-2 rounded-full text-white"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default NewProduct;

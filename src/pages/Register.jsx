import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../Firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

function Register() {
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setimage] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(selectedFile.name);

      fileRef.put(selectedFile).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL);
          setimage(downloadURL);
        });
      });
    } else {
      console.log("No file Selected, soo select one!");
    }
  };

  const register = () => {
    registerWithEmailAndPassword(name, email, password, image);
    navigate("/dashboard");
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="flex h-[calc(100vh-80px)] w-screen justify-center items-center">
      <div className="flex flex-col space-y-3 bg-white p-10 rounded">
        <div className="flex space-x-2 items-center mb-2">
          <p className="font-semibold">Profile Picture : </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
          />
        </div>
        <input
          type="text"
          className="outline-none bg-[white] text-black p-3 rounded border-2 border-gray-700 font-semibold"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          className="outline-none bg-[white] text-black p-3 rounded border-2 border-gray-700 font-semibold"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="outline-none bg-[white] text-black p-3 rounded border-2 border-gray-700 font-semibold"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="bg-orange-400 font-bold px-5 py-2 rounded-full text-white"
          onClick={register}
        >
          Register
        </button>
        <button onClick={signInWithGoogle}>
          <div className="border-2 bg-white border-gray-700 font-semibold px-5 py-2 rounded-full flex space-x-2 items-center justify-center">
            <p>Register with Google</p>
            <img
              className="h-5 w-5"
              src="https://www.transparentpng.com/thumb/google-logo/google-logo-png-icon-free-download-SUF63j.png"
              alt=""
            />
          </div>
        </button>
        <div style={{ marginTop: "20px" }} className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline text-blue-500">
            Login
          </Link>{" "}
          now.
        </div>
      </div>
    </div>
  );
}

export default Register;

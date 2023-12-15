import React, { useState } from "react";
import toast from "react-hot-toast";

import { database } from "../config/firebaseConfig";
import { push, ref, set } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Generar un nuevo ID de usuario
      const userId = push(ref(database, "Users")).key;

      // Almacenar los datos del usuario en la base de datos
      await set(ref(database, "Users/" + userId), {
        email: mail,
        password: password,
        token: userId + "-token",
      });

      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while registering");
    }
  };

  return (
    <div className="bg-primary-dark min-h-screen flex justify-center items-center">
      <form
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="email" className="text-sm text-slate-400">
            Email{" "}
          </label>

          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            onChange={(e) => setMail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm text-slate-400">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>
        <div>
          <label htmlFor="confirmPass" className="text-sm text-slate-400">
            Confirm Password
          </label>
          <input
            id="confirmPass"
            type="password"
            placeholder="Enter your password again"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>
        <input
          type="submit"
          value="Register"
          className="w-full bg-primary text-white p-2 rounded mt-4 cursor-pointer hover:bg-primary-hover"
        />
        <p className="text-sm mt-2">
          Already have an account?{" "}
          <Link className="text-primary hover:text-primary-hover" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;

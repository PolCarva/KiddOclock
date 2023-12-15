import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { database } from "../config/firebaseConfig";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Consulta la base de datos para encontrar el usuario por email
      const userQuery = query(
        ref(database, "Users"),
        orderByChild("email"),
        equalTo(email)
      );
      const snapshot = await get(userQuery);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userId = Object.keys(userData)[0];
        const user = userData[userId];

        // Aquí deberías verificar la contraseña. En este ejemplo, se compara directamente, pero deberías usar un método más seguro como comparar hashes.
        if (user.password === password) {
          localStorage.setItem("token", JSON.stringify(user.token));
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("Logged in successfully");
          navigate("/"); // Redireccionar al usuario a la página de inicio o dashboard
        } else {
          throw new Error("Invalid password");
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
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
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
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
        <input
          type="submit"
          value="Login"
          className="w-full bg-primary text-white p-2 rounded mt-4 cursor-pointer hover:bg-primary-hover"
        />
        <p className="text-sm mt-2">
          Don't have an account?{" "}
          <Link
            className="text-primary hover:text-primary-hover"
            to="/register"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

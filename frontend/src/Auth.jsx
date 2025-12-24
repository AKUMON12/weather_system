import { useState } from "react";
import axios from "axios";

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/login" : "/api/register";

    try {
      const res = await axios.post(`${API_URL}${endpoint}`, formData);
      if (isLogin) {
        localStorage.setItem("token", res.data.token); // Save token
        onLoginSuccess(res.data.user);
      } else {
        setMsg("Registered! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Error occurred");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-80">
      <h2 className="text-xl font-bold mb-4">
        {isLogin ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {!isLogin && (
          <input
            className="border p-2 rounded"
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        )}
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {isLogin ? "Sign In" : "Sign Up"}
        </button>
      </form>
      <p
        className="mt-4 text-sm text-blue-500 cursor-pointer"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Need an account? Register" : "Have an account? Login"}
      </p>
      {msg && <p className="mt-2 text-red-500 text-xs">{msg}</p>}
    </div>
  );
};

export default Auth;

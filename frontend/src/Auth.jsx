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
    <div className="glass-card p-10 rounded-[2.5rem] w-full max-w-md fade-up text-white">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-slate-400 text-sm">
          Access real-time weather data anywhere.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
          <input
            className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500/50 transition"
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        )}
        <input
          className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500/50 transition"
          type="email"
          placeholder="Email Address"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500/50 transition"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <button className="neon-button py-4 rounded-2xl font-bold text-white mt-4 shadow-lg">
          {isLogin ? "SIGN IN" : "GET STARTED"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-400">
        {isLogin ? "Don't have an account?" : "Already a member?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="ml-2 text-blue-400 font-bold hover:underline"
        >
          {isLogin ? "Register now" : "Login here"}
        </button>
      </p>
      {msg && (
        <p className="mt-4 text-red-400 text-center text-xs bg-red-500/10 py-2 rounded-lg">
          {msg}
        </p>
      )}
    </div>
  );
};

export default Auth;

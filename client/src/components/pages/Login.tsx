"use client";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const [login, { data, isSuccess }] = useLoginMutation();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("✅ Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1100); // give toast a moment to show
    }
  }, [isSuccess, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(form).unwrap();
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.data.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="dark:bg-gray-800 bg-white p-8 rounded shadow-md flex flex-col gap-4 min-w-[450px]"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-slate-400 p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-slate-400 p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <span>
          Don't have an account? <Link href="/register">Register</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;

"use client";

import {
  useRegisterMutation,
  useLoginMutation,
} from "@/redux/features/auth/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Register = () => {
  const [register, { data, isSuccess }] = useRegisterMutation();
  const [login] = useLoginMutation();

  const router = useRouter();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isSuccess) {
      const loginData = { email: form.email, password: form.password };
      login(loginData);
      toast.success("Account created successfully");

      // Redirect or show success message
      router.push("/");
    }
  }, [isSuccess, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(form).unwrap();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="dark:bg-gray-800 bg-white p-8 rounded border shadow-md flex flex-col gap-4 min-w-[450px]"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input
          type="text"
          name="userName"
          placeholder="Name"
          value={form.userName}
          onChange={handleChange}
          className="border border-slate-400 p-2 rounded"
          required
        />
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
          Register
        </button>

        <span>
          Already have an account? <Link href="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;

"use client";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const [login, { data, isSuccess }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // input handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("✅ Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, [isSuccess, data]);

  // hndler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(form).unwrap();
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.data.message);
    }
  };

  //guest login

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const guestData = { email: "johndoe@gmail.com", password: "john" };
    setForm(guestData);

    try {
      await login(guestData).unwrap();
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="dark:bg-gray-800 bg-white p-8 rounded-xl shadow-lg flex flex-col gap- w-full max-w-md border border-gray-200 dark:border-gray-700"
      >
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-3">
            Login to start chatting with your friends
          </p>
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="email"
              className="block text-md pl-1 font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
          </div>

          <div className="flex flex-col space-y-1 ">
            <label
              htmlFor="password"
              className="block text-md pl-1 font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {/* Main Login Button */}
          <div className="mt-2 flex flex-col gap-y-3 ">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold shadow-md transition-colors duration-200 cursor-pointer"
            >
              Login
            </button>

            {/* Guest Login Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
            >
              Login as Guest
            </button>
          </div>
        </div>

        <span className="text-sm text-center text-gray-600 dark:text-gray-300 pt-3">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Register
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;

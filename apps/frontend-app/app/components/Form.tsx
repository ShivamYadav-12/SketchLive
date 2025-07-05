"use client";

import { useState } from "react";
import { Mail, Eye, EyeOff, User } from "lucide-react";

const Form = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-6 w-[320px]">

      <div className="relative w-full">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="peer pl-10 pt-4 pb-1 w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg outline-none transition-all placeholder-transparent"
        />
        <label
          htmlFor="name"
          className="absolute left-10 top-2 text-gray-500 text-sm transition-all 
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500"
        >
          Name
        </label>
      </div>

      {/* Email Input */}
      <div className="relative w-full">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="peer pl-10 pt-4 pb-1 w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg outline-none transition-all placeholder-transparent"
        />
        <label
          htmlFor="email"
          className="absolute left-10 top-2 text-gray-500 text-sm transition-all 
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500"
        >
          Email
        </label>
      </div>

      {/* Password Input */}
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="peer pr-10 pt-4 pb-1 w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg outline-none transition-all placeholder-transparent pl-3"
        />
        <label
          htmlFor="password"
          className="absolute left-3 top-2 text-gray-500 text-sm transition-all 
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500"
        >
          Password
        </label>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Form;

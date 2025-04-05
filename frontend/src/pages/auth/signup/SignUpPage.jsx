import { Link } from "react-router-dom";
import { useState } from "react";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div 
      className="min-h-screen w-screen flex items-center justify-center p-4"
	  style={{
        background: `linear-gradient(135deg, 
          rgba(59, 30, 84, 0.9) 0%, 
          rgba(155, 126, 189, 0.9) 50%, 
          rgba(183, 130, 228, 0.9) 100%)`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Floating Glass Morphism Card */}
      <div 
        className="w-full max-w-2xl backdrop-blur-md bg-white/10 border-2 border-white/20 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Decorative Top Bar */}
        <div className="h-2 bg-gradient-to-r from-[#3B1E54] to-[#9B7EBD] "></div>
        
        <div className="p-8">
          {/* Animated Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <XSvg 
                className="w-24 h-24 fill-white drop-shadow-lg" 
              />
              <div className="absolute -inset-4 rounded-full border-2 border-white/30 animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Join Our Community
          </h1>
          <p className="text-center text-white/80 mb-8">
            Create your account to get started
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative group">
              <input
                type="email"
                className="w-full px-4 py-3 pl-12 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-[#3B1E54] text-white placeholder-white/60 transition-all duration-300"
                placeholder="Email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
              />
              <MdOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 group-focus-within:text-[#3B1E54] transition-colors duration-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <input
                  type="text"
                  className="w-full px-4 py-3 pl-12 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-[#3B1E54] text-white placeholder-white/60 transition-all duration-300"
                  placeholder="Username"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                />
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 group-focus-within:text-[#3B1E54] transition-colors duration-300" />
              </div>

              <div className="relative group">
                <input
                  type="text"
                  className="w-full px-4 py-3 pl-12 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-[#3B1E54] text-white placeholder-white/60 transition-all duration-300"
                  placeholder="Full Name"
                  name="fullName"
                  onChange={handleInputChange}
                  value={formData.fullName}
                />
                <MdDriveFileRenameOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 group-focus-within:text-[#3B1E54] transition-colors duration-300" />
              </div>
            </div>

            <div className="relative group">
              <input
                type="password"
                className="w-full px-4 py-3 pl-12 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-[#3B1E54] text-white placeholder-white/60 transition-all duration-300"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
              />
              <MdPassword className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 group-focus-within:text-[#3B1E54] transition-colors duration-300" />
            </div>

            <button
              className="w-full py-3 px-4 bg-gradient-to-r from-[#3B1E54] to-[#9B7EBD] hover:from-[#3B1E54]/90 hover:to-[#9B7EBD]/90 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-[#3B1E54]/40 flex items-center justify-center"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            {isError && (
              <div className="p-3 bg-red-500/20 text-red-100 rounded-lg text-sm border border-red-400/30">
                {error.message}
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/80">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="font-semibold text-white hover:underline transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
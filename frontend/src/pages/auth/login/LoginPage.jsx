import { useState } from "react";
import { Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
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
        className="w-full max-w-md backdrop-blur-md bg-white/10 border-2 border-white/20 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Decorative Top Bar */}
        <div className="h-2 bg-gradient-to-r from-[#3B1E54] to-[#9B7EBD]"></div>
        
        <div className="p-8">
          {/* Animated Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <XSvg 
                className="w-24 h-24 fill-white drop-shadow-lg" 
              />
              <div className="absolute -inset-4 rounded-full border-2 border-white/30 animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-white/80 mb-8">
            Sign in to continue your journey
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type="text"
                  className="w-full px-4 py-3 pl-12 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-[#3B1E54] text-white placeholder-white/60 transition-all duration-300"
                  placeholder="Username"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                />
                <MdOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 group-focus-within:text-[#3B1E54] transition-colors duration-300" />
              </div>
            </div>

            <div className="space-y-2">
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
              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-white/70 hover:text-white hover:underline transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              className="w-full py-3 px-4 bg-gradient-to-r from-[#3B1E54] to-[#9B7EBD] hover:from-[#3B1E54]/90 hover:to-[#9B7EBD]/90 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-[#3B1E54]/40 flex items-center justify-center"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
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
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="font-semibold text-white hover:underline transition-colors duration-200"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
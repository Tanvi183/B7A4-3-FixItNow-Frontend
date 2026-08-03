"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to login");

      document.cookie = `accessToken=${result.data.accessToken}; path=/; max-age=86400`;
      if (result.data.refreshToken) {
        document.cookie = `refreshToken=${result.data.refreshToken}; path=/; max-age=604800`;
      }

      const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${result.data.accessToken}` },
      });
      const profileData = await profileRes.json();

      if (profileData.success) {
        setUser(profileData.data);
        toast.success(`Welcome back, ${profileData.data.name}!`);
        const role = profileData.data.role;
        if (role === "ADMIN") router.push("/dashboard/admin");
        else if (role === "TECHNICIAN") router.push("/dashboard/technician");
        else router.push("/dashboard/customer");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="auth-form-header">
        <h1 className="auth-form-title">Welcome back</h1>
        <p className="auth-form-subtitle">Sign in to your FixItNow account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>

        {/* Email */}
        <div className="auth-field">
          <label className="auth-label" htmlFor="login-email">Email address</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><Mail size={16} /></span>
            <input
              id="login-email"
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`auth-input ${errors.email ? "auth-input-error" : ""}`}
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="auth-error-msg">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="auth-field">
          <label className="auth-label" htmlFor="login-password">Password</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><Lock size={16} /></span>
            <input
              id="login-password"
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`auth-input auth-input-pr ${errors.password ? "auth-input-error" : ""}`}
              disabled={isLoading}
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="auth-error-msg">{errors.password.message}</p>}
        </div>

        {/* Submit */}
        <button
          id="login-submit-btn"
          type="submit"
          disabled={isLoading}
          className="auth-submit-btn"
        >
          {isLoading ? (
            <><Loader2 className="auth-spinner" /> Signing in…</>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="auth-divider">
        <span className="auth-divider-line" />
        <span className="auth-divider-text">New to FixItNow?</span>
        <span className="auth-divider-line" />
      </div>

      {/* Footer */}
      <Link href="/register" className="auth-alt-btn">
        Create a free account
      </Link>
    </>
  );
}

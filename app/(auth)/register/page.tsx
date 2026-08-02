"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { Loader2, Mail, Lock, User, Eye, EyeOff, UserCircle2, Wrench } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["CUSTOMER", "TECHNICIAN"], {
    message: "Please select an account type.",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CUSTOMER" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to register");
      toast.success("Account created! Please sign in.");
      router.push("/login");
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
        <h1 className="auth-form-title">Create an account</h1>
        <p className="auth-form-subtitle">Join thousands of happy customers & technicians</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>

        {/* Role Selection */}
        <div className="auth-field">
          <label className="auth-label">I want to join as a…</label>
          <div className="auth-role-grid">
            <button
              type="button"
              className={`auth-role-card ${selectedRole === "CUSTOMER" ? "active" : ""}`}
              onClick={() => setValue("role", "CUSTOMER")}
            >
              <div className="auth-role-card-icon">
                <UserCircle2 size={20} />
              </div>
              <p className="auth-role-card-title">Customer</p>
              <p className="auth-role-card-sub">Book home services</p>
            </button>
            <button
              type="button"
              className={`auth-role-card ${selectedRole === "TECHNICIAN" ? "active" : ""}`}
              onClick={() => setValue("role", "TECHNICIAN")}
            >
              <div className="auth-role-card-icon">
                <Wrench size={20} />
              </div>
              <p className="auth-role-card-title">Technician</p>
              <p className="auth-role-card-sub">Offer your services</p>
            </button>
          </div>
          {errors.role && <p className="auth-error-msg">{errors.role.message}</p>}
        </div>

        {/* Name */}
        <div className="auth-field">
          <label className="auth-label" htmlFor="reg-name">Full name</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><User size={16} /></span>
            <input
              id="reg-name"
              {...register("name")}
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              className={`auth-input ${errors.name ? "auth-input-error" : ""}`}
              disabled={isLoading}
            />
          </div>
          {errors.name && <p className="auth-error-msg">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="auth-field">
          <label className="auth-label" htmlFor="reg-email">Email address</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><Mail size={16} /></span>
            <input
              id="reg-email"
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
          <label className="auth-label" htmlFor="reg-password">Password</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><Lock size={16} /></span>
            <input
              id="reg-password"
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 6 characters"
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

        <button
          id="register-submit-btn"
          type="submit"
          disabled={isLoading}
          className="auth-submit-btn"
        >
          {isLoading ? <><Loader2 className="auth-spinner" /> Creating account…</> : "Create Account"}
        </button>
      </form>

      <div className="auth-divider">
        <span className="auth-divider-line" />
        <span className="auth-divider-text">Already have an account?</span>
        <span className="auth-divider-line" />
      </div>

      <Link href="/login" className="auth-alt-btn">
        Sign in instead
      </Link>
    </>
  );
}

'use client'
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Loader2 } from "lucide-react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import authQuery from "@/api/auth.query";
import { toast } from 'sonner'
const validateEmail = (email: string) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focused, setFocused] = useState<"email" | "password" | null>(null);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [submitted, setSubmitted] = useState(false);

    // Instead of useRouter (which uses context that may not update in time in onSuccess),
    // use global 'window.location' for hard navigation, which always works after login.


    const validateFields = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = "Email address is required";
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleLoginMutation = useMutation({
        mutationFn: (body: { email: string, password: string }) => authQuery.login(body),
        onSuccess: (data) => {
            // Use window.location for navigation after login to ensure page refresh.
            toast.success('Login successful');
            window.location.href = '/';
        },
        onError: (error) => {
            console.log("Login failed", error);
        }
    })

    const handleLogin = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setSubmitted(true);
        if (validateFields()) {
            // Proceed with login
            handleLoginMutation.mutate({ email, password });
        }
    };

    const handleBlur = (field: "email" | "password") => {
        setFocused(null);
        if (submitted) {
            validateFields();
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F6F3] px-4 py-8" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.06),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.06),transparent_50%),radial-gradient(#d4d4d4_1px,transparent_1px)] bg-size-[100%_100%,100%_100%,24px_24px]" />
            <div className="relative w-full max-w-105 space-y-6">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="flex  shrink-0 items-center justify-center ">
                        <Image src={'/assets/logo.png'} alt="Veymor Mail" width={1000} height={1000} className="w-20 " />
                    </div>
                    <span className="text-xl tracking-[-0.3px] text-zinc-900">
                        Veymor Mail
                    </span>
                </div>

                <form
                    className="rounded-[20px]  bg-gray-50 p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.01)]"
                    onSubmit={handleLogin}
                    noValidate
                >
                    <div className="mb-7">
                        <h1 className="mb-1.5 text-[26px] leading-[1.2] tracking-[-0.5px] font-semibold text-zinc-900">
                            Welcome back
                        </h1>
                        <p className="text-sm leading-relaxed text-zinc-500">
                            Enter your credentials to access your inbox.
                        </p>
                    </div>

                    {/* Inputs */}
                    <div className="mb-5 space-y-3.5">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-[13px] font-medium text-zinc-700">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail
                                    className={`pointer-events-none absolute left-3.25 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${focused === "email" ? "text-indigo-500" : "text-zinc-400"
                                        }`}
                                />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="you@veymor.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email && submitted) {
                                            setErrors({ ...errors, email: undefined });
                                        }
                                    }}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => handleBlur("email")}
                                    className={`w-full rounded-xl border ${errors.email ? "border-red-400" : "border-zinc-200"} bg-zinc-50 py-2.75 pl-10 pr-3.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 hover:bg-zinc-50/80 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100`}
                                    style={{ fontFamily: "inherit" }}
                                />
                            </div>
                            {errors.email && (
                                <span className="text-xs text-red-500 font-medium pl-1 pt-1 block">{errors.email}</span>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-[13px] font-medium text-zinc-700">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="text-[12.5px] font-medium text-indigo-500 transition-colors hover:text-indigo-600"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock
                                    className={`pointer-events-none absolute left-3.25 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${focused === "password" ? "text-indigo-500" : "text-zinc-400"
                                        }`}
                                />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password && submitted) {
                                            setErrors({ ...errors, password: undefined });
                                        }
                                    }}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => handleBlur("password")}
                                    className={`w-full rounded-xl border ${errors.password ? "border-red-400" : "border-zinc-200"} bg-zinc-50 py-2.75 pl-10 pr-11 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 hover:bg-zinc-50/80 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100`}
                                    style={{ fontFamily: "inherit" }}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-zinc-400 transition-colors hover:bg-indigo-100 hover:text-indigo-500"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="text-xs text-red-500 font-medium pl-1 pt-1 block">{errors.password}</span>
                            )}
                        </div>
                    </div>
                    {/* Submit button and link */}
                    <button
                        type="submit"
                        disabled={handleLoginMutation.isPending}
                        className="group mb-5 cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-all duration-700  hover:bg-zinc-950 hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)] active:translate-y-0 active:shadow-none "
                    >
                        {handleLoginMutation.isPending ? <Loader2 className="animate-spin" /> : (
                            <span className="flex items-center gap-2">Sign in   <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
                        )}

                    </button>


                    {/* Google login button below inputs */}
                    <div className="mb-6 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-zinc-100" />
                            <span className="text-[11.5px] font-medium uppercase tracking-[0.04em] text-zinc-400">
                                or
                            </span>
                            <div className="h-px flex-1 bg-zinc-100" />
                        </div>
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.75 text-sm font-medium text-zinc-900 transition-all duration-150 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-100 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:translate-y-0 active:shadow-none"
                        >
                            <Image src={'/assets/googlelogo.png'} alt="Google" width={18} height={18} />
                            Continue with Google
                        </button>
                    </div>

                    <p className="text-center text-[13.5px] text-zinc-500">
                        Don&apos;t have an account?{" "}
                        <a href="/auth/register" className="font-medium text-indigo-500 transition-colors hover:text-indigo-600">
                            Create one
                        </a>
                    </p>
                </form>

                <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                    <Shield size={12} />
                    <span>Secured with 256-bit encryption</span>
                </div>
            </div>
        </main>
    );
};

export default Login;
import { useState } from "react";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUsers from "../../../hook/use-user";
import {
  loginSchema,
  type LoginFormValues,
} from "../../../schemas/auth.schema";
import { useTheme } from "../../../hooks/useTheme";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { LoginUser } = useUsers();
  const { mode, toggleMode } = useTheme();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submitForm = (values: LoginFormValues) => {
    LoginUser.mutate(values, { onSuccess: () => reset() });
  };

  return (
    <div className="login-page relative flex min-h-dvh items-center justify-center px-4 py-8">
      <button
        type="button"
        onClick={toggleMode}
        aria-label={
          mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        className="app-icon-button absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full shadow-sm"
      >
        {mode === "dark" ? <Sun size={19} /> : <Moon size={19} />}
      </button>
      {/* The card shadow adds lift in light mode; its border defines the surface in dark mode. */}
      <div className="login-card w-full max-w-md rounded-2xl p-6 shadow-xl dark:shadow-none sm:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Welcome Back 👋
        </h1>
        <form
          onSubmit={handleSubmit(submitForm)}
          className="space-y-6"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="app-input w-full px-3 py-2 shadow-sm"
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className="app-input w-full px-3 py-2 pr-12 shadow-sm"
                {...register("password")}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="app-icon-button absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={LoginUser.isPending}
            className="app-button-primary w-full"
          >
            {LoginUser.isPending ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="#" className="app-link">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

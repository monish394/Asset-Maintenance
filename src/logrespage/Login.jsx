import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/api";
import { toast } from "sonner";
import { RxCross1 } from "react-icons/rx";
import BeamsBackground from "./animationcomponent/Beambackground";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [clienterr, setClienterr] = useState("");

  const [animateCard, setAnimateCard] = useState(false);

  useEffect(() => {
    setAnimateCard(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setClienterr("");

    if (!email || !password) {
      setClienterr("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/userslogin", { email, password });

      if (res.data?.err) {
        setClienterr(res.data.err || "Invalid email or password.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      if (remember) localStorage.setItem("rememberEmail", email);

      toast.success("Logged in!", { duration: 1400 });

      setTimeout(() => {
        setLoading(false);
        const role = res.data.role;
        if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "user") navigate("/user", { replace: true });
        else if (role === "technician") navigate("/technician/home", { replace: true });
        else navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (err) {
      console.error(err);
      setClienterr("Invalid email or password.");
      toast.error("Login failed", { duration: 1400 });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-50 px-4 py-12 relative">
      <BeamsBackground />

      <Card
        className={`
          relative z-10 w-full max-w-md bg-white/80 border border-gray-200 shadow-2xl rounded-2xl
          transition-all duration-700 ease-out
          transform ${animateCard ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-20"}
        `}
      >
        <button
          onClick={() => navigate("/home")}
          className="absolute top-4 right-4 text-black hover:text-gray-700 transition"
        >
          <RxCross1 size={20} />
        </button>

        <CardHeader className="text-center py-6">
          <CardTitle className="text-xl">Welcome Back</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Sign in to manage your assets and service requests
          </CardDescription>
        </CardHeader>

        {clienterr && (
          <div className="mx-6 mb-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {clienterr}
          </div>
        )}

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1"
                autoComplete="email"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600"
              />
              Remember me
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 items-center py-6">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:underline">
              Create one
            </a>
          </p>

          <div className="w-full border-t border-gray-100 pt-4 text-sm text-gray-500">
            By continuing you agree to our{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Terms
            </a>{" "}
            &{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Privacy
            </a>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

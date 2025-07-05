
// LoginForm.jsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/magicui/border-beam";

import { useState } from "react";
import { login, oAuth } from "../../AppWrite/appwriteFunction";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/AppWrite/AuthContext";


function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const { refreshUser } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loginUser = await login(email, password);
      if (loginUser) {
        refreshUser()
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("Login failed", err);
      const appwriteMessage = err?.response?.message || err?.message || "Invalid credentials";
      setError(appwriteMessage);
    } finally {
      setLoading(false);
    }
  };

const handleOAuth = async () => {
    setOauthLoading(true);
    setError('');
    try {
        console.log('Starting OAuth flow...');
        await oAuth();
        // OAuth will redirect, so this won't execute
    } catch (error) {
        console.error("OAuth failed:", error);
        
        // Handle specific OAuth errors
        if (error.code === 409) {
            setError("An account with this email already exists. Please use email/password login.");
        } else if (error.message.includes('unauthorized')) {
            setError("OAuth not properly configured. Please contact support.");
        } else {
            setError("Google login failed. Please try again.");
        }
    } finally {
        setOauthLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dark Base Background */}
      <div className="absolute inset-0 bg-[#0d0d0d] z-0" />

      {/* Dotted Background */}
      <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px] opacity-20 z-0" />

      {/* Login Card with BorderBeam */}
      <Card
        className={cn(
          "w-full max-w-md relative z-10 bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 shadow-2xl shadow-orange-500/10 overflow-hidden group",
          className
        )}
        {...props}
      >
        <div className="relative z-10">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-3xl font-extrabold text-gray-200">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-lg font-semibold text-[#f97316]">
              Xcraft
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-800/80 text-white border border-neutral-700 placeholder:text-gray-500 focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base text-gray-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Your Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-neutral-800/80 text-white border border-neutral-700 placeholder:text-gray-500 focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
                />
                <div className="flex justify-end">
                  <Link
                    to="/reset-password"
                    className="text-sm text-[#fb923c] hover:text-[#fdba74] underline-offset-4 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg text-sm animate-in fade-in slide-in-from-top">
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-bold shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-neutral-900/60 px-2 text-gray-400 backdrop-blur-sm">
                    Or continue with
                  </span>
                </div>
              </div>
              
             <Button
            variant="outline"
            className="w-full border-neutral-700 text-gray-300 bg-transparent hover:bg-neutral-800 hover:text-white transition-all"
            type="button"
            onClick={handleOAuth}
            disabled={oauthLoading}
        >
            {oauthLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to Google...
                </>
            ) : (
                "Login with Google"
            )}
        </Button>
              <div className="text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#f97316] hover:text-[#fdba74] underline-offset-4 hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </div>

        {/* BorderBeam Effects */}
        <BorderBeam
          duration={8}
          size={400}
          className="from-transparent via-[#f97316] to-transparent"
        />
        <BorderBeam
          duration={8}
          delay={4}
          size={400}
          borderWidth={2}
          className="from-transparent via-[#ea580c] to-transparent"
        />
      </Card>
    </div>
  );
}

export default LoginForm;
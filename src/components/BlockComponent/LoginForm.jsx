import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useState } from "react"
import { login } from "../../AppWrite/appwriteFunction"
import { Link } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

function LoginForm({className, ...props}) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async(e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const loginUser = await login(email, password);
      if(loginUser){
        setError('')
        navigate("/dashboard")
      }
      return loginUser
    } catch (err) {
  console.log("Login failed", err);
  console.log("Error details:", JSON.stringify(err, null, 2));
  const appwriteMessage = err?.response?.message || err?.message || "Invalid credentials";
  setError(appwriteMessage);
}finally{
  setLoading(false)
}
  }

return (
    <div
      className={cn(
        "flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 p-4",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-gray-100 backdrop-blur-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-extrabold text-indigo-700">Welcome Back</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Access your account by entering your email and password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-base text-gray-800">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-base text-gray-800">
                    Password
                  </Label>
                  <a
                    href="#"
                    className="ml-auto text-sm text-indigo-600 hover:text-indigo-800 underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Your Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm animate-in fade-in slide-in-from-top shadow">
                  <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-lg transition-all"
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

              <Button
                variant="outline"
                className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition-all"
                type="button"
              >
                Login with Google
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-700">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="underline text-indigo-600 hover:text-indigo-800"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
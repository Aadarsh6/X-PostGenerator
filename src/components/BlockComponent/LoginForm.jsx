import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BorderBeam } from "@/components/magicui/border-beam";
import { useState } from "react"
import { Link } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { api } from "@/services/api"
import { useAuthStore } from "@/store/authStore"

function LoginForm({ className, ...props }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    
    const navigate = useNavigate()
    const { setAuth } = useAuthStore()

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    
    const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const trimmedEmail = email.trim()
    if (!isValidEmail(trimmedEmail)) {
        setError("Please enter a valid email address.")
        setLoading(false)
        return
    }

    try {
        const result = await api.login(trimmedEmail, password)
        console.log("LOGIN RESULT:", result)
        setAuth(result.token, { id: result.id, name: result.name, email: result.email,  createdAt: result.createdAt, })
        setSuccess("🎉 Login successful")
        navigate("/dashboard")
        console.log("LOGIN RESULT:", result) 
    } catch (err) {
        if (err.message.includes('Invalid') || err.message.includes('credentials')) {
            setError("Invalid email or password.")
        } else {
            setError(err.message || "Login failed. Please try again.")
        }
    } finally {
        setLoading(false)
    }
}

    // const handleOAuth = async () => {
    //     setOauthLoading(true);
    //     setError('');
    //     try {
    //         console.log('Starting OAuth flow...');
    //         sessionStorage.setItem('signupMethod', 'oauth');
    //         const oauthUrl = `${conf.apiBaseUrl}/api/oauth/google`;
    //         window.location.href = oauthUrl;
    //     } catch (error) {
    //         console.error("OAuth failed:", error);
    //         sessionStorage.removeItem('signupMethod');
    //         setError("Google login failed. Please try again.");
    //         setOauthLoading(false);
    //     }
    // };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#0d0d0d] z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px] opacity-20 z-0" />

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
                            Sign in to Xcraft
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
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
                                        placeholder="********"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-neutral-800/80 text-white border border-neutral-700 placeholder:text-gray-500 focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
                                    />
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

                            {success && (
                                <div className="p-3 bg-green-900/20 border border-green-500/30 text-green-400 rounded-lg text-sm animate-in fade-in slide-in-from-top">
                                    <div className="flex items-center">
                                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0 animate-pulse" />
                                        <span>{success}</span>
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
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
{/* 
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-neutral-700" />
                                </div> */}
                                {/* <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-neutral-900/60 px-2 text-gray-400 backdrop-blur-sm">
                                        Or continue with
                                    </span>
                                </div> */}
                            {/* </div> */}

                            {/* <Button
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
                                    "Sign in with Google"
                                )}
                            </Button> */}

                            <div className="text-center text-sm text-gray-400">
                                Don't have an account?{" "}
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
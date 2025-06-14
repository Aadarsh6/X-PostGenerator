import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createAccount, login } from "../../AppWrite/appwriteFunction"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

function SignUpForm({className, ...props}) {

    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    
    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        const trimmedEmail = email.trim()
        
        if (!isValidEmail(trimmedEmail)) {
            setError("Please enter a valid email address.");
            setLoading(false);
                return;
  }

        try {
            const newAccount = await createAccount(name, trimmedEmail, password)
            if(newAccount){
                console.log("Creating account with:", { name, email, password });
                await login(trimmedEmail, password)
                setSuccess("🎉 Account Created successfully")
                navigate("/dashboard")
            }

            setSuccess("🎉Account Created Successfully")   //!need to remove 
        } catch (err) {
            console.log("Cant Sign Up", err)
            setError(err.message || "Cant Sign Up")
        }finally{
            setLoading(false)
        }
    }
 return (
    <div
      className={cn(
        "flex items-center justify-center min-h-screen bg-[#191a1a] p-4",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md p-8 shadow-2xl rounded-3xl border border-[#27272a] backdrop-blur-md bg-[#1a1a1a]">
        <CardHeader className="text-center space-y-2">
         <CardTitle className="text-3xl font-extrabold bg-gray-200 text-transparent bg-clip-text">Create an Account</CardTitle>
          <CardDescription className="text-sm text-gray-400">
            Enter your details below to join the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="name" className="text-base text-[#dbdce0] mb-2">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 bg-[#292524] text-[#dbdce0] border border-[#44403c] placeholder:text-gray-500 focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"/>
              </div>

              <div>
                <Label htmlFor="email" className="text-base text-[#dbdce0] mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-[#292524] text-[#dbdce0] border border-[#44403c] placeholder:text-gray-500 focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"/>
              </div>

              <div>
                <Label htmlFor="password" className="text-base text-[#dbdce0] mb-2">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 bg-[#292524] text-[#dbdce0] border border-[#44403c] placeholder:text-gray-500 focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"/>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm animate-in slide-in-from-top shadow">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 text-[#20b8cd] rounded-lg text-sm animate-in slide-in-from-top shadow">
  <span className="inline-block w-2 h-2 bg-[#20b8cd] rounded-full mr-2 animate-pulse"></span>

                {success}
              </div>
            )}

            <Button
              type="submit"
                className="w-full flex items-center justify-center bg-[#f97316] hover:bg-[#ea580c] text-[#dbdce0] shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>


            <div className="relative text-center text-sm text-muted-foreground my-6 flex items-center">
  <div className="flex-grow border-t border-border"></div>
  <span className="mx-3 bg-[#1a1a1a] text-gray-300 px-2 relative z-10">
    Or Continue with
  </span>
  <div className="flex-grow border-t border-border"></div>
</div>

            <Button
  variant="outline"
   className="w-full border-[#f97316] text-[#f97316] bg-[#1a1a1a] transition-all"
  type="button"
>

              Sign Up with Google
            </Button>

            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account? {" "}  {/* //this is just to add a white space */}
 
              <Link
  to="/login"
className="underline text-[#f97316] hover:text-[#fdba74]">

                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUpForm;






// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { createAccount } from "../../AppWrite/appwriteFunction"
// import { useState } from "react"
// import { Link } from "react-router-dom"
// import { Loader2 } from "lucide-react"
// import { useNavigate } from "react-router-dom"

// function SignUpForm({className, ...props}) {

    
//     const [name, setName] = useState('')
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [error, setError] = useState('')
//     const [loading, setLoading] = useState(false)
//     const [success, setSuccess] = useState('')
//     const navigate = useNavigate()

//     const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    
//     const handleSubmit = async(e) => {
//         e.preventDefault()
//         setLoading(true)
//         setError("")
//         setSuccess("")

//         const trimmedEmail = email.trim()
        
//         if (!isValidEmail(trimmedEmail)) {
//             setError("Please enter a valid email address.");
//             setLoading(false);
//                  return;
//   }

//         try {
//             const newAccount = await createAccount(name, trimmedEmail, password)
//             if(newAccount){
//                 console.log("Creating account with:", { name, email, password });
//                 navigate("/dashboard")
//             }

//             setSuccess("🎉Account Created Successfully")   //!need to remove 
//         } catch (err) {
//             console.log("Cant Sign Up", err)
//             setError(err.message || "Cant Sign Up")
//         }finally{
//             setLoading(false)
//         }
//     }
//  return (
//     <div
//       className={cn(
//         "flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 p-4",
//         className
//       )}
//       {...props}
//     >
//       <Card className="w-full max-w-md p-8 shadow-2xl rounded-3xl border-none backdrop-blur-md bg-slate-100">
//         <CardHeader className="text-center space-y-2">
//          <CardTitle className="text-4xl font-extrabold bg-gradient-to-r from-[#20b8cd] to-[#137f8f] text-transparent bg-clip-text">Create an Account</CardTitle>
//           <CardDescription className="text-sm text-gray-600">
//             Enter your details below to join the community.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="flex flex-col space-y-4">
//               <div>
//                 <Label htmlFor="name" className="text-base text-[#dbdce0]">
//                   Full Name
//                 </Label>
//                 <Input
//                   id="name"
//                   type="text"
//                   placeholder="Your Full Name"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="mt-1 focus:ring-[#20b8cd] bg-white"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="email" className="text-base text-[#dbdce0]">
//                   Email
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="you@example.com"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="mt-1 focus:ring-[#20b8cd] bg-white"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="password" className="text-base text-[#dbdce0]">
//                   Password
//                 </Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="********"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="mt-1 focus:ring-[#20b8cd] bg-white"
//                 />
//               </div>
//             </div>

//             {error && (
//               <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm animate-in slide-in-from-top shadow">
//                 <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
//                 {error}
//               </div>
//             )}

//             {success && (
//               <div className="p-3 bg-green-50 text-[#20b8cd] rounded-lg text-sm animate-in slide-in-from-top shadow">
//   <span className="inline-block w-2 h-2 bg-[#20b8cd] rounded-full mr-2 animate-pulse"></span>

//                 {success}
//               </div>
//             )}

//             <Button
//               type="submit"
//                 className="w-full flex items-center font-bold text-gray-200 justify-center bg-gradient-to-r from-[#20b8cd] to-[#137f8f] hover:from-[#1aa7bb] hover:to-[#0e6c7a] shadow-lg transition-all"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating...
//                 </>
//               ) : (
//                 "Sign Up"
//               )}
//             </Button>

//             <Button
//   variant="outline"
//   className="w-full border-[#20b8cd] text-[#20b8cd] hover:bg-[#e0f8fa] transition-all"
//   type="button"
// >

//               Sign Up with Google
//             </Button>

//             <div className="mt-4 text-center text-sm text-gray-600">
//               Already have an account?{" "}
//               <Link
//   to="/login"
//   className="underline text-[#20b8cd] hover:text-[#0e6c7a]"
// >

//                 Login
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default SignUpForm;
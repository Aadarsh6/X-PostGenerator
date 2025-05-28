import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createAccount } from "../../AppWrite/appwriteFunction"
import { useState } from "react"

function SignUpForm({className, ...props}) {

    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async() => {
        try {
            await createAccount(name, email, password)
            setError('Account Created')
        } catch (err) {
            console.log("Cant Sign Up", err)
            setError(err.message || "Cant Sign Up")
            
        }
    }

return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
    <Card>
        <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
            Enter your details below to create a new account
        </CardDescription>
        </CardHeader>
        <CardContent>
        <form
        onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-6">
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                id="name"
                type="text"
                placeholder="Enter Your Name"
                required
                value = {name}
                onChange = {(e)=>setName(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                value = {email}
                onChange = {(e)=>setEmail(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                id="password"
                type="password"
                placeholder="********"
                required
                value = {password}
                onChange = {(e)=>setPassword(e.target.value)}
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
                Sign Up
            </Button>
            <Button variant="outline" className="w-full">
                Sign Up with Google
            </Button>
            </div>
            <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="#" className="underline underline-offset-4">
                Login
            </a>
            </div>
        </form>
        </CardContent>
    </Card>
    </div>
)
}


export default SignUpForm
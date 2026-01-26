import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export default function Login() {


  const [clienterr, setClienterr] = useState("")
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const logindata = { email, password }
  const handleLogin = () => {
    axios.post("http://localhost:5000/api/userslogin", logindata)
      .then((res) => {
        if (res.data.err) {
          setClienterr("Invalid email or password!!!");
          return;
        }

        // save token and role into localstorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        setClienterr('');
        toast.success("Logged in!", { duration: 1900 });


        setTimeout(() => {
          if (res.data.role === "admin") {
            navigate("/admin", { replace: true });

          }else if(res.data.role==="user"){
            navigate("/user")
          } else if(res.data.role==="technician"){
            navigate("/technician/home")
          }
          else {
            navigate("/dashboard", { replace: true });
          }
        }, 1900);
      })
      .catch((err) => {
        toast.error("Invalid Email or Password!", { duration: 1500 });
        console.log(err);
      });
  };





  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md border border-gray-200 shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email and password
          </CardDescription>
        </CardHeader>
        {
          clienterr &&
          <p className="text-xls ml-6 text-red-500">{clienterr}</p>
        }

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="Enter Your Email"
              className="border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="space-y-1">
            <Label>Password</Label>
            <Input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Enter Password"
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button onClick={handleLogin} className="w-full border border-blue-500 bg-blue-500 hover:bg-blue-600 text-white">
            Login
          </Button>
          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-500 underline">
              Register
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

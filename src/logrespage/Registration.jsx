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
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"


import { useState } from "react"
import axios from "axios"


export default function Register() {
  const navigate=useNavigate()
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [phone,setPhone]=useState("")
  const [password,setpassword]=useState("")
  const [address,setAddress]=useState("")
  const [clienterr,setClienterr]=useState("")
  const registerData={name,email,password,phone,address}

  const handleRegister=(e)=>{
    e.preventDefault();
    axios.post(`http://localhost:5000/api/usersregister`,registerData)
    .then((res)=>{
      if(res.data){
        setClienterr("");
      }
      if(res.data.err){
        setClienterr(res.data.err)
        return;
      }
  
      toast.success("Registration successful🎉")
      setTimeout(() => {
      navigate("/");
      setName("");
      setEmail("");
      setpassword("")
      setPhone("")
      setAddress("")

        
      }, 1500);

      

      console.log("Registered: " , res.data)
  })
    .catch((err)=>{
      if(err.response){
        setClienterr(err.response.data.error.replace(/"/g, ""));

      }
      
      console.log(err.response.data)
  })


  }

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md border border-gray-200 shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Fill in your details below
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Name */}
          {
            clienterr&&
          <p className="text-red-500">{JSON.stringify(clienterr)}</p>

          }
          <div className="space-y-1">
            <Label>Name</Label>
            <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="border border-gray-300 rounded-md p-2" />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input  value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="email" className="border border-gray-300 rounded-md p-2" />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label>Password</Label>
            <Input  value={password} onChange={e=>setpassword(e.target.value)} type="password" placeholder="Password" className="border border-gray-300 rounded-md p-2" />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input  value={phone} onChange={e=>setPhone(e.target.value)} type="text" placeholder="Phone" className="border border-gray-300 rounded-md p-2" />
          </div>

          {/* Address */}
          <div className="space-y-1">
            <Label>Address</Label>
            <Input value={address} onChange={e=>setAddress(e.target.value)} type="text" placeholder="Address" className="border border-gray-300 rounded-md p-2" />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button onClick={handleRegister} className="w-full border border-blue-500 bg-blue-500 hover:bg-blue-600 text-white">
            Register
          </Button>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 underline">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

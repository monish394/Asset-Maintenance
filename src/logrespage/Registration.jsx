import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "../config/api"
import { toast } from "sonner"
import { RxCross1 } from "react-icons/rx"

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

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "user",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, Email, and Password are required.")
      return
    }

    try {
      setLoading(true)

      const response = await axios.post("/usersregister", formData)

      if (response.data?.err) {
        setError(response.data.err)
        setLoading(false)
        return
      }

      toast.success("Account created successfully")

      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          role: "user",
        })
        setLoading(false)
        navigate("/login")
      }, 1200)

    } catch (err) {
      const serverMessage =
        err?.response?.data?.error ||
        "Unable to complete registration. Please try again."
      setError(String(serverMessage).replace(/"/g, ""))
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="relative w-full max-w-lg rounded-xl shadow-md border border-gray-200">
        <button
          onClick={() => navigate("/home")}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <RxCross1 size={22} />
        </button>

        <CardHeader className="text-center space-y-1 pt-4 pb-2">
          <CardTitle className="text-lg font-semibold">Create Account</CardTitle>
          <CardDescription className="text-xs text-gray-500">
            Enter your details to register.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-2 px-6">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-2 text-xs text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="role" className="text-xs">Role</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-8 text-sm border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="user">User</option>
                <option value="technician">Technician</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="address" className="text-xs">Address</Label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter address"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-2 pb-4 px-6">
            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-8 text-sm text-white rounded-md transition-all duration-200
                ${loading ? "bg-indigo-400 cursor-not-allowed scale-95" : "bg-indigo-600 hover:bg-indigo-700"}
              `}
            >
              {loading ? "Creating..." : "Register"}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

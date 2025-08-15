import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default function Home() {
  // In a real implementation, you would check for authentication here
  // and redirect to dashboard if already logged in
  const isAuthenticated = true // Temporarily set to true for demo

  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Elid DAS</h1>
          <p className="text-slate-600">Access Control System</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

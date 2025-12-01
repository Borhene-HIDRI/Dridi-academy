"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { UserService } from "@/lib/services/UserService"
import { toast } from "sonner";
import { AuthResponse } from "@/lib/types/user"
import { jwtDecode } from "jwt-decode";


interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("register")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerphoneNumber,setphoneNumber] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerFullName, setRegisterFullName] = useState("")
  const [registerPicture, setRegisterPicture] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
const {loadUser} = useAuth();
  const router = useRouter()
  const[user,setUser] = useState();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  
  setLoading(true);

  try {
    const res = await UserService.login({
      email: loginEmail,
      password: loginPassword,
    });


    if (res.isSuccess) {
      localStorage.setItem("token", res.token || "");
// document.cookie = `token=${res.token}; Path=/; SameSite=Lax; Max-Age=86400`;
       const decoded: any = jwtDecode(res.token);
      const UserFullName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      await loadUser();
      
      await new Promise((resolve) => setTimeout(resolve, 500));


      router.push("/admin");
      

          setLoginEmail("")
      setLoginPassword("")

      // loadUser();
      
  const decodedRole = decoded["role"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  console.log("Decoded Role:", decodedRole);
// toast(`Welcome back 👊🔥 ${UserFullName || ""} 👊🔥`);
 
    if (decodedRole === "Admin") {
      router.push("/admin");
         toast(`Welcome back ${UserFullName || ""} 👊🔥`, {
         
        })
      return;
    }

    if (decodedRole === "Member") {
      router.push("/dashboard");
         toast(`Welcome back 👊🔥 ${UserFullName || ""} 👊🔥`, {
          description: "Let's get training!",
          duration: 4000,
          
        })
      return;
    }
      onClose();



    } else {
      setError(res.message);
    }

  } catch (err: any) {
    console.log(err.message);
    setError(err.message || "Login failed.");
  }

  setLoading(false);
};


  //   if (success) {
  //     onClose()
  //     router.push("/dashboard")
  //   } else {
  //     setError("Invalid credentials. Try admin@mma.com / admin123 or any email with user123")
  //   }
  // }

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await UserService.register({
      fullName: registerFullName,
      email: registerEmail,
      phoneNumber: registerphoneNumber,
      password: registerPassword,
      UserType: 3
    },
    selectedFile ?? undefined
  );

      if (res?.isSuccess) {
      // Switch to login tab
      toast.success("Account created successfully 🎉");
      setActiveTab("login");
      setLoginEmail(registerEmail)

      // Clear fields
      setRegisterFullName("");
      setRegisterEmail("");
      setphoneNumber("");
      setRegisterPassword("");
      setPreviewUrl(null);
    } else {
      setError(res.message);
    }

  } catch (err: any) {
    setError(err.message || "Registration failed.");
  }

  setLoading(false);
};



  //   const success = await register(registerEmail, registerPassword, registerFullName)
  //   setLoading(false)

  //   if (success) {
  //     onClose()
  //     router.push("/dashboard")
  //   } else {
  //     setError("Registration failed. Please try again.")
  //   }
  // }

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setSelectedFile(file);

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  }
};


  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-8">
              <div className="text-center mb-5">
                <h2 className="text-2xl font-heading font-bold text-white mb-2">
                  {activeTab === "login" ? "WELCOME BACK" : "JOIN THE TEAM"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {activeTab === "login" ? "" : ""}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-8 bg-black/30 p-1">
                <button
                  onClick={() =>{ setActiveTab("login"); setError("")  }}
                  className={`py-2 text-sm font-heading tracking-wider transition-colors ${
                    activeTab === "login" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  LOGIN
                </button>
                <button
                  onClick={() =>{ setActiveTab("register") ; setError(""); setPreviewUrl("")}}
                  className={`py-2 text-sm font-heading tracking-wider transition-colors ${
                    activeTab === "register" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  REGISTER
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "login" ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleLogin}
                    className="space-y-3"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-heading tracking-wider text-primary uppercase">Email</label>
                      <input
                        
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-heading tracking-wider text-primary uppercase">Password</label>
                      <input
                        
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600"
                        placeholder="••••••••"
                      />
                    </div>

{error && (
  <div className="w-full rounded-md bg-red-500/10 border border-red-500 text-red-400 px-4 py-1 text-sm whitespace-pre-line">
    <div className="">{error}</div>
  </div>
)}
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white font-heading text-lg py-6 rounded-none mt-4"
                      disabled={loading}
                    >
  {loading ? (
    <div className="flex items-center justify-center gap-2">
      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      Loading...
    </div>
  ) : (
    "LOGIN"
  )}                    </Button>
                    {/* <p className="text-xs text-zinc-500 text-center mt-4">
                      Demo: admin@mma.com / admin123 or any email / user123
                    </p> */}
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleRegister}
                    className="space-y-2"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-heading tracking-wider text-primary uppercase">Full Name</label>
                      <input
                        type="text"
                        value={registerFullName}
                        onChange={(e) => setRegisterFullName(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600"
                        placeholder="FirstName & LastName"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-heading tracking-wider text-primary uppercase">Email</label>
                      <input
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600"
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-heading tracking-wider text-primary uppercase">Phone Number</label>
                      <input
                        type="phoneNumbee"
                        value={registerphoneNumber}
                        onChange={(e) => setphoneNumber(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600"
                        placeholder="+216 00000000"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-heading tracking-wider text-primary uppercase">Password</label>
                      <input
                        
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-heading tracking-wider text-primary uppercase">
                        Profile Picture (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="profile-upload"
                        />
                        <label
                          htmlFor="profile-upload"
                          className="flex items-center justify-center gap-2 w-full bg-black/50 border border-white/10 border-dashed p-4 text-gray-400 hover:text-white hover:border-primary cursor-pointer transition-all group"
                        >
                          {previewUrl ? (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                              <Image
                                src={previewUrl || "/placeholder.svg"}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 group-hover:text-primary transition-colors" />
                              <span className="text-sm group-hover:text-primary transition-colors">Upload photo</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

{error && (
  <div className="w-full rounded-md bg-red-500/10 border border-red-500 text-red-400 px-4 py-1 text-sm whitespace-pre-line">
    <div className="">{error}</div>
  </div>
)}


                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white font-heading text-lg py-6 rounded-none mt-4"
                      disabled={loading}
                    >
{loading ? (
  <div className="flex items-center justify-center gap-2">
    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
    Processing...
  </div>
) : (
  "CREATE ACCOUNT"
)}                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

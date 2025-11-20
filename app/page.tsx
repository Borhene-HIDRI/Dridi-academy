"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Calendar, MapPin, Instagram, Facebook, Mail, Phone, ChevronRight, Clock, Trophy, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { RegistrationModal } from "@/components/registration-modal"

// --- Data ---

const SCHEDULE = {
  Monday: [
    { time: "18:30 - 20:00", class: "MMA Fundamentals", level: "Advanced" },
    { time: "20:00 - 21:30", class: "Kickboxing", level: "Advanced" },
  ],
  Tuesday: [
    { time: "18:00 - 19:30", class: "No-Gi Grappling", level: "All Levels" },
    { time: "19:30 - 21:00", class: "Kickboxing", level: "Intermediate" },
  ],
  Wednesday: [
    { time: "18:00 - 19:30", class: "Wrestling for MMA", level: "All Levels" },
    { time: "19:30 - 21:00", class: "MMA Striking", level: "Advanced" },
  ],
  Thursday: [
    { time: "18:00 - 19:30", class: "BJJ (Gi)", level: "All Levels" },
    { time: "19:30 - 21:00", class: "Conditioning", level: "All Levels" },
  ],
  Friday: [
    { time: "18:00 - 20:00", class: "Open Mat", level: "All Levels" },
  ],
  Saturday: [
    { time: "10:00 - 12:00", class: "Competition Team", level: "Invite Only" },
  ],
}

const TEAM = [
  {
    name: "Abderahmen Dridi",
    role: "Head Coach / Pro Fighter",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304978983_467385692067685_6003878413241691908_n-51rpgTr5dSOUBUukABtsVCEq7MAuXw.jpg",
    achievements: []
  },
  {
    name: "Moujib Boudaya",
    role: "Coach",
    image: "images/moujib.jpg",
    achievements: []
  },
  {
    name: "Les coach lokhrin",
    role: "Coach",
    image: "/mma-grappling-coach-black-and-white.jpg",
    achievements: []
  }
]

// --- Components ---

function Navbar({onJoinNow}) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/90 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <a href="#">
          <div className="relative w-10 h-10 overflow-hidden rounded-full bg-white p-0.5">
             <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/480521460_1073667818106133_4544762354426792498_n-jztncOdPvOePaMZDZ1PBuQJJ5p7YnT.jpg" 
              alt="Logo" 
              fill
              className="object-cover"
            />
          </div></a>
          <span className="font-heading text-xl font-bold tracking-tighter hidden sm:block">
            ABDERAHMEN DRIDI <span className="text-primary">MMA</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-heading text-sm tracking-widest">
          <a href="#schedule" className="hover:text-primary transition-colors">SCHEDULE</a>
          <a href="#team" className="hover:text-primary transition-colors">TEAM</a>
          <Link href="/about" className="hover:text-primary transition-colors">ABOUT</Link>
          <a href="#contact" className="hover:text-primary transition-colors">CONTACT</a>
        </div>
     <Button 
  onClick={onJoinNow}
  className="bg-primary hover:bg-primary/90 text-white font-heading tracking-wider rounded-none skew-x-[-10deg]"
>
  <span className="skew-x-[10deg]">JOIN NOW</span>
</Button>
      </div>
    </nav>
  )
}

function Hero({ onStartTraining }: { onStartTraining: () => void }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 200])

  return (
<section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-10">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <Image
          src="images/abdo-ring.jpg"
          alt="Champion Fighter Action"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className=" inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className=" inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </motion.div>

      <div className="container relative z-10 px-4 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-primary font-heading text-xl md:text-2xl tracking-[0.5em] mb-4">EST. 2020</h2>
          <h1 className="text-6xl md:text-8xl lg:text-7xl font-heading font-bold leading-[0.9] mb-6">
            FORGED IN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">COMBAT</span>
          </h1>
          <p className="max-w-xl text-gray-400 text-lg mb-8 leading-relaxed">
            Join the elite. Whether you want to compete at the highest level or get in the best shape of your life, Dridi MMA is your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white font-heading text-lg px-8 py-6 rounded-none"
              onClick={onStartTraining}
            >
              START TRAINING
            </Button>
            <a href="#schedule">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black font-heading text-lg px-8 py-6 rounded-none">
              VIEW SCHEDULE
            </Button></a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Marquee() {
  return (
    <div className="bg-primary -mt-25  py-3 overflow-hidden whitespace-nowrap border-y border-primary/50">
      <motion.div 
        className="flex gap-8 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="text-black font-heading text-4xl font-bold italic">MMA</span>
            <span className="text-black/50 text-2xl">★</span>
            <span className="text-black font-heading text-4xl font-bold italic">KICKBOXING</span>
            <span className="text-black/50 text-2xl">★</span>
            <span className="text-black font-heading text-4xl font-bold italic">GRAPPLING</span>
            <span className="text-black/50 text-2xl">★</span>
            <span className="text-black font-heading text-4xl font-bold italic">WRESTLING</span>
            <span className="text-black/50 text-2xl">★</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Schedule({onBook}) {
  const days = Object.keys(SCHEDULE)
  const [activeDay, setActiveDay] = useState("Monday")

  return (
    <section id="schedule" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-primary font-heading text-lg tracking-widest mb-2">TRAINING TIMES</h2>
            <h3 className="text-5xl md:text-6xl font-heading font-bold text-white">WEEKLY SCHEDULE</h3>
          </div>
          <Button variant="outline" className="rounded-none border-white/20 hover:bg-white hover:text-black">
            DOWNLOAD PDF <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="Monday" className="w-full" onValueChange={setActiveDay}>
          <TabsList className="w-full flex flex-wrap justify-start bg-transparent border-b border-white/10 h-auto p-0 mb-8 gap-2">
            {days.map((day) => (
              <TabsTrigger 
                key={day} 
                value={day}
                className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-gray-400 text-lg font-heading px-6 py-3 transition-all"
              >
                {day.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="min-h-[300px]">
            {days.map((day) => (
              <TabsContent key={day} value={day} className="mt-0">
                <div className="grid gap-4">
                  {SCHEDULE[day as keyof typeof SCHEDULE].map((session, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="bg-secondary/30 border-white/5 hover:border-primary/50 transition-colors group">
                        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex items-center gap-6">
                            <div className="bg-primary/10 p-3 rounded-none group-hover:bg-primary transition-colors">
                              <Clock className="h-6 w-6 text-primary group-hover:text-white" />
                            </div>
                            <div>
                              <h4 className="text-2xl font-heading text-white mb-1">{session.class}</h4>
                              <p className="text-gray-400">{session.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <span className="px-3 py-1 bg-white/5 text-xs font-heading tracking-wider text-gray-300 border border-white/10">
                              {session.level.toUpperCase()}
                            </span>
                            
                           <Button 
  size="sm"
  onClick={onBook}
  className="bg-white text-black hover:bg-primary hover:text-white rounded-none"
>
  BOOK
</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  )
}

function Team() {
  return (
    <section id="team" className="py-24 bg-secondary/20 border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-primary font-heading text-lg tracking-widest mb-2">THE SQUAD</h2>
          <h3 className="text-5xl md:text-6xl font-heading font-bold text-white">MEET THE COACHES</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group relative"
            >
              <div className="relative h-[500px] w-full overflow-hidden bg-black border border-white/10">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-primary font-heading text-sm tracking-widest mb-1">{member.role}</h4>
                  <h3 className="text-3xl font-heading font-bold text-white mb-4">{member.name.toUpperCase()}</h3>
                  
                  <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {member.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <Trophy className="h-3 w-3 text-primary" />
                        {achievement}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 skew-x-12 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-primary font-heading text-lg tracking-widest mb-2">GET IN TOUCH</h2>
            <h3 className="text-5xl md:text-6xl font-heading font-bold text-white mb-8">START YOUR JOURNEY</h3>
            <p className="text-gray-400 text-lg mb-12 max-w-md">
Contact us to schedule your first session, or feel free to stop by during our opening hours.            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-secondary p-3 rounded-none">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-heading text-white mb-1">LOCATION</h4>
                  <p className="text-gray-400">Menzah 6</p>
                  <p className="text-gray-400">Ariana, Tunisie</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-secondary p-3 rounded-none">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-heading text-white mb-1">EMAIL</h4>
                  <p className="text-gray-400">info@dridimma.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-secondary p-3 rounded-none">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-heading text-white mb-1">PHONE</h4>
                  <p className="text-gray-400">+216 24339167</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
  <Link href="https://www.instagram.com/teamdridimma" target="_blank">
              <Button variant="outline" size="icon" className="rounded-none border-white/20 hover:bg-primary hover:border-primary hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              </Link>
  <Link href="https://www.facebook.com/teamdridimma" target="_blank">
              <Button variant="outline" size="icon" className="rounded-none border-white/20 hover:bg-primary hover:border-primary hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              </Link>
            </div>
          </div>

          <div className="bg-secondary/20 p-8 border border-white/5 backdrop-blur-sm">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-heading tracking-wider text-gray-400">FIRST NAME</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-heading tracking-wider text-gray-400">LAST NAME</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-heading tracking-wider text-gray-400">EMAIL ADDRESS</label>
                <input type="email" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-heading tracking-wider text-gray-400">INTEREST</label>
                <select className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors">
                  <option>MMA</option>
                  <option>Kickboxing</option>
                  <option>BJJ</option>
                  <option>Kids Class</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-heading tracking-wider text-gray-400">MESSAGE</label>
                <textarea rows={4} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors"></textarea>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-heading text-lg py-6 rounded-none">
                SEND MESSAGE
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 overflow-hidden rounded-full bg-white p-0.5">
             <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/480521460_1073667818106133_4544762354426792498_n-jztncOdPvOePaMZDZ1PBuQJJ5p7YnT.jpg" 
              alt="Logo" 
              fill
              className="object-cover"
            />
          </div>
          <span className="font-heading text-lg font-bold tracking-tighter text-white">
            DRIDI <span className="text-primary">MMA</span>
          </span>
        </div>
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Abderahmen Dridi MMA School. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
<Navbar onJoinNow={() => setIsModalOpen(true)} />
      <Hero onStartTraining={() => setIsModalOpen(true)} />
      <Marquee />
      <Schedule onBook={() => setIsModalOpen(true)} />
      <Team />
      <Contact />
      <Footer />
      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Trophy, Target, Users, Star, ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="h-5 w-5 text-primary group-hover:-translate-x-1 transition-transform" />
            <span className="font-heading font-bold tracking-wider">BACK TO HOME</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 overflow-hidden rounded-full bg-white p-0.5">
               <Image 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/480521460_1073667818106133_4544762354426792498_n-jztncOdPvOePaMZDZ1PBuQJJ5p7YnT.jpg" 
                alt="Logo" 
                fill
                className="object-cover"
              />
            </div>
            <span className="font-heading text-lg font-bold tracking-tighter hidden sm:block">
              DRIDI <span className="text-primary">MMA</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
              THE <span className="text-primary">LEGACY</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              From the cage to the community. The story of a champion building the next generation of warriors in Tunisia.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[600px] w-full rounded-lg overflow-hidden border border-white/10"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304978983_467385692067685_6003878413241691908_n-51rpgTr5dSOUBUukABtsVCEq7MAuXw.jpg"
                alt="Abderahmen Dridi Champion"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="bg-primary text-black font-heading font-bold px-4 py-1 inline-block mb-2 skew-x-[-10deg]">
                  <span className="skew-x-[10deg]">HEAD COACH</span>
                </div>
                <h2 className="text-4xl font-heading font-bold text-white">ABDERAHMEN DRIDI</h2>
                <p className="text-gray-300 mt-2">FCF MMA World Champion</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-heading font-bold text-white mb-4 flex items-center gap-3">
                  <Trophy className="text-primary h-8 w-8" />
                  THE CHAMPION
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Abderahmen Dridi is not only a coach — he is a seasoned competitor forged through years 
                  of discipline, sacrifice, and real combat experience. With championship victories and 
                  battles on the professional circuit, he has tested his skills against elite athletes 
                  and proven his mastery inside the cage.
                  <br />
                  Known for his precision striking, pressure fighting style, and relentless work ethic, 
                  Coach Dridi brings the mentality of a true warrior to every training session — inspiring 
                  each student to push past their limits physically and mentally.                </p>
              </div>

              <div>
                <h3 className="text-3xl font-heading font-bold text-white mb-4 flex items-center gap-3">
                  <Target className="text-primary h-8 w-8" />
                  THE MISSION
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  After competing at a high level, Coach Dridi returned with one goal: to elevate the 
                  sport of MMA in Tunisia. He founded the Abderahmen Dridi MMA Academy to transmit not 
                  only technique, but also the mindset and values that shaped him as a fighter.
                  <br />
                  At the academy, students learn discipline, confidence, humility, and resilience — 
                  the true foundations of martial arts.                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-secondary/20 p-4 border border-white/5 text-center">
                  <h4 className="text-3xl font-heading font-bold text-primary mb-1">10+</h4>
                  <p className="text-sm text-gray-400 font-heading tracking-wider">YEARS EXPERIENCE</p>
                </div>
                <div className="bg-secondary/20 p-4 border border-white/5 text-center">
                  <h4 className="text-2xl font-heading font-bold text-primary mb-1">MULTIPLE</h4>
                  <p className="text-sm text-gray-400 font-heading tracking-wider">WORLD TITLES</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The School Section */}
      <section className="py-24 bg-secondary/10 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <h2 className="text-primary font-heading text-lg tracking-widest mb-2">THE ACADEMY</h2>
              <h3 className="text-5xl font-heading font-bold text-white mb-6">MORE THAN A GYM</h3>
              
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                The Abderahmen Dridi MMA School is a sanctuary for growth. We don't just teach you how to fight; we teach you how to live. Our academy is built on the pillars of respect, humility, and hard work.
              </p>

              <ul className="space-y-4">
                {[
                  "World-Class Instruction directly from a Champion",
                  "State-of-the-art training facility",
                  "Programs for all ages and skill levels",
                  "A supportive community of like-minded warriors"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white">
                    <Star className="h-5 w-5 text-primary fill-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button className="mt-8 bg-primary hover:bg-primary/90 text-white font-heading text-lg px-8 py-6 rounded-none skew-x-[-10deg]">
                <span className="skew-x-[10deg]">JOIN THE FAMILY</span>
              </Button>
            </div>

            <div className="order-1 lg:order-2 relative h-[400px] w-full">
              <div className="absolute inset-0 bg-primary/20 translate-x-4 translate-y-4" />
              <div className="relative h-full w-full overflow-hidden border border-white/10 bg-black">
                <Image
                  src="images/school.jpg"
                  alt="Training at Dridi MMA"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8">
            READY TO WRITE <span className="text-primary">YOUR STORY?</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Whether you want to compete or just get fit, your journey starts here.
          </p>
          <Link href="/#contact">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-heading text-lg px-12 py-6 rounded-none">
              START TRAINING TODAY <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

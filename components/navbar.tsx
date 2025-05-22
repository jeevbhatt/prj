"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Facebook, Twitter, User, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the theme toggle
  useEffect(() => {
    setMounted(true)
  }, [])

  // Optimized toggle function to ensure it works correctly and responsively
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    // Force a re-render to update UI immediately
    setTimeout(() => {
      document.body.classList.toggle("dark", theme !== "dark")
    }, 0)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fixed toggle function to ensure it works correctly
  // const toggleTheme = () => {
  //   setTheme(theme === "dark" ? "light" : "dark")
  // }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2 bg-background shadow-md" : "py-4 bg-background dark:bg-background/95"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
            <Image src="/images/sms.png" alt="SMS" width={40} height={40} className="w-10 h-10" />
            <h2 className="text-2xl font-bold text-primary">SMS</h2>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#contact">Contact</NavLink>
            <NavLink href="/notices">Notices</NavLink>
          </nav>

          {/* Social & Admin Links with Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <SocialLink href="https://facebook.com" icon={<Facebook size={20} />} />
            <SocialLink href="https://twitter.com" icon={<Twitter size={20} />} />

            {/* Theme Toggle Button - Fixed to ensure it works */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-1 relative overflow-hidden"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                <span className="sr-only">{theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
              </button>
            )}

            <Link
              href="/admin/login"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-1 relative overflow-hidden"
              title="Admin Login"
            >
              <User size={20} />
              <span className="sr-only">Admin Login</span>
              <div className="absolute inset-0 bg-primary/20 scale-0 opacity-0 rounded-full transition-all duration-300 hover:scale-150 hover:opacity-100" />
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col h-full">
                <Link href="/" className="flex items-center gap-2 mb-8">
                  <Image src="/images/sms.png" alt="SMS" width={40} height={40} className="w-10 h-10" />
                  <h2 className="text-2xl font-bold text-primary">SMS</h2>
                </Link>
                <nav className="flex flex-col space-y-4">
                  <MobileNavLink href="#home">Home</MobileNavLink>
                  <MobileNavLink href="#about">About</MobileNavLink>
                  <MobileNavLink href="#services">Services</MobileNavLink>
                  <MobileNavLink href="#contact">Contact</MobileNavLink>
                  <MobileNavLink href="/notices">Notices</MobileNavLink>
                </nav>
                <div className="flex items-center space-x-4 mt-8">
                  <SocialLink href="https://facebook.com" icon={<Facebook size={20} />} />
                  <SocialLink href="https://twitter.com" icon={<Twitter size={20} />} />

                  {/* Mobile Theme Toggle - Fixed to ensure it works */}
                  {mounted && (
                    <button
                      onClick={toggleTheme}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 hover:bg-primary hover:text-white"
                      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                      aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                      <span className="sr-only">
                        {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                      </span>
                    </button>
                  )}

                  <Link
                    href="/admin/login"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 hover:bg-primary hover:text-white"
                    title="Admin Login"
                  >
                    <User size={20} />
                    <span className="sr-only">Admin Login</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-foreground font-medium relative pb-1 transition-colors duration-300 hover:text-primary after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-xl font-medium py-2 transition-colors duration-300 hover:text-primary">
      {children}
    </Link>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-1"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
      <span className="sr-only">Social Media</span>
    </Link>
  )
}

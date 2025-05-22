"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

type TeamMember = {
  id: number
  name: string
  role: string
  phone: string
  email: string
  image: string
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Tanka Timilsina",
    role: "Principal",
    phone: "+977-9800000001",
    email: "tanka@schoolms.com",
    image: "/images/tanka.jpg",
  },
  {
    id: 2,
    name: "Saurav S. Thakuri",
    role: "Vice Principal",
    phone: "+977-9800000002",
    email: "saurav@schoolms.com",
    image: "/images/saurav.jpg",
  },
  {
    id: 3,
    name: "Puja Bhatt",
    role: "Secretary",
    phone: "+977-9800000003",
    email: "puja@schoolms.com",
    image: "/images/puja.jpg",
  },
  {
    id: 4,
    name: "Prakash Pokharel",
    role: "IT Administrator",
    phone: "+977-9800000004",
    email: "prakash@schoolms.com",
    image: "/images/prakash.jpg",
  },
  {
    id: 5,
    name: "Dipu Pant",
    role: "Teacher",
    phone: "+977-9800000005",
    email: "dipu@schoolms.com",
    image: "/images/dipu.jpg",
  },
]

export function About() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("about")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="about"
      className={`py-16 px-4 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">About Us</h2>

        <div className="flex flex-col items-center mb-12">
          <Image
            src="/images/logo.png"
            alt="School Logo"
            width={200}
            height={200}
            className="rounded-lg mb-6 transition-transform duration-300 hover:scale-105"
          />
          <p className="text-center max-w-3xl text-gray-700 dark:text-gray-300">
            Welcome to our School Management System. We provide comprehensive tools for managing student records,
            academic performance, and school communications. Our system is designed to streamline administrative tasks
            and improve the educational experience for students, teachers, and parents.
          </p>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Our School Members</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <div className="w-32 h-32 mb-3 relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full border-4 border-white dark:border-gray-700 shadow-md transition-all duration-300 hover:border-primary"
                  />
                </div>
                <h4 className="font-medium text-center">{member.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-primary">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Member Info Modal */}
        {selectedMember && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full relative animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                onClick={() => setSelectedMember(null)}
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </button>

              <h3 className="text-xl font-bold mb-4">{selectedMember.name}</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Role:</strong> {selectedMember.role}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedMember.phone}
                </p>
                <p>
                  <strong>Email:</strong> {selectedMember.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Calendar, FileText, GraduationCap, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AcademicCalendar } from "@/components/academic-calendar"
import { LearningResources } from "@/components/learning-resources"
import { ExamResults } from "@/components/exam-results"

type ServiceModalContent = "calendar" | "resources" | "results" | null

export function Services() {
  const [activeModal, setActiveModal] = useState<ServiceModalContent>(null)
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

    const element = document.getElementById("services")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="services"
      className={`py-16 px-4 bg-gray-50 dark:bg-gray-900 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Our Services</h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-6">Student Services</h3>
            <ul className="space-y-4">
              <ServiceLink
                title="Academic Calendar"
                icon={<Calendar className="w-5 h-5 text-primary" />}
                onClick={() => setActiveModal("calendar")}
              />
              <ServiceLink
                title="Learning Resources"
                icon={<FileText className="w-5 h-5 text-primary" />}
                onClick={() => setActiveModal("resources")}
              />
              <ServiceLink
                title="Exam Results"
                icon={<GraduationCap className="w-5 h-5 text-primary" />}
                onClick={() => setActiveModal("results")}
              />
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/demo.gif"
                alt="Demo"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 italic">See how our system works</p>
          </div>
        </div>

        {/* Service Modal */}
        {activeModal && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setActiveModal(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                onClick={() => setActiveModal(null)}
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </button>

              <h3 className="text-xl font-bold mb-4">
                {activeModal === "calendar" && "Academic Calendar"}
                {activeModal === "resources" && "Learning Resources"}
                {activeModal === "results" && "Exam Results"}
              </h3>

              <div className="mt-4">
                {activeModal === "calendar" && <AcademicCalendar />}
                {activeModal === "resources" && <LearningResources />}
                {activeModal === "results" && <ExamResults />}
              </div>
            </div>
          </div>
        )}

        {/* Featured Services */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Featured Services</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <FeaturedServiceCard
              title="Academic Calendar"
              description="Access the complete academic calendar with important dates, events, and schedules."
              icon={<Calendar className="h-8 w-8 text-primary" />}
              onClick={() => setActiveModal("calendar")}
            />
            <FeaturedServiceCard
              title="Learning Resources"
              description="Download study materials, lecture notes, and educational resources in various formats."
              icon={<FileText className="h-8 w-8 text-primary" />}
              onClick={() => setActiveModal("resources")}
            />
            <FeaturedServiceCard
              title="Exam Results"
              description="View and download your examination results and academic performance records."
              icon={<GraduationCap className="h-8 w-8 text-primary" />}
              onClick={() => setActiveModal("results")}
            />
          </div>
        </div>

        {/* Admin Notice */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
          <p className="text-blue-800 dark:text-blue-300">
            Student management features (add, update, remove) are available exclusively in the{" "}
            <Link href="/admin/login" className="font-medium underline hover:text-blue-600 dark:hover:text-blue-200">
              admin panel
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}

function ServiceLink({ title, icon, onClick }: { title: string; icon?: React.ReactNode; onClick: () => void }) {
  return (
    <li>
      <button
        className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-md transition-all duration-300 hover:bg-primary hover:text-white hover:translate-x-2 border-l-4 border-transparent hover:border-primary-dark flex items-center justify-between"
        onClick={onClick}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span>{title}</span>
        </div>
        <ChevronRight className="w-4 h-4 opacity-70" />
      </button>
    </li>
  )
}

function FeaturedServiceCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          {icon}
          <Badge variant="outline" className="text-xs">
            Featured
          </Badge>
        </div>
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={onClick} className="w-full">
          Access Now
        </Button>
      </CardFooter>
    </Card>
  )
}

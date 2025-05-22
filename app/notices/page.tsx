import { Navbar } from "@/components/navbar"
import { NoticesList } from "@/components/notices-list"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "School Notices - School Management System",
  description: "View all school notices and announcements",
}

export default function NoticesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 relative inline-block left-1/2 -translate-x-1/2">
            School Notices
            <span className="absolute bottom-[-10px] left-1/2 w-12 h-1 bg-primary -translate-x-1/2"></span>
          </h1>

          <NoticesList />
        </div>
      </div>
      <Footer />
    </main>
  )
}

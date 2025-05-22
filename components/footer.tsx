export function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white pt-8">
      <div className="container mx-auto px-4 text-center pb-6">
        <h3 className="text-xl font-medium mb-4">Student life is the most important life of your journey</h3>
        <p>Copyright &copy; {new Date().getFullYear()} School Management System</p>
      </div>

      <div className="bg-gray-900 dark:bg-black py-3 overflow-hidden relative">
        <div className="marquee-content">
          <span className="whitespace-nowrap">
            📞 Phone: +1-234-567-8900 | 📧 Email: info@schoolms.com | 🌐 Website: http://www.schoolms.com
          </span>
        </div>
      </div>
    </footer>
  )
}

import "../globals.css"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <h1 className="font-extrabold text-7xl">ADMIN NAVBAR</h1>
        <main>{children}</main>
      </body>
    </html>
  )
}
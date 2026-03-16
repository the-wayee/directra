import { Navbar } from "@/components/shared/navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen">{children}</main>
    </>
  )
}

import { Navbar } from "@/components/shared/navbar"

export default function NewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen">{children}</main>
    </>
  )
}

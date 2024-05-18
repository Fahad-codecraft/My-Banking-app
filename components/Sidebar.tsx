'use client'
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Footer from "./Footer"

const Sidebar = ({user}: SiderbarProps) => {

  const pathName = usePathname()
  return (
    <section className='sidebar'>
      <nav className="flex flex-col gap-4">
        <Link href='/' className="mb-12 cursor-pointer items-center gap-2 flex">
          <h1 className="sidebar-logo">Bank</h1>
        </Link>
        {sidebarLinks.map((item) => {

          const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)
          return (
            <Link href={item.route}
            key={item.label}
            className={cn('sidebar-link',{'bg-bank-gradient': isActive})}
            >
              <p className={cn('sidebar-label', {'!text-white': isActive})}>
                {item.label}
              </p>
            </Link>
          )
        })}
      </nav>
      
      <Footer user={user} />
    </section>
  )
}

export default Sidebar
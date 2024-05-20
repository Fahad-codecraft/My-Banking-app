'use client'
import { myBankLinks } from "@/constants"
import Link from "next/link"




const page = () => {
  return (
    <section className="p-6">

    <nav className="flex flex-col gap-4">
      <Link href='/' className="mb-12 cursor-pointer items-center gap-2 flex">
        <h1 className="sidebar-logo">Bank</h1>
      </Link>
      <div className="flex gap-4">
      {myBankLinks.map((item) => {
        return (
          <Link href={item.route}
            key={item.label}
            className='sidebar-link bg-bank-gradient w-[355px]'
          >
            <p className='sidebar-label !text-white'>
              {item.label}
            </p>
          </Link>
        )
      })}
      </div>
    </nav>
    </section>
  )
}

export default page
import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
  return (
        <nav>
            <Link href="/" className="logo">
                <Image src="/ignitia-logo.png" alt="Ignitia Logo" width={100} height={50} />
            </Link>
            <ul className="flex space-x-6 list-none">
                <li>
                    <Link href="/home" className="">Home</Link>
                </li>
                <li>
                    <Link href="/events" className="">Events</Link>
                </li>
                <li>
                    <Link href="/create" className="">Create Event</Link>
                </li>
            </ul>
        </nav>
  )
}

export default Navbar
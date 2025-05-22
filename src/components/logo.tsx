import { Link } from "react-router-dom"
import { FaBusSimple } from "react-icons/fa6"

export function Logo() {
  return (
    <Link to="/" className="flex justify-center items-center gap-2 rounded-[28px] bg-gray-900/60 px-10 py-2 w-[160px] border border-gray-700">
      <span className="!text-xl font-poppins font-semibold">ADDIS</span>
      <div className="flex h-8 w-8 items-center justify-center rounded-md">
        <FaBusSimple className="h-5 w-5" />
      </div>
    </Link>
  )
}

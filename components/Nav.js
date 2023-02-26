import Link from "next/link"
import { auth } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"

export default function Nav() {
  const [user, loading] = useAuthState(auth)

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-bold">IniWeb</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"} legacyBehavior>
            <a className="px-4 py-2 text-sm bg-[#0F4C75] text-[#BBE1FA] rounded-lg font-medium ml-8">
              Login
            </a>
          </Link>
        )}
        {user && (
          <Link href="/dashboard">
            <div className="flex items-center gap-2">
              <img
                className="w-10 rounded-full"
                src={user.photoURL}
              />
              <p className="text-xs ">
                {user.displayName}
              </p>
            </div>
          </Link>
        )}
      </ul>
    </nav>
  )
}
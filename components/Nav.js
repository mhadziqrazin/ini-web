import Link from "next/link"
import { auth, db } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"

export default function Nav() {
  const [user, loading] = useAuthState(auth)
  const [userData, setUserData] = useState({})

  // get the user data
  const getUserData = async () => {
    if (!user) return
    const userRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(userRef)
    setUserData(docSnap.data())
  }

  useEffect(() => {
    getUserData()
  }, [user, loading])

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-bold">IniWeb</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"} legacyBehavior>
            <a className="px-4 py-2 text-sm bg-[#0F4C75] text-[#BBE1FA] rounded-lg font-medium ml-8 hover:bg-[#166FAB]">
              Login
            </a>
          </Link>
        )}
        {user && (
          <Link href="/dashboard">
            <div className="flex items-center gap-2">
              <img
                className="w-10 rounded-full border"
                src={userData.photoURL}
              />
              <p className="text-xs ">
                {userData.displayName}
              </p>
            </div>
          </Link>
        )}
      </ul>
    </nav>
  )
}

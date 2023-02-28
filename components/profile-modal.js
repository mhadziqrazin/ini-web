import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { TbArrowsDiagonalMinimize } from "react-icons/Tb"
import { auth, db } from "../utils/firebase"

export default function ProfileModal({ visible, onClose, username, profile, id }) {
  if (!visible) return

  const [user, loading] = useAuthState(auth)
  const [bio, setBio] = useState("")
  const getData = async () => {
    if (!user) return

    const userRef = doc(db, 'users', id)
    const docSnap = await getDoc(userRef)
    setBio(docSnap.data().bio)
  }

  useEffect(() => {
    getData()
  }, [user, loading])



  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-[#1B262C] px-4 py-4 rounded-lg drop-shadow-lg backdrop-blur-sm bg-opacity-60 border border-[#BBE1FA]/40">
        <div className="flex place-content-between">
          <div className="flex items-center gap-2">
            <img
              className="w-10 rounded-full border border-[#BBE1FA]"
              src={profile}
            />
            <p className="text-[#BBE1FA] font-medium text-2xl">
              {username}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex gap-1 ml-20"
          >
            <TbArrowsDiagonalMinimize />
          </button>
        </div>
        {bio != "" &&
          <div className="mt-5 flex place-content-center italic">
            {bio}
          </div>
        }
      </div>
    </div>
  )
}
import { doc, updateDoc } from "firebase/firestore"
import { useState } from "react"
import { FiSave } from "react-icons/Fi"
import { toast } from "react-toastify"
import { db } from "../utils/firebase"
import { ImCancelCircle } from "react-icons/Im"


export default function EditProfile({ visible, onClose, displayName, bio, id, getData }) {
  if (!visible) return
  const [info, setInfo] = useState({ displayName: displayName, bio: bio })
  const [loading, setLoading] = useState(false)

  const saveProfile = async (e) => {
    setLoading(true)
    e.preventDefault()

    // check length
    if (!info.displayName) {
      toast.error("username field cannot be empty!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      })
      setLoading(false)
      return
    }

    if (info.displayName.length > 20 || info.bio.length > 100) {
      toast.error("you've exceeded input limit!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      })
      setLoading(false)
      return
    }

    // make a new post
    const docRef = doc(db, 'users', id)
    await updateDoc(docRef, {
      displayName: info.displayName,
      bio: info.bio,
    })
    setLoading(false)
    getData()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-[#1B262C] px-4 py-4 rounded-lg drop-shadow-lg backdrop-blur-sm bg-opacity-60 border border-[#BBE1FA]/40">
        <form
          onSubmit={saveProfile}
        >
          <input
            type="text"
            value={info.displayName}
            onChange={(e) => setInfo({ ...info, displayName: e.target.value })}
            placeholder="What's on your mind?"
            className="resize-none p-4 text-sm text-white w-full bg-[#121212] border border-[#BBE1FA] rounded-lg outline-none"
          ></input>
          <textarea
            value={info.bio}
            onChange={(e) => setInfo({ ...info, bio: e.target.value })}
            placeholder="Tell others about you"
            className="resize-none mt-2 p-4 text-sm text-white w-full h-40 bg-[#121212] border border-[#BBE1FA] rounded-lg outline-none"
          ></textarea>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex gap-1 place-content-center items-center p-2 w-full bg-red-300 text-[#1B262C] font-medium rounded-lg mt-2 text-sm text-[#1B262C] hover:bg-red-400"
            >
              <ImCancelCircle />
              Cancel
            </button>
            <button
              type="submit"
              className="flex gap-1 place-content-center items-center p-2 w-full bg-[#BBE1FA] text-[#1B262C] font-medium rounded-lg mt-2 text-sm text-[#1B262C] hover:bg-[#60C1FF]"
            >
              <FiSave />{loading ? <>Saving profile..</> : <>Save</>}

            </button>
          </div>
        </form>
      </div>

    </div>
  )
}
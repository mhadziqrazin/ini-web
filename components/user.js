import { useState } from "react"
import { auth, db } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"

export default function User({ profile, user, username, addFriend, removeFriend, friendsOf }) {
  const [currUser, loadingUser] = useAuthState(auth)
  if (loadingUser) return
  const isFriend = friendsOf.some(e => {
    if (e == currUser.uid) {
      return true
    }
    return false
  })

  const [checked, setChecked] = useState(isFriend)

  const handleChange = () => {
    if (!checked) {
      console.log("Close friend added")
      addFriend(currUser.uid, user)
    } else {
      console.log("Close friend removed")
      removeFriend(currUser.uid, user)
    }
    setChecked(!checked)

  }

  return (
    <div className="my-4 p-4 text-white rounded-tr-lg rounded-bl-lg border border-[#BBE1FA] bg-gradient-to-r from-[#131A1F] to-[#182227]">
      <div className="flex items-center gap-1 place-content-between">
        <div className="flex items-center gap-2">
          <img
            className="w-6 rounded-full"
            src={profile}
          />
          <p className="text-xs font-medium">
            {username}
          </p>
          <div>
            <input
              type="checkbox"
              checked={checked}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

    </div>
  )
}
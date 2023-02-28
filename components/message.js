import { deleteDoc, doc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { BsThreeDotsVertical } from "react-icons/Bs"
import { auth, db } from "../utils/firebase"
import EditModal from "./edit-modal"

export default function Message({ timestamp, user, profile, username, tweet, closed, edited, id }) {

  const [open, setOpen] = useState(false)
  const [currUser] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)

  const optionRef = useRef(null)

  useEffect(() => {
    // if user clicked on outside of option
    function handleClickOutside(event) {
      if (optionRef.current && !optionRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [optionRef])

  // delete post
  const deletePost = async (id) => {
    setLoading(true)
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    setLoading(false)
  }

  const handleOnCloseEdit = () => {
    setEdit(!edit)
  }

  return (
    <div className={`my-4 p-4 text-white rounded-tr-lg rounded-bl-lg border border-[#BBE1FA] ${closed ? 'border-green-400' : ''} bg-gradient-to-r from-[#131A1F] to-[#182227]`}>
      <div className="flex items-center gap-1 place-content-between">
        <div className="flex items-center gap-2">
          <img
            className="w-6 rounded-full"
            src={profile}
          />
          <p className="text-xs font-medium">
            {username}
          </p>
          {timestamp &&
            <div className="text-xs text-gray-400 font-medium">
              <p>{new Date(timestamp.seconds * 1000).toLocaleDateString("en-GB")}</p>
            </div>
          }
        </div>

        {currUser != null && user == currUser.uid &&
          <div>
            <button
              onClick={() => setOpen(!open)}
            >
              <BsThreeDotsVertical />
            </button>
            {open &&
              <div
                ref={optionRef}
                className="p-1 absolute text-xs cursor-pointer bg-[#BBE1FA] bg-opacity-30 backdrop-blur-sm rounded-lg"
              >
                <div>
                  <button
                    onClick={() => setEdit(!edit)}
                    className="p-1 w-full text-left hover:bg-[#BBE1FA] hover:bg-opacity-40 hover:backdrop-blur-sm hover:rounded-md"
                  >
                    Edit
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => deletePost(id)}
                    className="p-1 w-full text-left hover:bg-[#BBE1FA] hover:bg-opacity-40 hover:backdrop-blur-sm hover:rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
      <div className={`mt-5 text-lg  ${loading ? 'text-red-300' : ''}`}>
        <p>{loading ? <>Deleting thoughts..</> : tweet}</p>
      </div>
      <EditModal onClose={handleOnCloseEdit} visible={edit} tweet={tweet} id={id} />
      {edited &&
        <p className="text-xs text-gray-400 mt-4">
          Edited
        </p>
      }




    </div>
  )
}
import { useState } from "react"
import { GrSend } from "react-icons/gr"
import { MdOutlineCancelScheduleSend } from "react-icons/md"
import { db } from "../utils/firebase"
import { toast } from "react-toastify"
import { doc, updateDoc } from "firebase/firestore"


export default function EditModal({ visible, onClose, tweet, id }) {
  
  if (!visible) return null

  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState({ tweet: tweet })

  const submitPost = async (e) => {
    setLoading(true)
    e.preventDefault()

    // check length
    if (!post.tweet) {
      toast.error("Thoughts field cannot be empty!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      })
      setLoading(false)
      return
    }

    if (post.tweet.length > 200) {
      toast.error("Thoughts too long!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      })
      setLoading(false)
      return
    }

    // make a new post
    const docRef = doc(db, 'posts', id)
    const updatedDoc = { ...post, edited: true }
    await updateDoc(docRef, updatedDoc)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-[#1B262C] px-5 py-2 rounded-lg drop-shadow-lg backdrop-blur-sm bg-opacity-60 border border-[#BBE1FA]/40">
        <form onSubmit={submitPost} className="my-4">
          <textarea
            value={post.tweet}
            onChange={(e) => setPost({ ...post, tweet: e.target.value })}
            placeholder="What's on your mind?"
            className="resize-none p-4 text-sm text-white w-full h-40 bg-[#121212] border border-[#BBE1FA] rounded-lg outline-none"
          ></textarea>
          <p className={`text-xs ${post.tweet.length > 200 ? 'text-red-300' : ''}`}>
            {post.tweet.length}/200
          </p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex gap-1 place-content-center items-center p-2 w-full bg-red-300 text-[#1B262C] font-medium rounded-lg mt-2 text-sm text-[#1B262C] hover:bg-red-400"
            >
              <MdOutlineCancelScheduleSend />
              Cancel
            </button>
            <button
              type="submit"
              className="flex gap-1 place-content-center items-center p-2 w-full bg-[#BBE1FA] text-[#1B262C] font-medium rounded-lg mt-2 text-sm text-[#1B262C] hover:bg-[#60C1FF]"
            >
              <GrSend />{loading ? <>Editing thoughts..</> : <>Post</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

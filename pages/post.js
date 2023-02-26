import { auth, db } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { GrSend } from "react-icons/Gr"
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore"
import { toast } from "react-toastify"
import Message from "../components/message"


export default function Post() {
  const [user] = useAuthState(auth)

  // form state
  const [post, setPost] = useState({ tweet: "" })

  // post
  const [loading, setLoading] = useState(false)

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
    const collectionRef = collection(db, 'posts')
    await addDoc(collectionRef, {
      ...post,
      timestamp: serverTimestamp(),
      user: user.uid,
      profile: user.photoURL,
      username: user.displayName,
    })
    toast.success("Thoughts posted!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000
    })
    setPost({ tweet: "" })
    setLoading(false)
  }

  // show post
  const [allPosts, setAllPosts] = useState([])

  const getPosts = async () => {
    const collectionRef = collection(db, 'posts')
    const que = query(collectionRef, orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(que, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    })
    return unsub
  }

  useEffect(() => {
    getPosts()
  })

  return (
    <div className="py-10 max-w-md mx-auto">
      {!user && (
        <h1 className="text-2xl font-medium">
          Hi! Are the chat looking fun? Login and start chatting :D
        </h1>
      )}
      {user && (
        <>
          <h1 className="text-2xl font-bold text-[#3282B8]">
            @{user.displayName}
          </h1>
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
            <button
              type="submit"
              className="flex gap-2 place-content-center items-center p-2 w-full bg-[#BBE1FA] text-[#1B262C] font-medium rounded-lg my-2 text-sm text-[#1B262C] hover:bg-[#ddf0fd]"
            >
              <GrSend />{loading ? <>Uploading thoughts..</> : <>Post</>}
            </button>
          </form>
        </>
      )}
      {allPosts.map((post) => (
        <Message {...post} key={post.id} />
      ))}
    </div>
  )
}
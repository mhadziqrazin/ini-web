import { auth, db } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { GrSend } from "react-icons/gr"
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, getDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import Message from "../components/message"


export default function Post() {
  const [user, loadingUser] = useAuthState(auth)
  const [friendsOf, setFriendsOf] = useState([])
  const route = useRouter()
  const [userData, setUserData] = useState({})


  // get user data
  const getData = async () => {
    if (!user) return

    const userRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(userRef)
    setUserData(docSnap.data())
    setFriendsOf(docSnap.data().friendsOf)
  }

  useEffect(() => {
    getData()
  }, [user, loadingUser])

  // form state
  const [post, setPost] = useState({ tweet: "" })

  // post
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)

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
      user: userData.uid,
      profile: userData.photoURL,
      username: userData.displayName,
      closed: checked,
      edited: false,
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
      setAllPosts(
        snapshot.docs.map((doc) => (
          { ...doc.data(), id: doc.id }
        ))
      )
    })
    return unsub
  }

  useEffect(() => {
    getPosts()
  }, [])

  const isFriend = (post) => {
    if (!user) return
    if (user.uid == post.user) {
      return true
    }
    return (friendsOf.some(e => {
      if (e == post.user) {
        return true;
      }
      return false
    }))

  }


  return (
    <div className="py-10 max-w-md mx-auto">
      {!user && (
        <h1 className="text-2xl font-medium">
          Hi! Are the chat looking fun? Login and start chatting :D
        </h1>
      )}
      {user && (
        <>
          <h1 className="text-lg italic font-medium">
            Welcome back,
          </h1>
          <h1 className="text-5xl font-bold text-[#46A2E0]">
            {userData.displayName}
          </h1>
          <form onSubmit={submitPost} className="my-4">
            <textarea
              value={post.tweet}
              onChange={(e) => setPost({ ...post, tweet: e.target.value })}
              placeholder="What's on your mind?"
              className="resize-none p-4 text-sm text-white w-full h-40 bg-[#121212] border border-[#BBE1FA] rounded-lg outline-none"
            ></textarea>
            <div className="flex items-center gap-6">
              <p className={`text-xs ${post.tweet.length > 200 ? 'text-red-300' : ''}`}>
                {post.tweet.length}/200
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  onChange={() => setChecked(!checked)}
                />
                <p>Close friend</p>
              </div>
            </div>
            <button
              type="submit"
              className="flex gap-1 place-content-center items-center p-2 w-full bg-[#BBE1FA] text-[#1B262C] font-medium rounded-lg my-2 text-sm text-[#1B262C] hover:bg-[#60C1FF]"
            >
              <GrSend />{loading ? <>Uploading thoughts..</> : <>Post</>}
            </button>
          </form>
        </>
      )}
      {allPosts.map((post) => (
        <>
          {(!post.closed || isFriend(post)) &&
            <Message key={post.id} {...post} />
          }
        </>
      ))}
    </div>
  )
}
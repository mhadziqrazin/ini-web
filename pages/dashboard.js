import { auth, db } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore"
import Message from "../components/message"
import { FiLogOut } from "react-icons/Fi"
import { FaUserFriends } from "react-icons/Fa"
import { IoMdSettings } from "react-icons/Io"

export default function Dashboard() {
  const [user, loading] = useAuthState(auth)
  const route = useRouter()
  const [posts, setPosts] = useState([])

  // dashboard accessibility
  const getData = async () => {
    if (loading) {
      return
    }
    if (!user) {
      return route.push("/auth/login")
    }

    // show current user's posts
    if (loading) return
    const collectionRef = collection(db, "posts")
    const que = query(collectionRef, where("user", "==", user.uid), orderBy("timestamp", "desc"))
    const unsub = onSnapshot(que, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    })
    return unsub
  }

  useEffect(() => {
    getData()
  }, [user, loading])

  return (
    <div>
      {user && (
        <div className="flex items-center gap-2 ">
          <img
            className="w-10 rounded-full"
            src={user.photoURL}
          />
          <p className="text-xs ">
            {user.displayName}
          </p>
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => route.push("/close-friends")}
          className="bg-green-600 w-full px-2 py-1 flex items-center gap-2 rounded-lg text-sm hover:bg-green-500 place-content-center"
        >
          <FaUserFriends />
          Close friends
        </button>
        <button
        onClick={() => route.push("/edit-profile")}
          className="bg-gray-600 w-full px-2 py-1 flex items-center gap-2 rounded-lg text-sm hover:bg-gray-500 place-content-center"
        >
          <IoMdSettings />
          Profile
        </button>
        <button
          onClick={() => auth.signOut()}
          className="bg-red-500 w-full px-2 py-1 flex items-center gap-2 rounded-lg text-sm hover:bg-red-400 place-content-center"
        >
          <FiLogOut />
          Sign out
        </button>

      </div>

      <p>Bio</p>


      <div>
        {posts.map((post) => (
          <Message {...post} key={post.id} />
        ))}
      </div>

    </div>
  )
}
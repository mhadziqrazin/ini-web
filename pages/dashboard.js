import { auth, db } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore"
import Message from "../components/message"


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
    const collectionRef = collection(db, "posts")
    const que = query(collectionRef, where("user", "==", user.uid))

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

      <p>Bio</p>
      <div>Posts</div>
      <button onClick={() => auth.signOut()}>
        Sign out
      </button>

      <div>
        {posts.map((post) => (
          <Message {...post} key={post.id}/>
        ))}
      </div>

    </div>
  )
}
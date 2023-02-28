import { auth, db } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore"
import Message from "../components/message"
import { FiLogOut } from "react-icons/Fi"
import { FaUserFriends } from "react-icons/Fa"
import { IoMdSettings } from "react-icons/Io"
import EditProfile from "../components/edit-profile"

export default function Dashboard() {
  const [user, loading] = useAuthState(auth)
  const [userData, setUserData] = useState({})
  const route = useRouter()
  const [posts, setPosts] = useState([])
  const [edit, setEdit] = useState(false)


  // dashboard accessibility
  const getData = async () => {
    if (loading) {
      return
    }
    if (!user) {
      return route.push("/auth/login")
    }

    // show current user's posts
    const userRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(userRef)
    setUserData(docSnap.data())

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

  const handleOnCloseEdit = () => {
    setEdit(!edit)
  }

  return (
    <div>
      {user && (
        <><div className="flex flex-col items-center gap-4 place-content-center">
          <img
            className="w-20 rounded-full border"
            src={userData.photoURL} />
          <p className="text-2xl font-medium">
            {userData.displayName}
          </p>
        </div>
          <p className="flex place-content-center my-4 text-gray-200">
            {userData.bio}
          </p>
        </>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => route.push("/close-friends")}
          className="bg-[#3282B8] w-full px-1 py-2 flex items-center gap-1 rounded-lg text-sm hover:bg-[#235b81] place-content-center font-medium"
        >
          <FaUserFriends />
          Close friends
        </button>
        <button
          onClick={() => setEdit(!edit)}
          className="bg-gray-500 w-full px-2 py-1 flex items-center gap-1 rounded-lg text-sm hover:bg-gray-600 place-content-center font-medium"
        >
          <IoMdSettings />
          Profile
        </button>

        <EditProfile
          visible={edit}
          onClose={handleOnCloseEdit}
          displayName={userData.displayName}
          bio={userData.bio}
          id={userData.uid}
          getData={getData}
        />

        <button
          onClick={() => auth.signOut()}
          className="bg-red-500 w-full px-2 py-1 flex items-center gap-1 rounded-lg text-sm hover:bg-red-600 place-content-center font-medium"
        >
          <FiLogOut />
          Sign out
        </button>

      </div>

      <div>
        {posts.map((post) => (
          <Message key={post.id} {...post} />
        ))}
      </div>

    </div>
  )
}
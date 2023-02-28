import { auth, db } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect, useState } from "react"
import { collection, doc, updateDoc, onSnapshot, query, arrayUnion, arrayRemove } from "firebase/firestore"
import User from "../components/user"
import { useRouter } from "next/router"

export default function CloseFriends() {
  const [currUser, loading] = useAuthState(auth)
  const route = useRouter()

  // close-friends page accessibility
  const getUserData = async () => {
    if (loading) {
      return
    }
    if (!currUser) {
      return route.push("/auth/login");
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  // get all users
  const [allUsers, setAllUsers] = useState([])

  const getUsers = async () => {
    if (loading) return
    const collectionRef = collection(db, 'users')
    const que = query(collectionRef)
    const unsub = onSnapshot(que, (snapshot) => {
      setAllUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    })
    return unsub
  }
  
  useEffect(() => {
    getUsers()
  }, [currUser, loading])

  // const [friends, setFriends] = useState([])

  const addFriend = async (friend, friendsOf) => {
    const userRef = doc(db, 'users', friendsOf)
    await updateDoc(userRef, {
      friendsOf: arrayUnion(friend)
    })
  }

  const removeFriend = async (friend, friendsOf) => {
    const userRef = doc(db, 'users', friendsOf)
    await updateDoc(userRef, {
      friendsOf: arrayRemove(friend)
    })
  }

  return (
    <div>
      {allUsers.map((user) => (
        <>
          {user.id != currUser.uid &&
            <User key={user.id} {...user} addFriend={addFriend} removeFriend={removeFriend} />
          }
        </>
      )
      )}
    </div>
  )
}
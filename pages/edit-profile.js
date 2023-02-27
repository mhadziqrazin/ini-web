import { auth, db } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function EditProfile() {
  const [user, loading] = useAuthState(auth)
  const [userData, setUserData] = useState({})
  const route = useRouter()

  // get the user data
  const getUserData = async () => {
    if (loading) {
      return
    }
    if (!user) {
      return route.push("/auth/login")
    }

    const userRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(userRef)
    setUserData(docSnap.data())
  }

  useEffect(() => {
    getUserData()
  }, [user, loading])


  const saveProfile = async () => {

  }
  return (
    <div>
      <form onSubmit={saveProfile}>
        <div>
          <table>
            <tbody>
              <tr>
                <td>Username: </td>
                <td>
                  <input
                  type="text" 
                  value={userData.username}
                  
                  />
                </td>
              </tr>
              <tr>
                <td>Bio: </td>
                <td>
                  <input type="text" />
                </td>
              </tr>
            </tbody>

          </table>
        </div>

      </form>
    </div>
  )
}
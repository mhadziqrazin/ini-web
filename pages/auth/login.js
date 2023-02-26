import { SlSocialGoogle } from 'react-icons/Sl'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../utils/firebase'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect } from 'react'

export default function Login() {
  const route = useRouter()
  const [user, loading] = useAuthState(auth)
  const googleAuthProvider = new GoogleAuthProvider()

  // sign in with Google
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider)
      route.push("/")
    } catch (error) {
      console.log(error)
    }
  }

  // if logged in user try to login
  useEffect(() => {
    if (user) {
      route.push("/")
    } else {
      console.log("logging in")
    }
  }, [user])

  return (
    <div className="mt-32 text-[#BBE1FA]">
      <h2 className="text-5xl font-medium">
        Join the Hype Now!
      </h2>
      <div className="py-4">
        <button onClick={GoogleLogin} className="bg-[#0F4C75] w-full p-4 font-medium items-center flex rounded-lg gap-2">
          <SlSocialGoogle className="text-3xl" />
          Sign in with your Google account
        </button>
      </div>
    </div>
  )
}
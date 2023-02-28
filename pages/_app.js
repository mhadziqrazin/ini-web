import '../styles/globals.css'
import Layout from '../components/layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EditModal from '../components/edit-modal'
import { SkeletonTheme } from 'react-loading-skeleton'


export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <ToastContainer limit={1} />
      <Component {...pageProps} />
    </Layout>
  )
}

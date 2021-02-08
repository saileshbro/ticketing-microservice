import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build_client'
import Header from '../components/header'

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </div>
  )
}
MyApp.getInitialProps = async ({ Component, ctx: context }) => {
  const client = buildClient(context)
  const { data: currentUser } = await client.get('/api/users/currentuser')
  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps({
      context,
      client,
      currentUser,
    })
  }
  return {
    pageProps,
    currentUser,
  }
}
export default MyApp

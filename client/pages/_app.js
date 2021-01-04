import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build_client'
import Header from '../components/header'

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  )
}
MyApp.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx)
  const { data } = await client.get('/api/users/currentuser')
  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  return {
    pageProps,
    ...data,
  }
}
export default MyApp

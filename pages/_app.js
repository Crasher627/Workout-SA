import Navigation from "@/components/navigationbar"
import 'bootstrap/dist/css/bootstrap.min.css';
import { SessionProvider } from "next-auth/react"
import { SSRProvider } from "react-bootstrap";


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SSRProvider>
    <SessionProvider session={session}>
      

      <Navigation></Navigation>
      <Component {...pageProps} />
      
    </SessionProvider>
    </SSRProvider>
  )
}
import { useSession } from "next-auth/react"



export default function Component() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        
        <div className="container text-center">
          <h2>Home page</h2>
          <h3>You are signed in</h3>
        </div>

      </>
    )
  }
  return (
    <>
      <div className="container text-center">
          <h2>Home page</h2>
          <h3>You are not signed in</h3>
        </div>
    </>
  )
}

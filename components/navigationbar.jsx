import { useSession, signIn, signOut} from "next-auth/react"
import Link from "next/link"
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';



export default function Navigation() {
  const { data: session } = useSession()

  return (
    
<Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand>Workout tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >

<Link href="/" className="m-2">

                 Home

              </Link>
              <Link href="/exercises/exercises" className="m-2">

                 Exercises

              </Link>
              <Link href="/workouts/workouts" className="m-2">

                 Workouts

              </Link>


          </Nav>
          {session ?
          <>
          <Navbar.Text className="m-2">
            Signed in as: {session.user.email}  
          </Navbar.Text>
            <Button variant="outline-danger" onClick={() => signOut()}>Sign out</Button>
            </>
            :
            <Button variant="outline-success" onClick={() => signIn()}>Sign in</Button>
          }
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

import { useSession, signIn, signOut} from "next-auth/react"
import Link from "next/link"
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { useState, useRef } from "react";
import Modal from 'react-bootstrap/Modal';



export default function Navigation() {
  const { data: session } = useSession()

  //Show modal
  const [showTimer, setShowTimer] = useState(false);

  const handleClose = () => setShowTimer(false);

  const handleShow = () => {
    setShowTimer(true);
  }

  //Rest Timer
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(0);
  const intervalRef = useRef(null);

  const handleStart = () => {
    setIsActive(true);
    setCounter(minutes * 60 + seconds);
    intervalRef.current = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter === 0) {
          clearInterval(intervalRef.current);
          setIsActive(false);
          return 0;
        } else {
          return prevCounter - 1;
        }
      });
    }, 1000);
  };
  
  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setMinutes(0);
    setSeconds(0);
    setCounter(0);
  };

  const formattedMinutes = Math.floor(counter / 60)
    .toString()
    .padStart(2, '0');
  const formattedSeconds = (counter % 60).toString().padStart(2, '0');

  return (
    <>
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

<Link href="/" className="btn btn-outline-dark m-2">

                 Home

              </Link>
              <Link href="/exercises/exercises" className="btn btn-outline-dark m-2">

                 Exercises

              </Link>
              <Link href="/workouts/workouts" className="btn btn-outline-dark m-2">

                 Workouts

              </Link>

              <button className="btn btn-outline-dark m-2" onClick={handleShow}>Rest timer</button>


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

    {/* Rest timer */}
    <Modal show={showTimer} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Rest timer</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="container">
    <div className="text-center">
      <h3>{formattedMinutes}:{formattedSeconds}</h3>
    </div>
    <div className="row">
      <div className="col-sm-6">
        <label>
          Minutes:
          <input
            type="number"
            min="0"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div className="col-sm-6">
        <label>
          Seconds:
          <input
            type="number"
            min="0"
            value={seconds}
            onChange={(e) => setSeconds(parseInt(e.target.value))}
          />
        </label>
      </div>
    </div>
    
      
      
    
    </div>
    <Button className="m-2 w-100" variant="outline-success" onClick={handleStart} disabled={isActive}>
        Start
      </Button>
      
      <Button className="m-2 w-100" variant="outline-danger" onClick={handleReset}>Reset</Button>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

    </>
  )
}

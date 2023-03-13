import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useState } from "react";
import prisma from "../../lib/prismadb";
import axios from "axios"
import Button from 'react-bootstrap/Button';
import Link from "next/link"
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const ITEMS_PER_PAGE = 3;



export default function Page({exercises, totalPages}) {
  //Session
  const { data: session, status } = useSession();

  //Refresh
  const router = useRouter()
  const workoutPlanId = Number(router.query.data);



  const [selectedExercise, setSelectedExercise] = useState(null);
  const [setNum, setSetNum] = useState(1);



  //Confirm
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setSelectedExercise(null);
  }
  const handleShow = (id) => {
    setShow(true);
    setSelectedExercise(id);
  }

  async function handleConfirm(exerciseId, totalSets){
    totalSets = Number(totalSets);
    try {
      await axios.post("/api/workoutPlanExercises", {exerciseId, totalSets, workoutPlanId});
      setSelectedExercise(null);
      setSetNum(1);
      setShow(false);
      router.push("/workouts/workouts")
    } catch (error) {
      console.error(error);
    }
    
  }

  
         
  
  if (status==="loading"){
    return ("<span>Loading</span>")
   }
   if (!session || !workoutPlanId){
     return (<span>You are not authorized</span>)
   }
   if (session && workoutPlanId){
    return (
      <>
      <div className="container-md">
      <br></br>
        <br></br>
        <h3>Exercise list</h3>
        <br></br>

        

        <ul className="list-group">
          {exercises?.map((exercise) => (
            <li className="list-group-item" key={exercise.id} >
              <h5>{exercise.name}</h5>
              <p>{exercise.description}</p>
                <Button onClick={() => handleShow(exercise.id)}>Add</Button>
            </li>
          ))}
        </ul>
        <div>
          <br></br>
        <ul className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <li className="page-item">
          <Link className="page-link" href={`/exercisesWorkout/exercisesWorkout?page=${i + 1}&data=${workoutPlanId}`}>
            {i + 1}
          </Link>
          </li>
        ))}
        </ul>
      </div>
        </div>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select the desired number of Sets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Number of sets</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={setNum} onChange={(e) => setSetNum(e.target.value)}
                autoFocus
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleConfirm(selectedExercise, setNum)}>
            Add exercise
          </Button>
        </Modal.Footer>
      </Modal>

        
      </>
    );
  }

}
 
export async function getServerSideProps({ query }) {
  const page = parseInt(query.page) || 1;

  const exercisesCount = await prisma.exercises.count();

  const exercises = await prisma.exercises.findMany({
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });


  return {
    props: {
      exercises,
      exercisesCount,
      currentPage: page,
      totalPages: Math.ceil(exercisesCount / ITEMS_PER_PAGE),
    },
  };
}



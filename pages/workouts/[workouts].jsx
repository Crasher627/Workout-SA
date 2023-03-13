import { useSession } from "next-auth/react"
import { Button } from "react-bootstrap";
import { useState } from 'react'
import { useRouter } from 'next/router'
import Form from 'react-bootstrap/Form';
import axios from "axios"
import Link from "next/link"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';


const ITEMS_PER_PAGE = 3;



export default function Page({workouts, totalPages}) {
    const { data: session, status } = useSession();

    //Refresh
  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath);
  }

  //Confirm
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletableWorkoutId, setDeletableWorkoutId] = useState(null);

  const handleClose = () => setShowConfirm(false);

  const handleShow = (itemId) => {
    setShowConfirm(true);
    setDeletableWorkoutId(itemId);
  }

  //Confirm exercise
  const [showConfirmExercise, setShowConfirmExercise] = useState(false);
  const [deletableExerciseId, setDeletableExerciseId] = useState(null);

  const handleCloseExercise = () => setShowConfirmExercise(false);

  const handleShowExercise = (itemId) => {
    setShowConfirmExercise(true);
    setDeletableExerciseId(itemId);
  }

  //Confirm share
  const [showConfirmShare, setShowConfirmShare] = useState(false);
  const [shareableWorkoutId, setShareableWorkoutId] = useState(null);
  const [email, setEmail] = useState('');

  const handleCloseShare = () => setShowConfirmShare(false);

  const handleShowShare = (itemId) => {
    setShowConfirmShare(true);
    setShareableWorkoutId(itemId);
  }

  //Change name modal
  const [showNameChange, setShowNameChange] = useState(false);
  const [editableWorkoutId, setEditableWorkoutId] = useState(null);
  const [newName, setNewName] = useState('');

  const handleCloseNameChange = () => setShowNameChange(false);

  const handleShowNameChange = (itemId) => {
    setShowNameChange(true);
    setEditableWorkoutId(itemId);
  }

    const [workoutName, setWorkoutName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = session.user.id;
        try {
          await axios.post("/api/workouts", {userId, workoutName});
          refreshData();
        } catch (error) {
          console.error(error);
        }
      }

      async function handleDelete (itemId) {
        const userId = session.user.id;
        try {
          await axios.delete('/api/workouts', {data: {userId: userId, workoutId: itemId}});
          setDeletableWorkoutId(null);
          setShowConfirm(false);
          refreshData();
        } catch (error) {
          console.error(error);
        }
      }

      async function handleDeleteExercise (itemId) {
        try {
          await axios.delete('/api/workoutPlanExercises', {data: {workoutPlanExerciseId: itemId}});
          setDeletableExerciseId(null);
          setShowConfirmExercise(false);
          refreshData();
        } catch (error) {
          console.error(error);
        }
      }

      const [shareResponse, setShareResponse] = useState('');
      async function handleShare (targetEmail, workoutId) {
        try {
          await axios.post('/api/shareWorkout', {targetEmail, workoutId});
          setShareableWorkoutId(null);
          setShowConfirmShare(false);
          refreshData();
        } catch (error) {
          console.error(error);
          setShareResponse(error.response.data.error)
        }
      }

      async function handleNameChange (workoutName, workoutId) {
        try {
          await axios.put('/api/workouts', {data: {id: workoutId, workoutName: workoutName}});
          setEditableWorkoutId(null);
          setShowNameChange(false);
          refreshData();
        } catch (error) {
          console.error(error);
        }
      }


      async function handleDeleteSet (workoutPlanExerciseId, setNumber) {
        try {
          await axios.delete('/api/sets', {data: {workoutPlanExerciseId: workoutPlanExerciseId, setNumber: setNumber}});
          refreshData();
        } catch (error) {
          console.error(error);
        }
      }

      async function handleAddSet (workoutPlanExerciseId, setNumber) {
        try {
          await axios.post('/api/sets', {workoutPlanExerciseId, setNumber});
          refreshData();
        } catch (error) {
          console.error(error);
        }
      }


    if (status==="loading"){
        return ("<span>Loading</span>")
       }
       //data: Session / undefined / null
       if (!session){
         return (<span>Please sign in first</span>)
       }
       if (session){
        return (<>
            <div className="container-sm">
                <h3>Create workout</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="workoutName">
                    <Form.Label>Workout Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter workout name" required value={workoutName} onChange={(e) => setWorkoutName(e.target.value)}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create
                </Button>
            </Form>
            <br></br>
            </div>
            <div className="container-md">
            <ul className="list-group">
          {workouts?.map((workout) => (
            <Accordion>
            <Accordion.Item eventKey={workout.id} >
            <Accordion.Header>{workout.workoutName}</Accordion.Header>
            
            <Accordion.Body>
            
              <h6>Exercises:</h6>
              {workout.workoutPlanExercises.map((exercise) => (
                <Accordion>
                <Accordion.Item eventKey={exercise.id}>
                <Accordion.Header>{exercise.exercise.name}</Accordion.Header>
                <Accordion.Body>
                  {exercise.workoutPlanExerciseSets.map((set) => (
                    <>
                    <ul>
                    <li key={set.id}>
                      <p>Set num: {set.setNumber}</p>
                      <div className="row">
                        <div className="col-sm-2">
                          <div className="row">
                            <div className="col-sm-4">
                              <p>Reps: </p>
                            </div>
                            <div className="col-sm-8">
                              <input defaultValue={set.reps} className="w-50" type="number" min="0"></input>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="row">
                            <div className="col-sm-4">
                              <p>Weight: </p>
                            </div>
                            <div className="col-sm-8">
                              <input defaultValue={set.weight} className="w-50" type="number" min="0"></input>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>          
                  </ul>
                  </>
                  ))}
                  <Button className="m-2" variant="primary" onClick={() => handleAddSet(exercise.id, exercise.totalSets)}>Add set</Button>
                  <Button className="m-2" variant="danger" onClick={() => handleDeleteSet(exercise.id, exercise.totalSets)}>Delete set</Button>
                  <Button className="m-2" variant="danger" onClick={() => handleShowExercise(exercise.id)}>Delete</Button>
                  </Accordion.Body> 
                  </Accordion.Item>
                </Accordion>
              ))}
              <br></br>
              <Link className="btn btn-primary m-2" href={`/exercisesWorkout/exercisesWorkout?data=${encodeURIComponent(workout.id)}`}>Add exercise</Link>
              <Button className="m-2" variant="primary" onClick={() => handleShowNameChange(workout.id)}>Rename</Button>
              <Button className="m-2" variant="primary" onClick={() => handleShowShare(workout.id)}>Share</Button>
              <Button className="m-2" variant="outline-danger" onClick={() => handleShow(workout.id)}>Delete</Button>
              </Accordion.Body>           
            </Accordion.Item>
            </Accordion>))}
        </ul>
        <div>
          <br></br>
          <ul className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <li className="page-item">
          <Link className="page-link" href={`/workouts/workouts?page=${i + 1}` }>
            {i + 1}
          </Link>
          </li>
        ))}
        </ul>
      </div>
            </div>

             {/* Confirmation box */}
        <Modal show={showConfirm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to permanatly delete the workout</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deletableWorkoutId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

       {/* Confirmation box exercise */}
       <Modal show={showConfirmExercise} onHide={handleCloseExercise}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to permanatly delete the exercise from the workout</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseExercise}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleDeleteExercise(deletableExerciseId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

          {/* Confirm share workout */}
      <Modal show={showConfirmShare} onHide={handleCloseShare}>
        <Modal.Header closeButton>
          <Modal.Title>Share workout with other user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={(e) => {
  e.preventDefault();
  handleShare(email, shareableWorkoutId);
}}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>User email</Form.Label>
              <Form.Control
                type="email"
                required
                value={email} onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </Form.Group>
          <Button variant="primary" type="submit">
            Share
          </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer><p>{shareResponse}</p></Modal.Footer>

      </Modal>

      {/* Name change */}
      <Modal show={showNameChange} onHide={handleCloseNameChange}>
        <Modal.Header closeButton>
          <Modal.Title>Change workout name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={(e) => {
  e.preventDefault();
  handleNameChange(newName, editableWorkoutId);
}}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>User email</Form.Label>
              <Form.Control
                type="text"
                required
                value={newName} onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
            </Form.Group>
          <Button variant="primary" type="submit">
            Change name
          </Button>
          </Form>
        </Modal.Body>
      </Modal>

        </>)
    }
    
}

export async function getServerSideProps({ req, res, query }) {
  const session = await getServerSession(req, res, authOptions)
  const page = parseInt(query.page) || 1;
  const userId = session?.user?.id;

  const workoutsCount = await prisma.workoutPlan.count({
    where: {
      userId: userId,
    },
  });

  const workouts = await prisma.workoutPlan.findMany({
    where: {
      userId: userId,
    },
    include: {
      workoutPlanExercises: {
        include: {
          exercise: true,
          workoutPlanExerciseSets: true,
        }}},
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  return {
    props: {
      workouts,
      workoutsCount,
      currentPage: page,
      totalPages: Math.ceil(workoutsCount / ITEMS_PER_PAGE),
    },
  };
}



import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useState } from "react";
import prisma from "../../lib/prismadb";
import axios from "axios"
import AddExercise from "../../components/addExercise";
import Button from 'react-bootstrap/Button';
import Link from "next/link"
import Modal from 'react-bootstrap/Modal';

const ITEMS_PER_PAGE = 3;



export default function Page({exercises, totalPages}) {
  //Session
  const { data: session, status } = useSession()

  //Edit
  const [editableExerciseId, setEditableExerciseId] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [text, setText] = useState(null);

  //Confirm
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletableExerciseId, setDeletableExerciseId] = useState(null);

  const handleClose = () => setShowConfirm(false);

  const handleShow = (itemId) => {
    setShowConfirm(true);
    setDeletableExerciseId(itemId);
  }

  //Refresh
  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath);
  }

  //Handle
   async function handleDelete (itemId) {
    try {
      await axios.delete('/api/exercises', {data: {id: itemId}});
      setDeletableExerciseId(null);
      setShowConfirm(false);
      refreshData();
    } catch (error) {
      console.error(error);
    }
  }

  const handleEdit = (id) => {
    setEditableExerciseId(id);
    setCanEdit(true);
  };


  async function handleSave(id)  {
    setEditableExerciseId(null);

    if (text) {
      const name = text[0].textContent
      const description = text[1].textContent
      if (name && description){
        try {
          await axios.put('/api/exercises', {data: {id: id, name: name, description: description}})
          refreshData();
        } catch (error) {
          console.error(error);
        } 
  
        setCanEdit(false);
      }
      else {
        alert("Please fill all fields");
        setEditableExerciseId(id);
      }
    }
       
  };
  if (status==="loading"){
    // return (<span>Loading</span>)
    return ("<span>Loading</span>")
   }
   //data: Session / undefined / null
   if (!session){
     return (<span>Please sign in first</span>)
   }
   if (session){
    return (
      <>
      <div className="container-md">
      <br></br>
        {session?.user?.isAdmin ? <AddExercise></AddExercise> : null}
        <br></br>
        <h3>Exercise list</h3>
        <br></br>

        

        <ul className="list-group">
          {exercises?.map((exercise) => (
            <li className="list-group-item" key={exercise.id} contentEditable={canEdit && exercise.id === editableExerciseId} suppressContentEditableWarning={true} onInput={e => setText(e.currentTarget.childNodes)}>
              <h5>{exercise.name}</h5>
              <p>{exercise.description}</p>
              {session?.user?.isAdmin ? (
                <>
                <Button variant="outline-danger" onClick={() => handleShow(exercise.id)}>Delete</Button>
                <Button variant="outline-primary" onClick={() => handleEdit(exercise.id)}>Edit</Button>
                  {exercise.id === editableExerciseId && <Button variant="outline-success" onClick={() => handleSave(editableExerciseId)}>Save</Button>
                }
                  </>
                  ) : null}
             
            </li>
          ))}
        </ul>
        <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <Link href={`/exercises/exercises?page=${i + 1}`}>
            {i + 1}
          </Link>
        ))}
      </div>
        </div>

          {/* Confirmation box */}
        <Modal show={showConfirm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to permanatly delete the exercise</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deletableExerciseId)}>
            Delete
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



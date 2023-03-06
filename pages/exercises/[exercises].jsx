import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useState } from "react";
import prisma from "../../lib/prismadb";
import axios from "axios"
import AddExercise from "../../components/addExercise";
import Button from 'react-bootstrap/Button';

export default function Page({exercises}) {
  const { data: session, status } = useSession()

  const [editableExerciseId, setEditableExerciseId] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [text, setText] = useState(null);

  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath);
  }

   async function handleDelete (itemId) {
    try {
      await axios.delete('/api/exercises', {data: {id: itemId}});
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
                <Button variant="outline-danger" onClick={() => handleDelete(exercise.id)}>Delete</Button>
                <Button variant="outline-primary" onClick={() => handleEdit(exercise.id)}>Edit</Button>
                  {exercise.id === editableExerciseId && <Button variant="outline-success" onClick={() => handleSave(editableExerciseId)}>Save</Button>
                }
                  </>
                  ) : null}
             
            </li>
          ))}
        </ul>
        </div>
      </>
    );
  }

}
 
export async function getServerSideProps() {
  const exercises = await prisma.exercises.findMany()
  return {
    props: {
      exercises
    }
  }
}
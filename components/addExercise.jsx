import { useState } from 'react'
import axios from "axios"
import { useRouter } from 'next/router'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function AddExercise() {
  const router = useRouter();

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const refreshData = () => {
    router.replace(router.asPath);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/exercises", {name, description});
      refreshData();
    } catch (error) {
      console.error(error);
    }
  }

    return (
      <>
<div className="container-sm">
<Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="exerciseName">
        <Form.Label>Exercise Name</Form.Label>
        <Form.Control type="text" placeholder="Enter exercise name" required value={name} onChange={(e) => setName(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="exerciseDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" placeholder="Enter exercise description" required value={description} onChange={(e) => setDescription(e.target.value)}/>
      </Form.Group>
      <Button variant="primary" type="submit">
        Add
      </Button>
    </Form>
    </div>
      </>
    )
  

}
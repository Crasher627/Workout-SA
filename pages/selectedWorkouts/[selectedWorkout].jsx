import { useSession } from "next-auth/react"
import { Button } from "react-bootstrap";
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap";
import axios from "axios"
import Link from "next/link"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';

export default function Page({workout}) {
    const { data: session, status } = useSession();

    //Refresh
  const router = useRouter()
  //const workoutPlanId = Number(router.query.data);

  const refreshData = () => {
    router.replace(router.asPath);
  }

  const [inputData, setInputData] = useState({});
  const [totalVolume, setTotalVolume] = useState(0);

  

  const handleInputChange = (event, setId) => {
    const { name, value } = event.target;
    setInputData((prevState) => ({
      ...prevState,
      [setId]: {
        ...prevState[setId],
        [name]: value,
      },
    }));
  };

  const setDefaultData = () => {
    const defaultData = {};
    workout.workoutPlanExercises.forEach((exercise) => {
      exercise.workoutPlanExerciseSets.forEach((set) => {
        defaultData[set.id] = {
          reps: set.reps,
          weight: set.weight,
        };
      });
    });
    setInputData(defaultData);
  };

  useEffect(() => {
    setDefaultData();
  }, [workout]);

  const updateSets = async () => {
    try {
      const updatedSets = await axios.put(`/api/sets`, inputData);
      console.log(updatedSets);
      setModalOpen(false);
      router.push("/workouts/workouts");
    } catch (error) {
      console.log(error);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    let volume = 0;
    Object.values(inputData).forEach((set) => {
      volume += set.reps * set.weight;
    });
    setTotalVolume(volume);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const filteredExercises = workout.workoutPlanExercises.filter((exercise) => {
    return exercise.workoutPlanExerciseSets.some((set) => {
      return inputData[set.id] && 
      ((inputData[set.id].weight > Math.max(...set.setHistory.map((history) => history.weight)) && inputData[set.id].weight > set.weight)
      || (inputData[set.id].reps > Math.max(...set.setHistory.map((history) => history.reps))) && inputData[set.id].reps > set.reps);
    });
  });
  


  if (status==="loading"){
    return ("<span>Loading</span>")
   }
   //data: Session / undefined / null
   if (!session){
     return (<span>Please sign in first</span>)
   }
   if (session){
    return (<>

        <div className="container">
            <h3 className="text-center">{workout.workoutName}</h3>
            {workout.workoutPlanExercises.length > 0 ? (workout.workoutPlanExercises.map((exercise) => (
            <>
              <Accordion>
              <Accordion.Item eventKey={exercise.id}>
              <Accordion.Header>{exercise.exercise.name}</Accordion.Header>
                  
                  <Accordion.Body>
                  <p>{exercise.exercise.description}</p>
                  {exercise.workoutPlanExerciseSets.map((set) => (
                    <li key={set.id}>
                      <p>Set num: {set.setNumber}</p>
                      <div className="row">
                        <div className="col-sm-2">
                          <div className="row">
                            <div className="col-sm-4">
                              <p>Reps: </p>
                            </div>
                            <div className="col-sm-8">
                              <input defaultValue={set.reps} className="w-50" type="number" min="0" name="reps" onChange={(e) =>
                            handleInputChange(e, set.id)
                          }></input>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="row">
                            <div className="col-sm-4">
                              <p>Weight: </p>
                            </div>
                            <div className="col-sm-8">
                              <input defaultValue={set.weight} className="w-50" type="number" min="0" name="weight" onChange={(e) =>
                            handleInputChange(e, set.id)
                          }></input>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="row">
                            <div className="col-sm-4">
                              <p>Weight record: </p>
                            </div>
                            <div className="col-sm-8">
                            <p>{Math.max(...set.setHistory.map(h => h.weight)) > set.weight ? `${Math.max(...set.setHistory.map(h => h.weight))} x 
                            ${set.setHistory.find(h => h.weight === Math.max(...set.setHistory.map(h => h.weight)))?.reps}` : `${set.weight} x ${set.reps}`}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="row">
                            <div className="col-sm-4">
                              <p>Reps record: </p>
                            </div>
                            <div className="col-sm-8">
                            <p>{Math.max(...set.setHistory.map(h => h.reps)) > set.reps ? `${Math.max(...set.setHistory.map(h => h.reps))} x 
                            ${set.setHistory.find(h => h.reps === Math.max(...set.setHistory.map(h => h.reps)))?.weight}` : `${set.weight} x ${set.reps}`}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </>
            ))): <p>No exercises</p>}
            <div>
              <br></br>
            <Button className="btn btn-success w-100" onClick={openModal}>Show Summary</Button>
        

      </div>
        </div>

        <Modal show={modalOpen} onHide={closeModal} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Summary</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
    <div>
      <h4>Total volume lifted:</h4>
      <p>{totalVolume}</p>
    </div>
    <br></br>
    <div>
    {filteredExercises.length > 0 ?<h4>Records broken:</h4>: null}
    {filteredExercises.length > 0 ? filteredExercises.map((exercise) => (
      <div key={exercise.id}>
        <h5>{exercise.exercise.name}</h5>
        <ul>
          {exercise.workoutPlanExerciseSets.map((set) => {
            if (inputData[set.id].weight > Math.max(...set.setHistory.map((history) => history.weight))) 
            {
              return (
                <li key={set.id}>
                  Set {set.setNumber}: {inputData[set.id].reps} reps, {inputData[set.id].weight} weight
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    )): <h4>No records were broken</h4>}
    </div>
  </Modal.Body>
  <Modal.Footer>
  <Button variant="success" onClick={() => updateSets()}>Finish workout</Button>
    <Button variant="secondary" onClick={closeModal}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

    </>)
   }
}

export async function getServerSideProps({ req, res, query }) {
    const session = await getServerSession(req, res, authOptions);
    const userId = session?.user?.id;
    const workoutPlanId = Number(query.data);

    const workout = await prisma.workoutPlan.findFirst({
        where: {
          userId: userId,
            id: workoutPlanId
        },
        include: {
          workoutPlanExercises: {
            include: {
              exercise: true,
              workoutPlanExerciseSets: {select: {
                id: true,
                setNumber: true,
                reps: true,
                weight: true,
                setHistory: {
                  select: {
                    id: true,
                    reps: true,
                    weight: true,
                    date: true,
                  }
                }
              }},
            }}}
      });

      workout.workoutPlanExercises.forEach((exercise) => {
        exercise.workoutPlanExerciseSets.forEach((set) => {
          set.setHistory.forEach((history) => {
            history.date = history.date.toString();
          });
        });
      });

      return {
        props: {
          workout
        },
      };
}
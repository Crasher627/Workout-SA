import { useSession } from "next-auth/react"
import { Button } from "react-bootstrap";
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from "axios"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';

export default function Page({workout}) {
    const { data: session, status } = useSession();

  const router = useRouter()
  const workoutPlanId = Number(router.query.data);


  const [inputData, setInputData] = useState({});
  const [totalVolume, setTotalVolume] = useState(0);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = () => setShowConfirm(false);

  const handleShow = () => {
    setShowConfirm(true);
  }

  const handleClear = () => {
    setShowConfirm(false);
    localStorage.removeItem('inputData');
    localStorage.removeItem('timer');
    router.push("/workouts/workouts");
  }
  

  const handleInputChange = (event, setId) => {
    const { name, value } = event.target;
    setInputData((prevState) => ({
      ...prevState,
      [setId]: {
        ...prevState[setId],
        [name]: value,
      },
    }));
    localStorage.setItem('inputData', JSON.stringify({
      ...inputData,
      [setId]: {
        ...inputData[setId],
        [name]: value,
      },
    }));
  };
  



  const setDefaultData = () => {
    const savedData = localStorage.getItem('inputData');
    if (savedData) {
      setInputData(JSON.parse(savedData));
    } else {
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
      localStorage.setItem('inputData', JSON.stringify(defaultData));
    }
  };
  
  

  useEffect(() => {
    setDefaultData();
  }, [workout]);

  const updateSets = async () => {
    try {
      await axios.put(`/api/sets`, inputData);
      await axios.post(`/api/workoutLogs`, {workoutPlanId, hours, minutes, seconds});
      setModalOpen(false);
      localStorage.removeItem('inputData');
      localStorage.removeItem('timer');
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

  // timer
const [hours, setHours] = useState(() => {
  if (typeof window !== "undefined") {
    const storedTime = localStorage.getItem("timer");
    if (storedTime) {
      return JSON.parse(storedTime).hours;
    }
  }
  return 0;
});
const [minutes, setMinutes] = useState(() => {
  if (typeof window !== "undefined") {
    const storedTime = localStorage.getItem("timer");
    if (storedTime) {
      return JSON.parse(storedTime).minutes;
    }
  }
  return 0;
});
const [seconds, setSeconds] = useState(() => {
  if (typeof window !== "undefined") {
    const storedTime = localStorage.getItem("timer");
    if (storedTime) {
      return JSON.parse(storedTime).seconds;
    }
  }
  return 0;
});

useEffect(() => {
  const interval = setInterval(() => {
    setSeconds((prevSeconds) => {
      if (prevSeconds === 59) {
        setMinutes((prevMinutes) => {
          if (prevMinutes === 59) {
            setHours((prevHours) => prevHours + 1);
            return 0;
          }
          return prevMinutes + 1;
        });
        return 0;
      }
      return prevSeconds + 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);


useEffect(() => {
  localStorage.setItem("timer", JSON.stringify({ hours, minutes, seconds }));
}, [hours, minutes, seconds]);


  


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
            <h4>Time: {`${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</h4>
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
                              <input defaultValue={set.reps} value={inputData[set.id]?.reps} className="w-50" type="number" min="0" name="reps" onChange={(e) =>
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
                              <input defaultValue={set.weight} value={inputData[set.id]?.weight} className="w-50" type="number" min="0" name="weight" onChange={(e) =>
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
      <div>
      <br></br>
            <Button className="btn btn-danger w-100" onClick={handleShow}>Discard changes</Button>
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
      {exercise.workoutPlanExerciseSets.filter((set) => {
        return inputData[set.id] && 
          ((inputData[set.id].weight > Math.max(...set.setHistory.map((history) => history.weight)) && inputData[set.id].weight > set.weight)
          || (inputData[set.id].reps > Math.max(...set.setHistory.map((history) => history.reps))) && inputData[set.id].reps > set.reps);
      }).map((set) => {
        return (
          <li key={set.id}>
            Set {set.setNumber}: {inputData[set.id].reps} reps, {inputData[set.id].weight} weight
          </li>
        );
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

{/* Clear local storage modal */}
<Modal show={showConfirm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Discard changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to permanatly discard changes?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleClear()}>
            Discard
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
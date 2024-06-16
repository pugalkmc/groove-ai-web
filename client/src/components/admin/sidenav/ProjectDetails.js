import { useState, useEffect } from "react";
import axiosInstance from "../../../config";
import './styles.css'

function ProjectDetails() {
  const [project, setProject] = useState({
    name: "",
    email: "",
  });

  const [ formData , setFormData ] = useState(project);
  const [ dataChanged , setDataChanged ] = useState(false);
  const [ savingStatus , setSavingStatus ] = useState(false);
  // const [ error, setError ] = useState('');

  const [ formStatus, setFormStatus ] = useState(false);


  const dataChangeHandler = (event)=>{
    setDataChanged(true);
    setFormData({...formData, [event.target.id]: event.target.value})
  }

  useEffect(()=> {
    const fetchData = async ()=> {
      await axiosInstance.get("/api/project/details")
      .then(res => {
        setProject(res.data);
      })
      .catch(err => {
        console.log(err);
      })
    };

    fetchData();
  },[])

  const handleSubmit = async (event)=> {
    event.preventDefault();
    setSavingStatus(true);
    await axiosInstance.post("/api/project/details", formData)
    .then( res => {
      setProject(formData);
      setFormStatus(false);
    })
    .catch(err => {
      console.log(err);
    })
    
    // if ( response.status === 200 ){
      setProject(formData);
      setFormStatus(false);
    // }
    // else {
    //   // setError("Error saving details");
    //   alert("Error saving details");
    // }

    setSavingStatus(false);
    setDataChanged(false);
  }

  return (
    <section>
      <h3 className='text-center' style={{fontSize: 26}}>Project Details</h3>
      {
        formStatus===true ? (
          <form className="project-details-form mt-1" onSubmit={handleSubmit}>
          <div className="mt-3">
            <label htmlFor="name" className="d-block form-label">Project Name</label>
            <input type="text" min={1} id="name" className="form-control" value={formData.name} onChange={(e) => dataChangeHandler(e)} required></input>
          </div>
          <div className="mt-4">
            <label htmlFor="email" className="d-block form-label">Official Email</label>
            <input type="email" min={1} id="email" className="form-control" value={formData.email} onChange={(e) => dataChangeHandler(e)} required></input>
            <p>This email will be used by our admin to contact, if any details needed</p>
          </div>
          <button className="btn btn-success" disabled={!dataChanged} type="submit">{savingStatus ? 'Saving..' : 'Save'}</button><button className="btn btn-danger ml-3" type="button" onClick={()=> {setFormData({});setFormStatus(false)}}>Cancel</button>
        </form>
        ) : (
          <div className="project-details-container">
      <div className="mb-4">
        <label htmlFor="projectName" className="form-label">
          Project Name
        </label>
        <p className="form-control">{project.name}</p>
      </div>
      <div className="mb-4">
        <label htmlFor="projectEmail" className="form-label">
          Official Email
        </label>
        <p className="form-control">{project.email}</p>
      </div>
          <button className="btn btn-submit" onClick={()=> {setFormStatus(!formStatus);setFormData(project); setDataChanged(false); setSavingStatus(false);}}>Edit details</button>
        </div>

        
        )
      }
    </section>
  );
}

export default ProjectDetails;

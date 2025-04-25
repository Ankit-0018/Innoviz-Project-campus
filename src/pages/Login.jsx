import React, { useState } from 'react'
import { login } from '../feature/authService';
import { useNavigate , NavLink} from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import '../Login.css'


const Login = () => {
  
  const navigate = useNavigate();
  const { setProfile } = useProfile();
  const [details, setDetails] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    setDetails({
      email: "",
      password: ""
    });
    console.log(details);

    const { data, error } = await login(details.email, details.password);

    if (error) {
      console.log(error);
    } else {
      console.log("Logged In successfully", data);
      localStorage.setItem("supabase_session", JSON.stringify(data.session));
      navigate("/dashboard"); 
      
      setProfile(data)
    }
  }

  return (
<div className="container">
<div className=" max-w-mid max-h-520px p-10">
      <header className='flex justify-center items-center flex-col'>
        <h1 className='text-3xl font-bold text-[#9b87f6]'>Campus Watch</h1>
        <p className='mt-3'>Campus Issue Reporting Platform</p>
      </header>

      <div className="form border-2 border-blue-50 my-10 p-5 rounded-xl bg-white">
        <form onSubmit={handleSubmit}>
          <h2 className='text-center font-bold mb-4'>Log in With your Official ID.</h2>
          <div className="auth-detail flex flex-col">
            <label className='font-semibold'>Official Email</label>
            <input 
              type="email" 
              placeholder='you@official.ac.in'
              className='px-1 py-3 border-1 my-4 rounded'
              value={details.email}
              onChange={e => setDetails({ ...details, email: e.target.value })}
            />
            <label className='font-semibold'>Password</label>
            <input 
              type="password" 
              placeholder='....'
              className='px-1 py-3 border-1 my-4 rounded'
              value={details.password}
              onChange={e => setDetails({ ...details, password: e.target.value })}
            />
          </div>

          <button type="submit" className='w-full px-2 py-3 bg-[#9b87f6] mb-4 rounded-md text-white'>
            Log In
          </button>
         <p>Don't have an Account ? <NavLink to={"/register"} className="hover:text-blue">Register Here</NavLink></p>
          <p>@St Andrews Institute of Technology and Management.</p>
        </form>
      </div>
    </div>
</div>
    
  );
}

export default Login;

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { registerUser } from '../feature/authService';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    gender: "",
    phone: "",
    department: "",
    role: "",
    password: "",
    confirmPassword: ""
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [authId, setAuthId] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check for empty fields
    for (let key in registerData) {
      if (!registerData[key]) {
        alert(`Please fill in the ${key}`);
        return;
      }
    }
  
    // Password match check
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      // Check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users') // make sure this table exists and contains the email field
        .select('*')
        .eq('email', registerData.email)
        .single();
  
      if (existingUser) {
        alert("User with this email already exists.");
        return;
      }
  
      // Register user
      const { data, error } = await registerUser(registerData.email, registerData.password);
  
      if (error) {
        console.log("Authentication Error", error);
        alert("Registration failed. Please try again.");
        return;
      }
  
      setSuccessMsg("Registration successful! Please check your email to confirm your account.");
      console.log("Successfully registered:", data);
      
  
      // Insert user details using data.user.id directly
      const { error: insertError } = await supabase.from('users').insert({
        full_name: registerData.fullName,
        email: registerData.email.trim(),
        gender: registerData.gender,
        phone: registerData.phone,
        department: registerData.department,
        role: registerData.role,
        auth_id: data.user.id, // use data.user.id directly
        is_verified: false, 
      });
  
      if (insertError) {
        console.log("Insert error:", insertError);
        alert("Error saving user details.");
        return;
      }
  
      alert(successMsg)
    } catch (err) {
      console.error("Error checking user existence:", err);
      alert("An unexpected error occurred.");
    }
  
    // Clear form data after successful registration
    setRegisterData({
      fullName: "",
      email: "",
      gender: "",
      phone: "",
      department: "",
      role: "",
      password: "",
      confirmPassword: ""
    });
  };
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f9fafb] px-4">
      <h1 className="text-3xl font-bold text-purple-600 mb-1">Campus Watch</h1>
      <p className="text-center text-gray-600 mb-6">Campus Issue Reporting Platform</p>

      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-center text-lg font-semibold mb-4">Register with your Official ID</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {[
            { label: "Full Name", type: "text", key: "fullName", placeholder: "Your Name" },
            { label: "Official Email", type: "email", key: "email", placeholder: "you@official.ac.in" },
            { label: "Phone", type: "tel", key: "phone", placeholder: "1234567890" },
            { label: "Department", type: "text", key: "department", placeholder: "e.g., Computer Science" },
            { label: "Password", type: "password", key: "password", placeholder: "••••••••" },
            { label: "Confirm Password", type: "password", key: "confirmPassword", placeholder: "••••••••" }
          ].map(({ label, type, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                required
                value={registerData[key]}
                onChange={(e) => setRegisterData({ ...registerData, [key]: e.target.value })}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={registerData.gender}
              onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Not specified">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={registerData.role}
              onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already Have an account?{" "}
          <NavLink to={"/login"} className="hover:text-blue-500 font-medium">
            Login Here
          </NavLink>
          <br />
          @St Andrews Institute of Technology and Management.
        </p>
      </div>
    </div>
  );
};

export default Register;

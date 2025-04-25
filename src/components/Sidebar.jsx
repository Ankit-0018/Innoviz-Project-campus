import React, { useState } from 'react'
import { House, Flag, Package, Bell, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState('Dashboard')
  const Navigate = useNavigate();

  const navLinks = [
    { label: 'Dashboard', icon: <House /> },
    { label: 'Issues', icon: <Flag /> },
    { label: 'Lost&Found', icon: <Package /> },
    { label: 'MyIssues', icon: <Bell /> },
    { label: 'Profile', icon: <User /> }
  ]

  const handleLogout = async () =>{
const {error} = await supabase.auth.signOut()
if(error){
  console.log("Log Out error" , error)
}
else {
  console.log("Log Out successfully")
  localStorage.removeItem("supabase_session")
  Navigate("/login")
}

  }

  return (
    <div className='w-64 h-screen  bg-[#efebf9] '>
      <aside className='h-full w-full flex flex-col'>
        <div className='px-6 py-5'>
          <h1 className='text-2xl font-bold text-[#a68bf2]'>Campus Watch</h1>
          <h5 className='font-thin'>Campus Issue Reporting</h5>
        </div>

        <nav className='flex flex-col justify-between flex-1'>
          <ul className='px-2'>
            {navLinks.map((link) => (
              <li
                key={link.label}
                onClick={() => {
                  setActiveLink(link.label)
                  Navigate(`/${link.label}`)
                }}
                className={`flex items-center gap-3 cursor-pointer px-4 py-3 mb-2 rounded-md text-sm font-medium transition-all ${
                  activeLink === link.label
                    ? 'bg-[#a68bf2] text-white'
                    : 'text-gray-700 hover:bg-[#d7cbf9]'
                }`}
              >
                {link.icon}
                {link.label}
              </li>
            ))}
          </ul>

          <div className='px-4 py-6'>
            <button className='w-full py-3 bg-red-400 hover:bg-red-500 font-medium rounded-md text-white'  onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </nav>
      </aside>
    </div>
  )
}

export default Sidebar

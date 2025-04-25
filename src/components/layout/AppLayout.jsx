
import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => (
    <div className='flex'>
      <Sidebar />
      <main className='flex-1 p-4'>
       
        <Outlet />
      </main>
    </div>
  )

  export default AppLayout;
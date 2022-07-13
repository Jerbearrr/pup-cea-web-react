import React from 'react';
import { FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
const Trybtn= () => {

   const dispatch = useDispatch();
    const navigate = useNavigate();
    const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
    }

 return (
   

  
 
     <>
     <div id="dropdown" className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 absolute">
        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
          <li>
            <a href="/changepass" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Change Password</a>
          </li>
          <li>
             <a  href="/" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={onLogout}>Logout</a>
          </li>


        </ul>
      </div>                      
     </>
 );

};

export default Trybtn;
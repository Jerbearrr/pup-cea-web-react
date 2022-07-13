import React, { useEffect, useState, useContext } from 'react';

import { FaSearch } from "react-icons/fa";

import "./style/home.css";
import { FaChevronDown } from "react-icons/fa";
import "./style/browse.css";
import "./style/sidemenu.css";
import Menu from "./Menu.js";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../features/auth/requests";
import { UserContext } from '../features/UserContext';
import { toast } from 'react-toastify';
import { getFeaturedBook, getRecentlyAdded, resetBook } from '../features/book/bookSlice';
import { reset, getUser, logoutUser } from '../features/auth/authSlice'
import { Link } from 'react-router-dom';

const Hometopnav = () => {

  const { user, isLoading, isSuccess, isError, message, justloggedin } = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const onLogout = () => {
    dispatch(logoutUser())
    dispatch(reset())
    navigate('/')
  }

  const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )

  const userexist = getCookieValue('userpersist')

  

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userexist && !justloggedin) {
      dispatch(getUser())
      dispatch(reset())
    }

    if (isError === true) {
      toast.error(message);
      onLogout();
    }

   

  }, [])


  const [isActive, setActive] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
  };

  const onClickOutsideListener = () => {
    setActive(false)
    document.removeEventListener("click", onClickOutsideListener)
  }
  if (!userexist) {

    return (
      <>
        <div className='topnavcont phone:hidden laptop:block '> </div>

        <div className='navcont z-10 ' >
          <div className='navcontlist '>
            <div className='navcontul phone:py-3 tablet:py-5 laptop:py-6' >


              <div className='desktop:ml-5 phone:ml-2  phone:flex tablet:hidden' ><Menu /></div>

              <ul className='phone:hidden tablet:flex'>
                <div className='margnav'>
                  
                  <li className='mr-5'>
                    <Link to={`/`} >Home </Link>
                  </li>
                  
               
                  <li className='mx-5'>
                       <Link to={`/browse`} > Browse </Link>
                  </li>
                  
                  <li className='mx-5'>
                    <Link to={`/advancedsearch`} > Advanced Search </Link>
                  </li>
               
                  <li className='mx-5'>  <Link to={`/studentlogin`} >Login </Link>
                  
                  </li>
                  
                </div>

                <div className='phone:hidden laptop:block'>
                  <li className=' loginbtnnav mr-5' style={{boxShadow:'none'}}>
                    <a href="/">Welcome Guest!</a>
                  </li>
                </div>

              </ul>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className='topnavcont phone:hidden laptop:block '> </div>

        <div className='navcont z-10 ' >
          <div className='navcontlist '>
            <div className='navcontul phone:py-3 tablet:py-5 laptop:py-6' >


              <div className='desktop:ml-5 phone:ml-2 mr-3 phone:flex tablet:flex' ><Menu /></div>


              <ul className='phone:hidden tablet:flex'>
                <div className='margnav flex flex-row items-center'>

                  
                  <li className='mr-5'>
                   <Link to={`/`} > Home </Link>
                  </li>
                  
                  
                  <li className='mx-5'>
                  <Link to={`/browse`} >  Browse</Link>
                  </li>
                 
                  <li className='mx-5'>
                     <Link to={`/advancedsearch`} > Advanced Search</Link>
                  </li>

                  <li>

                  </li>


                </div>

                <div className='phone:hidden laptop:block relative mr-5' >
                  <li className=' loginbtnnav  '  style={{boxShadow:'none'}}>
                    <a href="/">{`Welcome ${ user && userexist? user.firstName?  user.firstName: 'Visitor':'Visitor' } !`}</a>
                    <button className='mx-1' type='button' id="dropdownDefault"  onClick={toggleClass}  onMouseLeave={() => {
          document.addEventListener("click", onClickOutsideListener)
        }} ><FaChevronDown /></button>

                  </li>
                  <div id="dropdown2" className={" absolute  flex-col  z-100 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 " + (isActive ? 'flex' : 'hidden')}>
                    <ul className="py-1 flex flex-col text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                      <li>
                        <a href="/changepass" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Change Password</a>
                      </li>
                      <li>
                        <a className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={onLogout} >Logout</a>
                      </li>


                    </ul>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Hometopnav;
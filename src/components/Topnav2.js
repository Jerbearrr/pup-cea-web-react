import React, { useEffect, useState, useContext } from 'react';
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import "./style/browse.css";
import "./style/sidemenu.css";
import Menu from "./Menu.js";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../features/auth/requests";
import { UserContext } from '../features/UserContext';
import { toast } from 'react-toastify';
import { logout, reset } from '../features/auth/authSlice';
import { resetBook, searchBook } from '../features/book/bookSlice';


const Topnav = () => {

 
 

  const dispatch = useDispatch();


  const [isActive, setActive] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
  };


  return (
    <>

      <div className='topnavcont2 z-100 '>
        <div className='navcont navcont2 z-10' >
          <div className='navcontlist2 '>
            <div className='navcontul2 ' >


              <ul className='topnavmid topnavmid2'  >

                <div className=' namidfirst phone:flex' >
                  <Menu />




                  <li className='namidlogo phone:hidden tabletlg:block'>
                    <a href="/"> <img className='logohome2' src={require('.//style/images/logo.png')} /> </a>
                  </li>
                  <li className='phone:hidden tablet:flex' >
                    <a href="/"> PUP WEB Library </a>
                  </li>

                </div>
                <div className='searchbartop'>

                  <form className='relative flex w-full justify-end phone:mr-0 tablet:mr-1 tabletlg:mr-0 ' action='/advancedsearch'>
                    <input className='w-full  searchfield2 text-black' type="text" name="title" placeholder="Search book..." required=""></input>
                    <button type="submit" title="Search" aria-label="Submit Search" className='searchbtn2 '><div><FaSearch /></div></button>
                  </form>


                </div>
               <div className='phone:hidden laptop:block'>
                  <li className=' loginbtnnav '>
                    <a href="/">Welcome Guest!</a>
                  </li>
                </div> 

            


                 </ul>
            </div>
          </div>
        </div>


      </div>










    </>





  );

};

export default Topnav;
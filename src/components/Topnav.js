import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import "./style/browse.css";
import "./style/sidemenu.css";
import Menu from "./Menu.js";
import 'flowbite';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { searchBook } from '../features/book/bookSlice';

const Topnav = () => {
    const [searchData, setSearchData] = useState({
        title: ''
    });
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    }

    const onSearch = (e) => {
        setSearchData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault();

        dispatch(searchBook(searchData));
        navigate('/advancedsearch')
    }

    return (
        <>
            <div className='topnavcont2  '>
                <div className='navcont navcont2' >
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
                                </div>
                                <div className='searchbartop'>
                                    <form className='relative flex w-full justify-end phone:mr-2 tablet:mr-1 tabletlg:mr-0 '>
                                        <input className='w-full  searchfield2 text-black' type="text" name="title" placeholder="Search book..." required="" onChange={onSearch}></input>
                                        <button type="submit" title="Search" aria-label="Submit Search" className='searchbtn2 ' onSubmit={onSubmit}><div><FaSearch /></div></button>
                                    </form>
                                </div>
                                <div className='phone:hidden laptop:block'>
                                    {user ?
                                        (
                                            <li className=' loginbtnnav '>
                                                <a href="/"> Welcome {`${user.firstName} ${user.lastName}`}  </a>
                                                <button className='mx-1' type='button' id="dropdownDefault" data-dropdown-toggle="dropdown"  >< FaChevronDown /></button>
                                            </li>
                                        ) :
                                        (
                                            <li className=' loginbtnnav '>
                                                <a href="/">Welcome Guest!</a>
                                            </li>
                                        )
                                    }
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>

                <div id="dropdown" className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 absolute">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                        <li>
                            <a href="/changepass" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Change Password</a>
                        </li>
                        <li>
                            <button className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={onLogout}>Logout</button>
                        </li>


                    </ul>
                </div>

            </div>










        </>





    );

};

export default Topnav;
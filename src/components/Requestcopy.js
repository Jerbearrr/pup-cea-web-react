import React, { useEffect, useState, useContext } from 'react';
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/bookmarks.css";
import "./style/borrow.css";
import { apiClient } from "../features/auth/requests";
import { UserContext } from '../features/UserContext';
import { useNavigate, Link } from 'react-router-dom';

const Requestcopy = () => {

  const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )
  const userexist = getCookieValue('userpersist')




  return (
    <>



      <div className='recentlyCont  flex '>

        <div className='recentCont pt-3 addnav '>
          <div className='text-black recenthead recentContCont '>

            <div className='flex bookmarkshead  mt-3 mb-2 flex-row  items-center'>
              <Link to='/borrow' className='bkmrkhead px-2 py-1' >Borrow Status</Link>
              <Link className='bkmrkhead px-2 py-1' to='/requestedcopy ' style={{ backgroundColor: '#a43033' }}>Requested copy</Link>

            </div>
            <div className='flex  optionborrow w-full justify-end pb-2'>
              <select className='borrowstatusselect py-0   '>
                <option selected>All</option>
                <option value="1">Pending</option>
                <option value="2">Copy sent</option>

              </select></div>

            <div className='  grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 gap-1 '>

              <p className='hidden laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p>










            </div>











          </div>


        </div>


      </div>




    </>

  );


};

export default Requestcopy;
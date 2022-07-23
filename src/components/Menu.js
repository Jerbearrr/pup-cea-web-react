import React, {useEffect, useState, useContext} from 'react';
import { FaChevronLeft } from "react-icons/fa";
import { ReactDimmer } from "react-dimmer";
import "./style/sidemenu.css";
import { Link, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../features/auth/requests";
import { UserContext } from '../features/UserContext';
import { toast } from 'react-toastify';
import { reset,  getUser, logoutUser } from '../features/auth/authSlice'
import { slide as SideMenu } from 'react-burger-menu';

const Menu = ({setpageloader}) => {
const location = useLocation();
  const [isMenuOpen, setMenu] = useState(false);
  const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    setMenu(false)

  },[location])

 const onLogout = () => {
   
   if(setpageloader){
       setpageloader(null)
    }
   
    dispatch(logoutUser())
    dispatch(reset())
    
    
  }

const getCookieValue = (name) => (
document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)
  
  const userexist = getCookieValue('userpersist')




  // Get current user from redux 


  const handleMenu = () => {
  
    setMenu((prevState) => !prevState);
  };

   
  return (
    <>
     
      <div className='fabar phone:block phone:ml-2 desktop:ml-0 mr-2 self-center' onClick={handleMenu} ><GiHamburgerMenu /></div>
      <SideMenu isOpen={ isMenuOpen } disableAutoFocus  overlayClassName={ "my-class" }  customBurgerIcon={ false } >
      
      <div className='my-class' onClick={handleMenu}></div>
      <div className={'app-menu ' + (isMenuOpen ? 'menu-open' : '')}>
        <div className='menuheader py-4 px-4 ' style={{ backgroundImage: 'url(' + require('.//style/images/bg.png') + ')', backgroundPosition:'center' }} onClick={handleMenu} ><FaChevronLeft /><p className='font-semibold'>PUP CEA WEB Library</p> </div>
        <ul className='mt-3 sidemenus flex flex-col '>
           
          <li className='sidemenu py-4'>
           <Link to={`/`} > <h2>Home</h2></Link>
          </li>
          
          <li className='sidemenu py-4'>
             <Link to={`/browse`} ><h2>Browse</h2></Link>
          </li>
         
          <li className='sidemenu py-4'>
             <Link to={`/advancedsearch`} > <h2>Advanced Search</h2></Link>
          </li>
        {userexist? <>
          { user?.role === '4d3b'? 
               <>
                    
                <li className='sidemenu py-4'>
                  <Link to={`/bookmarks`} ><h2>Bookmarks</h2> </Link>
                </li>
               
                    
                <li className='sidemenu py-4'>
                  <Link to={`/borrow`} ><h2>Borrow </h2>  </Link>
                </li>
                     
                <li className='sidemenu py-4'>
                  <Link to={`/contribute`} ><h2>Contribute </h2></Link>
                </li>    
           </>: <></>
           }
          
         { user?.role === 'b521c'? 
                <>
                
                <li className='sidemenu py-4'>
                 <Link to={`/addbook`} > <h2>Manage Books </h2></Link>
                </li>
                   
                <li className='sidemenu py-4'>
                  <Link to={`/requests`} > <h2>Manage Requests </h2></Link>
                </li>
                
                
                <li className='sidemenu py-4'>
                    <Link to={`/signuprequests`} ><h2>User Requests </h2> </Link>
                </li>
               
                <li className='sidemenu py-4'>
                  
                 <Link to={`/filerequests`} > <h2>Digital Copy Requests</h2></Link>
                </li>
                 
                 <li className='sidemenu py-4'>
                  
                 <Link to={`/controlpanel`} > <h2>Control Panel</h2></Link>
                </li>
                
            </>: <></>
           }

            <li className='sidemenu py-4'>
                  <Link to='/changepassword'> <h2>Change Password</h2></Link>
            </li>
         { user?.role === 'b521c' || user.role === '4d3b' ? 
           
              <li className='sidemenu py-4'>
                  <a  onClick={onLogout} > <h2>Logout</h2></a>
              </li>:
             
            <li className='sidemenu py-4'>
                 <Link to={`/studentlogin`} ><h2>Login</h2></Link>
             </li>
            }
        </>:  
            
            <li className='sidemenu py-4'>
                <Link to={`/studentlogin`} >    <h2>Login</h2> </Link>
             </li>
            }

        </ul>


      </div>
      </SideMenu>

    </>




  )};



export default Menu;
import React, {useEffect, useState, useContext} from 'react';
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/bookmarks.css";
import { apiClient } from "../features/auth/requests";
import { UserContext } from '../features/UserContext';
import { useNavigate, Link } from 'react-router-dom';

const Likedbooks= () => {
const {  loading, userRole } = useContext(UserContext) 
const getCookieValue = (name) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)
const userexist = getCookieValue('userpersist')



const logout = async () => {

        
        localStorage.removeItem('userpersist')
        document.cookie = "userpersist=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        try {
            await apiClient.get('/logout', {
                withCredentials: true
            });
        } catch (err) {
            console.error(err);
        }
    


}



if(userexist){
if(loading === false){
   if(!userRole ){
     console.log('loading is no user')
   }else{
     if(loading === false){
       
    if(userRole.role === '4d3b'){
           console.log('user granted access')
      }else{
         window.location.href='/'
      }
    
     }else{
       console.log('loading is true please wait')

     }
   }
}
}else{
  
  logout();
  window.location.href='/studentlogin'

}

  
    return (
        <>
        
        
        
        <div className='recentlyCont  flex '>
      
         <div className='recentCont pt-3 addnav '>
         <div className='text-black recenthead recentContCont '>
                 
         <div className='flex bookmarkshead  mt-3 mb-2 flex-row  items-center'>

        <Link className='bkmrkhead px-2 py-1' to='/bookmarks' >Bookmarks</Link>
        <Link className='bkmrkhead px-2 py-1' to='/likedbooks' style={{backgroundColor:'#a43033'}}>Liked books</Link>
         

         </div>
         <div className=' grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 gap-1 '>
            
             <div className='bookmarkcontainer text-white flex flex-row px-2 py-3 relative'>
             <div className='blurthis absolute ' style={{backgroundImage: 'url(' + require('.//style/images/bg2.png') + ')',zIndex:"1",filter:'blur(90%)'}}>   </div>
            
            <div className='bookmarksimgcont relative  ' style={{zIndex:"2"}}>
              <img className=" " src={require('.//style/images/harry.jpg')} alt="Mountain"/>
            </div>
            <div className=' relative removeshadow text-white flex flex-col px-2'  style={{zIndex:"2"}}>
             <h4 className='removeunderline' >Now I Will make the title of this journal to two lines and i hope it works well and if it exceeds three lines then the text will be clipped by the css</h4>
             <h5>Author</h5>
             <h6>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</h6>
           </div>

           </div>
                     <div className='bookmarkcontainer text-white flex flex-row px-2 py-3 '>
            
            <div className='bookmarksimgcont '>
              <img className=" " src={require('.//style/images/bg.png')} alt="Mountain"/>
            </div>
            <div className=' removeshadow text-white flex flex-col px-2'>
             <h4 className='removeunderline' >Now I Will make the title of this journal to two lines and i hope it works well and if it exceeds three lines then the text will be clipped by the css</h4>
             <h5>Author</h5>
             <h6>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</h6>
           </div>

           </div>
                     <div className='bookmarkcontainer text-white flex flex-row px-2 py-3 '>
            
            <div className='bookmarksimgcont '>
              <img className=" " src={require('.//style/images/harry.jpg')} alt="Mountain"/>
            </div>
            <div className=' removeshadow text-white flex flex-col px-2'>
             <h4 className='removeunderline' >Now I Will make the title of this journal to two lines and i hope it works well and if it exceeds three lines then the text will be clipped by the css</h4>
             <h5>Author</h5>
             <h6>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</h6>
           </div>

           </div>
                     <div className='bookmarkcontainer text-white flex flex-row px-2 py-3 '>
            
            <div className='bookmarksimgcont '>
              <img className=" " src={require('.//style/images/bg2.png')} alt="Mountain"/>
            </div>
            <div className=' removeshadow text-white flex flex-col px-2'>
             <h4 className='removeunderline' >Now I Will make the title of this journal to two lines and i hope it works well and if it exceeds three lines then the text will be clipped by the css</h4>
             <h5>Author</h5>
             <h6>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</h6>
           </div>

           </div>
       
   
    
             
           
         </div>
       
         
       
         


                


                 

                </div>
   

          </div>
       

        </div>
        
   


        </>

    );
    

};

export default Likedbooks;
import React, {useState, useEffect} from 'react';
import {FaAngleUp} from 'react-icons/fa';
import "./style/advancedsearch.css";
import { useLocation } from 'react-router-dom';
const Scrolltotopbutton = (isloaded) =>{
  const location = useLocation();
  const loadedadv = isloaded
  const [visible, setVisible] = useState(false)
  const [currentloc, setcurrentloc]= useState(null)
  const [scrolledd, setscrolled] = useState(0)
  const [scrolltotop, setscrolltotop] = useState(null)
  
  const toggleVisible = () => {
    
    
    
  
  };
   useEffect(()=>{
    var currloc = location.pathname

    setcurrentloc(currloc)
  },[location])

  useEffect(()=>{
    window.addEventListener('scroll', setscrolltotop);
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300 && !isloaded.loadedadv && currentloc === '/advancedsearch'){
      setVisible(true)
    } 
    else if (scrolled <= 300  && !isloaded.loadedadv && currentloc === '/advancedsearch') {
      setVisible(false)
    }

    return function cleanupListener() {
      window.removeEventListener('scroll', setscrolltotop)
    }
  },[scrolledd, scrolltotop])
  
  const scrollToTop = () =>{
    window.scrollTo({
      top: 0, 
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };
  
  
  if(!isloaded.loadedadv && currentloc === '/advancedsearch'){
  return (
          <div className='backtotopbtn fixed bottom-8 text-white z-10 right-0 phone:py-2 phone:px-3 tabletlg:py-4 tabletlg:px-8' onClick={scrollToTop}  style={{marginRight: visible ? '0' : '-100px'}}><FaAngleUp/></div>
  )}else{return null}
}
  
export default Scrolltotopbutton;
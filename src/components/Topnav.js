import React, { useEffect, useState, useContext, useRef } from 'react';
import { FaSearch } from "react-icons/fa";
import { FaChevronDown,FaUserCircle } from "react-icons/fa";
import { IoMdNotificationsOutline, IoMdKey} from "react-icons/io"
import { IoLogOutOutline} from "react-icons/io5"
import "./style/browse.css";
import "./style/sidemenu.css";
import Menu from "./Menu.js";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { reset, getUser, logoutUser } from '../features/auth/authSlice'
import { apiClientBookPublic, apiClient, apiClientBook, SSEURL } from '../features/auth/requests';
import { getNotifs } from '../features/book/bookSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { format, compareAsc, formatDistance, subDays } from 'date-fns';


const Topnav = () => {
  const location = useLocation();
  const { user, isLoading, isSuccess, isError, message,  justloggedin } = useSelector(state => state.auth);
  const [currentloc, setcurrentloc]= useState(null)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logoutUser())
    dispatch(reset())

  }

  useEffect(()=>{
    if(isError){
      dispatch(reset())
    }
  },[isError])

  const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )

  const userexist = getCookieValue('userpersist')

  useEffect(()=>{
    var currloc = location.pathname

    setcurrentloc(currloc)
  },[location])

  useEffect(() => {
    
    
    

    if (userexist && !justloggedin) {
      dispatch(getUser());
   
     dispatch(reset())
    }
    


  }, [justloggedin])


  const elementRef = useRef();
  const divElement = elementRef.current;
  const [bookSearch, setbookSearch] = useState('');
  const [fetchedbook, setfetchbook]= useState('');
  const [searchloading, setsearchloading]=useState('');
  const [searchresultdiv , setsearchresultdiv]=useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(bookSearch);
    
  useEffect(() => {
        setsearchresultdiv(true)
         setsearchloading(true);
        const timer = setTimeout(() => setbookSearch(debouncedTerm), 1000);
        return () => clearTimeout(timer);
     
         
    }, [debouncedTerm])

    
    useEffect(() => {
     const getsearch = async()=>{
          
       const query =  await apiClientBookPublic.get(`/getlivesearch?search=${bookSearch}`)
      
  
       setfetchbook(query.data) 
       setsearchloading(false);
       

     }
     
      if(bookSearch !== ''){

     
          console.log('pleasewait')
      
          
        getsearch() 
        
        
             
      }else{
        setsearchresultdiv(false)
      }
    }, [bookSearch]);

  const [notifActive, setnotifActive] = useState(false);
  const [fetchnotification, setfetchnotification] = useState('');
  const [notifloading, setnotifloading] = useState(true);
  const [notifpage, setnotifpage] = useState(1)
  const [fetching, setfetching ] = useState(false)
  const [hasMore, sethasMore] = useState(true);
  const [unreadnotifs, setunreadnotifs] = useState(0)
  const [startfetching, setstartfetching] =useState(false)
  const [newlyfetchednotif, setnewlyfetchednotif] = useState(null)


  useEffect(async()=>{
  
   
    const getnotif = async()=>{   
     const querynotif =  await apiClientBook.get(`/userNotifications?page=${notifpage}`).then((query)=>{
      if(query){
        setfetchnotification(query.data.findUser) 
        setnotifloading(false);
        setunreadnotifs(query.data.unreadcounts)

        setstartfetching(true)
      }
     })
    }

     const getadminnotif = async()=>{   
     const querynotif =  await apiClientBook.get(`/adminNotifications?page=${notifpage}`).then((query)=>{
      if(query){
        setfetchnotification(query.data.findnotifs) 
        setnotifloading(false);
        setunreadnotifs(query.data.unreadcounts)

        setstartfetching(true)
      }
     })
      }

     

    if( user?.accessToken && user?.role === '4d3b'){
        getnotif()
    
   
    }else if( user?.accessToken && user?.role === 'b521c'){
       getadminnotif()
       
    }else{

    }




  },[user])
  
function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
function debounce(func, wait) {
    var timeout;
    var waitFunc;
    
    return function() {
        if (isFunction(wait)) {
            waitFunc = wait;
        }
        else {
            waitFunc = function() { return wait };
        }
        
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, waitFunc());
    };
}

var reconnectFrequencySeconds = 1;

const usereventsource= () =>{

      var fetcheddate = new Date().toISOString()
      const eventSource = new EventSource(`${SSEURL?SSEURL:'http://localhost:8080'}/realtimeuser?date=${fetcheddate}&user=${user._id}&accessToken=${user.accessToken}`,{
       
      headers: {
          Accept: "text/event-stream",
          
        },
      });
      eventSource.onmessage = (e) => {
        let userObj = JSON.parse(e.data, (key, value) => {
        
        return value;
        });

        if(userObj?.length > 0){
           setnewlyfetchednotif(userObj)
          
        }
        }
      eventSource.onerror = err => {
        eventSource.close();
        reconnectusersource();
     
      };
   
}
var reconnectusersource = debounce(function() {
    usereventsource();
    // Double every attempt to avoid overwhelming server
    reconnectFrequencySeconds *= 2;
    // Max out at ~1 minute as a compromise between user experience and server load
    if (reconnectFrequencySeconds >= 64) {
        reconnectFrequencySeconds = 64;
    }
}, function() { return reconnectFrequencySeconds * 1000 });
  
  useEffect(async()=>{

    if( user?.accessToken && user?.role === '4d3b' && startfetching ){

      console.log('iam i here')

  

      usereventsource()
     
    
   
    }else if( user?.accessToken && user?.role === 'b521c' && startfetching )
    { 
   
        var fetcheddate = new Date().toISOString()
      
      
      const eventSource = new EventSource(`${SSEURL?SSEURL:'http://localhost:8080'}/realtime?date=${fetcheddate}&accessToken=${user.accessToken}`,{
       headers: {
          Accept: "text/event-stream",
        },
      });
      eventSource.onmessage = (e) => {
        let userObj = JSON.parse(e.data, (key, value) => {
        
        return value;
        });

        if(userObj?.length > 0){
           setnewlyfetchednotif(userObj)
        }
        }
      eventSource.onerror = err => {
          console.log(err)
     
      };
    
       
    }else{

    }

  },[startfetching])

  useEffect(()=>{
  
  if(fetchnotification){
  const all = fetchnotification.filter((obj) => {
  return obj.status === 'unread';
  });

  setunreadnotifs(all.length)
  console.log(fetchnotification.length)
  }

  },[fetchnotification])
  

  useEffect(()=>{

  if(newlyfetchednotif){
    
    if(user?.role === 'b521c'){
     var array1 = newlyfetchednotif;
     var array2 = fetchnotification;
    
    const unique = ([...array1, ...array2]);

    function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
    }

    var uniqueArray = removeDuplicates(unique, "_id");
     setfetchnotification(uniqueArray)
     setnewlyfetchednotif(null)
  

    }else if(user?.role === '4d3b'){

      var array1 = newlyfetchednotif;
     var array2 = fetchnotification;
    
    const unique = ([...array1, ...array2]);

    function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
     }

     var uniqueArray = removeDuplicates(unique, "id");
     setfetchnotification(uniqueArray)
     setnewlyfetchednotif(null)
  
  
    }



  }


  },[newlyfetchednotif])

  const readnotif = async()=>{

      await apiClientBook.post('/readNotifs',{

        body: JSON.stringify({
        notifs: fetchnotification,
        useid: user._id
      })
      })
  }

  const userfetcher = async()=>{
    const notifsFormServers =  await apiClientBook.get(`/userNotifications?page=${notifpage+1}`);
    const notifsFormServer = notifsFormServers.data

    const unique =([...fetchnotification, ...notifsFormServer.findUser]);

    console.log(unique, notifsFormServer)
    
    function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
    }

    var uniqueArray = removeDuplicates(unique, "id");

    setfetchnotification(uniqueArray)

    if (notifsFormServer.pages === notifpage ) {
      sethasMore(false);
    }
   
    readnotif()
    setnotifpage(notifpage+1)

  }
  const fetchData = () => {

    setTimeout(function () {
      userfetcher()
    
    }, 1000);
   
  
  }; 

  const adminfetcher = async()=>{
    const notifsFormServers =  await apiClientBook.get(`/adminNotifications?page=${notifpage+1}`);
    const notifsFormServer = notifsFormServers.data
   
    const unique = ([...fetchnotification, ...notifsFormServer.findnotifs]);

    function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
    }

    var uniqueArray = removeDuplicates(unique, "_id");

    setfetchnotification(uniqueArray)


    if (notifsFormServer.pages === notifpage ) {
      sethasMore(false);
    }

    readnotif()
    setnotifpage(notifpage+1)
}
 const fetchadminData = () => {



    setTimeout(function () {
      adminfetcher()
    
    }, 1000);
   
    
  }; 


   const toggleNotif = () => {
    
   
    setnotifActive(!notifActive)
    
    if(notifActive){
     document.removeEventListener("click", onClickOutsideNotifListener)
     
     if(user.role === 'b521c'){
console.log('wkwkw1')
      
           const readids = fetchnotification.map(bookids => {
      return bookids._id
     })

     for (var i = 0; i < readids.length; i++) { 
     document.getElementById(readids[i]).style.backgroundColor = "transparent";
     document.getElementById(`567${readids[i]}`).style.backgroundColor = "transparent";
     }

   
     const readnotif = fetchnotification.map((obj, i) => ({ ...obj, status: 'read' }));
     setfetchnotification(readnotif)
     setunreadnotifs(unreadnotifs - readnotif.length)
     }else if(user.role === '4d3b'){
      console.log('wkwkw2')
      const readids = fetchnotification.map(bookids => {
      return bookids.id
     })

     for (var i = 0; i < readids.length; i++) { 
     document.getElementById(readids[i]).style.backgroundColor = "transparent";
     document.getElementById(`567${readids[i]}`).style.backgroundColor = "transparent";
     }

     const readnotif = fetchnotification.map((obj, i) => ({ ...obj, status: 'read' }));
     setfetchnotification(readnotif)
     setunreadnotifs(unreadnotifs - readnotif.length)
     }

    

    }
  };

  const onClickOutsideNotifListener = () => {
  
    setnotifActive(false)
    document.removeEventListener("click", onClickOutsideNotifListener)
  
  }


  const [isActive, setActive] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
    if(isActive){
       document.removeEventListener("click", onClickOutsideListener)
    }
    
  };
    const inputonClickOutsideListener = ()=>{
    document.removeEventListener("click", onClickOutsideListener)
    setsearchresultdiv(false)
  }

  const onClickOutsideListener = () => {
    setActive(!isActive)
    setActive(false)
    document.removeEventListener("click", onClickOutsideListener)
  }

if(currentloc === '/'){
    if (!userexist) {

    return (
      <div className='hometopnavdivcont'>
 <div className='relative'>
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
        </div> </div>
      </div>
    );
  } else {
    return (
      <div className='hometopnavdivcont'>
        <div className='relative'>
      
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
                 if(isActive){
                  document.addEventListener("click", onClickOutsideListener)
                 }
        }} ><FaChevronDown /></button>

                  </li>
                  <div id="dropdown2" className={" absolute  flex-col  z-100 w-44 bg-white rounded divide-y divide-gray-100  dark:bg-gray-700 " + (isActive ? 'flex' : 'hidden')}>
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
       </div>
     </div>
    );
  }

}else{
    return (
    <>
  
      <div className='topnavcont2 z-100 '>
          <div className='initialtop' > </div>
        <div className='navcont navcont2 z-10' >
          <div className='navcontlist2 '>
            <div className='navcontul2 ' >


              <ul className='topnavmid topnavmid2 phone:px-0 tablet:px-1'  >

                <div className=' namidfirst phone:px-0.5 tablet:px-0 phone:flex' >
                  <Menu />



                  
                  <li className='namidlogo phone:hidden laptop:block'>
                    <Link to={`/`} ><img className='logohome2 ml-4' src={require('.//style/images/logo.png')} /> </Link> 
                  </li>
                 
                
                  <li className='phone:hidden tablet:flex mx-3 h-full items-center' >
                      <Link to={`/`} >PUP WEB Library </Link>
                  </li>
                  

                </div>
                <div className='searchbartop phone:justify-end '>

                  <form className='relative flex tablet:pl-0 flex-col phone:pl-8 tablet:ml-0 phone:mr-0 tablet:mr-1 tabletlg:mr-0 ' action='/advancedsearch'>
                    <input  autoComplete='off' className='w-full   searchfield2  pr-10 phone:mr-1 tablet:mr-0' type="text" name="title" placeholder="Search book..." ref={elementRef} onChange={e => setDebouncedTerm(e.target.value)}  
                    onMouseLeave={() => {
                   document.addEventListener("click", inputonClickOutsideListener)
                  }} required=""></input>
                    <button type="submit" title="Search" aria-label="Submit Search" className='searchbtn2 ml-2 phone:mr-1.5 tablet:mr-0.5'><div><FaSearch /></div></button>
                       <div className="relative self-end px-0 topsearchcont " style={{display:'flex'}}>
                        <div className='absolute inset-o w-full phone:hidden tablet:flex flex-col'>
                          <div className={`absolute searchresultbar2 searchresultbartop `  + ( searchresultdiv ? 'block' : 'hidden') } >
                  
                  {searchloading?
                      <div className="resultcontainer w-full pointer-events-none flex flex-row grid grid-cols-12 loadingcont" >
                           <div className="loading">
                            <div className="span1"></div>
                            <div className="span2"></div>
                            <div className="span3"></div>
                          </div>                 
                      </div>:

                  fetchedbook?.length > 0 ?
                 (fetchedbook.map((book,i) => (
                     <Link  to={`/openbook/${book._id}`} key={book._id}  onClick={()=>{           
                        divElement.value = book.title;                           
                        }}>
                     <div className="resultcontainer w-full flex flex-row grid grid-cols-12" 
                     >
                       <div className='  resultimgcont col-span-3 flex justify-center' >
                         <img className='resultimg self-center ' src={book.imgUri ? book.imgUri : require('.//style/images/placeholder_book1.jpg')} alt="No Image Preview" />
                       </div>
                       <div  className=' resultdetails relative col-span-9 flex flex-col ' >
                         <p className="resultdetailstitle ">{book.title}</p>
                         <p className="resultdetailsauthor mt-1">-{book.author}</p>
                       </div>                             
                      </div>
                    </Link>
                    
                ))) :<p className="resultdetailstitle px-3 py-2">no results found</p>
                  
                  }
                          </div> 
                  </div>
                  </div>
                  </form>
                  


                </div>
                <div className='mt-8 phone:block tablet:hidden w-full absolute inset-0'>
                     <div className={`absolute searchresultbar2 searchresultbartop flex-col `  + ( searchresultdiv ? 'flex' : 'hidden')  } >
                  
                  {searchloading?
                      <div className="resultcontainer  pointer-events-none w-full flex mt-5 flex-row grid grid-cols-12 loadingcont" >
                           <div className="loading pointer-events-none" >
                            <div className="span1"></div>
                            <div className="span2"></div>
                            <div className="span3"></div>
                          </div>                 
                      </div>:

                  fetchedbook?.length > 0 ?
                 (fetchedbook.map((book,i) => (
                      <Link  to={`/openbook/${book._id}`} key={book._id}  onClick={()=>{           
                        divElement.value = book.title;                           
                        }}>
                     <div className="resultcontainer w-full flex flex-row grid grid-cols-12" key={book._id} 
                      >
                       <div className='  resultimgcont col-span-3 flex justify-center' >
                         <img className='resultimg self-center ' src={book.imgUri ? book.imgUri : require('.//style/images/placeholder_book1.jpg')} alt="No Image Preview" />
                       </div>
                       <div  className=' resultdetails relative col-span-9 flex flex-col ' >
                         <p className="resultdetailstitle ">{book.title}</p>
                         <p className="resultdetailsauthor mt-1">-{book.author}</p>
                       </div>                             
                      </div>
</Link>
                    
                ))) :<p className="resultdetailstitle px-3 py-2">no results found</p>
                  
                  }
                  </div> 
                  </div>
              <div className='mt-9 phone:block tablet:hidden w-full absolute inset-0'>
              <div className='notifCont phone:flex tablet:hidden' onClick={()=>  toggleNotif()}>
                </div>  
                       
                    <InfiniteScroll
          dataLength={fetchnotification?.length}
          className={`notificationcont absolute flex-col `  + ( notifActive ? 'flex' : 'hidden') }
          next={ user?.role === '4d3b'? fetchData :  user?.role === 'b521c'? fetchadminData : null}
          hasMore={hasMore}
          loader={ <div className="resultcontainer pointer-events-none relative w-full flex flex-col grid grid-cols-12 py-5 " style={{minHeight:'80px'}}>
                       <div className="loading pointer-events-none ">
                            <div className="span1"></div>
                            <div className="span2"></div>
                            <div className="span3"></div>
                          </div>                 
                      </div>}
          height={400}
          endMessage={
              <p className='py-4 ' style={{ textAlign: "center", backgroundColor:'#374151' }}>
                 <b className='text-base'>Yay! You have seen it all! :)</b>
              </p>
                 }
            >
                       <div className="resultcontainer2 w-full flex flex-col grid grid-cols-12 pointer-events-none " >
                      <div  className=' resultdetails relative col-span-12 flex flex-col '  >
                             <div  className=' resultdetails relative flex flex-col ' >
                            <p className="resultdetailstitle2 text-base"> Notifications</p>
                          
                       </div>  
                       </div> 
                      </div>
                    {
                     !notifloading && user?.role === '4d3b'?
                       fetchnotification?.length > 0  ? 
                        fetchnotification.map((notifs) =>(
                      <div className="resultcontainer2 w-full flex flex-col grid grid-cols-12 " style={{backgroundColor:`${notifs.status === 'unread'? '#353840':null}`}} id={`567${notifs.id}`}  key={notifs.id}>
                      <div  className=' resultdetails relative col-span-12 flex flex-col '  >
                             <div  className=' resultdetails relative flex flex-col ' >
                            <p className="resultdetailstitle2 ">{notifs.title} </p>
                             <p className="resultdetailsauthor2 mt-1">{formatDistance(subDays(new Date(notifs.dateAdded), 0), new Date(), { addSuffix: true })}</p>
                       </div>  
                       </div> 
                      </div>


                         )):  
                         <div className="resultcontainer2 items-center justify-center h-full w-full flex flex-col grid grid-cols-12 pointer-events-none" >
                         <div  className=' resultdetails items-center justify-center relative col-span-12 flex flex-col pointer-events-none'  >
                             <div  className=' resultdetails relative flex flex-col pointer-events-none' >
                            <p className="resultdetailstitle2 ">You have no Notifications for Today!</p>
                             <p className="resultdetailstitle2 flex items-center justify-center"> :D</p>
             
                        </div>  
                        </div> 
                        </div>:

                      !notifloading && user?.role === 'b521c'?
                       fetchnotification?.length > 0  ? 
                        fetchnotification.map((notifs) =>(
                      <div className="resultcontainer2 w-full flex flex-col grid grid-cols-12 " style={{backgroundColor:`${notifs.status === 'unread'? '#353840':null}`}} id={`567${notifs._id}`} key={notifs._id}>
                      <div  className=' resultdetails relative col-span-12 flex flex-col '  >
                             <div  className=' resultdetails relative flex flex-col ' >
                            <p className="resultdetailstitle2 ">{notifs.description} </p>
                             <p className="resultdetailsauthor2 mt-1">{formatDistance(subDays(new Date(notifs.dateAdded), 0), new Date(), { addSuffix: true })}</p>
                       </div>  
                       </div> 
                      </div>


                         )):  
                         <div className="resultcontainer2 items-center justify-center h-full w-full flex flex-col grid grid-cols-12 pointer-events-none" >
                         <div  className=' resultdetails items-center justify-center relative col-span-12 flex flex-col pointer-events-none'  >
                             <div  className=' resultdetails relative flex flex-col pointer-events-none' >
                            <p className="resultdetailstitle2 ">You have no Notifications for Today! !</p>
                             <p className="resultdetailstitle2 flex items-center justify-center"> :D</p>
             
                        </div>  
                        </div> 
                        </div>:null
                        
                      }
                  </InfiniteScroll>    
                  
                            
                      
            
                     
                     
                     </div>
                {!user && !userexist ?       <div className='phone:hidden laptop:flex flex-row' >

                   
                       <li className=' loginbtnnav ml-5  phone:mr-1  laptop:mr-1' >
                      <Link to={`/signup`} className=' signupbtn px-3 py-1'>Signup</Link>
                      </li>
                      
                      
                       <li className=' loginbtnnav phone:mr-1  laptop:mr-5'>
                    <Link to={`/login`} className='toploginbtn px-3 py-1'> Login</Link>
                  </li>
                    </div> : (

                  userexist && user ? (
                    <div className='flex flex-row '>
                   <li className=' loginbtnnav laptop:ml-5 phone:ml-1 relative flex flex-col '  style={{boxShadow:'none'}}>

                     <button className='userProfile h-full phone:mr-1 phone:ml-1 tablet:ml-0  laptop:mr-3' onMouseLeave={() => {
                   if(notifActive){ document.addEventListener("click", onClickOutsideNotifListener)}
                  
                  }} onClick={()=>{toggleNotif(); readnotif()}} ><IoMdNotificationsOutline color="white" size="1.5em"/></button>
                      { unreadnotifs > 0?
                      <div className='unreadcounts absolute' onClick={()=> toggleNotif()}> <p>{unreadnotifs}</p></div>:null
                       } 
                    <div className='notifCont phone:hidden tablet:flex' onClick={()=>  toggleNotif()}>
                     
                  
                       
                    <InfiniteScroll
          dataLength={fetchnotification?.length}
          className={`notificationcont absolute flex-col `  + ( notifActive ? 'flex' : 'hidden') }
          next={ user?.role === '4d3b'? fetchData :  user?.role === 'b521c'? fetchadminData : null}
          hasMore={hasMore}
          loader={ <div className="resultcontainer pointer-events-none relative w-full flex flex-col grid grid-cols-12 py-5 " style={{minHeight:'80px'}}>
                       <div className="loading pointer-events-none ">
                            <div className="span1"></div>
                            <div className="span2"></div>
                            <div className="span3"></div>
                          </div>                 
                      </div>}
          height={400}
          endMessage={
              <p className='py-4 ' style={{ textAlign: "center", backgroundColor:'#374151' }}>
                 <b className='text-base'>Yay! You have seen it all! :)</b>
              </p>
                 }
            >
                <div className="resultcontainer2 w-full flex flex-col grid grid-cols-12 pointer-events-none " >
                      <div  className=' resultdetails relative col-span-12 flex flex-col '  >
                             <div  className=' resultdetails relative flex flex-col ' >
                            <p className="resultdetailstitle2 text-base "> Notifications</p>
                          
                       </div>  
                       </div> 
                      </div>
                    {
                     !notifloading && user?.role === '4d3b' ?
                       fetchnotification?.length > 0? 
                        fetchnotification.map((notifs) =>(
                      <div className="resultcontainer2 w-full flex flex-col grid grid-cols-12 " style={{backgroundColor:`${notifs.status === 'unread'? '#353840':null}`}} id={notifs.id}  key={notifs.id}>
                      <div  className=' resultdetails relative col-span-12 flex flex-col '  >
                             <div  className=' resultdetails relative flex flex-col ' >
                            <p className="resultdetailstitle2 ">{notifs.title} </p>
                             <p className="resultdetailsauthor2 mt-1">{formatDistance(subDays(new Date(notifs.dateAdded), 0), new Date(), { addSuffix: true })}</p>
                       </div>  
                       </div> 
                      </div>


                         )):  <div className="resultcontainer2 items-center justify-center h-full w-full flex flex-col grid grid-cols-12 pointer-events-none " >
                         <div  className=' resultdetails items-center justify-center relative col-span-12 flex flex-col pointer-events-none '  >
                             <div  className=' resultdetails relative flex flex-col pointer-events-none' >
                            <p className="resultdetailstitle2 ">You have no Notifications for Today!</p>
                             <p className="resultdetailstitle2 flex items-center justify-center"> :D</p>
             
                        </div>  
                        </div> 
                        </div>:
                        
                      !notifloading && user?.role === 'b521c'?
                       fetchnotification?.length > 0  ? 
                        fetchnotification.map((notifs) =>(
                      <div className="resultcontainer2 w-full flex flex-col grid grid-cols-12 " style={{backgroundColor:`${notifs.status === 'unread'? '#353840':null}`}} id={notifs._id}  key={notifs._id}>
                      <div  className=' resultdetails relative col-span-12 flex flex-col '  >
                             <div  className=' resultdetails relative flex flex-col ' >
                            <p className="resultdetailstitle2 ">{notifs.description} </p>
                             <p className="resultdetailsauthor2 mt-1">{formatDistance(subDays(new Date(notifs.dateAdded), 0), new Date(), { addSuffix: true })}</p>
                       </div>  
                       </div> 
                      </div>


                         )):  
                         <div className="resultcontainer2 items-center justify-center h-full w-full flex flex-col grid grid-cols-12 pointer-events-none" >
                         <div  className=' resultdetails items-center justify-center relative col-span-12 flex flex-col pointer-events-none'  >
                             <div  className=' resultdetails relative flex flex-col pointer-events-none' >
                            <p className="resultdetailstitle2 ">You have no Notifications for Today!</p>
                             <p className="resultdetailstitle2 flex items-center justify-center"> :D</p>
             
                        </div>  
                        </div> 
                        </div>:null

                      }
                  </InfiniteScroll>    
                  
                            
                      
            
                     
                     
                     </div>
                     
                   </li>
                     <li className=' profilecont laptop:flex items-center laptop:mr-3 phone:mr-0 phone:hidden' onClick={toggleClass}  onMouseLeave={() => {
                          if(isActive){   document.addEventListener("click", onClickOutsideListener)}
                        
                        }} >
                      <div className='usernamecircle whitespace-nowrap flex-row phone:hidden laptop:flex pr-6 pl-3' > {user.firstName} </div>

                           <button className='userProfile  phone:mr-0 ' style={{zIndex:'123'}} ><FaUserCircle color="white" size="1.8em"  className='facircle'/></button>
                   </li>
           
                  
   
                 
                  
                  <div id="dropdown2"   className={" absolute  flex-col  z-100 bg-white rounded divide-y divide-gray-100  dark:bg-gray-700 " + (isActive ? 'flex' : 'hidden')}>
                    <ul className="py-1 mb-2 flex flex-col text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                      <li className='tracking-tight topuserName py-2 mb-2 ' >
                         <div  className="block py-2 px-4  flex flex-row items-center "> <FaUserCircle color="white" size="3.0em" className='mr-4'/><a className='welcomename flex flex-col'><p className='welcometext'>Welcome</p><p className='usernamewel usernametop'>{user.firstName} &nbsp; {user.lastName}</p></a> </div>
                      </li>
                      <li  >
                        <a  href="/changepass" className="flex flex-row items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><IoMdKey size="1.5em" className='mr-2'/> Change Password</a>
                      </li>
                      <li >
                        <a   className="flex flex-row items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={onLogout} ><IoLogOutOutline size="1.5em" className='mr-2'/>Logout</a>
                      </li>


                    </ul>
                  </div>
                    </div>
                  ) : (

                    <div className='phone:hidden laptop:flex flex-row'>
                      
                       <li className=' loginbtnnav ml-5  phone:mr-1  laptop:mr-1'>
                      <Link to={`/signup`} className=' signupbtn px-3 py-1'> Signup</Link>
                      </li>
                      
                       <li className=' loginbtnnav phone:mr-1  laptop:mr-5'>
                    <Link to={`/studentlogin`} className='toploginbtn px-3 py-1' > Login</Link>
                  </li>
                    </div>
                  )


                )}


              </ul>
            </div>
          </div>
        </div>


      </div>
    </>
  );
}


};

export default Topnav;
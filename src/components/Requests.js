import React, { useEffect, useState, useContext } from 'react';
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/bookmarks.css";
import "./style/requests.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { reset, getUser, logoutUser } from '../features/auth/authSlice'
import { FaSearch } from "react-icons/fa";
import { FaChevronDown, FaUndo } from "react-icons/fa";
import { IoCloseSharp, } from "react-icons/io5";
import { AiOutlineUndo } from "react-icons/ai"
import Menu from "./Menu.js";
import { resetBook, getlikedBook, getbookmarkBook, getborrowedBook, getallborrowedBook, manageBookRequests, manageundoBookRequests } from '../features/book/bookSlice';
import { useTabs, TabPanel } from "react-headless-tabs"
import { TabSelector } from './TabSelector';
import Pagination from './Pagination';
import Likepagination from './Likepagination';
import Select from 'react-select'
import Modal from 'react-modal';
import jwt_decode from "jwt-decode";
import bookService from '../features/book/bookService';
import { toast } from 'react-toastify';
import { format, compareAsc, formatDistance, subDays, addDays } from 'date-fns';
var parse = require('date-fns/parse')


Modal.setAppElement('#root');

const Requests = () => {
     const { user, message, isSuccess } = useSelector(state => state.auth);
    const [skipCount, setSkipCount] = useState(true);
 const navigate = useNavigate();

  
  
   useEffect(()=>{
  
   if (skipCount){
    
    setSkipCount(false)
 
  };
   if (!skipCount){
 
    
   if (userexist && user.role ) {
    
       console.log(user.role)
       if(user.role !== 'b521c'){
        navigate(-1)
       }
   
   }else if(!userexist ){
   
      navigate(-1)
     
   }}

  },[  skipCount, user])

  const [modalIsOpen, setIsOpen] = React.useState({ open: false, selectedBook: null });

  function openModal(i) {
    setIsOpen({ open: true, selectedBook: i });
  }
  function closeModal() {
    setIsOpen({ open: false, selectedBook: null });
  }
  
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);


  const { bookFeatured, openbook, likeStatus, isError, likedbook, bookmarkedbook, bookmarkpagecount, isLoading, getborrowedbook, borrowbook } = useSelector(state => state.book);

  const [pageloading, setpageloading] = useState(true)
  const [userloaded, setuserloaded] = useState(null)
  const [canceledreq, setcanceledreq] =useState(null)
  const [fetchdaylimit, setfetchdaylimit] = useState(null)

  const [selectedTab, setSelectedTab] = useTabs([
    'all',
    'pending',
    'confirmed',
    'received',
    'returned',

  ]);


  const customStyles = {

    control: (base, state) => ({
      ...base,
      /*border: state.isFocused ? 0 : 0,
      // This line disable the blue border
      boxShadow: state.isFocused ? 0 : 0,
      '&:hover': {
        border: state.isFocused ? 0 : 0
      }*/
      backgroundColor: 'rgba(255, 255, 255, 0.901)',
      margin: '0',

      minHeight: '30px',
      height: '30px',
      minWidth: '80px',



    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: '30px',
      padding: '0 5px',
      minWidth: '80px',


    }),

    input: (provided, state) => ({
      ...provided,
      margin: '0px',

    }),
    indicatorSeparator: state => ({
      display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '30px',
      maxWidth: '270px',

    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menuList: base => ({
      ...base,
      minHeight: "10px",
      minWidth: '80px',

      padding: '0'

    }),
    option: styles => ({
      ...styles,

      lineHeight: '20px',

    })

  }

  const pageNumber = 1;


  const [page, setPage] = useState(urlParams.get('page') ?urlParams.get('page'): pageNumber);
  const [pages, setPages] = useState(1);


  
  const dispatch = useDispatch()


  const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )
  const userexist = getCookieValue('userpersist')



  useEffect(async() => {
       try {
    const featureddaylimit = await bookService.getdaylimit().then((res)=>{

        if(res){
          setfetchdaylimit(res)
     
          console.log(res)
        }
      })
      
    } catch (error) {
   
       toast.error(error);
    }
    window.scrollTo(0, 0);
    setSelectedTab(urlParams.get('tab') ?urlParams.get('tab'): 'bookmarks')
    setpageloading(true)

  }, [isError])


  useEffect(() => {
 window.scrollTo(0, 0);
    if (userexist) {
      if (user.length !== 0) {
        setuserloaded(user)
          console.log('did ig oghere agin')
        if(selectedTab === 'all' || selectedTab === 'pending' || selectedTab === 'confirmed'||selectedTab === 'received' || selectedTab === 'returned'){
        dispatch(getallborrowedBook({ page: page, status: selectedTab ? selectedTab : urlParams.get('tab') ?urlParams.get('tab'): 'all' })).then((res)=>{
          if(res){
            setpageloading(false)
          }
        })

       }
      }
    } else {
      setpageloading(false)
      if (!userloaded) {
        navigate('/')
      }
    }


  }, [user, page, selectedTab,borrowbook,canceledreq ])

  useEffect(() => {

    setPages(getborrowedbook.pages)
  }, [getborrowedbook])

  const onLogout = () => {
    setuserloaded(null)
    setpageloading(false)
    dispatch(logoutUser())
    dispatch(reset())

  }
  const [istabLoading, setistabLoading] = useState(false)
  const manageRequests = (id, bookid) => {
    setistabLoading(true)
  
    var decoded = jwt_decode(user.accessToken);
    var now = new Date();
    var time = now.getTime();
    var exp = new Date((decoded.exp * 1000) - (5 * 1000));

    if (time > exp) {

      dispatch(getUser()).then((response) => {
        if (response.payload.accessToken) {
          dispatch(manageBookRequests(id)).then((res)=>{
            if(res){
              setistabLoading(false)
            }
          })
        }
      });

    } else {

      dispatch(manageBookRequests(id)).then((res)=>{
            if(res){
              setistabLoading(false)
            }
          })
    }

  }

  const manageundoRequests = (id) => {

    setistabLoading(true)

    var decoded = jwt_decode(user.accessToken);
    var now = new Date();
    var time = now.getTime();
    var exp = new Date((decoded.exp * 1000) - (5 * 1000));

    if (time > exp) {

      dispatch(getUser()).then((response) => {
        if (response.payload.accessToken) {
          dispatch(manageundoBookRequests(id)).then((res)=>{
            if(res){
              setistabLoading(false)
            }
          })
        }
      });

    } else {

      dispatch(manageundoBookRequests(id)).then((res)=>{
            if(res){
              setistabLoading(false)
            }
          })
      
    }

  }

  const cancelrequest = async(id)=>{

    setistabLoading(true)
    try {
    const featuredalluser = await bookService.cancelreq(id).then((res)=>{

        if(res){
           setcanceledreq(res)
           setistabLoading(false)
        }
      })
      
    } catch (error) {
        setistabLoading(false)
       toast.error(error);
    }
  }

const notifylateuser = async(id)=>{
  try{
    const featuredalluser = await bookService.notifylate(id).then((res)=>{

        if(res){
          
           toast.success('user notified succcessfully')
        }
      })
      
    } catch (error) {
        
       toast.error(error);
    }
  }

  const tabClicked = (tabstatus) => {

   
      
      setSelectedTab(tabstatus);
      setPage(1);
   

  }
  useEffect(()=>{
     
  window.history.replaceState(null, null, `?tab=${selectedTab}&page=${page}`);
   
  },[page,selectedTab])
  const [isActive, setActive] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
  };


  const onClickOutsideListener = () => {
    setActive(false)
    document.removeEventListener("click", onClickOutsideListener)
  }

  useEffect(()=>{
    
    if(!istabLoading ){
      if( page > 1 && getborrowedbook?.length <= 0){

        setPage(page - 1)
      }
    }



  },[istabLoading])

    return (
      <>

        <div className='recentlyCont pb-32  flex '>

          <div className='recentCont pt-3 addnav '>
            <div className='text-black recenthead recentContCont '>

              <div className='flex bookmarkshead  mt-3 mb-2 flex-row  items-center'>
                <TabSelector
                  isActive={selectedTab === 'all'}
                  onClick={() => { tabClicked('all') }}

                >
                  All
                </TabSelector>
                <TabSelector

                  isActive={selectedTab === 'pending'}
                  onClick={() => { tabClicked('pending') }}
                 
                >
                  Pending
                </TabSelector>
                <TabSelector
                  isActive={selectedTab === 'confirmed'}
                  onClick={() => { tabClicked('confirmed') }}
                 
                >
                  Confirmed
                </TabSelector>
                <TabSelector
                  isActive={selectedTab === 'received'}
                  onClick={() => { tabClicked('received') }}
                
                >
                  Received
                </TabSelector>
                <TabSelector
                  isActive={selectedTab === 'returned'}
                  onClick={() => { tabClicked('returned') }}
               
                >
                  Returned
                </TabSelector>




              </div>
              <Modal
                isOpen={modalIsOpen.open}
                shouldCloseOnOverlayClick={true}
                onRequestClose={closeModal}
                className={"requestsmodal"}


                contentLabel="More details Modal"
              >
                {!isLoading ? (modalIsOpen.selectedBook !== null ?
                  <>
               
                    <button className='closeModal' onClick={closeModal}><   IoCloseSharp color="white" /></button>
                    <div className='borrowermoredetailscont pt-8'>

                      <h4 className='text-white' ><span className='makethisbold  text-emerald-400'>Book Title: &nbsp;</span> {getborrowedbook.bookquery[modalIsOpen.selectedBook].bookTitle}</h4>
                      <h6 className='mt-2  mb-6 text-white'><span className='makethisbold  text-emerald-400 '>Author: &nbsp;</span> {getborrowedbook.bookquery[modalIsOpen.selectedBook].bookAuthor}</h6>
                      <h4 className='text-white ' ><span className='makethisbold text-rose-600'>Borrower Details</span> </h4>
                      <h6 className='mt-4 mb-2 text-white '><span className='makethisbold  my-4 text-emerald-400'>Borrower Name: &nbsp;</span> {getborrowedbook.bookquery[modalIsOpen.selectedBook].borrowerfName} &nbsp; {getborrowedbook.bookquery[modalIsOpen.selectedBook].borrowerlName}</h6>

                      <h6 className='my-2 text-white  '><span className='makethisbold  my-4 text-emerald-400'>Borrower Email: &nbsp;</span> {getborrowedbook.bookquery[modalIsOpen.selectedBook].borrowerEmail}</h6>
                      <h6 className='my-2 text-white '><span className='makethisbold  my-4 text-emerald-400'>Borrower Department: &nbsp;</span> {getborrowedbook.bookquery[modalIsOpen.selectedBook].borrowerDepartment}</h6>
                      <h6 className='my-2 text-white '><span className='makethisbold  my-4 text-emerald-400'>Borrower Student Number: &nbsp;</span> {getborrowedbook.bookquery[modalIsOpen.selectedBook].studentNumber}</h6>
                      <h6 className='my-2 text-white mt-4   '><span className='makethisbold  my-4 text-rose-600 '>Borrow Date:&nbsp;</span>{format(new Date(getborrowedbook.bookquery[modalIsOpen.selectedBook].borrowDate), 'yyyy-MM-dd')} </h6>
                      <h6 className='my-2 text-white  flex flex-row items-center '><span className='makethisbold   text-rose-600 '>Borrow Status:&nbsp;</span> {getborrowedbook.bookquery[modalIsOpen.selectedBook].borrowStatus} 
                      {
                       getborrowedbook.bookquery[modalIsOpen.selectedBook].borrowStatus === 'confirmed'?
                       new Date() >= new Date(addDays (new Date((getborrowedbook.bookquery[modalIsOpen.selectedBook].confirmedDate)),fetchdaylimit?.confirmbook?parseInt(fetchdaylimit.confirmbook, 10):7))? <div className='flex flex-row items-center '><div className='latewarn flex items-center justify-center ml-2'><p>!</p></div><p>late</p></div> : null
                       :null
                       }
                       
                       {
                       getborrowedbook.bookquery[modalIsOpen.selectedBook].borrowStatus === 'received'?
                        new Date() >= new Date(addDays (new Date((getborrowedbook.bookquery[modalIsOpen.selectedBook].receivedDate)),fetchdaylimit?.receivedbook?parseInt(fetchdaylimit.receivedbook, 10):7 ))? <div className='flex flex-row items-center '><div className='latewarn flex items-center justify-center ml-2'><p>!</p></div><p>late</p></div> : null
                      :null
                       }
                       </h6>
                 
                      {getborrowedbook.bookquery[modalIsOpen.selectedBook].confirmedDate ?

                        <h6 className='my-2 text-white  '><span className='makethisbold  my-4 text-rose-600 '>Confirmed Date:&nbsp;</span> {format(new Date(getborrowedbook.bookquery[modalIsOpen.selectedBook].confirmedDate), 'yyyy-MM-dd')}<span onClick={()=>cancelrequest(getborrowedbook.bookquery[modalIsOpen.selectedBook]._id)}>
                        
                      
                        
                        </span></h6>
                        : null

                      }
                      {getborrowedbook.bookquery[modalIsOpen.selectedBook].receivedDate ?

                        <h6 className='my-2 text-white   '><span className='makethisbold  my-4 text-rose-600 '>Received Date:&nbsp;</span> {format(new Date(getborrowedbook.bookquery[modalIsOpen.selectedBook].receivedDate), 'yyyy-MM-dd')}</h6>
                        : null

                      }
                      {getborrowedbook.bookquery[modalIsOpen.selectedBook].returnDate ?

                        <h6 className='my-2 text-white  '><span className='makethisbold  my-4 text-rose-600 '>Return Date:&nbsp;</span> {format(new Date(getborrowedbook.bookquery[modalIsOpen.selectedBook].returnDate), 'yyyy-MM-dd')}</h6>
                        : null

                      }
                            {
                       getborrowedbook.bookquery[modalIsOpen.selectedBook].borrowStatus === 'confirmed'?
                       new Date() >= new Date(addDays (new Date((getborrowedbook.bookquery[modalIsOpen.selectedBook].confirmedDate)),fetchdaylimit?.confirmbook?parseInt(fetchdaylimit.confirmbook, 10):7))? <div className='flex flex-row items-center openbookbuttons text-white gap-2'><button className='px-2' onClick={()=>{cancelrequest(getborrowedbook.bookquery[modalIsOpen.selectedBook]._id); closeModal()}}>Cancel Request</button><button   className='px-2' onClick={()=>notifylateuser(getborrowedbook.bookquery[modalIsOpen.selectedBook]._id)}>Notify User</button></div> : null
                       :null
                       }
                       
                       {
                       getborrowedbook.bookquery[modalIsOpen.selectedBook].borrowStatus === 'received'?
                        new Date() >= new Date(addDays (new Date((getborrowedbook.bookquery[modalIsOpen.selectedBook].receivedDate)),fetchdaylimit?.receivedbook?parseInt(fetchdaylimit.receivedbook, 10):7  
                        ))? <div className='flex flex-row items-center openbookbuttons text-white'><button  className='px-2' onClick={()=>notifylateuser(getborrowedbook.bookquery[modalIsOpen.selectedBook]._id)}>Notify user</button></div> : null
                      :null
                       }





                    </div></> :
                  <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p>) : null}


              </Modal>
              {!istabLoading?
              <>
              <TabPanel hidden={selectedTab !== 'all'}>
                <div className=' flex grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 tablet:gap-2 phone:gap-1  '>
                  {
                      !isLoading? (
                       getborrowedbook?.bookquery?.length  ?
                        (getborrowedbook.bookquery.map((getborrowedbook, i) => (



                          <div className='bookmarkcontainer text-white flex flex-row px-2  relative w-100' key={getborrowedbook._id} >


                            <div className='bookmarksimgcont relative  my-3' style={{ zIndex: "2" }}>
                              <Link to={`/openbook/${getborrowedbook.bookId}`}  >
                                <img className=" " src={getborrowedbook.bookImg ? getborrowedbook.bookImg : require('.//style/images/placeholder_book1.jpg')} alt={getborrowedbook.bookTitle} />
                              </Link>
                            </div>

                            <div className=' relative removeshadow text-white flex flex-col pl-1 w-100' style={{ zIndex: "2" }}>
                              <div className='statusbar w-full flex  flex-row-reverse w-100'>

                                {getborrowedbook.borrowStatus === 'pending' ?
                                  <>  <button className='relative acceptbtn' disabled={getborrowedbook.noOfCopies <= 0 ? true:false} onClick={() => (manageRequests(getborrowedbook._id))} >
                                    <h5 className=' stattext flex mx-3 flex-1  absolute' >{getborrowedbook.noOfCopies <= 0 ? '0 copies left':'Accept'}</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </button>

                                    <div className='relative declinebtn' onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute'  >Decline</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div></> : null
                                }
                                {getborrowedbook.borrowStatus === 'confirmed' ?
                                  <>
                                    <div className='relative rcvdbtn' onClick={() => (manageRequests(getborrowedbook._id))}>
                                      <h5 className=' stattext flex mx-3 flex-1  absolute' >Received</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                      </svg>
                                    </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'received' ?
                                  <>
                                    <div className='relative rtrndbtn' onClick={() => (manageRequests(getborrowedbook._id))}>
                                      <h5 className=' stattext flex mx-3 flex-1  absolute' >Returned</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                      </svg>
                                    </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'returned' ?
                                  <>  <div className='relative returnbtn' >
                                    <h5 className=' stattext text-black flex mx-3 flex-1  absolute' >Retrieved</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'declined' ?
                                  <>   <div className='relative declinedbtn'>
                                    <h5 className=' stattext flex px-3 flex-1  absolute'>{getborrowedbook.borrowStatus}</h5>
                                    <svg width="150" height="24">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" fill={getborrowedbook.borrowStatus === 'pending' || getborrowedbook.borrowStatus === 'declined' ? "#A43033" : "#3da450"} stroke="none" />

                                    </svg>

                                  </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))} >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }


                              </div>
                              <span className='mt-1' onClick={() => (openModal(i))}>
                                <h4 className='removeunderline mb-1'>{getborrowedbook.bookTitle}</h4>

                                <h6  ><span className='makethisbold mr-2'>Borrower Name:</span> {getborrowedbook.borrowerfName} &nbsp; {getborrowedbook.borrowerlName}</h6>
                                <h6 ><span className='makethisbold mr-2'>Borrow Date:</span> {format(new Date(getborrowedbook.borrowDate), 'yyyy-MM-dd')} </h6>
                                <h6 className='flex flex-row items-center ' ><span className='makethisbold mr-2'>Status:</span>  {getborrowedbook.borrowStatus}      
                        {
                       getborrowedbook.borrowStatus === 'confirmed'?
                       new Date() >= new Date(addDays (new Date((getborrowedbook.confirmedDate)),fetchdaylimit?.confirmbook?parseInt(fetchdaylimit.confirmbook, 10):7))? <div className='flex flex-row items-center justify-center '><div className='latewarn flex items-center justify-center ml-2'><p className='mt-0'>!</p></div><p className='mt-0'>late</p></div> : null
                       :null
                       }
                       
                       {
                       getborrowedbook.borrowStatus === 'received'?
                        new Date() >= new Date(addDays (new Date((getborrowedbook.receivedDate)),fetchdaylimit?.receivedbook?parseInt(fetchdaylimit.receivedbook, 10):7 ))? <div className='flex flex-row items-center justify-center '><div className='latewarn flex items-center justify-center ml-2'><p className='mt-0'>!</p></div><p className='mt-0'>late</p></div> : null
                      :null
                       } </h6>
                              </span>

                            </div>


                          </div>



                        ))) :
                        <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p>
                    ) : (<p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>Loading...</p>)

                  }



                </div>
                {!pageloading ?
                  <Pagination page={page} pages={pages} changePage={setPage} /> : null
                }
              </TabPanel>

              <TabPanel hidden={selectedTab !== 'pending'}>
                     <div className=' flex grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 tablet:gap-2 phone:gap-1  '>
                  {
                      !isLoading? (
                       getborrowedbook?.bookquery?.length  ?
                        (getborrowedbook.bookquery.map((getborrowedbook, i) => (



                          <div className='bookmarkcontainer text-white flex flex-row px-2  relative w-100' key={getborrowedbook._id} >


                            <div className='bookmarksimgcont relative  my-3' style={{ zIndex: "2" }}>
                              <Link to={`/openbook/${getborrowedbook.bookId}`}  >
                                <img className=" " src={getborrowedbook.bookImg ? getborrowedbook.bookImg : require('.//style/images/placeholder_book1.jpg')} alt={getborrowedbook.bookTitle} />
                              </Link>
                            </div>

                            <div className=' relative removeshadow text-white flex flex-col pl-1 w-100' style={{ zIndex: "2" }}>
                              <div className='statusbar w-full flex  flex-row-reverse w-100'>

                                {getborrowedbook.borrowStatus === 'pending' ?
                                  <>  <button className='relative acceptbtn' disabled={getborrowedbook.noOfCopies <= 0 ? true:false} onClick={() => (manageRequests(getborrowedbook._id))} >
                                    <h5 className=' stattext flex mx-3 flex-1  absolute' >{getborrowedbook.noOfCopies <= 0 ? '0 copies left':'Accept'}</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </button>

                                    <div className='relative declinebtn' onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute'  >Decline</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div></> : null
                                }
                                {getborrowedbook.borrowStatus === 'confirmed' ?
                                  <>
                                    <div className='relative rcvdbtn' onClick={() => (manageRequests(getborrowedbook._id))}>
                                      <h5 className=' stattext flex mx-3 flex-1  absolute' >Received</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                      </svg>
                                    </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'received' ?
                                  <>
                                    <div className='relative rtrndbtn' onClick={() => (manageRequests(getborrowedbook._id))}>
                                      <h5 className=' stattext flex mx-3 flex-1  absolute' >Returned</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                      </svg>
                                    </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'returned' ?
                                  <>  <div className='relative returnbtn' >
                                    <h5 className=' stattext text-black flex mx-3 flex-1  absolute' >Retrieved</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'declined' ?
                                  <>   <div className='relative declinedbtn'>
                                    <h5 className=' stattext flex px-3 flex-1  absolute'>{getborrowedbook.borrowStatus}</h5>
                                    <svg width="150" height="24">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" fill={getborrowedbook.borrowStatus === 'pending' || getborrowedbook.borrowStatus === 'declined' ? "#A43033" : "#3da450"} stroke="none" />

                                    </svg>

                                  </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))} >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }


                              </div>
                              <span className='mt-1' onClick={() => (openModal(i))}>
                                <h4 className='removeunderline mb-1'>{getborrowedbook.bookTitle}</h4>

                                <h6  ><span className='makethisbold mr-2'>Borrower Name:</span> {getborrowedbook.borrowerfName} &nbsp; {getborrowedbook.borrowerlName}</h6>
                                <h6 ><span className='makethisbold mr-2'>Borrow Date:</span> {new Date(getborrowedbook.borrowDate).toISOString().split('T')[0].replace(/-/g, '/')} </h6>
                                <h6 className='flex flex-row items-center ' ><span className='makethisbold mr-2'>Status:</span>  {getborrowedbook.borrowStatus}      
                        {
                       getborrowedbook.borrowStatus === 'confirmed'?
                       new Date() >= new Date(addDays (new Date((getborrowedbook.confirmedDate)),fetchdaylimit?.confirmbook?parseInt(fetchdaylimit.confirmbook, 10):7))? <div className='flex flex-row items-center justify-center '><div className='latewarn flex items-center justify-center ml-2'><p className='mt-0'>!</p></div><p className='mt-0'>late</p></div> : null
                       :null
                       }
                       
                       {
                       getborrowedbook.borrowStatus === 'received'?
                        new Date() >= new Date(addDays (new Date((getborrowedbook.receivedDate)),fetchdaylimit?.receivedbook?parseInt(fetchdaylimit.receivedbook, 10):7 ))? <div className='flex flex-row items-center justify-center '><div className='latewarn flex items-center justify-center ml-2'><p className='mt-0'>!</p></div><p className='mt-0'>late</p></div> : null
                      :null
                       } </h6>
                              </span>

                            </div>


                          </div>



                        ))) :
                        <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p>
                    ) : (<p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>Loading...</p>)

                  }



                </div>
                {!pageloading ?
                  <Pagination page={page} pages={pages} changePage={setPage} /> : null
                }</TabPanel>
              <TabPanel hidden={selectedTab !== 'confirmed'}>
                     <div className=' flex grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 tablet:gap-2 phone:gap-1  '>
                  {
                      !isLoading? (
                       getborrowedbook?.bookquery?.length  ?
                        (getborrowedbook.bookquery.map((getborrowedbook, i) => (



                          <div className='bookmarkcontainer text-white flex flex-row px-2  relative w-100' key={getborrowedbook._id} >


                            <div className='bookmarksimgcont relative  my-3' style={{ zIndex: "2" }}>
                              <Link to={`/openbook/${getborrowedbook.bookId}`}  >
                                <img className=" " src={getborrowedbook.bookImg ? getborrowedbook.bookImg : require('.//style/images/placeholder_book1.jpg')} alt={getborrowedbook.bookTitle} />
                              </Link>
                            </div>

                            <div className=' relative removeshadow text-white flex flex-col pl-1 w-100' style={{ zIndex: "2" }}>
                              <div className='statusbar w-full flex  flex-row-reverse w-100'>

                                {getborrowedbook.borrowStatus === 'pending' ?
                                  <>  <button className='relative acceptbtn' disabled={getborrowedbook.noOfCopies <= 0 ? true:false} onClick={() => (manageRequests(getborrowedbook._id))} >
                                    <h5 className=' stattext flex mx-3 flex-1  absolute' >{getborrowedbook.noOfCopies <= 0 ? '0 copies left':'Accept'}</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </button>

                                    <div className='relative declinebtn' onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute'  >Decline</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div></> : null
                                }
                                {getborrowedbook.borrowStatus === 'confirmed' ?
                                  <>
                                    <div className='relative rcvdbtn' onClick={() => (manageRequests(getborrowedbook._id))}>
                                      <h5 className=' stattext flex mx-3 flex-1  absolute' >Received</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                      </svg>
                                    </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'received' ?
                                  <>
                                    <div className='relative rtrndbtn' onClick={() => (manageRequests(getborrowedbook._id))}>
                                      <h5 className=' stattext flex mx-3 flex-1  absolute' >Returned</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                      </svg>
                                    </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'returned' ?
                                  <>  <div className='relative returnbtn' >
                                    <h5 className=' stattext text-black flex mx-3 flex-1  absolute' >Retrieved</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'declined' ?
                                  <>   <div className='relative declinedbtn'>
                                    <h5 className=' stattext flex px-3 flex-1  absolute'>{getborrowedbook.borrowStatus}</h5>
                                    <svg width="150" height="24">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" fill={getborrowedbook.borrowStatus === 'pending' || getborrowedbook.borrowStatus === 'declined' ? "#A43033" : "#3da450"} stroke="none" />

                                    </svg>

                                  </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))} >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }


                              </div>
                              <span className='mt-1' onClick={() => (openModal(i))}>
                                <h4 className='removeunderline mb-1'>{getborrowedbook.bookTitle}</h4>

                                <h6  ><span className='makethisbold mr-2'>Borrower Name:</span> {getborrowedbook.borrowerfName} &nbsp; {getborrowedbook.borrowerlName}</h6>
                                <h6 ><span className='makethisbold mr-2'>Borrow Date:</span> {new Date(getborrowedbook.borrowDate).toISOString().split('T')[0].replace(/-/g, '/')} </h6>
                                <h6 className='flex flex-row items-center ' ><span className='makethisbold mr-2'>Status:</span>  {getborrowedbook.borrowStatus}      
                        {
                       getborrowedbook.borrowStatus === 'confirmed'?
                       new Date() >= new Date(addDays (new Date((getborrowedbook.confirmedDate)),fetchdaylimit?.confirmbook?parseInt(fetchdaylimit.confirmbook, 10):7))? <div className='flex flex-row items-center justify-center '><div className='latewarn flex items-center justify-center ml-2'><p className='mt-0'>!</p></div><p className='mt-0'>late</p></div> : null
                       :null
                       }
                       
                       {
                       getborrowedbook.borrowStatus === 'received'?
                        new Date() >= new Date(addDays (new Date((getborrowedbook.receivedDate)),fetchdaylimit?.receivedbook?parseInt(fetchdaylimit.receivedbook, 10):7 ))? <div className='flex flex-row items-center justify-center '><div className='latewarn flex items-center justify-center ml-2'><p className='mt-0'>!</p></div><p className='mt-0'>late</p></div> : null
                      :null
                       } </h6>
                              </span>

                            </div>


                          </div>



                        ))) :
                        <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p>
                    ) : (<p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>Loading...</p>)

                  }



                </div>
                {!pageloading ?
                  <Pagination page={page} pages={pages} changePage={setPage} /> : null
                }
              </TabPanel>
              <TabPanel hidden={selectedTab !== 'received'}>
                          <div className=' flex grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 tablet:gap-2 phone:gap-1  '>
                  {
                      !isLoading? (
                       getborrowedbook?.bookquery?.length  ?
                        (getborrowedbook.bookquery.map((getborrowedbook, i) => (



                          <div className='bookmarkcontainer text-white flex flex-row px-2  relative w-100' key={getborrowedbook._id} >


                            <div className='bookmarksimgcont relative  my-3' style={{ zIndex: "2" }}>
                              <Link to={`/openbook/${getborrowedbook.bookId}`}  >
                                <img className=" " src={getborrowedbook.bookImg ? getborrowedbook.bookImg : require('.//style/images/placeholder_book1.jpg')} alt={getborrowedbook.bookTitle} />
                              </Link>
                            </div>

                            <div className=' relative removeshadow text-white flex flex-col pl-1 w-100' style={{ zIndex: "2" }}>
                              <div className='statusbar w-full flex  flex-row-reverse w-100'>

                                {getborrowedbook.borrowStatus === 'pending' ?
                                  <>  <button className='relative acceptbtn' disabled={getborrowedbook.noOfCopies <= 0 ? true:false} onClick={() => (manageRequests(getborrowedbook._id))} >
                                    <h5 className=' stattext flex mx-3 flex-1  absolute' >{getborrowedbook.noOfCopies <= 0 ? '0 copies left':'Accept'}</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </button>

                                    <div className='relative declinebtn' onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute'  >Decline</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div></> : null
                                }
                                {getborrowedbook.borrowStatus === 'confirmed' ?
                                  <>
                                    <div className='relative rcvdbtn' onClick={() => (manageRequests(getborrowedbook._id))}>
                                      <h5 className=' stattext flex mx-3 flex-1  absolute' >Received</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                      </svg>
                                    </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'received' ?
                                  <>
                                    <div className='relative rtrndbtn' onClick={() => (manageRequests(getborrowedbook._id))}>
                                      <h5 className=' stattext flex mx-3 flex-1  absolute' >Returned</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                      </svg>
                                    </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'returned' ?
                                  <>  <div className='relative returnbtn' >
                                    <h5 className=' stattext text-black flex mx-3 flex-1  absolute' >Retrieved</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'declined' ?
                                  <>   <div className='relative declinedbtn'>
                                    <h5 className=' stattext flex px-3 flex-1  absolute'>{getborrowedbook.borrowStatus}</h5>
                                    <svg width="150" height="24">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" fill={getborrowedbook.borrowStatus === 'pending' || getborrowedbook.borrowStatus === 'declined' ? "#A43033" : "#3da450"} stroke="none" />

                                    </svg>

                                  </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))} >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }


                              </div>
                              <span className='mt-1' onClick={() => (openModal(i))}>
                                <h4 className='removeunderline mb-1'>{getborrowedbook.bookTitle}</h4>

                                <h6  ><span className='makethisbold mr-2'>Borrower Name:</span> {getborrowedbook.borrowerfName} &nbsp; {getborrowedbook.borrowerlName}</h6>
                                <h6 ><span className='makethisbold mr-2'>Borrow Date:</span> {new Date(getborrowedbook.borrowDate).toISOString().split('T')[0].replace(/-/g, '/')} </h6>
                                <h6 className='flex flex-row items-center ' ><span className='makethisbold mr-2'>Status:</span>  {getborrowedbook.borrowStatus}      
                        {
                       getborrowedbook.borrowStatus === 'confirmed'?
                       new Date() >= new Date(addDays (new Date((getborrowedbook.confirmedDate)),fetchdaylimit?.confirmbook?parseInt(fetchdaylimit.confirmbook, 10):7))? <div className='flex flex-row items-center justify-center '><div className='latewarn flex items-center justify-center ml-2'><p className='mt-0'>!</p></div><p className='mt-0'>late</p></div> : null
                       :null
                       }
                       
                       {
                       getborrowedbook.borrowStatus === 'received'?
                        new Date() >= new Date(addDays (new Date((getborrowedbook.receivedDate)),fetchdaylimit?.receivedbook?parseInt(fetchdaylimit.receivedbook, 10):7 ))? <div className='flex flex-row items-center justify-center '><div className='latewarn flex items-center justify-center ml-2'><p className='mt-0'>!</p></div><p className='mt-0'>late</p></div> : null
                      :null
                       } </h6>
                              </span>

                            </div>


                          </div>



                        ))) :
                        <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p>
                    ) : (<p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>Loading...</p>)

                  }



                </div>
                {!pageloading ?
                  <Pagination page={page} pages={pages} changePage={setPage} /> : null
                }</TabPanel>
              <TabPanel hidden={selectedTab !== 'returned'}>
                    <div className=' flex grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 tablet:gap-2 phone:gap-1  '>
                  {
                      !isLoading? (
                       getborrowedbook?.bookquery?.length  ?
                        (getborrowedbook.bookquery.map((getborrowedbook, i) => (



                          <div className='bookmarkcontainer text-white flex flex-row px-2  relative w-100' key={getborrowedbook._id} >


                            <div className='bookmarksimgcont relative  my-3' style={{ zIndex: "2" }}>
                              <Link to={`/openbook/${getborrowedbook.bookId}`}  >
                                <img className=" " src={getborrowedbook.bookImg ? getborrowedbook.bookImg : require('.//style/images/placeholder_book1.jpg')} alt={getborrowedbook.bookTitle} />
                              </Link>
                            </div>

                            <div className=' relative removeshadow text-white flex flex-col pl-1 w-100' style={{ zIndex: "2" }}>
                              <div className='statusbar w-full flex  flex-row-reverse w-100'>

                                {getborrowedbook.borrowStatus === 'pending' ?
                                  <>  <button className='relative acceptbtn' disabled={getborrowedbook.noOfCopies <= 0 ? true:false} onClick={() => (manageRequests(getborrowedbook._id))} >
                                    <h5 className=' stattext flex mx-3 flex-1  absolute' >{getborrowedbook.noOfCopies <= 0 ? '0 copies left':'Accept'}</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </button>

                                    <div className='relative declinebtn' onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute'  >Decline</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div></> : null
                                }
                                {getborrowedbook.borrowStatus === 'confirmed' ?
                                  <>
                                    <div className='relative rcvdbtn' onClick={() => (manageRequests(getborrowedbook._id))}>
                                      <h5 className=' stattext flex mx-3 flex-1  absolute' >Received</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                      </svg>
                                    </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'received' ?
                                  <>
                                    <div className='relative rtrndbtn' onClick={() => (manageRequests(getborrowedbook._id))}>
                                      <h5 className=' stattext flex mx-3 flex-1  absolute' >Returned</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                      </svg>
                                    </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'returned' ?
                                  <>  <div className='relative returnbtn' >
                                    <h5 className=' stattext text-black flex mx-3 flex-1  absolute' >Retrieved</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }
                                {getborrowedbook.borrowStatus === 'declined' ?
                                  <>   <div className='relative declinedbtn'>
                                    <h5 className=' stattext flex px-3 flex-1  absolute'>{getborrowedbook.borrowStatus}</h5>
                                    <svg width="150" height="24">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" fill={getborrowedbook.borrowStatus === 'pending' || getborrowedbook.borrowStatus === 'declined' ? "#A43033" : "#3da450"} stroke="none" />

                                    </svg>

                                  </div>
                                    <div className={`relative declinebtn2  ${fetchdaylimit?.undostatus? '':'hidden'}`} onClick={() => (manageundoRequests(getborrowedbook._id))} >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute flex align-baseline justify-center'  ><FaUndo className='mt-0.5 mr-1' />undo</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                                  </> : null
                                }


                              </div>
                              <span className='mt-1' onClick={() => (openModal(i))}>
                                <h4 className='removeunderline mb-1'>{getborrowedbook.bookTitle}</h4>

                                <h6  ><span className='makethisbold mr-2'>Borrower Name:</span> {getborrowedbook.borrowerfName} &nbsp; {getborrowedbook.borrowerlName}</h6>
                                <h6 ><span className='makethisbold mr-2'>Borrow Date:</span> {new Date(getborrowedbook.borrowDate).toISOString().split('T')[0].replace(/-/g, '/')} </h6>
                                <h6 className='flex flex-row items-center ' ><span className='makethisbold mr-2'>Status:</span>  {getborrowedbook.borrowStatus}      
                        {
                       getborrowedbook.borrowStatus === 'confirmed'?
                       new Date() >= new Date(addDays (new Date((getborrowedbook.confirmedDate)),fetchdaylimit?.confirmbook?parseInt(fetchdaylimit.confirmbook, 10):7))? <div className='flex flex-row items-center justify-center '><div className='latewarn flex items-center justify-center ml-2'><p className='mt-0'>!</p></div><p className='mt-0'>late</p></div> : null
                       :null
                       }
                       
                       {
                       getborrowedbook.borrowStatus === 'received'?
                        new Date() >= new Date(addDays (new Date((getborrowedbook.receivedDate)),fetchdaylimit?.receivedbook?parseInt(fetchdaylimit.receivedbook, 10):7 ))? <div className='flex flex-row items-center justify-center '><div className='latewarn flex items-center justify-center ml-2'><p className='mt-0'>!</p></div><p className='mt-0'>late</p></div> : null
                      :null
                       } </h6>
                              </span>

                            </div>


                          </div>



                        ))) :
                        <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p>
                    ) : (<p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>Loading...</p>)

                  }



                </div>
                {!pageloading ?
                  <Pagination page={page} pages={pages} changePage={setPage} /> : null
                }
              </TabPanel>
              </>:null}





            </div>

          </div>


        </div>




      </>

    );



};

export default Requests;



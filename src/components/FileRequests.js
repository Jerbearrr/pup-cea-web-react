import React, { useEffect, useState } from 'react';
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/bookmarks.css";
import "./style/requests.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { reset, getUser, logoutUser } from '../features/auth/authSlice'
import { FaSearch } from "react-icons/fa";
import { FaChevronDown, FaUndo } from "react-icons/fa";
import Menu from "./Menu.js";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import axios from 'axios';
import Pagination from './Pagination';
import { toast } from 'react-toastify';
import { digitalCopyApi } from '../features/auth/requests';

const FileRequests = () => {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const { isError, isLoading, borrowbook } = useSelector(state => state.book);
  const { user, isSuccess } = useSelector(state => state.auth);
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [dataLoading, setDataLoading] = useState(null);
  const [userloaded, setuserloaded] = useState(null)
  const pageNumber = 1;
  const [entries, setEntries] = useState(null);
  const [page, setPage] = useState(urlParams.get('page') ?urlParams.get('page'): pageNumber);
  const [dataloader, setDataloader]= useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )

  const userexist = getCookieValue('userpersist')


   const [skipCount, setSkipCount] = useState(true);

  
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



  useEffect(async () => {

    if (userexist) {
      if (user.length !== 0) {
        setuserloaded(user)
        setDataLoading(true);
        try {
          const req = await digitalCopyApi.get(`/all?page=${page}&filter=pending`);
          setEntries(req.data);
        } catch (err) {
          toast.error(err);
        } finally {
          setDataLoading(false);
          setDataloader(false)
        }
      }
    } else {
      if (!userloaded) {
        navigate('/')
      }
    }

  }, [user, page,dataloader ])

  const onLogout = () => {
    setuserloaded(null)
    dispatch(logoutUser())
    dispatch(reset())
  }

  const [isActive, setActive] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
  };

  const onClickOutsideListener = () => {
    setActive(false)
    document.removeEventListener("click", onClickOutsideListener)
  }

  const handleRequest = async (id, isApproved) => {
    const body = {
      _id: id,
      isApproved
    }

    try {
      setWaitingResponse(true);
      const req = await digitalCopyApi.post('/handleRequest', body);
      console.log(req);
    } catch (err) {
      setWaitingResponse(false);
      toast.error(err);
    } finally {
      setWaitingResponse(false);
      if (isApproved) {
        toast.success('Request has been successfully approved.');
      } else {
        toast.success('Request has been successfully declined.');
      }
      setDataLoading(true);
      setDataloader(true)
    }
  }
  useEffect(()=>{
    console.log(entries?.fileRequests)
  },[entries])

  useEffect(()=>{
     
     window.history.replaceState(null, null, `?page=${ page}`);
    
  },[page])
  
 useEffect(()=>{
    
    if(!dataloader ){

      console.log('arewehere')
      if( page > 1 &&  entries?.length <= 0){
            console.log('arewehere2')
        setPage(page - 1)
      }
    }



  },[dataloader, entries])

    return (
      <>
        <div className='recentlyCont  flex '>

          <div className='recentCont pt-3 addnav '>
            <div className='text-black recenthead recentContCont '>

              <div className='overflow-x-auto overflow-y-hidden flex bookmarkshead  mt-3 mb-2 flex-row  items-center'>
                <button className="mr-0.5 group whitespace-nowrap  items-center px-2 py-1  tabactive">Digital Copy Requests</button>
              </div>

              <div className='mb-24  grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 gap-1 '>
                {
                  !dataLoading && !dataloader?  (
                       entries? (
                       entries?.fileRequests?.map(fileRequest => (
                        <div className='bookmarkcontainer text-white flex flex-row px-2 relative w-100 ' key={fileRequest?._id}>
                          <div className=' relative removeshadow text-white flex flex-col pl-2 w-100 ' style={{ zIndex: "2" }}>
                            <div className='statusbar w-full flex  flex-row-reverse w-100'>
                              <button type='button' onClick={() => (handleRequest(fileRequest?._id, true))} className='relative acceptbtn disabled:opacity-50' disabled={waitingResponse}>
                                <h5 className=' stattext flex mx-3 flex-1  absolute'>Accept</h5>
                                <svg className='' width="150" height="25">
                                  <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                </svg>
                              </button>

                              <button type='button' onClick={() => (handleRequest(fileRequest?._id, false))} className='relative declinebtn disabled:opacity-50' disabled={waitingResponse}>
                                <h5 className=' stattext flex mx-2 flex-1  absolute'>Decline</h5>
                                <svg className='' width="150" height="25">
                                  <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                </svg>
                              </button>

                            </div>


                            <h4 className='removeunderline my-1'>{fileRequest?.book_id?.title}</h4>
                            <h6 className='onelineonly'><span className='makethisbold mr-2'>Requested by:</span>{`${fileRequest?.borrower_id?.firstName} ${fileRequest?.borrower_id.lastName}`}</h6>
                            <h6 className='onelineonly'><span className='makethisbold mr-2'>Department:</span>{fileRequest?.borrower_id?.department}</h6>
                          </div>
                        </div>
                      ))
                    ) :
                      (<p className='laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>No requests found.</p>)

                  ) :
                    <div className='laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>Loading...</div>
                }
              </div>
              <Pagination page={page} pages={entries?.totalPages} changePage={setPage} />
            </div>


          </div>


        </div>




      </>

    );
 

};

export default FileRequests;
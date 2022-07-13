import React, { useEffect, useState, useContext, useRef } from 'react';
import { FaRegBookmark } from "react-icons/fa";
import { BsFillBookmarkStarFill, BsWindowSidebar } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import ButtonSpinner from './ButtonSpinner';
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/openbook.css";
import LoadingSpinner from './Spinner.js';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { likeBook, bookmarkBook } from "../features/book/bookSlice";
import jwt_decode from "jwt-decode";
import { openBook, getrelatedBooks, checkborrowBook, borrowBook } from '../features/book/bookSlice';
import { reset, getUser, logoutUser } from '../features/auth/authSlice'
import { digitalCopyApi } from '../features/auth/requests';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import {IoCloseSharp, } from  "react-icons/io5";
import Renderonview from './Renderonview';
import { set } from 'date-fns';

const Openbook = () => {

  const { id } = useParams();
const ref = useRef()
  const [fileRequested, setFileRequested] = useState(null);
  const [likecount, setlikecount] = useState(null)
  const [hasliked, sethasliked] = useState(null)
  const [hasbookmarked, sethasbookmarked] = useState(null)
  const [pageloading, setpageloading] = useState(true)
  const [likeloading, setlikeloading] = useState(false)
  const [borrowstatus, setborrowstatus] = useState(false)
  const [loadingFile, setLoadingFile] = useState(null);
  const [relatedloading, setrelatedloading] = useState(true)
  const [alreadyshown, setalreadyshown]= useState(false)
  const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )

  const { isLoading, openbook, relatedbook, borrowbook, sameseries, isError, message} = useSelector(state => state.book);
  const { user, userLoading } = useSelector(state => state.auth);

  const isVisible =Renderonview(ref);
 
      useEffect(()=>{
        setalreadyshown(false)
  setrelatedloading(true)
  },[id])

  useEffect(()=>{
     if(isVisible && id && !alreadyshown){
      console.log(isVisible)
      dispatch(getrelatedBooks(id)).then(res=>{
      if(res){
        setalreadyshown(true)
        setrelatedloading(false)
      }
     })

     }

    
  },[isVisible, openbook])
   


  const userexist = getCookieValue('userpersist')


  const dispatch = useDispatch();
  const navigate = useNavigate();

    const [modalIsOpen, setIsOpen] = React.useState({ open: false, selectedBook: null });
   
  function openModal() {
    setIsOpen({open:true});
  }
    function closeModal() {
    setIsOpen({open:false});
  }


  useEffect(() => {
    window.scrollTo(0, 0);
    setpageloading(true)
    const bookData = {
      id: id
    }
    dispatch(openBook(bookData))
  }, [id])

  useEffect(async () => {
    const bookData = {
      id: id
    }

    if (userexist && user?.accessToken) {
      if (Object.keys(user).length && Object.keys(openbook).length) {
        setlikecount(openbook.noOfLikes?.length)
        dispatch(checkborrowBook(bookData.id))
        try {
          const { data } = await digitalCopyApi.post(`/${openbook._id}/isRequested`);
          setFileRequested(data)
        } catch (err) {

          console.log(err)

        }

        if (openbook.noOfLikes?.find((noOfLikes) => noOfLikes.user_id === user._id)) {

          sethasliked(true)

        } else {
          sethasliked(false)
        }
        if (openbook.noOfBookmarks?.find((noOfBookmarks) => noOfBookmarks.user_id === user._id)) {

          sethasbookmarked(true)


        } else {
          sethasbookmarked(false)

        }
      }
    } else {
      setlikecount(openbook.noOfLikes?.length)
      sethasbookmarked(false)
      sethasliked(false)

    }
  }, [openbook, user, id])

  useEffect(() => {

    if (userexist && user?.accessToken) {
      if (Object.keys(openbook).length && Object.keys(user).length && Object.keys(borrowbook).length) {

        if (borrowbook.alreadyborrowed === true) {
          setborrowstatus(borrowbook.borrowstatus)
          setpageloading(false)
        } else {
          setborrowstatus(false)

          setpageloading(false)
        }

      }
    }
    if (Object.keys(openbook) && !userexist) {
      setborrowstatus(false)
      setpageloading(false)
    }

  }, [pageloading && borrowbook, id])

  const [isActive, setActive] = useState(false);

  const onClickOutsideListener = () => {
    setActive(!isActive);
    document.removeEventListener("click", onClickOutsideListener)
  }

  var Likes = () => {
    return hasliked
      ? (
        <><FaHeart fontSize="small" />&nbsp;{likecount}</>
      ) : (
        <><FaRegHeart fontSize="small" fill='white' />&nbsp;{likecount} {likecount === 1 ? 'Like' : 'Likes'}</>
      );
  };
  var Bookmarks = () => {
    return hasbookmarked
      ? (
        <><BsFillBookmarkStarFill fontSize="small" fill='white' /></>
      ) : (
        <><FaRegBookmark fontSize="small" /></>
      );
  };
  useEffect(()=>{
   if(isError){ toast.error(message)
   navigate('/')
  }
  
   

  },[isError])  




    const Borrowstatus = () => {

    if(openbook.noOfCopies >0){
      if (borrowstatus === 'pending'  ) {
        return (<><button className='px-2 my-4 mx-1' disabled={!userexist || isLoading || likeloading || !user.accessToken || userLoading} onClick={() => { borrowtheBook() }}>Cancel Request</button></>)
      } else if (borrowstatus === 'confirmed' || borrowstatus === 'borrowed' || borrowstatus === 'received') {
        return (<><button className='px-2 my-4 mx-1' disabled> {borrowstatus} </button></>)
      } else if (borrowstatus === 'false') {
        return (<><button className='px-2 my-4 mx-1' disabled={!userexist || isLoading || likeloading || !user.accessToken || userLoading} onClick={() => { borrowtheBook() }}>Borrow</button></>)
      } else {
        return (<><button className='px-2 my-4 mx-1' disabled={!userexist || isLoading || likeloading || !user.accessToken || userLoading} onClick={() => { borrowtheBook() }}>Borrow</button></>)
      }}else{
        return (<><button className='px-2 my-4 mx-1' disabled={true} onClick={() => { borrowtheBook() }}>No copies available</button></>)
      }

    };

    const borrowtheBook = () => {
      setlikeloading(true)
      if (borrowstatus) {
        setborrowstatus(false)
      } else {
        setborrowstatus('pending')
      }

      if (!isLoading && user.accessToken) {
        dispatch(borrowBook(openbook._id)).then((res) => {
          if (res) {
            setlikeloading(false)
          }
        })

      }
    }

    const liketheBook = () => {
      setlikeloading(true)
      if (hasliked) {
        setlikecount(likecount - 1)
        sethasliked(false)
      } else {
        setlikecount(likecount + 1)
        sethasliked(true)
      }


      if (!isLoading && user.accessToken) {
        dispatch(likeBook(openbook._id)).then((res) => {
          if (res) {
            setlikeloading(false)
          }
        })
      }


    }

    const bookmarktheBook = () => {

      setlikeloading(true)
      if (hasbookmarked) {
        sethasbookmarked(false)
      } else {
        sethasbookmarked(true)
      }

      if (!isLoading && !likeloading && user.accessToken) {
        dispatch(bookmarkBook(openbook._id)).then((res) => {
          if (res) {
            setlikeloading(false)
          }
        })
      }

    }

    const requestFile = async () => {
      setLoadingFile(true)

      try {
        const req = await digitalCopyApi.post(`${openbook._id}/request`);

        if (req.data) {
          setFileRequested(req.data)
          setLoadingFile(false);

        }
      } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        toast.error(message);
        setLoadingFile(false);

      }
    }

    const cancelRequest = async () => {
      setLoadingFile(true);

      digitalCopyApi.post(`${openbook._id}/cancelReq`)
        .then(res => {

          console.log(res.data);
          setFileRequested(null);
          setLoadingFile(false);
        })
        .catch(error => {
          const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
          toast.error(message);
          setLoadingFile(false);
        })


    }

    const updateRequest = async () => {
      setLoadingFile(true);

      digitalCopyApi.post(`${openbook._id}/updateRequest`)
        .then(res => {
          setFileRequested(res.data);
          setLoadingFile(false);
        })
        .catch(error => {
          const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
          toast.error(message);
          setLoadingFile(false);
        })
    }

    const openFile = async () => {
      setLoadingFile(true);

      digitalCopyApi.get(`${openbook._id}/getFile`)
        .then(res => {
          navigate('/viewFile', {state: res.data});
          setLoadingFile(false);
        })
        .catch(error => {
          const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
          toast.error(message);
          setLoadingFile(false);
        })
    }

    return (
      
      <>
     
        <div style={{ backgroundColor: "#18191a" }}>
         { Object.keys(openbook).length && pageloading === false && openbook._id === id ?
          <div className='relative  flex mainp ' >

            <div className='w-full bookdetailcontainer  ' key={openbook._id}>
            
                 <div className='absolute parentabsoluter'>
              
                 <div className={'absolute ' + (openbook && openbook.imgUri ? 'blurcontainer' : 'blurcontainer2')} style={{ backgroundImage: 'url(' + `${openbook ? openbook.imgUri ? openbook.imgUri : require('.//style/images/bg3.png') : null}` + ')'}} > </div>   
                
                 </div>
              

             
              <div className='maxwidthopen  flex-row flex  grid grid-cols-12 self-center'>
                <div className='bookimge laptop:my-8 phone:my-0 phone:pb-0 pt-8 tablet:py-6 desktop:py-8  col-span-12 desktop:col-span-2 tablet:col-span-4 '>
                  <div className='flex flex-col'>
                    <img className='openbookimage bg-transparent' src={openbook?.imgUri ? openbook.imgUri : require('.//style/images/placeholder_book.png')} alt="No Image Preview" />
                    {user && userexist && openbook.digitalCopy && !fileRequested?.isRequested &&
                      <button onClick={requestFile} className='digitalFile justify-center text-center disabled:opacity-75' disabled={loadingFile}>
                        {loadingFile ? <ButtonSpinner /> : <p>Request for Digital Copy</p>}

                      </button>
                    }
                    {user && userexist && openbook.digitalCopy && fileRequested?.status === 'rejected' &&
                      <button onClick={updateRequest} className='digitalFile justify-center text-center bg-red-600 disabled:opacity-75' disabled={loadingFile}>
                        {loadingFile ? <ButtonSpinner /> : <p>Request File Again</p>}

                      </button>
                    }
                    {user && userexist && openbook.digitalCopy && fileRequested?.status === 'pending' &&
                      <button onClick={cancelRequest} className='digitalFile justify-center text-center bg-yellow-500 disabled:opacity-75' disabled={loadingFile}>
                        {loadingFile ? <ButtonSpinner /> : <p>Cancel Request</p>}

                      </button>
                    }
                    {user && userexist && openbook.digitalCopy && fileRequested?.status === 'approved' &&
                      <button onClick={openFile} className='digitalFile justify-center text-center bg-green-600 disabled:opacity-75' disabled={loadingFile}>
                        {loadingFile ? <ButtonSpinner /> : <p>View File</p>}

                      </button>
                    }
                    {(openbook?.digitalCopyPublic && !openbook?.digitalCopy)  || (openbook?.linkurl && !openbook?.digitalCopy)  ? 
                    <>
                    <button className='digitalFile justify-center text-center' onClick={()=>(openModal())}> Click to read Digital Version</button>
                             <Modal
              style = {{  margin: 0 }}
            isOpen={modalIsOpen.open}
            shouldCloseOnOverlayClick={true}
            onRequestClose={closeModal}
            className={"openbookmodal"}
            >
           { !isLoading? ( modalIsOpen.selectedBook !== null ? 
            <>
            <button className='closeModal' onClick={closeModal}><   IoCloseSharp color="white"/></button>  
             <div className='flex flex-col mt-14 w-100 justify-center align-center '>
              {openbook.digitalCopyPublic?
              <button className='yesbtn laptop:mx-8 phone:mx-8 px-8 py-2' onClick={() => {window.open(`${openbook.digitalCopyPublic}`);}}>
                 <p className='text-white'>Click me to view File!</p>
               </button>:null
            }
              {openbook.linkurl?
             <button className='yesbtn laptop:mx-8 phone:mx-8 mt-3 px-8 py-2' onClick={() => {window.open(`${openbook.linkurl}`);}}>
                 <p className='text-white'>Alternative Link</p>
               </button>:null
             }
               
             </div>

            </>:
            <p  className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p> ):null}
        
       
                   </Modal></>:null}
                  </div>

                </div>
                <div className='titledescription laptop:my-8 phone:mb-2 phone:mt-0 pb-2 tablet:py-4 desktop:py-8 col-span-12 desktop:col-span-7 tablet:col-span-8  tablet:px-6 phone:px-2 '>
                  <h2 className='px-1 mt-1 openbooktitle phone:justify-center tablet:justify-start
          flex phone:text-center tablet:text-left'>{openbook.title}</h2>
                  <h3 className='openbookauthor py-2'><span className='openbookclassname'>Author: &nbsp; </span> {openbook.author}</h3>

                  <div className='   flex flex-row openbookbuttons mt-1'>

                    <Borrowstatus />
                    <button className='px-2 my-4   mx-1' disabled={!userexist || isLoading || likeloading || !user.accessToken || userLoading} onClick={() => { bookmarktheBook() }}>
                      <Bookmarks />
                    </button>
                    <button className='px-2  my-4  mx-1' disabled={!userexist || isLoading || likeloading || !user.accessToken || userLoading} onClick={() => { liketheBook() }}>
                      <Likes />
                    </button>

                  </div>
                  {openbook.description?
                  <h4 className='openbooksummary mb-2 mt-2 '><p className='openbookclassname mb-2'>Overview:</p></h4>:null}
                  {openbook.description? <h4 className='openbooksummarycont mb-2 mt-2 '>{openbook.description}</h4>:null}
                  
                  {openbook.volume || openbook.edition ? 
                  <div className=' flex-row phone:hidden desktop:flex mt-5'>
                    {openbook.volume ? (<h4 className='openbooksummary '><span className='openbookclassname'>Volume: &nbsp; </span> {openbook.volume}</h4>) : (null)}
                    {openbook.edition ? (<h4 className='openbooksummary  mx-2'><span className='openbookclassname '>Edition: &nbsp; </span> {openbook.edition}</h4>) : (null)}
                  </div>:null
                  }
                  {openbook.series ? <> <div className='seriesdiv mt-4   '>

                    <h4 className='openbooksummary mb-2 py-2'>More on<span className='openbookclassname'> {openbook.series} </span>&nbsp;Series </h4>

                  </div>

                    <div className='sameSeries ml-1  w-100 grid grid-cols-3 grid-row-3 gap-2 mt-2'>


                      {
                        sameseries?.length > 0 ?
                          sameseries.map(sameseries => (
                            <Link className={`seriesbook relative px-1 ${sameseries._id === openbook._id ? 'selectedid' : null}`} key={sameseries._id} to={ `/openbook/${sameseries._id}`} >
                              <div className='blurthis2 absolute ' style={{ backgroundImage: 'url(' + `${sameseries.imgUri ? sameseries.imgUri : require('.//style/images/bg2.png')}` + ')' }}>   </div>
                              <p>{sameseries.title}</p>
                            </Link>
                          )) : null
                      }



                    </div>

                  </> : null
                  }
                </div>
                <div className='moredetails py-4 tablet:py-6 desktop:py-8  desktop:col-span-3  phone:col-span-12 flex flex-col desktop:items-left tabletlg:px-7 phone:px-3'>
                  <div className='flex laptop:my-8 phone:my-2 flex-col  desktop:px-0 moredetcont'>
                    {openbook.type ? (<p><span className='openbookclassname'>Material type: &nbsp; </span>{openbook.type}</p>) : (null)}
                    {openbook.form ? (<p><span className='openbookclassname'>Literary Form: &nbsp; </span>  {openbook.form}</p>) : (null)}
                    {openbook.genre?.length > 0 && openbook.genre[0] !== "" ? (<div className='genreneg'><span className='openbookclassname mr-1'>Genre:</span>  {
                      openbook.genre ?
                        (openbook.genre.map(openbook => (
                          <div className='genrecircle inline-flex' key={openbook}> <a className='openbookgenre pr-0.5 mb-2 ' key={openbook}><span className='px-1 '>{openbook}</span></a></div>
                        ))) : <a></a>
                    }</div>) : (null)}
                    {openbook.publisher ? (<p><span className='openbookclassname'>Publisher: &nbsp; </span>{openbook.publisher}</p>) : (null)}
                    {openbook.copyrightDate ? (<p><span className='openbookclassname'>Copyright date: &nbsp; </span>©{new Date(openbook.copyrightDate).getFullYear()}</p>) : (null)}
                    {openbook.dateOfPublication ? (<p><span className='openbookclassname'>Publication date: &nbsp; </span>{new Date(openbook.dateOfPublication).getFullYear()}</p>) : (null)}
                    {openbook.volume ? (<p className='desktop:hidden'><span className='openbookclassname'>Volume: &nbsp; </span> {openbook.volume}</p>) : (null)}
                    {openbook.edition ? (<p className='desktop:hidden'><span className='openbookclassname'>Edition: &nbsp; </span> {openbook.edition}</p>) : (null)}
                    {openbook.isbn ? (<p><span className='openbookclassname'>ISBN: &nbsp; </span> {openbook.isbn}</p>) : (null)}
                    {openbook.doi ? (<p><span className='openbookclassname'>DOI: &nbsp; </span> {openbook.doi}</p>) : (null)}
                    {openbook.callNumber ? (<p><span className='openbookclassname'>Call number: &nbsp;  </span>{openbook.callNumber}</p>) : (null)}
                    <p><span className='openbookclassname'>Availability: &nbsp; </span>{openbook.noOfCopies > 0 ? (<span className="text-emerald-400">Available</span>) : (<span className="text-rose-600">Not Available</span>)}</p>

                  </div>
                </div>

              </div>
            </div>

          </div>: <div className='relative  flex ' >
          <div className='w-full  bookdetailcontainer  ' style={{ minHeight: '50vh' }}>

            <div className='maxwidthopen w-full flex-row flex  self-center items-center justify-center'>
           
              <div className='relative flex self-center items-center justify-center w-full h-full '>
                  <LoadingSpinner />
              </div>
               
          

            </div>
          </div>

        </div>
  }


          <div ref={ref} className='youmaylike pb-24 pt-3'>
            <div className='flex recenthead mt-5 flex-row justify-between items-center'>
              <h3 className='mb-3 text-xl text-white font-semibold '>Recommended For You
              </h3>

            </div>
            <div   className='phone:px-1 desktop:px-0 w-full grid grid-row-2 desktop:grid-cols-6 laptop:grid-cols-6 tabletlg:grid-cols-4 tablet:grid-cols-3 phone:grid-cols-3 phone:gap-1 tablet:gap-1 tabletlg:gap-2 '>


              {!relatedloading ?
                (relatedbook?.map(book => (
                  <Link key={book._id} to={`/openbook/${book._id}`} >

                    <div className='h-full '>
                      <div className="overflow-hidden recentcard ">

                        <div className='imagecont ' style={{ zIndex: "2" }}>
                          <img className=" imagecontcont" loading="lazy" src={book.imgUri ? book.imgUri : require('.//style/images/placeholder_book1.png')} alt="No Image Preview" />
                        </div>

                        <div className="px-1 carddet " style={{ zIndex: "2" }}>
                          <div className=" cardtitle ">{book.title}</div>
                          <p className=" cardauthor  mb-1">
                            {book.author}
                          </p>
                        </div>

                      </div>
                    </div>
                  </Link>
                ))) :
                <>
                      <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>
                 <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>
                 <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>
                 <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>
                 <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>
                 <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>
                </>
              }




            </div>
          </div>


        </div>
      </>
    );








};

export default Openbook;
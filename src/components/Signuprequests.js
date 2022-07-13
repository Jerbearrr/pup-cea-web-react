import React, { useEffect, useState, useContext } from 'react';
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/bookmarks.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getborrowedBook, signupRequests, verifySignuprequests, rejectSignuprequests, getallcontributedBook } from '../features/book/bookSlice';
import { useTabs, TabPanel } from "react-headless-tabs"
import { TabSelector } from './TabSelector';
import { apiClientBase } from '../features/auth/requests';
import Pagination from './Pagination';
import Select from 'react-select';
import { digitalCopyApi } from '../features/auth/requests';
import {format} from 'date-fns'
import jwt_decode from "jwt-decode";
import { getUser } from '../features/auth/authSlice';
import Zoom from 'react-medium-image-zoom'
import Modal from 'react-modal';
import { IoCloseSharp, } from "react-icons/io5";
import Creatable from 'react-select/creatable';
import { toast } from "react-toastify";

import bookService from '../features/book/bookService';



const Signuprequests = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);



  const { isLoading, getborrowedbook, signrequests, signRrequests, getcontributedbook } = useSelector(state => state.book);
  const { user } = useSelector(state => state.auth);
  const [pageloading, setpageloading] = useState(true)
  const [userloaded, setuserloaded] = useState(null)
    const [selecteditgenre, setselecteditgenre] = useState(null);
    

  const [fileOptions, setFileOptions] = useState([
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ])


  const [selectedTab, setSelectedTab] = useTabs([
    'Signuprequests',
    'Contributionrequests',
  ]);
  const pageNumber = 1;
  const [fileRequests, setFileRequests] = useState(null);
  const [tabLoading, setTabLoading] = useState(null);
  const [page, setPage] = useState(urlParams.get('page') ?urlParams.get('page'): pageNumber);
  const [pages, setPages] = useState(1);
  const [approvedbook, setapprovedbook] = useState(null);
   const [confirmbook, setconfirmbook]= useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()
 
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

  const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )






  const userexist = getCookieValue('userpersist')


  useEffect(() => {
    window.scrollTo(0, 0);
    setpageloading(true)
    setSelectedTab(urlParams.get('tab')?urlParams.get('tab'):'Signuprequests' )


  }, [])

  useEffect(async () => {
   window.scrollTo(0, 0);
  console.log(page)
   if(selectedTab === 'Signuprequests'){
    if (userexist) {
      if (user.length !== 0) {
        setuserloaded(user)
         dispatch(signupRequests(page))
         
        setpageloading(false)
        setistabLoading(false)
        
      }
    } else {
      setpageloading(false)
      if (!userloaded) {
        navigate('/')
      }
    }
   }
    
  if(selectedTab === 'Contributionrequests'){
  if (userexist) {
      if (user.length !== 0) {
        setuserloaded(user)
        dispatch(getallcontributedBook(page))
        setpageloading(false)
         setapprovedbook(null)
        setconfirmbook(null)
        setistabLoading(false)
      }
    } else {
      setpageloading(false)
      if (!userloaded) {
        navigate('/')
      }
    }
   }




  }, [page, user, signRrequests, selectedTab, approvedbook  ])


  useEffect(() => {
    if(selectedTab === 'Signuprequests' ){
    setPages(signrequests?.totalPages)
    }else if(selectedTab === 'Contributionrequests'){
    setPages(getcontributedbook?.pages)
    }

  }, [selectedTab,getcontributedbook,signrequests  ])

  

  const tabClicked = (tabstatus) => {
    
    setPage(1)
    setpageloading(true)
    setSelectedTab(tabstatus);
    

  }

  const [istabLoading, setistabLoading] = useState(false)


   const acceptRequest = async (id) => {


   setistabLoading(true)
  
    var decoded = jwt_decode(user.accessToken);
    var now = new Date();
    var time = now.getTime();
    var exp = new Date((decoded.exp * 1000) - (5 * 1000));

    if (time > exp) {

      dispatch(getUser()).then((response) => {
        if (response.payload.accessToken) {
          dispatch(verifySignuprequests(id)).then((res)=>{
            if(res){
              setistabLoading(false)
            }
          })
        }
      });

    } else {

      dispatch(verifySignuprequests(id)).then((res)=>{
            if(res){
              setistabLoading(false)
            }
          })
    }
  
  }

  const declineRequest = async (id) => {

    setistabLoading(true)
  
    var decoded = jwt_decode(user.accessToken);
    var now = new Date();
    var time = now.getTime();
    var exp = new Date((decoded.exp * 1000) - (5 * 1000));

    if (time > exp) {

      dispatch(getUser()).then((response) => {
        if (response.payload.accessToken) {
          dispatch(rejectSignuprequests(id)).then((res)=>{
            if(res){
              setistabLoading(false)
            }
          })
        }
      });

    } else {

      dispatch(rejectSignuprequests(id)).then((res)=>{

            if(res){
              setistabLoading(false)
            }
          })
    }
  }



  const [isActive, setActive] = useState(false);

  useEffect(()=>{
     
     window.history.replaceState(null, null, `?tab=${selectedTab}&page=${ page}`);
    
  },[page,selectedTab])


 
 const [genrearr, setgenrearr]= useState(null)
 useEffect(()=>{
  console.log(confirmbook)
 },[confirmbook])
 const [modalIsOpen, setIsOpen] = React.useState({ open: false, selectedBook: null });
   function openModal(i) {
    setIsOpen({ open: true, selectedBook: i });
  }
  function closeModal() {
    setIsOpen({ open: false, selectedBook: null });
    setconfirmbook(null)
 
  }

   const selectedgenreoptions = (genre) => {
 if(genre){
  let options = [];
    // MAKE A LABEL FOR EACH GENRE VALUE
    genre.forEach(value => {

      let label = value.split('_');
      let formattedLabel = [];
      //FORMAT LABEL INTO PROPER UPPERCASE AND CHANGE _ TO SPACE
      label.forEach(word => {
        formattedLabel.push(word.charAt(0).toUpperCase() + word.slice(1))
      })

      options = [...options, { value: value, label: formattedLabel.join(' ') }];

    })
    console.log(options)
    setselecteditgenre(options)
    return options;
}
   }
  
  const onFormSubmit = (event) => {
    setistabLoading(true)
    event.preventDefault();
    let form = new FormData(event.target);
    for (var pair of form.entries()) {
    console.log(pair[0]+ ', ' + pair[1]); 
    }
    bookService.confirmContri(form).then(res => {
    if(res){
        console.log(res)
        toast.success('Book Added Successfully')
        setapprovedbook(res)
        setconfirmbook(null)
        console.log(res)
        closeModal()
      
        
        ;}
      }).catch(err => {
        toast.error(err.message);
     })
    console.log(confirmbook.title)
  }

  const declinecontri = (id)=>{
    setistabLoading(true)
    bookService.declineContri(id).then(res => {
    if(res){
        console.log(res)
        toast.success('Book request rejected')
        setapprovedbook(res)
        setconfirmbook(null)
        console.log(res)
        closeModal()
      
        
        ;}
      }).catch(err => {
        toast.error(err.message);
     })


  }  
  useEffect(()=>{
    
    if(!istabLoading ){
      if( page > 1 && signrequests?.requests?.length <= 0){

        setPage(page - 1)
      }
          if( page > 1 && getcontributedbook?.bookquery?.length  <= 0){

        setPage(page - 1)
      }

    }

    if(!pageloading){
  
     
      if( page > 1 && getcontributedbook?.bookquery?.length  <= 0){

        setPage(page - 1)
      }
    }



  },[istabLoading, pageloading, getcontributedbook ])


  return (
  
    <div className='recentlyCont mb-24 flex '>
      <Modal
                isOpen={modalIsOpen.open}
                shouldCloseOnOverlayClick={true}
                onRequestClose={closeModal}
                className={"seecontribute"}
                contentLabel="More details Modal"
              >
                {!isLoading ? (modalIsOpen.selectedBook !== null ?
                <div className='relative h-full w-full'> 
     
                  <button className='closeModal' onClick={closeModal}><   IoCloseSharp color="white" /></button>
                
                  <div className='buttonsbelowmodal mb-1 z-10 w-full absolute grid grid-cols-2 flex flex-row'> 
                  <button className='modaldeclinebtn' onClick={()=>{declinecontri(getcontributedbook.bookquery[modalIsOpen.selectedBook]._id)}}>Decline</button>
                  <button className='modalacceptbtn' type="submit" form="confirmform" >Accept</button>

                  </div>
         
               <div className='flex absolute  inset-0'>
                <div className='flex relative w-full tablet:px-5 phone:px-2 pt-3 pb-12 overflow-auto '>
              
                  < div className="w-full overflow-y-auto overflow-x-hidden" >
                    <div className="flex flex flex-row grid grid-cols-12 w-full gap-3" >
                    <div className="contimage  tablet:col-span-3 phone:col-span-12">
                      <div className="contrcontimg ">
                            <img className=" imagecontcont" src={getcontributedbook.bookquery[modalIsOpen.selectedBook].imgUri ? getcontributedbook.bookquery[modalIsOpen.selectedBook].imgUri : require('.//style/images/placeholder_book1.png')}/>
                   
                      </div>
                    </div>
                    <div className="conttitle tablet:col-span-9 phone:col-span-12">
                      <h4 className='text-white tablet:mr-8 phone:mr-0 mt-2' >Book Title:<span className='makethisbold text-white mx-2'> &nbsp;{getcontributedbook.bookquery[modalIsOpen.selectedBook].title}</span> </h4>
                      <h4 className='text-white mt-2' >Author: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].author} &nbsp;</span></h4>
                      <h4 className='text-white mt-2' >Genre: <span className='makethisbold text-white mx-2'>{
                      getcontributedbook.bookquery[modalIsOpen.selectedBook].genre.map(openbook => (
                          <div className='genrecircle inline-flex' key={openbook}> <a className='openbookgenre pr-0.5 mb-2 ' key={openbook}><span className='px-1 '>{openbook}</span></a></div>
                        ))  
                     }</span>
                     </h4>
                     <h4 className='text-white mt-1' >Description: <span className='makethisbold text-white mx-2 threelines'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].description} &nbsp;</span></h4>
                     <h4 className='text-white mt-1 ' >Series: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].series} &nbsp;</span></h4>
                     <h4 className='text-white  mt-1' >Volume: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].volume} &nbsp;</span></h4>
                     <h4 className='text-white  mt-1' >Edition: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].edition} &nbsp;</span></h4>
                 
                 
                    </div>
       

                    </div>
                    <div className="contmredetails flex grid tablet:grid-cols-2 phone:grid-cols-1 mt-4 pt-2">
                     <h4 className='text-white  mt-1' >Material Type: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].type} &nbsp;</span></h4>
                         <h4 className='text-white  mt-1' >Literary Form: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].form} &nbsp;</span></h4>
                         <h4 className='text-white  mt-1' >Publisher: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].publisher} &nbsp;</span></h4>
                         <h4 className='text-white  mt-1' >Copyright Date: <span className='makethisbold text-white mx-2'>{new Date(getcontributedbook.bookquery[modalIsOpen.selectedBook].copyrightDate).getFullYear()} &nbsp;</span></h4>
                         <h4 className='text-white  mt-1' >Publication Date: <span className='makethisbold text-white mx-2'>{new Date(getcontributedbook.bookquery[modalIsOpen.selectedBook].dateOfPublication).getFullYear()} &nbsp;</span></h4>
                          <h4 className='text-white  mt-1' >ISBN: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].isbn} &nbsp;</span></h4>
                          <h4 className='text-white  mt-1' >Call Number: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].callNumber} &nbsp;</span></h4>
                           <h4 className='text-white  mt-1' >No of Copies: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].noOfCopies} &nbsp;</span></h4> 
                   </div>
                    <div className="contmredetails flex grid grid-cols-1 mt-4 pt-2">
     
                      <h4 className='text-white  mt-1' >Digital Copy: <span className='makethisbold text-white mx-2'><a href={getcontributedbook.bookquery[modalIsOpen.selectedBook].digitalCopyPublic} target="_blank">  &nbsp;{getcontributedbook.bookquery[modalIsOpen.selectedBook].digitalCopyPublic}</a> &nbsp;</span></h4> 
                      <h4 className='text-white  mt-1' >Link: <span className='makethisbold text-white mx-2'><a href={getcontributedbook.bookquery[modalIsOpen.selectedBook].linkurl} target="_blank" >  &nbsp; {getcontributedbook.bookquery[modalIsOpen.selectedBook].linkurl}</a> </span></h4> 
                    </div>

                  
                
                  </div></div></div></div>:
                  <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p>) : null}
             
             
              </Modal>
       
      <div className='recentCont pt-3 addnav '>
        <div className='text-black recenthead recentContCont '>

          <div className='flex bookmarkshead  mt-3 mb-2 flex-row  items-center'>
            <TabSelector
              isActive={selectedTab === 'Signuprequests'}
              onClick={() => tabClicked('Signuprequests')}
            >
              Signup Requests
            </TabSelector>
            <TabSelector
              isActive={selectedTab === 'Contributionrequests'}
              onClick={() => tabClicked('Contributionrequests')}
            >
              Contribution Requests
            </TabSelector>
          </div>
 
          <TabPanel hidden={selectedTab !== 'Signuprequests'}>
            <div className=' flex grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 tablet:gap-2 phone:gap-1  '>
              {
                !istabLoading && !isLoading ? (
                  signrequests?.requests?.length ?

                    (signrequests.requests.map(post => (
                        <div className='bookmarkcontainer text-white flex flex-row px-2 relative w-100 h-52'  key={post._id}>

                          <div className='grid grid-rows-2 text-black relative my-3 w-2/5 gap-2' style={{ zIndex: "2" }}>
                            <div className="row-auto overflow-hidden">
                              <p className='absolute z-10 bg-neutral-900 p-2 font-bold'>Front ID Pic</p>
                              <Zoom>
                                <img
                                  alt="Front ID Pic"
                                  src={post.verification.files.frontId}
                                />
                              </Zoom>
                            </div>
                            <div className="row-auto overflow-hidden">
                              <p className='absolute z-10 bg-neutral-900 p-2 font-bold'>Back ID Pic</p>
                              <Zoom>
                                <img
                                  alt="Front ID Pic"
                                  src={post.verification.files.backId}

                                />
                              </Zoom>
                            </div>
                          </div>


                          <div className=' relative removeshadow text-white flex flex-col pl-2 w-100 ' style={{ zIndex: "2" }}>
                            <div className='statusbar w-full flex  flex-row-reverse w-100'>
                              <button type='button' onClick={() => (acceptRequest(post._id))} className='relative acceptbtn disabled:opacity-50' >
                                <h5 className=' stattext flex mx-3 flex-1  absolute'>Accept</h5>
                                <svg className='' width="150" height="25">
                                  <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                </svg>
                              </button>

                              <button type='button' onClick={() => (declineRequest(post._id))} className='relative declinebtn disabled:opacity-50' >
                                <h5 className=' stattext flex mx-2 flex-1  absolute'>Decline</h5>
                                <svg className='' width="150" height="25">
                                  <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                </svg>
                              </button>

                            </div>

                           <div className='flex flex-col'>
                            <h4 className='removeunderline my-1'>{`${post.firstName} ${post.lastName}`}</h4>

                            <h6 className='twolineonly'><span className='makethisbold mr-2'>User Email:</span></h6>
                            <span className='makethisbold mr-2 text-sm'>{post.email}</span>
                            <h6 className='twolineonly mt-1'><span className='makethisbold mr-2'>Department:</span></h6>
                            <span className='makethisbold mr-2 text-sm'>{post.department}</span>
                            <h6 className='twolineonly mt-1'><span className='makethisbold mr-2'>Student Number:</span></h6>
                            <span className='makethisbold mr-2 text-sm'>{post.studentNumber}</span>

                            </div>
                          </div>
                        </div>
                      ))) :
                    <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>No Requests Found</p>
                ) : (<p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>....loading</p>)

              }



            </div>
            {!pageloading ?
              <Pagination page={page} pages={pages} changePage={setPage} /> : null
            }
          </TabPanel>

          <TabPanel hidden={selectedTab !== 'Contributionrequests'}>
              <div className=' flex grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 tablet:gap-2 phone:gap-1  '>
                  {
                   !istabLoading &&  !isLoading ? (
                      getcontributedbook?.bookquery?.length ?
                        (getcontributedbook?.bookquery?.map((getborrowedbook, i) => (



                          <div className='bookmarkcontainer text-white flex flex-row px-2  relative w-100' key={getborrowedbook._id} >


                            <div className='bookmarksimgcont relative  my-3' style={{ zIndex: "2" }} onClick={()=>{
                            setconfirmbook(null)
                            setconfirmbook(getcontributedbook?.bookquery[i]); 
                            selectedgenreoptions(getborrowedbook.genre && getborrowedbook.genre[0] !== ''? getborrowedbook.genre: '');
                            openModal(i)
                            console.log('dataloaded')
                          }}>
                           
                                <img className=" " src={getborrowedbook.imgUri ? getborrowedbook.imgUri: require('.//style/images/placeholder_book1.jpg')} alt={getborrowedbook.title} />
                             
                            </div>

                            <div className=' relative removeshadow text-white flex flex-col pl-1 w-100' style={{ zIndex: "2" }}>
                              <div className='statusbar w-full flex  flex-row-reverse w-100'>

                                {getborrowedbook.status === 'pending' ?
                                  <> 
                                  <button className='relative acceptbtn' onClick={()=>{
                                    setconfirmbook(null)
                                    setconfirmbook(getcontributedbook?.bookquery[i]); 
                                    selectedgenreoptions(getborrowedbook.genre && getborrowedbook.genre[0] !== ''? getborrowedbook.genre: '');

                                    console.log('btn clicked accepted', confirmbook?.title)}} type="submit" form="confirmform" >
                                    <h5 className=' stattext flex mx-3 flex-1  absolute' >Accept</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </button>

                                    <div className='relative declinebtn' onClick={()=>{declinecontri(getborrowedbook._id)}}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute'  >Decline</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div></> : null
                                }
                          
                        


                              </div>
                              <span className='mt-1 h-full' onClick={()=>{
                            setconfirmbook(null)
                            setconfirmbook(getcontributedbook?.bookquery[i]); 
                            selectedgenreoptions(getborrowedbook.genre && getborrowedbook.genre[0] !== ''? getborrowedbook.genre: '');
                            openModal(i)
                            
                            console.log('dataloaded')
                          }}>
                                <h4 className='removeunderline mb-1'>{getborrowedbook.title}</h4>
                                <h6 ><span className='makethisbold mr-2'>Author:</span>  {getborrowedbook.author} </h6>
                                <h6  ><span className='makethisbold mr-2'>Contributor:</span> {getborrowedbook.contributerFName} &nbsp; {getborrowedbook.contributerLName}</h6>
                                <h6 ><span className='makethisbold mr-2'>Date Requested:</span> {new Date(getborrowedbook.dateRequested).toISOString().split('T')[0].replace(/-/g, '/')}</h6>
                                
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

        </div>
      </div>
        <form id="confirmform"  className='hidden' autoComplete="off" onSubmit={onFormSubmit} encType="multipart/form-data">
            <div className='maxwidthopen  flex-row flex  grid grid-cols-12 self-center'>
             <div className="flex flex-col col-span-12 desktop:col-span-9 tablet:col-span-12 ">       
             <div className="flex w-full flex-row grid grid-cols-12">
              <div className='bookimge justify-start laptop:my-1 phone:my-0 flex flex-col items-center flex-wrap pb-6 pt-2 tablet:py-6 desktop:py-3  col-span-12 desktop:col-span-3 tablet:col-span-4 ' >
                <div className='inputfilebtn mt-2 self-center'>
                  <label className='editinputfilebtnbtn' htmlFor="confirmbookimg">
                    <input id="imgUri" name="imgUri"  defaultValue={confirmbook? confirmbook.imgUri: ''}  className=''  type="text"   />                       
                  </label>
                   
                </div>
              </div>
              <div className='titledescription laptop:my-1 phone:my-0 pb-10 tablet:py-4 desktop:py-3 col-span-12 desktop:col-span-9 tablet:col-span-8  tablet:px-6 phone:px-1'>              
            
         
                <div className="form-groupaddbook flex flex-col ">
                   <input type="text" name="id"  defaultValue={confirmbook? confirmbook._id: ''} />
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>Title:</label>
                  <input type="text" name="title"  defaultValue={confirmbook? confirmbook.title: ''}  />
                </div>
                <div className="form-groupaddbook mt-2 flex flex-col ">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>Author: </label>
                  <input name="author" type="text" defaultValue={confirmbook? confirmbook.author: ''} ></input>
                </div>
                <div className="form-groupaddbook mt-2 flex flex-col ">
                  <label className='addbooklabel'>Genre: </label>
                    <Creatable
                    isClearable
            

                     value={selecteditgenre}
                     onChange={(value) => {             
                     setselecteditgenre(value);
                     }}
                    isMulti
                    classNamePrefix="materialtype"
                    name="genre"
                    
               
                  />
                  
                </div>
                <div className="form-groupaddbook mt-2 mb-3 flex flex-col ">
                  <label className='addbooklabel'>Description:</label>
                  <textarea rows="1" name="description" className='textareadesc' defaultValue={confirmbook? confirmbook.description: ''}               
              />
                </div>

                <div className="form-groupaddbook mt-2 mb-3 flex flex-col ">
                  <label className='addbooklabel'>Series:</label>
                  <input
                    name="series"
                    type='text'
                    defaultValue={confirmbook? confirmbook.series:''}           
                        
                  />
                </div>

                <div className="form-groupaddbook mt-2  w-full grid grid-cols-2 gap-2">
                  <div>
                    <label className='addbooklabel'><span style={{ color: 'red' }}></span>Volume: </label>
                    <input type="number"  defaultValue={confirmbook? confirmbook.volume: ''} name="volume" className="form-control my-1  w-full" autoComplete="off"></input>
                  </div>
                  <div>
                    <label className='addbooklabel'><span style={{ color: 'red' }}></span>Edition: </label>
                    <input type="number"  defaultValue={confirmbook? confirmbook.edition: ''} name="edition" className="form-control my-1  w-full" autoComplete="off" ></input>
                  </div>
                </div>

                <div className="mt-2 flex flex-col">
                  
                  
    
                  <input id="editinputfile" defaultValue={confirmbook? confirmbook.digitalCopyPublic: ''} name="digitalCopyPublic" type="text"  className="form-control my-1"  autoComplete="off"></input>
           
                </div>
 
              </div>
             </div>
             </div>


              <div className='moredetails py-4 tablet:py-6 desktop:py-8  desktop:col-span-3  phone:col-span-12 flex flex-col desktop:items-center'>
                <div className='flex flex-col laptop:my-8 phone:my-0 px-1 desktop:px-0'>

                  <div className="w-full grid grid-row-2 desktop:grid-cols-1 laptop:grid-cols-1 tabletlg:grid-cols-2 tablet:grid-cols-2 phone:grid-cols-1 phone:gap-1 tablet:gap-1 tabletlg:gap-2">

                    <div className="">
                      <p><span className='openbookclassname'>Material type: &nbsp; </span></p>
                      <input
                        name="type"
                         defaultValue={confirmbook? confirmbook.type:''}
                       type='text'
        
                      />
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Literary Form: &nbsp; </span> </p>
                      <input
                        name="form"
      
 
                         defaultValue={confirmbook? confirmbook.form:''}
                         type='text'
                     
          
                      />
                    </div>
                    <div className="">
                      <p><span className='openbookclassname'><span style={{ color: 'red' }}></span>Publisher: &nbsp; </span>	</p>
                      <input name="publisher" defaultValue={confirmbook? confirmbook.publisher: ''} className="infoaddbook" type='text' ></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Publication Date: &nbsp; </span>	</p>
                      <input name="dateOfPublication" defaultValue={confirmbook && confirmbook?.dateOfPublication !== null ? new Date(confirmbook.dateOfPublication).toLocaleDateString('en-CA'): ''} className="infoaddbook w-full" type='date'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Publication Place: &nbsp; </span>	</p>
                      <input name="placeOfPublication" defaultValue={confirmbook ? confirmbook.placeOfPublication: ''} className="infoaddbook" type='text'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Copyright Date: &nbsp; </span>	</p>
                      <input name="copyrightDate" defaultValue={confirmbook && confirmbook?.copyrightDate !== null? new Date(confirmbook.copyrightDate).toLocaleDateString('en-CA'): ''}  className="infoaddbook w-full" type='date'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>ISBN: &nbsp; </span>	</p>
                      <input name="isbn" className="infoaddbook" defaultValue={confirmbook? confirmbook.isbn: ''} placeholder="(978/979)-xxxxx-xxxxxxx-xxxxxx-x" type='text'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>DOI: &nbsp; </span>	</p>
                      <input name="doi" className="infoaddbook" defaultValue={confirmbook? confirmbook.doi: ''} type='text'></input>
                      <input name="linkurl" className="infoaddbook" defaultValue={confirmbook? confirmbook.linkurl: ''} type='text'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Call number: &nbsp; </span>	</p>
                      <input name="callNumber" defaultValue={confirmbook? confirmbook.callNumber: ''} className="infoaddbook" type='text'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Number of Copies: &nbsp; </span>	</p>
                      <input name="noOfCopies" defaultValue={confirmbook? confirmbook.noOfCopies: ''} className="infoaddbook" type='number'></input>
                    </div>
                        <div className="mt-5 flex items-center laptop:hidden phone:flex flex-row justify-center addformbtn flex-wrap">             
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <button type='submit'>clickme</button>
          </form>
    </div>
  )
};

export default Signuprequests;



import React, { useEffect, useState, useContext, useRef } from 'react';
import Zoom from 'react-medium-image-zoom'
import {FiRefreshCcw} from "react-icons/fi"
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Topnav from './Topnav';
import "./style/control.css";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTabs, TabPanel } from "react-headless-tabs"
import { TabSelector } from './TabSelector';
import bookService from '../features/book/bookService';
import { toast } from 'react-toastify';
import { apiClientBookPublic, apiClient, apiClientBook } from '../features/auth/requests';
import Modal from 'react-modal';
import { IoCloseSharp, } from "react-icons/io5";
const Admincontrol = () => {
  const { user, isLoading, isSuccess, isError, message,  justloggedin } = useSelector(state => state.auth);
const [skipCount, setSkipCount] = useState(true);
    const navigate = useNavigate()
    const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )

  const userexist = getCookieValue('userpersist')
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
   
  

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const [selectedTab, setSelectedTab] = useTabs([
    'Application Settings',
    'User Settings',

  ]);

   const tabClicked = (tabstatus) =>{

         setSelectedTab(tabstatus); 

   }

   const elementRef = useRef();
  const divElement = elementRef.current;
    const [bookSearch, setbookSearch] = useState('');
  const [fetchedbook, setfetchbook]= useState('');
  const [searchloading, setsearchloading]=useState('');
  const [searchresultdiv , setsearchresultdiv]=useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(bookSearch);
  const [fetchfeaturedbooks, setfetchfeaturedbooks] = useState(null)
  const [isfeaturedloading, setisfeaturedloading] = useState(null)
  const [selectedforadded,   setSelectedforadded] = useState(null)
  const [fetchquote, setfetchquote] = useState(null)
  const [fetchauthor, setfetchquoteauthor] = useState(null)
  const [fetchdaylimit, setfetchdaylimit] = useState(null)


  const [allusers, setalluser] = useState(null)

     const [q, setQ] = useState("");
    const [searchTerm] = useState(["email", "firstName", "lastName"]);
  useEffect(async()=>{

    if( user && user.role === 'b521c'){
    setisfeaturedloading(true)
     
    try {
      const featured = await bookService.getcontrolfeatured().then((res)=>{

        if(res){
          setfetchfeaturedbooks(res)
       
          setisfeaturedloading(false)

        }
      })
      
    } catch (error) {
       setisfeaturedloading(false)
       toast.error(error);
    }

   try {
    const featuredquote = await bookService.getquote().then((res)=>{

        if(res){
          setfetchquote(res.quote)
          setfetchquoteauthor(res.author)
        
       

        }
      })
      
    } catch (error) {
   
       toast.error(error);
    }

    try {
    const featureddaylimit = await bookService.getdaylimit().then((res)=>{

        if(res){
          setfetchdaylimit(res)
  
         
        }
      })
      
    } catch (error) {
   
       toast.error(error);
    }

     try {
    const featuredalluser = await bookService.getalluser().then((res)=>{

        if(res){
          setalluser(res)
     
        
        }
      })
      
    } catch (error) {
   
       toast.error(error);
    }


  }
     

  },[user])

  const reloaduser =async()=>{
    setisfeaturedloading(true)

    try {
    const featuredalluser = await bookService.getalluser().then((res)=>{

        if(res){
          setalluser(res)
           setisfeaturedloading(false)
         
        }
      })
      
    } catch (error) {
        setisfeaturedloading(false)
       toast.error(error);
    }


  }


    
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

     
     
      
          
        getsearch() 
        
        
             
      }else{
        setsearchresultdiv(false)
      }
    }, [bookSearch]);
      const [isActive, setActive] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
    
  };

  function search(items) {
        return items.filter((item) => {
            return searchTerm.some((newItem) => {
                return (
                    item[newItem]
                        .toString()
                        .toLowerCase()
                        .indexOf(q.toLowerCase()) > -1
                );
            });
        });
    }
    const inputonClickOutsideListener = ()=>{
    document.removeEventListener("click", onClickOutsideListener)
    setsearchresultdiv(false)
  }

  const onClickOutsideListener = () => {
    setActive(!isActive)
    setActive(false)
    document.removeEventListener("click", onClickOutsideListener)
  }

  const addfeatured =async()=>{

    if( user && user.role === 'b521c'){
    if(selectedforadded){
   
    setisfeaturedloading(true)
     
    try {
      const featured = await bookService.controlfeatured(selectedforadded).then(async(res)=>{
       if(res){
        if(res.message === 'book already exist' ){
              toast.error('book already exist');
               setisfeaturedloading(false)
        }else{
           toast.success('book successfully added');
                try {
        const featured = await bookService.getcontrolfeatured().then((res)=>{
      

        if(res){
       
          setfetchfeaturedbooks(res)
     
          setisfeaturedloading(false)

         }
       })
      
         } catch (error) {
       setisfeaturedloading(false)
       toast.error(error);
       }
        }
  

        }
      })
      
     }catch (error) {
       setisfeaturedloading(false)
       toast.error(error);
     }
    }else{

      toast.error('no book selected')
      
     }
     }
    


  }

  const removefeatured = async(id)=>{

 if( user && user.role === 'b521c'){

   
    setisfeaturedloading(true)
     
    try {
      const featured = await bookService.delcontrolfeatured(id).then(async(res)=>{
       if(res){
        toast.success('book removed successfully')    
           try {
        const featured = await bookService.getcontrolfeatured().then((res)=>{
      

        if(res){  
       
          setfetchfeaturedbooks(res)
     
          setisfeaturedloading(false)

         }
       })
      
         } catch (error) {
       setisfeaturedloading(false)
       toast.error(error);
       }
        }
      })
      
     }catch (error) {
       setisfeaturedloading(false)
       toast.error(error);
     }
    }
    
  }
  const inputRef2 = useRef(null)
  
  const handleInputHeight2 = () => {
    const scrollHeight2 = inputRef2.current.scrollHeight;
    inputRef2.current.style.height = scrollHeight2 + "px";
  };
   
  const handleInputChange2 = () => {

  handleInputHeight2()
 }

   const onFormSubmit = async(event) => {
    event.preventDefault();

    let form = {
            quote: event.target[0].value,
            author: event.target[1].value,
       }

    await bookService.setquote(form)
      .then(async(res) => {
       if(res){
        toast.success('quote changed successfully')
           try {
    const featuredquote = await bookService.getquote().then((res)=>{

        if(res){
          setfetchquote(res.quote)
          setfetchquoteauthor(res.author)
     
       

        }
      })
      
    } catch (error) {
   
       toast.error(error);
    }

       }
      })
      .catch(err => {
        toast.error(err.message);
      })

  }

  const onadminFormSubmit = async(event) => {
    event.preventDefault();

    let form = {
            email: event.target[0].value,
            firstName: event.target[1].value,
            lastName: event.target[2].value,
            password: event.target[3].value,
            
       }

    await bookService.addadmin(form)
      .then(async(res) => {
       if(res){
        toast.success('admin account added successfully')
       }
      })
      .catch(err => {
        toast.error(err.message);
      })

  }

const setdayFormSubmit = async(event) => {
    event.preventDefault();
    let form = {
            confirmbook: event.target[0].value,
            receivedbook: event.target[1].value,
           digitalfile:event.target[2].value,
           undovisible: fetchdaylimit.undostatus,
            

    }

    await bookService.setdaylimit(form)
      .then(async(res) => {
       if(res){
        toast.success('Borrow Settings changed successfully')
              try {
    const featureddaylimit = await bookService.getdaylimit().then((res)=>{

        if(res){
          setfetchdaylimit(res)
        
        }
      })
      
    } catch (error) {
   
       toast.error(error);
    }

       }
      })
      .catch(err => {
        toast.error(err.message);
      })

  }

 const delauser = async(id)=>{

 

  if( user && user.role === 'b521c'){

    

   
    setisfeaturedloading(true)
     
    try {
      const deleteauser = await bookService.deleteuser(id).then(async(res)=>{
       if(res){
        toast.success('user deleted successfully')    
        try {
        const featuredalluser = await bookService.getalluser().then((res)=>{

        if(res){
          setalluser(res)
          setisfeaturedloading(false)

         }
       })
      
         } catch (error) {
       setisfeaturedloading(false)
       toast.error(error);
       }
        }
      })
      
     }catch (error) {
       setisfeaturedloading(false)
       toast.error(error);
     }
    }




 }



    const onChange =() => {
 
        setfetchdaylimit({...fetchdaylimit, undostatus: !fetchdaylimit.undostatus})
  
    };

  useEffect(()=>{
     
     window.history.replaceState(null, null, `?tab=${selectedTab}`);
   
  },[selectedTab])

  const [modalIsOpen, setIsOpen] = React.useState({ open: false, selectedBook: null, delopen:false });
  function openModal(i) {
    setIsOpen({ open: true, selectedBook: i });
  }
  function closeModal() {
    setIsOpen({ open: false, selectedBook: null, delopen:false });
  }
  function opendelModal(){
    setIsOpen({delopen:true})
  }

    const delborrow =async()=>{

    try {
    const featuredalluser = await bookService.delallborrow().then((res)=>{

        if(res){
         toast.success('Borrow Records deleted successfully')
         closeModal()
       
        }
        })
      
    } catch (error) {
       
       toast.error(error);
    }
  }
    return (
      
        <div className='text-white ' style={{  overflow:'hidden' }}>
                 <Modal
                isOpen={modalIsOpen.open}
                shouldCloseOnOverlayClick={true}
                onRequestClose={closeModal}
                className={"controlmodal "}
                contentLabel="More details Modal"
              > <>
              <button className='closeModal ' onClick={closeModal}><   IoCloseSharp color="white" /></button>

           
               <div className='text-white flex mt-7 tablet:flex-row phone:flex-col phone:items-center tablet:items-start justify-center px-2 relative w-100 phone:h-100 tablet:h-auto  '  >
              

                 {allusers?  allusers[modalIsOpen.selectedBook?modalIsOpen.selectedBook : 0].verification.files?
                          <div className='grid grid-rows-2 flex justify-center text-black relative my-3 phone:w-3/5 tablet:w-2/5 gap-2' style={{ zIndex: "2", maxHeight:'200px' }}>
                            <div className="row-auto overflow-hidden ">
                              <p className='absolute z-10 bg-neutral-900 p-2 mt-2 font-bold text-white text-sm'>Front ID Pic</p>
                              <Zoom>
                                <img
                                  alt="Front ID Pic"
                                  src={allusers?  allusers[modalIsOpen.selectedBook?modalIsOpen.selectedBook : 0].verification.files?allusers[modalIsOpen.selectedBook?modalIsOpen.selectedBook : 0].verification.files.frontId: null  : ''}
                                />
                              </Zoom>
                            </div>
                            <div className="row-auto overflow-hidden ">
                              <p className='absolute z-10 bg-neutral-900 p-2 mt-2 font-bold text-white text-sm'>Back ID Pic</p>
                              <Zoom>
                                <img
                                  alt="Front ID Pic"
                                  src={allusers?  allusers[modalIsOpen.selectedBook?modalIsOpen.selectedBook : 0].verification.files? allusers[modalIsOpen.selectedBook?modalIsOpen.selectedBook : 0].verification.files.backId:null : ''}

                                />
                              </Zoom>
                            </div>
                          </div>:null:null
                       }

                          <div className=' relative mt-2  removeshadow text-white flex-col pl-2 w-100 ' style={{ zIndex: "2" }}>
                       
                            <h4 className='removeunderline my-1'>{`${allusers?  allusers[modalIsOpen.selectedBook?modalIsOpen.selectedBook : 0].firstName: ''} ${allusers?  allusers[modalIsOpen.selectedBook?modalIsOpen.selectedBook : 0].lastName: ''}`}</h4>

                            <h6 className='mt-2'><span className='makethisbold mr-2 whitespace-nowrap flex'>User Email:</span><span className='twolineonly flex'>{allusers?  allusers[modalIsOpen.selectedBook?modalIsOpen.selectedBook : 0].email: ''}</span></h6>
                            <h6 className='mt-2'><span className='makethisbold mr-2 whitespace-nowrap '>Department:</span><span className='twolineonly '>{allusers?  allusers[modalIsOpen.selectedBook?modalIsOpen.selectedBook : 0].department: ''}</span></h6>
                            <h6 className='mt-2'><span className='makethisbold mr-2 whitespace-nowrap'>Student Number:</span><span className='twolineonly whitespace-pre'>{allusers?  allusers[modalIsOpen.selectedBook?modalIsOpen.selectedBook : 0].studentNumber: ''}</span></h6>
                          </div>
                        </div>
              </>
              
                    
              
             
             
              </Modal>

                <Modal
                isOpen={modalIsOpen.delopen}
                shouldCloseOnOverlayClick={true}
                onRequestClose={closeModal}
               
                className={"editmodal max-h-52 "}
                

                contentLabel="More details Modal"
              >
                <>
                    <button className='closeModal' onClick={closeModal}><   IoCloseSharp color="white" /></button>
                    <div className='borrowermoredetailscont pt-5'>

                      
                      <h4 className='text-white mb-5 mt-5 ' ><span className='makethisbold '>Are you sure you want to delete all book borrow records?</span> </h4>
           


                   <div className="mt-9 flex items-center  flex-row justify-center addformbtn flex-wrap gap-3">
                   <button type="button" className="form-control my-1 addbooksubmit py-1  phone:px-5  mx-1 text-white bg-red-600" onClick={closeModal} > No</button>
                   <button type="button" className="form-control my-1 addbooksubmit py-1  phone:px-5  mx-1 text-white bg-green-700 " onClick={delborrow}> Yes</button>
           
                 
                   </div>
                





                    </div></>


              </Modal>
      
            <div className='flex ResumeContainer flex-col min-h-screen justify-center w-full '>
                <div className='relative flex items-center justify-items-center px-1 text-white'>

                    <div className='controlcont desktop:mt-24 phone:mt-8 mx-auto'>
                    <div className='controlheadercont flex flex-row overflow-x-auto'>
                   <TabSelector
             
                  isActive={selectedTab === 'Application Settings'}
                  onClick={() => {tabClicked('Application Settings')}}
                >
                  Application Settings
                </TabSelector>
                <TabSelector

              
                  isActive={selectedTab === 'User Settings'}
                  onClick={() => {tabClicked('User Settings')}}
                >
                  User Settings
                </TabSelector>

                    </div>

                     <TabPanel hidden={selectedTab !== 'Application Settings'} className='mb-24'>
                        <div className='mt-5 flex grid grid-cols-12 laptop:gap-12 phone:gap2'>

                            <div className='flex tabletlg:col-span-5 phone:col-span-12 flex-col'>
                                <h6 className='text-black'>Featured Books</h6>
                                <p>
                                    Set Books that will be featured in the homepage
                                </p>
                            </div>

                            <div className='flex tabletlg:col-span-6 phone:col-span-12 flex-col searchuserscont mt-2' style={{   backgroundColor:'#18191a', color:'white' }}>
                                
                                <div className='controlusercont flex flex-col laptop:p-6 tablet:p-4 phone:p-1'>
                               
                                    <div className='controlsearcher w-full flex flex-row grid grid-cols-12 gap-2'>
                                        
                                        <div className='controlsearchersearcher col-span-10'>
                                              <div className="form-groupaddbook  flex flex-col ">
                                   
                                              <input type="text " autoComplete='off'  className='py-1 px-1 controlsearcherins font-normal ' name="searchbook" placeholder="Search book..." ref={elementRef} onChange={e => setDebouncedTerm(e.target.value)}  onMouseLeave={() => {
                   document.addEventListener("click", inputonClickOutsideListener)
                  }} required=""/>   
                          <div className="relative w-full text-white self-end px-0 topsearchcont " style={{display:'flex'}}>
                        <div className='absolute inset-o w-full flex flex-col'>
                          <div className={`absolute searchresultbar searchresultbartop `  + ( searchresultdiv ? 'block' : 'hidden') } >
                            <div className='relative flex w-full flex-col' style={{overflow:'auto', height:'200px'}}>
                  
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
                  
                     <div className="resultcontainer w-full flex flex-row grid grid-cols-12" key={book._id} 
                     
                      onClick={async()=>{
                  
      
                    
                        divElement.value = book.title;
                        setSelectedforadded(book._id)
                  
                
                              
                        
                        }}>
                       <div className='  resultimgcont col-span-3 flex justify-center' >
                         <img className='resultimg self-center ' src={book.imgUri ? book.imgUri : require('.//style/images/placeholder_book1.jpg')} alt="No Image Preview" />
                       </div>
                       <div  className=' resultdetails relative col-span-9 flex flex-col ' >
                         <p className="resultdetailstitle text-white ">{book.title}</p>
                         <p className="resultdetailsauthor text-white mt-1">-{book.author}</p>
                       </div>                             
                      </div>

                    
                ))) :<p className="resultdetailstitle px-3 py-2 text-white">no results found</p>
                  
                  }
                          </div> 
                  </div>
                  </div>
                  </div>
                                              </div>
                                        </div>
                                        <div className='controlsubmit flex items-center justify-center col-span-2 border'>
                                           <button onClick={()=>addfeatured()} > Add </button>
                                        </div>
                                       
                                    </div>
                               
                                   <div className='controluercontentcont mt-3 flex flex-col w-full '>

                                    {
                                      !isfeaturedloading && fetchfeaturedbooks ?
                                       
                                       fetchfeaturedbooks?.length > 0 ?
                                       fetchfeaturedbooks?.map((book,i) =>(

                                          <div className='controlusercontent mt-4 pb-2 flex flex-row w-full items-center' key={book._id} >
                                        
                                          <p className='controltitle mr-3'>{String(i+1).padStart(2, '0')}. {book.title}</p>
                                          <div className='controlremover flex flex-row  ml-auto'>
                                
                                               <p className='mx-1 cursor-pointer ' onClick={()=> removefeatured(book._id)}>remove</p>
                                           </div>


                                   
                                   
                                         </div>
                             



                                       ))

                                       :<p className='mt-4'>featuredbooks not set</p>: <p className='mt-4'>..Loading</p>

                                    }
                                  

                                   </div>
 
                                </div>
                            </div>




                        </div>

                         <div className='mt-5 flex grid grid-cols-12 laptop:gap-12 phone:gap2 mt-6 '>

                            <div className='flex tabletlg:col-span-5 phone:col-span-12 flex-col mt-6'>
                                <h6 className='text-black'>Custom quote</h6>
                                <p>
                                    Set quote that will be seen on the home page
                                </p>
                            </div>

                            <div className='flex tabletlg:col-span-6 phone:col-span-12 flex-col searchuserscont tabletlg:mt-6 phone:mt-2'>
                                 <h6 className='text-sm font-normal text-black'> Enter quote here (no need for quotation marks)</h6>
                                 <form   onSubmit={onFormSubmit} >
                                  <textarea defaultValue={fetchquote? fetchquote: ''} rows="1" name="quote" 
                             className='textareadesc w-full text-black' 
                             onChange={handleInputChange2}
                             ref={inputRef2} onKeyDown={(e) => {
                             if (e.key === "Enter") {
                             handleInputHeight2(e);
                             inputRef2.current.style.height = "20px";
                             }
                            }}
                          />

                          <h6 className='mt-3 text-sm font-normal'> Enter author here</h6>
                          <input  className='w-full   text-black' name='author' defaultValue={fetchauthor? fetchauthor:''}  type='text'></input>

                          <button type='submit ' className='flex ml-auto mt-1 controlsubmit px-2'>Save</button>



                                 </form>
                              
                            </div>




                        </div>

                          <div className='mt-5 flex grid grid-cols-12 laptop:gap-12 phone:gap2 mt-6 '>

                            <div className='flex tabletlg:col-span-5 phone:col-span-12 flex-col mt-6'>
                                <h6 className='text-black'>Borrow Settings</h6>
                                <p>
                                   Set the duration (in days)  when borrowing books, digital files, before it is declared as late. Limit the duration of borrowed private digital files and manage the borrow records  
                                </p>
                            </div>

                            <div className='flex tablet:col-span-6 phone:col-span-12 flex-col searchuserscont tabletlg:mt-6 phone:mt-2'>
                          
                                 <form   onSubmit={setdayFormSubmit} >
                                  <p className='mt-3 italic'>   Duration of the confirmed book (in days) before it  is canceled. User must receive
the book within this time period. (Default : 7 days)
</p>
                                  <input type="number"  className=' text-black' name='confirmbook' defaultValue={fetchdaylimit?.confirmbook}></input>

                          <p className='mt-3 italic'> Duration of the received book (in days) before it is declared as late. User must 
return the book that has been borrowed within this time period. (Default: 7 days)</p>
                           <input type="number"  className=' text-black' name='receivedbook' defaultValue={fetchdaylimit?.receivedbook}></input>

                                           <p className='mt-3 italic'>  Duration of received digital file. User must request the file again after this time 
period to view the file . (Default: 7 days)</p>
                           <input type="number" className=' text-black' name='digitalfile' defaultValue={fetchdaylimit?.digitalfile}></input>

                                   <p className='mt-3 italic'> Allow undo of status when managing borrow requests (default: true)
</p>
                            <label className="switch ">
                  <input type="checkbox"
    name="undovisible"
    value={fetchdaylimit?.undostatus}
    onClick={onChange}
    defaultChecked={fetchdaylimit?.undostatus} />
                   <span className="slider round"></span>
                   
                </label>


                          <button type='submit ' className='flex ml-auto mt-1 controlsubmit px-2'>Save</button>



                                 </form>
                           <p className='mt-3 italic'> Delete all borrow records, deletes all data for borrowing books, not including digital files. </p>
                           <button className='mt-2 deletewarningbtn py-1 px-2 self-start' onClick={opendelModal}> Delete</button>


                            </div>




                        </div>

                      
                
                    </TabPanel>
                    <TabPanel hidden={selectedTab !== 'User Settings'} className='mb-24'>
                       <div className='mt-5 flex grid grid-cols-12 laptop:gap-12 phone:gap2 '>

                            <div className='flex tabletlg:col-span-5 phone:col-span-12 flex-col'>
                                <h6 className='text-black'>Manage Users</h6>
                                <p>
                                    Viewing and deleting user information 
                                </p>
                            </div>

                            <div className='flex tabletlg:col-span-6 phone:col-span-12 flex-col searchuserscont mt-2' style={{   backgroundColor:'#18191a', color:'white', overflow:'hidden' }}>
                                
                                <div className='controlusercont flex flex-col laptop:p-6 tablet:p-4 phone:p-1'>
                               
                                    <div className='controlsearcher w-full flex flex-row grid grid-cols-12 gap-2'>
                                        
                                        <div className='controlsearchersearcher tablet:col-span-11 phone:col-span-10 '>
                                              <div className="form-groupaddbook  flex flex-col ">
                                   
                                              <input type="text " autoComplete='off'  className='py-1 px-1 controlsearcherins font-normal ' name="searchbook" placeholder="Search user..." 
                                              value={q}
                                             onChange={(e) => setQ(e.target.value)}
                                              />   
                       
                                              </div>
                                        </div>
                                         <div className='flex tablet:col-span-1 phone:col-span-2 items-center justify-center'>
                                          <button className='bg-gray-900 h-full w-full flex items-center justify-center border '  onClick={reloaduser}><FiRefreshCcw color='white'/></button> 

                                         </div>
                                     
                                       
                                    </div>
                               
                                   <div className='controluercontentcont mt-3 flex flex-col w-full'>

                                    {
                                      !isfeaturedloading && allusers?
                                       
                                       allusers?.length > 0 ?
                                       search(allusers).map((user,i) =>(

                                          <div className='controlusercontent mt-4 pb-2 flex flex-row w-full items-center' key={user._id} >
                                        
                                          <p className='controltitle mr-3'> {user.firstName}  {user.lastName}</p>
                                          <div className='controlremover flex flex-row  ml-auto'>
                                             <p className='mx-1 cursor-pointer rolebox text-white  px-2 ' style={{backgroundColor: `${user.role === 'b521c'? '#4D2ECA': '#1BD00E'}` }} >{user.role === 'b521c'? 'admin': 'user'}</p>
                                            <p className='mx-1 cursor-pointer ' onClick={()=>{openModal(i)}} >view</p>
                                            <p className='mx-1 cursor-pointer ' onClick={() => {
    const confirmBox = window.confirm(
      "Do you really want to delete this user?"
    )
    if (confirmBox === true) {

      delauser(user._id)
    }
  }} >remove</p>
                                           </div>


                                   
                                   
                                         </div>
                             



                                       ))

                                       :<p className='mt-4'>featuredbooks not set</p>: <p className='mt-4'>..Loading</p>

                                    }
                                  

                                   </div>
 
                                </div>
                            </div>




                        </div>

                         <div className='mt-5 flex grid grid-cols-12 laptop:gap-12 phone:gap2 mt-6 '>

                            <div className='flex tabletlg:col-span-5 phone:col-span-12 flex-col mt-6'>
                                <h6 className='text-black'>Add Admin Account</h6>
                                <p>
                                    Adding another admin account to manage the library
                                </p>
                            </div>

                            <div className='flex tabletlg:col-span-6 phone:col-span-12 flex-col searchuserscont tabletlg:mt-6 phone:mt-2'>
                                 <h6 className='text-sm font-normal text-black'> Enter new admin account details here </h6>
                                 <form   onSubmit={onadminFormSubmit} >
                                <h6 className='mt-3 text-sm font-normal'> Enter Admin Email</h6>
                          <input  className='w-full text-black' name='email' required  type='text'></input>

                          <h6 className='mt-3 text-sm font-normal'> Enter Admin First Name</h6>
                          <input  className='w-full text-black' name='firstName' required  type='text'></input>

                          <h6 className='mt-3 text-sm font-normal'> Enter Admin Last Name</h6>
                          <input  className='w-full text-black' name='lastName'  required type='text'></input>

                          <h6 className='mt-3 text-sm font-normal'> Enter Admin Password</h6>
                          <input  className='w-full text-black' name='password' required type='text'></input>

                          <button type='submit ' className='flex ml-auto mt-1 controlsubmit px-2'>Add</button>



                                 </form>
                              
                            </div>




                        </div>

                
                    </TabPanel>


                     

                    </div>


                


               
      </div>     

      
      
      <div className=' flex  w-full grow flex  flex items-end '>
                <Footer className='w-full'/>
            </div>
            </div>
       
            
        </div>

    )

}

export default  Admincontrol;
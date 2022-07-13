import React, { useEffect, useState, useContext } from 'react';
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/bookmarks.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getborrowedBook } from '../features/book/bookSlice';
import { useTabs, TabPanel } from "react-headless-tabs"
import { TabSelector } from './TabSelector';
import Pagination from './Pagination';
import Select from 'react-select';
import { digitalCopyApi } from '../features/auth/requests';
import jwt_decode from "jwt-decode";
import bookService from '../features/book/bookService';
import { toast } from 'react-toastify';
import { format, compareAsc, formatDistance, subDays, addDays } from 'date-fns';
var parse = require('date-fns/parse')

const Borrow = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const { isLoading, getborrowedbook } = useSelector(state => state.book);
  const { user } = useSelector(state => state.auth);
  const [pageloading, setpageloading] = useState(true)
  const [userloaded, setuserloaded] = useState(null)
    const [fetchdaylimit, setfetchdaylimit] = useState(null)
  const [options, setOptions] = useState([
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'declined', label: 'Declined' },
    { value: 'received', label: 'Received' },
    { value: 'returned', label: 'Returned' }
  ]);
  const [fileOptions, setFileOptions] = useState([
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ])
  const [selectedOptions, setSelectedOptions] = useState({ value: 'all', label: 'All' });
  const [selectedfileOptions, setSelectedfileOptions] = useState({ value: 'all', label: 'All' });
  const [selectedTab, setSelectedTab] = useTabs([
    'BorrowRequests',
    'FileRequests',
  ]);
  const pageNumber = 1;
  const [fileRequests, setFileRequests] = useState(null);
  const [tabLoading, setTabLoading] = useState(null);
  const [page, setPage] = useState(urlParams.get('page') ?urlParams.get('page'): pageNumber);
  const [pages, setPages] = useState(1);

  const navigate = useNavigate()
  const dispatch = useDispatch()

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

  const handleChange = (options) => {
    setSelectedOptions(options);
  };

  useEffect(()=>{
    setPage(1)

  },[selectedOptions, selectedfileOptions])

  const handleFileOptions = (options) => {
    setSelectedfileOptions(options);
  }


  const userexist = getCookieValue('userpersist')

  useEffect(() => {
    window.scrollTo(0, 0);
    setpageloading(true)
    setSelectedTab(urlParams.get('tab')?urlParams.get('tab'):'BorrowRequests' )
    setPage(urlParams.get('page')? urlParams.get('page'):1 )
    setSelectedOptions({
      value: urlParams.get('option')?urlParams.get('option'):'all',
      label: urlParams.get('option')?urlParams.get('option'):'all'

    })

    
  }, [])

  useEffect(async() => {
   window.scrollTo(0, 0);
    if (userexist) {
      if (user.length !== 0) {
        setuserloaded(user)
        setTabLoading(true);
        if (selectedTab === 'BorrowRequests') {
          dispatch(getborrowedBook({ page: page, status: selectedOptions.value }))
          setTabLoading(false);
        }

        if (selectedTab === 'FileRequests') {
          try {
            const req = await digitalCopyApi.get(`/all?filter=${selectedfileOptions.value}&page=${page}`);
            setFileRequests(req.data);
          } catch (err) {
            const message = err.message;
            console.log(message);
          } finally {
            setTabLoading(false);
          }
        }
        
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

    setpageloading(false)
      }
    } else {
      setpageloading(false)
      if (!userloaded) {
        navigate('/')
      }
    }

  }, [page, selectedOptions, selectedTab, user, selectedfileOptions])

  useEffect(() => {
    setPages(getborrowedbook.pages)
  }, [getborrowedbook])

  useEffect(() => {
    console.log(fileRequests)
    setPages(fileRequests?.totalPages)
  }, [fileRequests])

  const tabClicked = (tabstatus) => {
    setSelectedTab(tabstatus);
    setPage(1);

  }

  const [isActive, setActive] = useState(false);

  const onClickOutsideListener = () => {
    setActive(false)
    document.removeEventListener("click", onClickOutsideListener)
  }
  useEffect(()=>{
     
     window.history.replaceState(null, null, `?tab=${selectedTab}&page=${ selectedTab === 'BorrowRequests'? page:null}&option=${selectedOptions.value}`);
     console.log(options)
  },[page,selectedTab,selectedOptions])
  return (
    
    <div className='recentlyCont mb-24 flex '>

      <div className='recentCont pt-3 addnav '>
        <div className='text-black recenthead recentContCont '>

          <div className='flex bookmarkshead  mt-3 mb-2 flex-row  items-center'>
            <TabSelector
              isActive={selectedTab === 'BorrowRequests'}
              onClick={() => tabClicked('BorrowRequests')}
            >
              Borrow Requests
            </TabSelector>
            <TabSelector
              isActive={selectedTab === 'FileRequests'}
              onClick={() => tabClicked('FileRequests')}
            >
              Digital File Request
            </TabSelector>
          </div>

          <TabPanel hidden={selectedTab !== 'BorrowRequests'}>
            <div className='flex  optionborrow w-full justify-between  pb-2 pr-1'>
              <p className='border-b-2 px-1 resulttext'>No of Results: {!isLoading && getborrowedbook?.total || 0}</p>
           
              <Select options={options} value={selectedOptions} styles={customStyles} onChange={handleChange} menuPortalTarget={document.querySelector('body')} />
        
              

            
            </div>
            <div className=' flex grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 tablet:gap-2 phone:gap-1  '>
              {
                !tabLoading && !isLoading ? (
                  getborrowedbook?.bookquery?.length ?
                    (getborrowedbook?.bookquery?.map(getborrowedbook => (

                      <Link to={`/openbook/${getborrowedbook.bookId}`}   key={getborrowedbook._id}>

                        <div className='bookmarkcontainer text-white flex flex-row px-2  relative w-100' >
                          <div className='bookmarksimgcont relative  my-3' style={{ zIndex: "2" }}>
                            <img className=" " src={getborrowedbook.bookImg ? getborrowedbook.bookImg : require('.//style/images/placeholder_book1.jpg')} alt={getborrowedbook.bookTitle} />
                          </div>
                          <div className=' relative removeshadow text-white flex flex-col pl-1 w-100' style={{ zIndex: "2" }}>
                            <div className='statusbar w-full flex  flex-row-reverse w-100'>
                              <div
                                className=
                                {
                                  `relative ${getborrowedbook.borrowStatus === 'pending' || getborrowedbook.borrowStatus === 'declined' ?
                                    'declinedbtn' : (
                                      getborrowedbook.borrowStatus === 'confirmed' ?
                                        'rcvdbtn' : (
                                          getborrowedbook.borrowStatus === 'received' ?
                                            'rtrndbtn' : (
                                              getborrowedbook.borrowStatus === 'returned' ?
                                                'returnbtn' : null)
                                        )
                                    )
                                  }
                                `}>
                                <h5 className={`stattext flex px-3 flex-1  absolute ${getborrowedbook.borrowStatus === 'returned' ? 'text-black' : null}`}>{getborrowedbook.borrowStatus}</h5>
                                <svg width="150" height="24">
                                  <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="none" strokeWidth="1" />

                                </svg>

                              </div>

                            </div>
                            <h4 className='removeunderline mt-1'  >{getborrowedbook.bookTitle}</h4>
                            <h5 className='pt-0 phone:mt-0 tablet:mt-1 hide'>-{getborrowedbook.bookAuthor}</h5>
                            <h6 className='phone:mt-1 tablet:mt-2 flex flex-row items-center'><span className='makethisbold mr-2 '>Borrow Date:</span> {new Date(getborrowedbook.borrowDate).toISOString().split('T')[0].replace(/-/g, '/')} 
                             {
                       getborrowedbook.borrowStatus === 'confirmed'?
                       new Date() >= new Date(addDays (new Date((getborrowedbook.confirmedDate)),fetchdaylimit?.confirmbook?parseInt(fetchdaylimit.confirmbook, 10):7))? <div className='flex flex-row items-center justify-center '><div className='latewarn flex items-center justify-center ml-2'><p className='mt-0'>!</p></div><p className='mt-0'>late</p></div> : null
                       :null
                       }
                       
                       {
                       getborrowedbook.borrowStatus === 'received'?
                        new Date() >= new Date(addDays (new Date((getborrowedbook.receivedDate)),fetchdaylimit?.receivedbook?parseInt(fetchdaylimit.receivedbook, 10):7 ))? <div className='flex flex-row items-center justify-center '><div className='latewarn flex items-center justify-center ml-2'><p className='mt-0'>!</p></div><p className='mt-0'>late</p></div> : null
                      :null
                       }</h6>
                         {
                           getborrowedbook.borrowStatus === 'confirmed' ?
                          <h6 className='twolineonly'>Please get the book within {fetchdaylimit?.confirmbook} days to avoid issues</h6>:null

                         }
                         {
                           getborrowedbook.borrowStatus === 'received' ?
                          <h6 className='twolineonly'>Please return the book within {fetchdaylimit?.receivedbook} days to avoid issues</h6>:null

                         }
                         {
                           getborrowedbook.borrowStatus === 'returned' ?
                          <h6><span className='makethisbold mr-2 '>Return Date:</span> {new Date(getborrowedbook?.returnDate).toISOString().split('T')[0].replace(/-/g, '/')} </h6>:null

                         }
                            
                          </div>

                        </div>

                      </Link>

                    ))) :
                    <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>No Requests Found</p>
                ) : (<p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>....loading</p>)

              }



            </div>
            {!pageloading ?
              <Pagination page={page} pages={pages} changePage={setPage} /> : null
            }
          </TabPanel>

          <TabPanel hidden={selectedTab !== 'FileRequests'}>
            <div className='flex  optionborrow w-full justify-between  pb-2 pr-1'>
              <p className='border-b-2 px-1 resulttext'>No of Results: {!tabLoading && (fileRequests?.length || 0)}</p>
                   <Select options={fileOptions} value={selectedfileOptions} styles={customStyles} onChange={handleFileOptions} menuPortalTarget={document.querySelector('body')} />
            </div>
            <div className='  grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 tablet:gap-2 phone:gap-1 '>
              {
                !tabLoading ? (
                  fileRequests !== null ? (
                    fileRequests?.fileRequests?.map(fileRequest => (
                      <Link to={`/openbook/${fileRequest?.book_id?._id}`}  key={fileRequest?._id} >

                        <div className='bookmarkcontainer text-white flex flex-row px-2  relative w-100' >
                          <div className=' relative removeshadow text-white flex flex-col pl-1 w-100' style={{ zIndex: "2" }}>
                            <div className='statusbar w-full flex  flex-row-reverse w-100'>
                              <div className={`relative ${fileRequest?.status === 'pending' || fileRequest?.status === 'rejected' ? 'declinedbtn' : 'rcvdbtn'}`}>
                                <h5 className={`stattext flex px-3 flex-1  absolute `}>{fileRequest?.status}</h5>
                                <svg width="150" height="24">
                                  <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="none" strokeWidth="1" />
                                </svg>
                              </div>
                            </div>
                            <h4 className='removeunderline mt-1'  >{fileRequest.book_id?.title}</h4>
                            <h5 className='pt-0'>-{fileRequest.book_id?.author}</h5>
                            <h6><span className='makethisbold mr-2'>Approval Date:</span>{fileRequest.approveDate && format(new Date(fileRequest.approveDate), 'MMMM d, yyyy (h:mm aa)')}</h6>
                            <h6><span className='makethisbold mr-2'>Expiration Date:</span>{fileRequest.expirationDate && format(new Date(fileRequest.expirationDate), 'MMMM d, yyyy (h:mm aa)')}</h6>
                          </div>

                        </div>

                      </Link>
                    ))
                  ) :
                    <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>No Requests Found</p>
                ) : (<p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>....loading</p>)
              }
            </div>
                      {!pageloading ?
              <Pagination page={page} pages={pages} changePage={setPage} /> : null
            }
          </TabPanel>

        </div>
      </div>
    </div>
  )
};

export default Borrow;



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

const Signupreq = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);



  const { isLoading, getborrowedbook, signrequests } = useSelector(state => state.book);
  const { user } = useSelector(state => state.auth);
  const [pageloading, setpageloading] = useState(true)
  const [userloaded, setuserloaded] = useState(null)

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

  const handleFileOptions = (options) => {
    setSelectedOptions(options);
  }


  const userexist = getCookieValue('userpersist')


  useEffect(() => {
    window.scrollTo(0, 0);
    setpageloading(true)
    setSelectedTab(urlParams.get('tab')?urlParams.get('tab'):'Signuprequests' )
    setPage(urlParams.get('page')? urlParams.get('page'):1 )

  }, [])

  useEffect(async () => {
   window.scrollTo(0, 0);
    if (userexist) {
      if (user.length !== 0) {
        setuserloaded(user)
        setTabLoading(true);
        if (selectedTab === 'Signuprequests') {
          dispatch(signupRequests(page))
          setTabLoading(false);
        }

        if (selectedTab === 'Contributionrequests') {

         dispatch(getallcontributedBook(page))

        }
    
        setpageloading(false)
      }
    } else {
      setpageloading(false)
      if (!userloaded) {
        navigate('/')
      }
    }

  }, [page, selectedTab, user, signrequests])

  useEffect(() => {
    setPages(signrequests.totalPages)
  }, [signrequests])

  useEffect(() => {
    console.log(fileRequests);
  }, [fileRequests])

  const tabClicked = (tabstatus) => {
    setSelectedTab(tabstatus);
    setPage(1);

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

  const onClickOutsideListener = () => {
    setActive(false)
    document.removeEventListener("click", onClickOutsideListener)
  }
  useEffect(()=>{
     
     window.history.replaceState(null, null, `?tab=${selectedTab}&page=${ selectedTab === 'Signuprequests'? page:null}`);
     console.log(options)
  },[page,selectedTab])
  return (
    !pageloading &&
    <div className='recentlyCont mb-24 flex '>

      <div className='recentCont pt-3 addnav '>
        <div className='text-black recenthead recentContCont '>

          <div className='flex bookmarkshead  mt-3 mb-2 flex-row  items-center'>
            <TabSelector
              isActive={selectedTab === 'Signuprequests'}
              onClick={() => tabClicked('Signuprequests')}
            >
              Borrow Requests
            </TabSelector>
            <TabSelector
              isActive={selectedTab === 'Contributionrequests'}
              onClick={() => tabClicked('Contributionrequests')}
            >
              Digital File Request
            </TabSelector>
          </div>

          <TabPanel hidden={selectedTab !== 'Signuprequests'}>
            <div className=' flex grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 tablet:gap-2 phone:gap-1  '>
              {
                !tabLoading && !isLoading ? (
                  signrequests?.requests.length ?
                    (signrequests.requests.map(post => (
                        <div className='bookmarkcontainer text-white flex flex-row px-2 relative w-100 h-52'  >

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
                              <button type='button' onClick={() => (acceptRequest(post._id))} className='relative acceptbtn disabled:opacity-50' disabled={waitingResponse}>
                                <h5 className=' stattext flex mx-3 flex-1  absolute'>Accept</h5>
                                <svg className='' width="150" height="25">
                                  <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                </svg>
                              </button>

                              <button type='button' onClick={() => (declineRequest(post._id))} className='relative declinebtn disabled:opacity-50' disabled={waitingResponse}>
                                <h5 className=' stattext flex mx-2 flex-1  absolute'>Decline</h5>
                                <svg className='' width="150" height="25">
                                  <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 0" stroke="#202125" />
                                </svg>
                              </button>

                            </div>


                            <h4 className='removeunderline my-1'>{`${post.firstName} ${post.lastName}`}</h4>

                            <h6 className='onelineonly'><span className='makethisbold mr-2'>User Email:</span>{post.email}</h6>
                            <h6 className='onelineonly'><span className='makethisbold mr-2'>Department:</span>{post.department}</h6>
                            <h6 className='onelineonly'><span className='makethisbold mr-2'>Student Number:</span>{post.studentNumber}</h6>
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
            <div className='flex  optionborrow w-full justify-between  pb-2 pr-1'>
              <p className='border-b-2 px-1 resulttext'>No of Results: {!tabLoading && (fileRequests ? fileRequests?.fileRequests.length : 0)}</p>
              <Select options={options} styles={customStyles} onChange={handleFileOptions} menuPortalTarget={document.querySelector('body')} />
            </div>
            <div className='  grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 tablet:gap-2 phone:gap-1 '>
              {
                !tabLoading ? (
                  fileRequests ? (
                    fileRequests?.fileRequests.map(fileRequest => (
                      <Link to={`/openbook/${fileRequest.book_id._id}`}   key={fileRequest._id}>

                        <div className='bookmarkcontainer text-white flex flex-row px-2  relative w-100' >
                          <div className=' relative removeshadow text-white flex flex-col pl-1 w-100' style={{ zIndex: "2" }}>
                            <div className='statusbar w-full flex  flex-row-reverse w-100'>
                              <div className={`relative ${fileRequest.status === 'pending' || fileRequest.status === 'rejected' ? 'declinedbtn' : 'rcvdbtn'}`}>
                                <h5 className={`stattext flex px-3 flex-1  absolute `}>{fileRequest.status}</h5>
                                <svg width="150" height="24">
                                  <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="none" strokeWidth="1" />
                                </svg>
                              </div>
                            </div>
                            <h4 className='removeunderline mt-1'  >{fileRequest.book_id.title}</h4>
                            <h5 className='pt-0'>-{fileRequest.book_id.author}</h5>
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
          </TabPanel>

        </div>
      </div>
    </div>
  )
};

export default Signupreq;



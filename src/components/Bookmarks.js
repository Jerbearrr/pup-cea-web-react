import React, { useEffect, useState, useContext } from 'react';
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/bookmarks.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { reset, getUser, logoutUser } from '../features/auth/authSlice'
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import Menu from "./Menu.js";
import { resetBook, getlikedBook, getbookmarkBook } from '../features/book/bookSlice';
import { useTabs, TabPanel } from "react-headless-tabs"
import { TabSelector } from './TabSelector';
import Pagination from './Pagination';
import Likepagination from './Likepagination';
import jwt_decode from "jwt-decode";
import { FaUserCircle } from "react-icons/fa";
import { IoMdNotificationsOutline} from "react-icons/io"
import Topnav from './Topnav';

const Bookmarks = () => {

  const { bookFeatured, openbook, likeStatus, isError, likedbook, bookmarkedbook, bookmarkpagecount, isLoading } = useSelector(state => state.book);
  const { user, message, isSuccess } = useSelector(state => state.auth);
  const [pageloading, setpageloading] = useState(true)
  const [userloaded, setuserloaded] = useState(null)
  const [selectedTab, setSelectedTab] = useTabs([
    'bookmarks',
    'likedbooks',

  ]);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const pageNumber = 1;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [page, setPage] = useState(urlParams.get('page') ?urlParams.get('page'): pageNumber);
  const [pages, setPages] = useState(1);

  const [likepage, setlikePage] = useState(urlParams.get('page') ?urlParams.get('page'): pageNumber);
  const [likepages, setlikePages] = useState(1);

  const navigate = useNavigate()
  const dispatch = useDispatch()


  const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )
  const userexist = getCookieValue('userpersist')



  useEffect(() => {

    window.scrollTo(0, 0);
    setpageloading(true)
    setSelectedTab(urlParams.get('tab') ?urlParams.get('tab'): 'bookmarks')
    setPage(urlParams.get('page') ?urlParams.get('page'): pageNumber)

  }, [])


  useEffect(() => {
   window.scrollTo(0, 0);

    if (userexist) {
      if (user.length !== 0) {
        setuserloaded(user)
        dispatch(getlikedBook(likepage))
        setpageloading(false)
      }
    } else {
      setpageloading(false)
      if (!userloaded) {
        navigate('/')
      }
    }

  }, [  likepage,  user])

  window.scrollTo(0, 0);
  useEffect(() => {
   

    if (userexist) {
      if (user.length !== 0) {
        setuserloaded(user)
        dispatch(getbookmarkBook(page))

        setpageloading(false)
      }
    } else {
      setpageloading(false)
      if (!userloaded) {
        navigate('/')
      }
    }

  }, [ page, user])

  useEffect(() => {

    setPages(bookmarkedbook.pages)
    setlikePages(likedbook.pages)

  }, [bookmarkedbook, likedbook])


  const onLogout = () => {
    setuserloaded(null)
    setpageloading(false)
    dispatch(logoutUser())
    dispatch(reset())

  }

  const tabClicked = (tabstatus) =>{

     

         setSelectedTab(tabstatus); 
         setPage(1);
         setlikePage(1);
      
    

   }

  useEffect(()=>{
     
     window.history.replaceState(null, null, `?tab=${selectedTab}&page=${ selectedTab === 'bookmarks'? page:likepage}`);
   
  },[page,selectedTab, likepage])
  const [isActive, setActive] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
  };

  if (!pageloading) {

  


    return (


      <>
        <div className='recentlyCont mb-24 flex '>

          <div className='recentCont pt-3 addnav '>
            <div className='text-black recenthead recentContCont '>

              <div className='flex bookmarkshead  mt-3 mb-2 flex-row  items-center'>
                <TabSelector
                  isActive={selectedTab === 'bookmarks'}
                  onClick={() => {tabClicked('bookmarks')}}
                >
                  Bookmarks
                </TabSelector>
                <TabSelector
                  isActive={selectedTab === 'likedbooks'}
                  onClick={() => {tabClicked('likedbooks')}}
                >
                  Liked Books
                </TabSelector>




              </div>
              <TabPanel hidden={selectedTab !== 'bookmarks'}>
                <div className=' flex grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 tablet:gap-2 phone:gap-1  '>
                  {
                    !isLoading ? (
                      bookmarkedbook.bookquery?.length > 0 ?
                        (bookmarkedbook.bookquery.map(bookmarkedbook => (

                          <Link to={`/openbook/${bookmarkedbook._id}`} key={bookmarkedbook._id} >

                            <div className='bookmarkcontainer text-white flex flex-row px-2 py-3 '>

                              <div className='bookmarksimgcont '>
                                <img className=" " src={bookmarkedbook.imgUri ? bookmarkedbook.imgUri : require('.//style/images/placeholder_book1.jpg')} alt={bookmarkedbook.title} />
                              </div>
                              <div className=' removeshadow text-white flex flex-col px-2'>
                                <h4 className='removeunderline' >{bookmarkedbook.title}</h4>
                                <h5 className='mt-1'>-{bookmarkedbook.author.toString()}</h5>
                                <div className='flex-grow flex tablet:mt-2 phone:mt-0'>
                                  <div className='flex  flex phone:items-end tablet:items-start'>
                                    <h2 className='tablet:mt-2 phone:mt-0'>{bookmarkedbook.description}</h2>
                                  </div>
                                   
                                </div>
                               
                              </div>

                            </div>
                          </Link>

                        ))) :
                        <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p>
                    ) : (<p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>....loading</p>)

                  }



                </div>
                {!pageloading ?
                  <Pagination page={page} pages={pages} changePage={setPage} /> : null
                }
              </TabPanel>

              <TabPanel hidden={selectedTab !== 'likedbooks'}>
                <div className='  grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 tablet:gap-2 phone:gap-1 '>

                  {
                    !isLoading ? (
                      likedbook.bookquery?.length ?
                        (likedbook.bookquery.map(likedbook => (

                          <Link to={`/openbook/${likedbook._id}`} key={likedbook._id} >

                            <div className='bookmarkcontainer text-white flex flex-row px-2 py-3 '>

                              <div className='bookmarksimgcont '>
                                <img className=" " src={likedbook.imgUri ? likedbook.imgUri : require('.//style/images/placeholder_book1.jpg')} alt={likedbook.title} />
                              </div>
                              <div className=' removeshadow text-white flex flex-col px-2'>
                        
                                  <h4 className='removeunderline' >{likedbook.title}</h4>
                                <h5 className='mt-1'>-{likedbook.author.toString()}</h5>
                                <div className='flex-grow flex tablet:mt-2 phone:mt-0'>
                                  <div className='flex  flex phone:items-end tablet:items-start'>
                                    <h2 className='tablet:mt-2 phone:mt-0'>{likedbook.description}</h2>
                                  </div>
                                   
                                </div>
                              </div>

                            </div>
                          </Link>

                        ))) :
                        <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p>
                    ) : (<p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>....loading</p>)

                  }

                </div>
                {!pageloading ?
                  <Pagination page={likepage} pages={likepages} changePage={setlikePage} /> : null
                }
              </TabPanel>





            </div>

          </div>


        </div>




      </>

    );
  } else {
    return (<></>)
  }


};

export default Bookmarks;
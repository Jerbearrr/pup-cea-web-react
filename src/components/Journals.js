import React, { useEffect } from 'react';
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaBars } from "react-icons/fa";

import { FaChevronDown } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/bookmarks.css";
import "./style/advancedsearch.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Footer";
import Menu from "./Menu.js";
import Topnav from "./Topnav";
import 'flowbite';
import { ReactDimmer } from "react-dimmer";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getallrecentlyadded, getalllikedbooks, getJournals } from '../features/book/bookSlice';
import SeemorePagination from './SeemorePagination';


const Journals = () => {
  const { seemore, isLoading, getjournals } = useSelector(state => state.book);

  
  const pageNumber = 1;
  const limiter = null;


  const [page, setPage] = useState(pageNumber);
  const [pages, setPages] = useState(1);

  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getJournals({ page:page, limiter:limiter }))
   

  }, [page])
  

  useEffect(()=>{

    setPages(getjournals.pages)

  },[getjournals])



  return (
    <>
      <div className='advancedsearchcont  '>
        <div className='relative advancedsearchcont2  w-full  pt-7 pb-10 px-1'>
          <div className='blurthis2 absolute ' style={{ backgroundImage: 'url(' + require('.//style/images/bg.png') + ')', zIndex: "1", backgroundAttachment: 'fixed' }}></div>

          <h1 className='advancetext mt-5 mb-3' style={{ zIndex: "2" }}>Recently Added Journals</h1>
           <div style={{ zIndex: "2" }} className='searchresultcont w-full grid grid-row-2 desktop:grid-cols-6 laptop:grid-cols-6 tabletlg:grid-cols-4 tablet:grid-cols-4 phone:grid-cols-3 phone:gap-1 tablet:gap-1 tabletlg:gap-3 '>
         
            {
               getjournals && !isLoading?
                    (getjournals.bookquery?.map(book => {
                        return (
                            <Link to={`/openbook/${book._id}`} key={book._id}>
                                <div className='h-full '>
                                    <div className="overflow-hidden recentcard ">

                                        <div className='imagecont advimgcont' style={{ zIndex: "2" }}>
                                            <img className=" imagecontcont" loading="lazy" src={book.imgUri ? book.imgUri : require('.//style/images/placeholder_book1.png')} alt={book.title} />
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
                        )
                    })):  <>
              <div className='h-full '>
                <div className="overflow-hidden recentcard ">

                  <div className='imagecont ' style={{ zIndex: "2" }}>
                    <img className=" imagecontcont" />
                  </div>

                  <div className="px-1 carddet " style={{ zIndex: "2" }}>
                    <div className=" cardtitle "></div>
                    <p className=" cardauthor  mb-1">

                    </p>
                  </div>

                </div>
              </div>
                <div className='h-full '>
                <div className="overflow-hidden recentcard ">

                  <div className='imagecont ' style={{ zIndex: "2" }}>
                    <img className=" imagecontcont" />
                  </div>

                  <div className="px-1 carddet " style={{ zIndex: "2" }}>
                    <div className=" cardtitle "></div>
                    <p className=" cardauthor  mb-1">

                    </p>
                  </div>

                </div>
              </div>
                <div className='h-full '>
                <div className="overflow-hidden recentcard ">

                  <div className='imagecont ' style={{ zIndex: "2" }}>
                    <img className=" imagecontcont" />
                  </div>

                  <div className="px-1 carddet " style={{ zIndex: "2" }}>
                    <div className=" cardtitle "></div>
                    <p className=" cardauthor  mb-1">

                    </p>
                  </div>

                </div>
              </div>
                <div className='h-full '>
                <div className="overflow-hidden recentcard ">

                  <div className='imagecont ' style={{ zIndex: "2" }}>
                    <img className=" imagecontcont" />
                  </div>

                  <div className="px-1 carddet " style={{ zIndex: "2" }}>
                    <div className=" cardtitle "></div>
                    <p className=" cardauthor  mb-1">

                    </p>
                  </div>

                </div>
              </div>
                <div className='h-full '>
                <div className="overflow-hidden recentcard ">

                  <div className='imagecont ' style={{ zIndex: "2" }}>
                    <img className=" imagecontcont" />
                  </div>

                  <div className="px-1 carddet " style={{ zIndex: "2" }}>
                    <div className=" cardtitle "></div>
                    <p className=" cardauthor  mb-1">

                    </p>
                  </div>

                </div>
              </div>
                <div className='h-full '>
                <div className="overflow-hidden recentcard ">

                  <div className='imagecont ' style={{ zIndex: "2" }}>
                    <img className=" imagecontcont" />
                  </div>

                  <div className="px-1 carddet " style={{ zIndex: "2" }}>
                    <div className=" cardtitle "></div>
                    <p className=" cardauthor  mb-1">

                    </p>
                  </div>

                </div>
              </div>
                <div className='h-full '>
                <div className="overflow-hidden recentcard ">

                  <div className='imagecont ' style={{ zIndex: "2" }}>
                    <img className=" imagecontcont" />
                  </div>

                  <div className="px-1 carddet " style={{ zIndex: "2" }}>
                    <div className=" cardtitle "></div>
                    <p className=" cardauthor  mb-1">

                    </p>
                  </div>

                </div>
              </div>
                <div className='h-full '>
                <div className="overflow-hidden recentcard ">

                  <div className='imagecont ' style={{ zIndex: "2" }}>
                    <img className=" imagecontcont" />
                  </div>

                  <div className="px-1 carddet " style={{ zIndex: "2" }}>
                    <div className=" cardtitle "></div>
                    <p className=" cardauthor  mb-1">

                    </p>
                  </div>

                </div>
              </div>
                <div className='h-full '>
                <div className="overflow-hidden recentcard ">

                  <div className='imagecont ' style={{ zIndex: "2" }}>
                    <img className=" imagecontcont" />
                  </div>

                  <div className="px-1 carddet " style={{ zIndex: "2" }}>
                    <div className=" cardtitle "></div>
                    <p className=" cardauthor  mb-1">

                    </p>
                  </div>

                </div>
              </div>
                <div className='h-full '>
                <div className="overflow-hidden recentcard ">

                  <div className='imagecont ' style={{ zIndex: "2" }}>
                    <img className=" imagecontcont" />
                  </div>

                  <div className="px-1 carddet " style={{ zIndex: "2" }}>
                    <div className=" cardtitle "></div>
                    <p className=" cardauthor  mb-1">

                    </p>
                  </div>

                </div>
              </div>
                <div className='h-full '>
                <div className="overflow-hidden recentcard ">

                  <div className='imagecont ' style={{ zIndex: "2" }}>
                    <img className=" imagecontcont" />
                  </div>

                  <div className="px-1 carddet " style={{ zIndex: "2" }}>
                    <div className=" cardtitle "></div>
                    <p className=" cardauthor  mb-1">

                    </p>
                  </div>

                </div>
              </div>
                <div className='h-full '>
                <div className="overflow-hidden recentcard ">

                  <div className='imagecont ' style={{ zIndex: "2" }}>
                    <img className=" imagecontcont" />
                  </div>

                  <div className="px-1 carddet " style={{ zIndex: "2" }}>
                    <div className=" cardtitle "></div>
                    <p className=" cardauthor  mb-1">

                    </p>
                  </div>

                </div>
              </div>
              </>
           
                }
          </div>
          {seemore.bookquery?.length > 0 ?
          <div className='youmaylike' style={{ zIndex: "2" }}><SeemorePagination page={page} pages={pages} changePage={setPage} /></div>
          :null}

        </div>
        <Footer />
      </div>

    </>
  );

};

export default Journals;
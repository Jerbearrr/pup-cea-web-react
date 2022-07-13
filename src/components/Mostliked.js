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
import { getallrecentlyadded, getalllikedbooks } from '../features/book/bookSlice';
import SeemorePagination from './SeemorePagination';


const Mostliked = () => {
  const { seemore, isLoading } = useSelector(state => state.book);

  
  const pageNumber = 1;


  const [page, setPage] = useState(pageNumber);
  const [pages, setPages] = useState(1);

  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getalllikedbooks(page))
   

  }, [page])
  

  useEffect(()=>{

    setPages(seemore.pages)

  },[seemore])



  return (
    <>
      <div className='advancedsearchcont  '>
        <div className='relative advancedsearchcont2  w-full  pt-7 pb-16 px-1'>
      

          <h1 className='advancetext mt-5 mb-3' style={{ zIndex: "2" }}> Most Liked Books</h1>
           <div style={{ zIndex: "2" }} className='searchresultcont w-full grid grid-row-2 desktop:grid-cols-6 laptop:grid-cols-6 tabletlg:grid-cols-4 tablet:grid-cols-4 phone:grid-cols-3 phone:gap-1 tablet:gap-1 tabletlg:gap-3 '>
         
            {
                seemore.bookquery?.length > 0 && !isLoading?
                    (seemore.bookquery.map(book => {
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

export default Mostliked;
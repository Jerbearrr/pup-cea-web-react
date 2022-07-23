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
      const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const { seemore, isLoading, getjournals } = useSelector(state => state.book);

  

  const limiter = null;

  const pageNumber = 1;

  const [page, setPage] = useState(urlParams.get('page') ?urlParams.get('page'): pageNumber);
  


  const [pages, setPages] = useState(1);

  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getJournals({ page:page, limiter:limiter }))
   

  }, [page])
  

  useEffect(()=>{

    setPages(getjournals.pages)

  },[getjournals])


  useEffect(()=>{
     
     window.history.replaceState(null, null, `?page=${ page}`);
    
  },[page])
  return (
    <>
      <div className='advancedsearchcont  '>
        <div className='relative advancedsearchcont2  w-full  pt-7 pb-16 px-1'>

          <h1 className='advancetext mt-5 mb-3 tabletlg:text-xl tablet:text-xl phone:text-base font-extrabold' style={{ zIndex: "2" }}>Recently Added Journals</h1>
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
            </div>    <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>    <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>    <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>    <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>    <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>    <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>    <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>    <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>    <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>    <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>    <div style={{ zIndex: "2" }} className="h-full my-2">
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
import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import {Link} from 'react-router-dom'
import { FaChevronDown } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import "./style/browse.css";
import "./style/sidemenu.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Footer";
import Menu from "./Menu.js";
import Topnav from "./Topnav";

import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedBook, getRecentlyAdded, resetBook, getlikedbooks, getRandomBook } from '../features/book/bookSlice';

const Browse = () => {

  const { recentlyAdded, bookfeatured, isLoading, likedbooks, randombooks } = useSelector(state => state.book);
  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(getFeaturedBook())
    dispatch(getRecentlyAdded());
    dispatch(getlikedbooks())
  }, [])



  var settingsfeatured = {
    dots: true,



    autoplay: true,
    speed: 700,
    autoplaySpeed: 8000,
    cssEase: "linear",
    infinite: true,
    swipeToSlide: true,


  };
  var settings = {
    dots: false,


    slidesToShow: 5,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 6000,
    cssEase: "linear",
    infinite: true,
    swipeToSlide: true,

    responsive: [



      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,

        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,

        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,

        }
      }
    ]
  };
  return (
    <>


      <div className='relative flex flex-col randcontainer' style={{overflow:'hidden'}}>


        <div className='phone:mx-1 laptop:mx-0 slidcont laptop:pt-10 phone:pt-5 px-1'>

          <Slider {...settingsfeatured}>

            {
             
                (randombooks?.map(bookfeatured => (
                  <div className='insfeaturedBox flex relative  ' key={bookfeatured._id}>

                    <div className='featuredimgBox z-10'>
                      <img className="featuredImg" src={bookfeatured.imgUri ? bookfeatured.imgUri : require('.//style/images/placeholder_book1.png')} alt="Mountain" />

                    </div>
                    <div className='featuredcontBox relative flex flex-col py-2 phone:px-1 tablet:px-4'>



                      <h4 className='featuredtitle'>{bookfeatured.title}</h4>
                      <h4 className='featuredauthor'>-{bookfeatured.author}</h4>
                      <div className='tabletlg:flex phone:hidden flex-row featuredgenre items-center '>
                        <p className='featuredauthor' >Genre: </p>

                        {
                          bookfeatured.genre ?
                            (bookfeatured.genre.map(bookfeatured => (
                              <p className='genrefeatured px-1' key={bookfeatured}>{bookfeatured}</p>

                            ))) : <p ></p>}




                      </div>
                      <h4 className='featureddescript'>An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.</h4>
                    </div>


                  </div>
                )))
            }

          </Slider>
        </div>
     
      <div className='text-white homefeaturedbox2 mt-5  pb-10'>
        <div className='homefeaturedcont px-1'>

        

          <div className='flex  w-100 mb-2  flex-row justify-between items-center mt-3'>
            <h3 className='mb-1 mt-8 phone:ml-1 laptop:ml-0 h2h'>Most Recent</h3>
            <button className='mt-8 seemorebutton border-transparent flex items-center justify-between flex-row'><a className='mr-1 text-white' href='/recentlyadded'> View more</a><FaChevronRight color="white" /></button>
          </div>
          <div className=' phone:px-1 desktop:px-0 grid grid-row-2 desktop:grid-cols-6 laptop:grid-cols-6 tabletlg:grid-cols-4 tablet:grid-cols-4 phone:grid-cols-3 phone:gap-1 tablet:gap-1 tabletlg:gap-3'>

            {recentlyAdded &&
              (recentlyAdded.map(book => (
                <Link to={`/openbook/${book._id}`} key={book._id}>
                  <div key={book._id}>
                    <div className='h-full '>
                      <div className="overflow-hidden recentcard ">

                        <div className='imagecont ' style={{ zIndex: "2" }}>
                          <img className=" imagecontcont" src={book.imgUri ? book.imgUri : require('.//style/images/placeholder_book1.png')} alt="Mountain" />
                        </div>

                        <div className="px-1 carddet " style={{ zIndex: "2" }}>
                          <div className=" cardtitle ">{book.title}</div>
                          <p className=" cardauthor  mb-1">
                            -{book.author}
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                </Link>
              )))}

          </div>



        </div>


      </div>

      <div className='text-white homefeaturedbox2  pb-10'>
        <div className='homefeaturedcont'>

          

          <div className='flex  mb-2  flex-row justify-between items-center mt-3'>
            <h3 className='mb-1 phone:ml-1 laptop:ml-0 mt-2  h2h'>Most Liked</h3>
            <button className='seemorebutton border-transparent flex items-center justify-between flex-row'><a className='mr-1 text-white' href='/mostliked'> View more</a><FaChevronRight color="white" /></button>
          </div>
          <div className=' phone:px-1 desktop:px-0 grid grid-row-2 desktop:grid-cols-6 laptop:grid-cols-6 tabletlg:grid-cols-4 tablet:grid-cols-4 phone:grid-cols-3 phone:gap-1 tablet:gap-1 tabletlg:gap-2'>
            
            {likedbooks &&
              (likedbooks.map(book => (
                <Link to={`/openbook/${book._id}`} key={book._id}>
                  <div key={book._id}>
                    <div className='h-full '>
                      <div className="overflow-hidden recentcard ">

                        <div className='imagecont ' style={{ zIndex: "2" }}>
                          <img className=" imagecontcont" src={book.imgUri ? book.imgUri : require('.//style/images/placeholder_book1.png')} alt="Mountain" />
                        </div>

                        <div className="px-1 carddet " style={{ zIndex: "2" }}>
                          <div className=" cardtitle ">{book.title}</div>
                          <p className=" cardauthor  mb-1">
                            -{book.author}
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                </Link>
              )))}
          

          
  
          </div>



        </div>


      </div>

      <div className='text-white homefeaturedbox2  pb-10'>
        <div className='homefeaturedcont'>
     

          <div className='flex  mb-2  flex-row justify-between items-center mt-3'>
            <h3 className='mb-1 phone:ml-1 laptop:ml-0  h2h'>Recent Journals</h3>
            <button className='seemorebutton border-transparent flex items-center justify-between flex-row'><a className='mr-1 text-white' href='/recentlyadded'> View more</a><FaChevronRight color="white" /></button>
          </div>
          <div className='phone:px-1 desktop:px-0 grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 gap-3 mb-5'>
            <div className='journalcontainer text-white flex flex-col p-3'>
              <h4 className='text-justify align-middle'>Title</h4>
              <p>Date Published: July 2019</p>
              <h5>Author , 2nd Author </h5>
              <h6 className='text-justify'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</h6>


            </div>
            <div className='journalcontainer text-white flex flex-col p-3'>
              <h4>Now I Will make the title of this journal to two lines and i hope it works well and if it exceeds three lines then the text will be clipped by the css</h4>
              <p>Date Published</p>
              <h5>Author</h5>
              <h6>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</h6>


            </div>
            <div className='journalcontainer text-white flex flex-col p-3'>
              <h4>Now I Will make the title of this journal to two lines and i hope it works well and if it exceeds three lines then the text will be clipped by the css</h4>
              <p>Date Published</p>
              <h5>Author</h5>
              <h6>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</h6>


            </div>
            <div className='journalcontainer text-white flex flex-col p-3'>
              <h4>Now I Will make the title of this journal to two lines and i hope it works well and if it exceeds three lines then the text will be clipped by the css</h4>
              <p>Date Published</p>
              <h5>Author</h5>
              <h6>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</h6>


            </div>
            <div className='journalcontainer text-white flex flex-col p-3'>
              <h4>Now I Will make the title of this journal to two lines and i hope it works well and if it exceeds three lines then the text will be clipped by the css</h4>
              <p>Date Published</p>
              <h5>Author</h5>
              <h6>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</h6>


            </div>
            <div className='journalcontainer text-white flex flex-col p-3'>
              <h4>Now I Will make the title of this journal to two lines and i hope it works well and if it exceeds three lines then the text will be clipped by the css</h4>
              <p>Date Published</p>
              <h5>Author</h5>
              <h6>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</h6>


            </div>


          </div>





        </div>
      </div>
 </div>






    </>

  );


};

export default Browse;
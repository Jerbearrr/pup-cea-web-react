import React, { useState, useEffect, useCallback, useRef } from 'react';

import {Link} from 'react-router-dom'

import { FaChevronRight, FaHeart } from "react-icons/fa";
import "./style/newbrowsecss.css";
import "./style/sidemenu.css";



import Carousel from 'react-material-ui-carousel'

import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedBook, getRecentlyAdded, resetBook, getlikedbooks, getJournals, getRandomBook } from '../features/book/bookSlice';
import { Swiper, SwiperSlide,  Autoplay, } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";



// import required modules
import { EffectFade,  Pagination } from "swiper";
import { format } from 'date-fns';
import Renderonview from './Renderonview';
const Browse2 = () => {
  
  const { recentlyAdded, bookfeatured, isLoading, likedbooks, getjournals } = useSelector(state => state.book);
  const dispatch = useDispatch();
  const page = 0;
  const limiter =8;
  const [randombooks, setrandombooks] = useState(null)
  const [randomloading, setrandomloading]=useState(false)
  const [likeloading, setlikeloading] = useState(true)
  const [journalloading, setjournalloading] =useState(true)
  const [recentlyloaded, setrecentlyloaded]=useState(true)

  const ref = useRef()
  const ref2 = useRef()
  const ref3 = useRef()

  const isVisible = Renderonview(ref)
  const isVisible2 = Renderonview(ref2)
  const isVisible3 = Renderonview(ref3)

  useEffect(()=>{
     window.scrollTo(0, 0);
  },[])
  useEffect(()=>{

    if(isVisible && journalloading){
        
      dispatch(getJournals({ page:page, limiter:limiter })).then(res=>{
        if(res){
          setjournalloading(false)
        }
      })
    }

    if(isVisible2 && likeloading){
      dispatch(getlikedbooks()).then((res)=>{
        if(res){
          setlikeloading(false)
        }
      })
    }

      if(isVisible3 && likeloading){
      dispatch(getlikedbooks()).then((res)=>{
        if(res){
          setlikeloading(false)
        }
      })
    }
   


  },[isVisible, isVisible2, isVisible3])



  useEffect(async() => {
    
   
    setrandombooks(null)

    dispatch(getRecentlyAdded()).then((res)=>{
      if(res){
        setrecentlyloaded(false)
      }
    });
   
    setrandomloading(true)
   
   
      dispatch(getRandomBook()).then(res =>{
        if(res){
           
      setrandombooks(res.payload)
         setrandomloading(false)
      }
     
     })
  
  
  }, [])
  
    var settingsfeatured = {
    dots: true,



    autoplay: true,
    speed: 300,
    autoplaySpeed: 8000,
    cssEase: "linear",
    infinite: true,
    swipeToSlide: true,


  };
  const [swiped, setSwiped] = useState(false)
   const handleSwiped = useCallback(() => {
    setSwiped(true)
  }, [setSwiped])

  const handleOnItemClick = useCallback(
    (e) => {
      if (swiped) {
        e.stopPropagation()
        e.preventDefault()
        setSwiped(false)
      }
    },
    [swiped],
  )
  return (

    <>
    <div className='homefeaturedbox  pb-10    ' style={{backgroundColor:'#18191A'}}>
      <div className='homefeaturedcont px-0 addnav py-5'>


  

     <div className="flex  grid grid-cols-12 gap-4 ">

    <div className=' laptop:flex phone:hidden newpuplogo  flex-col phone:col-span-0 laptop:col-span-3 items-center justify-center p-10  '>
      <img className='newpupLogo ' src={require('.//style/images/logo.png')} />
      <p className='mt-5 text-lg text-2xl font-bold'>PUP CEA </p>
       <p className='text-2xl font-bold'>Web Library</p>
    </div>
    <div className='phone:col-span-12 laptop:col-span-9 newrandomizerparentcont'>
    <div className='newrandomizercontainer relative flex flex-row  w-full   '>
    <p className='absolute laptop:mt-5  phone:mt-3 tablet:ml-3 laptop:ml-5 phone:ml-1 tablet:text-2xl phone:text-base font-bold newrandtext'>Random Books</p>


       <Swiper
        spaceBetween={30}
        effect={"fade"}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
       
        
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Pagination]}
        className="mySwiper"
      >
               {
        !randomloading ?
       (randombooks && randombooks?.map(bookfeatured => (
       
       <SwiperSlide key={bookfeatured._id}>
                 <Link to={`/openbook/${bookfeatured._id}`} key={bookfeatured._id} draggable='true' onDragStart={(e) => {e.preventDefault()}} >
  <div className='w-full  setmin h-full phone:flex tablet:hidden relative  flex-row  laptop:pt-5 phone:pt-3 laptop:pl-5 phone:pl-3 phone:pr-3 laptop:pr-5 '  draggable='true' onDragStart={(e) => {e.preventDefault()}} >
    <div className='absolute parentabsoluter'>
              
                 <div className={'absolute ' +  (bookfeatured && bookfeatured.imgUri ? 'blurcontainer' : 'blurcontainer2') } style={{ backgroundImage: 'url(' + `${bookfeatured ? bookfeatured.imgUri ? bookfeatured.imgUri : require('.//style/images/bg3.png') : null}` + ')'}} > </div>   
                
    </div>
    <div className='newrandTitlecont tablet:basis-3/5 phone:basis-5/5 flex flex-col items-center ' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
      <div className='newrandTitlecontins tablet:mt-10 phone:mt-5 flex flex-col mb-5 pt-5 tablet:pl-5 phone:pl-0' draggable='true' onDragStart={(e) => {e.preventDefault()}}>

        <h1 className='tablet:text-2xl laptop:text-3xl phone:text-xl font-bold newrandtitle' draggable='true' onDragStart={(e) => {e.preventDefault()}}>{bookfeatured.title}</h1>
        <p className='laptop:text-lg tablet:text-base phone:text-sm tablet:mt-3 phone:mt-1 newrandauthor' draggable='true' onDragStart={(e) => {e.preventDefault()}}>-{bookfeatured.author}</p>
      </div>
     
    </div>
 </div>

 <div className='w-full h-full phone:hidden relative tablet:flex flex-row  pt-5 pl-5 pr-5 ' onMouseDown={()=> {return false;}}   onDragStart={(e) => {e.preventDefault()}} >
           <div className='absolute parentabsoluter'>
              
                 <div className={'absolute ' +  (bookfeatured && bookfeatured.imgUri ? 'blurcontainer' : 'blurcontainer2') } style={{ backgroundImage: 'url(' + `${bookfeatured ? bookfeatured.imgUri ? bookfeatured.imgUri : require('.//style/images/bg3.png') : null}` + ')'}} > </div>   
                
    </div>
    
       <div className='newrandTitlecont basis-3/5 flex flex-col items-center '  onDragStart={(e) => {e.preventDefault()}}>
      <div className='newrandTitlecontins mt-10 flex flex-col mb-5 pt-5 pl-5'>

        <h1 className='text-3xl font-bold newrandtitle' draggable='true' onDragStart={(e) => {e.preventDefault()}}>{bookfeatured.title}</h1>
        <p className='text-lg mt-3 newrandauthor' draggable='true' onDragStart={(e) => {e.preventDefault()}}>-{bookfeatured.author}</p>
        <p className='mt-5 newranddescription ' draggable='true' onDragStart={(e) => {e.preventDefault()}}>{bookfeatured.description}</p>
      </div>
     
    </div>
    <div draggable='true' onDragStart={(e) => {e.preventDefault()}} className='newrandimagecont basis-2/5 flex flex-col justify-end items-center' >
      <div className='newimgcontinside flex items-center mt-10' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
          <img className='newimginside' src={bookfeatured.imgUri ? bookfeatured.imgUri : require('.//style/images/placeholder_book1.png')} />
      </div>
    
    </div>
    </div>
   </Link>
        </SwiperSlide>
    
       ))):
       
     <>       
     <div className='w-full setmin h-full phone:flex tablet:hidden relative  flex-row  laptop:pt-5 phone:pt-3 laptop:pl-5 phone:pl-3 phone:pr-3 laptop:pr-5 '  draggable='true' onDragStart={(e) => {e.preventDefault()}} >
  
    
 </div>  
     <div className='w-full h-full phone:hidden absolute tablet:flex flex-row  pt-5 pl-5 pr-5 ' onMouseDown={()=> {return false;}}   onDragStart={(e) => {e.preventDefault()}} >
     
    
       <div className='newrandTitlecont basis-3/5 flex flex-col items-center '  onDragStart={(e) => {e.preventDefault()}}>
      <div className='newrandTitlecontins  mt-10 w-full flex flex-col mb-5 pt-5 pl-5'>

        <h1 className='text-3xl font-bold w-full newrandtitle' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
                    <div className=" w-full flex-1 flex-col space-y-2">
                       
                        <div className="m-1 space-y-2 w-full ">
                         
                        </div>
                    </div>
                    </h1>
        <p className='text-lg mt-3 newrandauthor' draggable='true' onDragStart={(e) => {e.preventDefault()}}></p>
        <p className='mt-5 newranddescription ' draggable='true' onDragStart={(e) => {e.preventDefault()}}></p>
      </div>
     
    </div>
    <div draggable='true' onDragStart={(e) => {e.preventDefault()}} className='newrandimagecont basis-2/5 flex flex-col justify-end items-center' >
      <div className='newimgcontinside animate-pulse flex items-center mt-10' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
             <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-full"></div>
                
                    </div>
      </div>
    
    </div>
    </div>
     </>             
            
            }
  
    </Swiper>

          <>       
     <div className={`${randombooks? 'hidden ':'phone:flex tablet:hidden'}  w-full setmin h-full  absolute  flex-row  laptop:pt-5 phone:pt-3 laptop:pl-5 phone:pl-3 phone:pr-3 laptop:pr-5 `}  draggable='true' onDragStart={(e) => {e.preventDefault()}} >
         <div className='absolute parentabsoluter'>
              
                 <div className={'absolute '} > </div>   
                
    </div>
    <div className='newrandTitlecont w-full tablet:basis-3/5 phone:basis-5/5 flex flex-col items-center ' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
      <div className='newrandTitlecontins animate-pulse w-full tablet:mt-10 phone:mt-5 flex flex-col mb-5 pt-5 tablet:pl-5 phone:pl-0' draggable='true' onDragStart={(e) => {e.preventDefault()}}>

        <h1 className='tablet:text-2xl  laptop:text-3xl phone:text-xl font-bold newrandtitleloading bg-zinc-600  ' draggable='true' onDragStart={(e) => {e.preventDefault()}}></h1>
        <p className='laptop:text-lg mt-2 tablet:text-base phone:text-sm tablet:mt-3 phone:mt-1 newrandauthorloading bg-zinc-600 ' draggable='true' onDragStart={(e) => {e.preventDefault()}}></p>
      </div>
     
    </div>
    </div>  
     <div className={`${randombooks? 'hidden ':'phone:hidden tablet:flex'} w-full h-full relative  flex-row  pt-5 pl-5 pr-5 `} onMouseDown={()=> {return false;}}   onDragStart={(e) => {e.preventDefault()}} >
        <div className='absolute parentabsoluter'>
              
                 <div className={'absolute ' } > </div>   
                
       </div>
    
       <div className='newrandTitlecont basis-3/5 flex flex-col items-center '  onDragStart={(e) => {e.preventDefault()}}>
      <div className='newrandTitlecontins  mt-10 w-full flex flex-col mb-5 pt-5 pl-5'>

        <h1 className='text-3xl font-bold w-full newrandtitle' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
                    <div className="animate-pulse w-full flex-1 flex-col space-y-2">
                       
                        <div className="m-1 space-y-2 w-full ">
                            <div className="rounded-2xl bg-zinc-600 h-6 mr-12 "></div>
                            <div className="rounded-2xl mt-4 bg-zinc-600 w-20 h-4 self-center "></div>
                        </div>
                    </div>
                    </h1>
        <p className='text-lg mt-3 newrandauthor' draggable='true' onDragStart={(e) => {e.preventDefault()}}></p>
        <p className='mt-5 newranddescription ' draggable='true' onDragStart={(e) => {e.preventDefault()}}></p>
      </div>
     
    </div>
    <div draggable='true' onDragStart={(e) => {e.preventDefault()}} className='newrandimagecont basis-2/5 flex flex-col justify-end items-center' >
      <div className='newimgcontinside animate-pulse flex items-center mt-10' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
             <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-full"></div>
                
                    </div>
      </div>
    
    </div>
    </div>
     </> 







     <div className='absolute newimgimgholder w-full flex flex-row tablet:flex phone:hidden'>
      <div className='basis-3/5 flex '></div>
      <div className='basis-2/5 flex justify-center ml-1 mr-4'>
        <div className='newimgholder '></div>
      </div>
      
     </div>



    </div>
    </div>
    </div>
  
    <div className="flex  grid grid-cols-12 tabletlg:gap-4 phone:gap-1 mt-4">
          

    <div ref={ref3} className='laptop:flex newmostliked flex-col  laptop:col-span-3  phone:col-span-12 phone:mt-5 laptop:mt-0  phone:hidden laptop:flex '>
      <p className='w-full newmostlikedtext tablet:p-3 phone:p-1 text-lg font-bold mb-2'>Most Liked</p> 
         
          {!likeloading ?
              (likedbooks?.map((book,i) => (
                <Link to={`/openbook/${book._id}`} key={book._id}>
                  <div className='newmostlikedcontent flex flex-row w-full items-center py-12   '>
                <p className='topnumbers mx-3'>{String(i+1).padStart(2, '0')}</p>
      
                <img className='newmostlikedimg ' src={book.imgUri ? book.imgUri : require('.//style/images/placeholder_book1.png')} />
                <div className='flex flex-col newmostlikedtext2 justify-center'>
                <p className='newmostlikedtiked px-2 font-bold mb-1  '>{book.title}</p>
                <p className='text-xs flex text-gray-400 px-2 items-center'><FaHeart fill='#ea6666' className='mr-1'/>{book.noOfLikes?.length}</p>
                 </div>
                 </div>
                </Link>
              ))):<>

              <div className='newmostlikedcontent  flex flex-row w-full items-center pt-4  pb-6 '>
                
              
              
                <div className='flex flex-col animate-pulse newmostlikedtext2 justify-center px-5 w-full'>
                  <p className='w-full h-3 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-40 mt-2 h-2 bg-zinc-600 rounded-2xl'></h5>
               
                 </div>
                
               
                </div>
                  <div className='newmostlikedcontent  flex flex-row w-full items-center pt-4  pb-6 '>
                
              
              
                <div className='flex flex-col animate-pulse newmostlikedtext2 justify-center px-5 w-full'>
                  <p className='w-full h-3 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-40 mt-2 h-2 bg-zinc-600 rounded-2xl'></h5>
               
                 </div>
                
               
                </div>
                  <div className='newmostlikedcontent  flex flex-row w-full items-center pt-4  pb-6 '>
                
              
              
                <div className='flex flex-col animate-pulse newmostlikedtext2 justify-center px-5 w-full'>
                  <p className='w-full h-3 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-40 mt-2 h-2 bg-zinc-600 rounded-2xl'></h5>
               
                 </div>
                
               
                </div>
                  <div className='newmostlikedcontent  flex flex-row w-full items-center pt-4  pb-6 '>
                
              
              
                <div className='flex flex-col animate-pulse newmostlikedtext2 justify-center px-5 w-full'>
                  <p className='w-full h-3 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-40 mt-2 h-2 bg-zinc-600 rounded-2xl'></h5>
               
                 </div>
                
               
                </div>
                  <div className='newmostlikedcontent  flex flex-row w-full items-center pt-4  pb-6 '>
                
              
              
                <div className='flex flex-col animate-pulse newmostlikedtext2 justify-center px-5 w-full'>
                  <p className='w-full h-3 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-40 mt-2 h-2 bg-zinc-600 rounded-2xl'></h5>
               
                 </div>
                
               
                </div>
                  <div className='newmostlikedcontent  flex flex-row w-full items-center pt-4  pb-6 '>
                
              
              
                <div className='flex flex-col animate-pulse newmostlikedtext2 justify-center px-5 w-full'>
                  <p className='w-full h-3 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-40 mt-2 h-2 bg-zinc-600 rounded-2xl'></h5>
               
                 </div>
                
               
                </div>
                 <div className='newmostlikedcontent  flex flex-row w-full items-center pt-4  pb-6 '>
                
              
              
                <div className='flex flex-col animate-pulse newmostlikedtext2 justify-center px-5 w-full'>
                  <p className='w-full h-3 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-40 mt-2 h-2 bg-zinc-600 rounded-2xl'></h5>
               
                 </div>
                
               
                </div>
                 <div className='newmostlikedcontent  flex flex-row w-full items-center pt-4  pb-6 '>
                
              
              
                <div className='flex flex-col animate-pulse newmostlikedtext2 justify-center px-5 w-full'>
                  <p className='w-full h-3 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-40 mt-2 h-2 bg-zinc-600 rounded-2xl'></h5>
               
                 </div>
                
               
                </div>
                 <div className='newmostlikedcontent  flex flex-row w-full items-center pt-4  pb-6 '>
                
              
              
                <div className='flex flex-col animate-pulse newmostlikedtext2 justify-center px-5 w-full'>
                  <p className='w-full h-3 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-40 mt-2 h-2 bg-zinc-600 rounded-2xl'></h5>
               
                 </div>
                
               
                </div>
              
              
              </>}
              

    <Link to={'/mostliked'} className='seemorebutton border-transparent flex items-center justify-between flex-row text-white'> View more<FaChevronRight  className='ml-1' color="white" /></Link>
    </div>

    

    

     <div className='newmostrecentcontainer laptop:col-span-9 phone:col-span-12 flex flex-col  w-full desktop:p-5 laptop:p-3 phone:p-1 phone:pt-5 desktop:pt-0 phone:mt-1 laptop:mt-0'>
    <div className='newtitleheader flex flex-row justify-between w-full mb-5 laptop:mt-5 phone:mt-0'>
      <p className='tabletlg:text-xl phone:text-lg font-bold'>Most Recent</p>
      <button className=' seemorebutton border-transparent flex items-center justify-between flex-row'><Link className='mr-1 text-white' to='/recentlyadded'> View more</Link><FaChevronRight color="white" /></button>
    </div>
    

    <div  className='newrecentcont grid tablet:grid-cols-4 phone:grid-cols-3 tablet:gap-2 laptop:gap-3 phone:gap-1 pb-2'>
        { !recentlyloaded  ?
              (recentlyAdded?.map(book => (
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
              ))):
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
            </div>     <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>     <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>     <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>     <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>     <div style={{ zIndex: "2" }} className="h-full my-2 phone:hidden tabletlg:flex w-full">
                <div className="bg-zinc-800 recentcard w-full">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>
               <div style={{ zIndex: "2" }} className="h-full my-2 phone:hidden tabletlg:flex w-full">
                <div className="bg-zinc-800 recentcard w-full">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>
            
              </>}
    </div>
    

    
 
    </div>
    <div ref={ref2} className='newmostrecentcontainer laptop:col-span-9 phone:col-span-12 flex flex-col  w-full desktop:p-5 laptop:p-3 phone:p-1 phone:pt-5 desktop:pt-0 phone:mt-5 laptop:mt-0 phone:flex laptop:hidden'>
    <div className='newtitleheader flex flex-row justify-between w-full mb-5'>
      <p className='tabletlg:text-xl phone:text-lg font-bold'>Most Liked</p>
      <button className=' seemorebutton border-transparent flex items-center justify-between flex-row'><a className='mr-1 text-white' href='/recentlyadded'> View more</a><FaChevronRight color="white" /></button>
    </div>
    

    <div  className='newrecentcont grid tablet:grid-cols-4 phone:grid-cols-3 tablet:gap-2 laptop:gap-3 phone:gap-1 pb-2'>
       { !likeloading   ?
              (likedbooks?.map(book => (
                <Link to={`/openbook/${book._id}`} key={book._id}>
                  <div key={book._id}>
                    <div className='h-full relative '>
                      <div className='absolute top-0 right-0 z-10 likedsmall mt-1 py-1' style={{backgroundColor:'#0d0d0dc2'}}>
                        <p className='text-xs flex text-white px-2 items-center'><FaHeart fill='rgb(234, 11, 93)' className='mr-1'/>{book.noOfLikes?.length}</p>
                      </div>
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
              ))): <>
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
            </div>     <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>     <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>     <div style={{ zIndex: "2" }} className="h-full my-2">
                <div className="bg-zinc-800 recentcard">
                    <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-52"></div>
                        <div className="m-1 space-y-2 ">
                            <div className="rounded bg-zinc-600 h-2"></div>
                            <div className="rounded bg-zinc-600 w-20 h-2 self-center"></div>
                        </div>
                    </div>
                </div>
            </div>     <div style={{ zIndex: "2" }} className="h-full my-2 mb-4">
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
          
            
              </>}
    </div>
    

    
 
    </div>
    </div>

      <div className='text-white homefeaturedbox2 mt-5 pb-10' ref={ref}>
        <div className='homefeaturedcont recentjournbg laptop:px-5 tablet:px-3 phone:px-0.5'>
     

          <div className='flex  mb-2  flex-row justify-between items-center mt-3'>
            <h3 className='mb-1 phone:ml-1 laptop:ml-0 tabletlg:text-xl phone:text-lg h2h'>Recent Journals</h3>
            <Link to='/journals' className='seemorebutton border-transparent flex items-center justify-between flex-row'><p className='mr-1 text-white' > View more</p><FaChevronRight color="white" /></Link>
          </div>
          <div className='phone:px-0.5 desktop:px-0 grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 phone:grid-cols-1 gap-3 mb-5 py-2'>

           {!journalloading   ?
              (getjournals?.bookquery?.map((book) => (
                <Link to={`/openbook/${book._id}`} key={book._id}>
                   <div className='journalcontainer text-white flex flex-col p-3'>
                   <h4 className='text-justify align-middle'>{book.title}</h4>
                   <p>Date Published: {format(new Date(book.dateOfPublication), 'yyyy-MM-dd')}</p>
                   <h5>{book.author}</h5>
                   <h6 className='text-justify'>{book.description?book.description:'There are no descriptions for this book'}</h6>


                  </div>


                </Link>
              ))):<>
                         <div className='journalcontainer text-white animate-pulse w-full flex flex-col p-3 pt-6 pb-12'>
           
                   <p className='w-full h-4 bg-zinc-600 rounded-2xl'></p>
                   <h5 className='w-60 mt-5 h-3 bg-zinc-600 rounded-2xl'></h5>
                   <h6 className='text-justify mt-3 h-3 w-60 bg-zinc-600 rounded-2xl'></h6>


                  </div>
                        <div className='journalcontainer text-white animate-pulse w-full flex flex-col p-3 pt-6 pb-12'>
           
                   <p className='w-full h-4 bg-zinc-600 rounded-2xl'></p>
                   <h5 className='w-60 mt-5 h-3 bg-zinc-600 rounded-2xl'></h5>
                   <h6 className='text-justify mt-3 h-3 w-60 bg-zinc-600 rounded-2xl'></h6>


                  </div>
                         <div className='journalcontainer text-white animate-pulse w-full flex flex-col p-3 pt-6 pb-12'>
           
                   <p className='w-full h-4 bg-zinc-600 rounded-2xl'></p>
                   <h5 className='w-60 mt-5 h-3 bg-zinc-600 rounded-2xl'></h5>
                   <h6 className='text-justify mt-3 h-3 w-60 bg-zinc-600 rounded-2xl'></h6>


                  </div>
                     <div className='journalcontainer text-white animate-pulse w-full flex flex-col p-3 pt-6 pb-12'>
           
                   <p className='w-full h-4 bg-zinc-600 rounded-2xl'></p>
                   <h5 className='w-60 mt-5 h-3 bg-zinc-600 rounded-2xl'></h5>
                   <h6 className='text-justify mt-3 h-3 w-60 bg-zinc-600 rounded-2xl'></h6>


                  </div>
                
                  
                
              </>}
         

          </div>





        </div>
      </div>

      </div>
    </div>
 
    




     
    </>

  );


};

export default Browse2;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaSearch } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { BsFillBookmarkHeartFill } from "react-icons/bs";
import { GiBookshelf } from "react-icons/gi";
import { GiBlackBook } from "react-icons/gi";
import "./style/home.css";
import "./style/sidemenu.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Footer";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getFeaturedBook, getRecentlyAdded, resetBook } from '../features/book/bookSlice';
import Hometopnav from './Hometopnav';
import bookService from '../features/book/bookService';
import Renderonview from './Renderonview';
import Topnav from './Topnav';

const Home = () => {
  const { recentlyAdded, bookfeatured, isLoading } = useSelector(state => state.book);
  const dispatch = useDispatch();
  const [swiped, setSwiped] = useState(false)
  const [fetchquote, setfetchquote] = useState(null)
  const [fetchauthor, setfetchquoteauthor] = useState(null)
  const [searchtext, setsearchtext] = useState(null)
  const [bookcount, setbookcount] = useState(0)
  const [counter, setcounter] = useState(0)

  const[featureloading, setfeatureloading] = useState(true)
  const[recentlyloading, setrecentloading] = useState(true)

  const ref = useRef()
  const ref2 = useRef()
  

  const isVisible = Renderonview(ref)
  const isVisible2 = Renderonview(ref2)

  const handleSwiped = useCallback(() => {
    setSwiped(true)
  }, [setSwiped])

  const onChangeSearch =(e)=>{

    setsearchtext(e.target.value) 
  }

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
  
  useEffect(()=>{
    
    if(bookcount > 0){
      console.log(bookcount)
   

    let start = 0;
    // first three numbers from props
    const end = parseInt(bookcount)
    // if zero, return
    if (start === end) return;

    // find duration per increment
    let totalMilSecDur = parseInt(0.1);
    let incrementTime = (totalMilSecDur / end) * 1000;

    // timer increments start counter 
    // then updates count
    // ends if start reaches end
    let timer = setInterval(() => {
      start += 1;
      setcounter((start))
      if (start === end) clearInterval(timer)       
    }, incrementTime);
    }



  },[bookcount])
  useEffect(()=>{

     if(isVisible && featureloading){
       dispatch(getFeaturedBook()).then(res=>{
      if(res){
        setfeatureloading(false)
      }
     })

     }

     if(isVisible2 && recentlyloading){
          dispatch(getRecentlyAdded()).then(res=>{
       if(res){
        setrecentloading(false)
       }
       })

     }


    
  },[isVisible, isVisible2])
  

  useEffect(async() => {



    
    try {
    const featuredquote = await bookService.getquote().then((res)=>{

        if(res){
          setfetchquote(res.quote)
          setfetchquoteauthor(res.author)
   
      
        }
      })
      
    } catch (error) { 
       console.log(error);
    }

   try {
    const bookcont = await bookService.getbookcount().then((res)=>{

        if(res){
         setbookcount(res)
   
        }
      })
      
    } catch (error) { 
       console.log(error);
    }



  }, [])

  var settingsfeatured = {
    dots: true,
    slidesToShow: 2,
    autoplay: true,
    speed:500,
    autoplaySpeed: 6000,
    cssEase: "linear",
    infinite: true,
    swipeToSlide: true,

    responsive: [



      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,

        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,

        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,

        }
      }
    ]


  };

  const [bookModal, setbookModal] = useState({ open: false, selectedBook: null });

  const bookhovered = (i) =>{

    console.log(i)
   
   
    setbookModal({open: true,selectedBook:recentlyAdded[i]})
    console.log(recentlyAdded[i])
    
   



  }
  const bookunhovered = ()=>{
    console.log('unhovered')
  }

  const hoverbookModal = ()=>{
    return (
    
    <p className={ (bookModal.open? 'flex':'hidden' ) }> {bookModal.selectedBook.title} </p>)
  }

  // On render event
  return (
    <>
    
       <div className='hometopnavdiv'>


       </div>
      <div className='searchCont flex '>

        <div className='centerCont '>
          <div className='centerContCont mt-14 phone:mb-28 laptop:mb-20 '>
            <h2 className='mb-4 h2h styler'><img className='logohome' src={require('.//style/images/logo.png')} alt="Logo" /><span className='mt-2  h2h styler'>PUP CEA Web Library</span></h2>
            <div className=''>
              <div className='relative' action='/advancedsearch'>
                <input className='w-full tabletlg:py-3 phone:py-2 text-black searchfield' onKeyDown={(e)=>{
                   if (e.keyCode == 13)
                        document.getElementById('btnSearch').click()    
                }} type="text" onChange={onChangeSearch} name="title" placeholder="Search book..." ></input>
               <Link id='btnSearch' className='searchbtn flex item-center justify-center' to={`/advancedsearch?title=${searchtext}`}><button type="button" title="Search" aria-label="Submit Search" className=' tabletlg:px-4 phone:px-3'><div><FaSearch /></div></button></Link>  
              </div>
              <p className='mt-4 homedescr'>Search for <span className='font-semibold'>{counter}</span> library resources composed of books and journals that can be found on the PUP CEA Library</p>
            </div>

  
            <div className='w-full flex browsebtncenter p-2 mt-5'>
             
            <Link to={`/browse`} title="Search"  aria-label="Submit Search" className='brswsebton p-3' >  <div>Browse Resources</div></Link>
             
            </div> 

          </div>


        </div>


      </div>
      <div className='librarydescription w-full py-14 px-5'>
        <div className='librarydesccontainer   phone:px-1 desktop:px-0 grid  phone:grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-3' >
          <div className='librarydesc flex flex-row tabletlg:gap-3 phone:gap-1'>
            <div className='iconbox'>
              <p><BsFillBookmarkHeartFill /></p>

            </div>
            <div className='icondesc flex flex-col content-between '>
              <p className='icondesctitle'>Bookmark</p>
              <p className='icondescdesc'>Bookmark books that you like in the library</p>

            </div>



          </div>
          <div className='librarydesc flex flex-row tabletlg:gap-3 phone:gap-1'>
            <div className='iconbox'>
              <p>< GiBookshelf /></p>

            </div>
            <div className='icondesc flex flex-col content-between '>
              <p className='icondesctitle'>Manage</p>
              <p className='icondescdesc'>Manage the library resources with admin access</p>


            </div>

          </div>
          <div className='librarydesc flex flex-row tabletlg:gap-3 phone:gap-1'>

            <div className='iconbox'>
              <p><GiBlackBook /></p>

            </div>
            <div className='icondesc flex flex-col content-between '>
              <p className='icondesctitle'>Borrow</p>
              <p className='icondescdesc'>Borrow books using the library system</p>

            </div>



          </div>


        </div>
      </div>

      <div className='homefeaturedbox  pb-56'>
      
        <div ref={ref} className='homefeaturedcont px-3 desktop:px-0 '>
          <h3 className='my-10  py-0 text-white text-center w-full flex justify-center items-center relative'><div className='absolute w-full linefeatured'></div> <span className='h2h featline'>Featured Books</span> </h3>

      {
        !featureloading ?
    
          <Slider {...settingsfeatured}
            onSwipe={handleSwiped}>

            {!featureloading ?
              (bookfeatured && bookfeatured?.map(book => (
                <Link to={`/openbook/${book._id}`} key={book._id} onClickCapture={handleOnItemClick} onDrag={(e)=> {e.stopPropagation()}}>

                  <div className='insfeaturedBox flex relative   ' onClickCapture={handleOnItemClick}  >

                    <div className='featuredimgBox'>
                      <img className="featuredImg" src={book.imgUri ? book.imgUri : require('.//style/images/placeholder_book.png')} alt={book.title} />

                    </div>
                    <div className='featuredcontBox relative h-full flex flex-col  laptop:mx-5 phone:mx-1 pl-2 '>


                      <h4 className='featuredtitle' draggable='true' onDragStart={(e) => {e.preventDefault()}}>{book.title}</h4>
                      <h4 className='featuredauthor' draggable='true' onDragStart={(e) => {e.preventDefault()}}>-{book.author.toString()}</h4>

                      <h4 className='featureddescript' draggable='true' onDragStart={(e) => {e.preventDefault()}}>{book.description}</h4>

                    </div>
                  </div>
                </Link>
              ))) : 
              null
            }



          </Slider>: <>
         
         <div className='flex flex-row gap-4 w-full justify-center items'>


              <div className='insfeaturedBox flex relative   '  >

                    <div className='featuredimgBox'>
                      <div className='newimgcontinside animate-pulse flex items-center mt-10' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
             <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-full"></div>
                
                    </div>
      </div>

                    </div>
                    <div className='featuredcontBox relative h-full flex flex-col  laptop:mx-5 phone:mx-1 pl-2 '>


                      <div className='flex flex-col h-full animate-pulse newmostlikedtext2  px-5 w-full'>
                  <p className='w-full mt-8 h-4 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-40 mt-3 h-3 bg-zinc-600 rounded-2xl'></h5>
                  <h5 className='w-40 mt-2 h-3 bg-zinc-600 rounded-2xl'></h5>
               
                 </div>

                    </div>
                  </div>

                  <div className='insfeaturedBox relative phone:hidden tabletlg:flex  '  >

                    
                    <div className='featuredimgBox'>
                      <div className='newimgcontinside animate-pulse flex items-center mt-10' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
             <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-full"></div>
                
                    </div>
      </div>

                    </div>
                    <div className='featuredcontBox relative h-full flex flex-col  laptop:mx-5 phone:mx-1 pl-2 '>


                      <div className='flex flex-col h-full animate-pulse newmostlikedtext2  px-5 w-full'>
                  <p className='w-full mt-8 h-4 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-40 mt-3 h-3 bg-zinc-600 rounded-2xl'></h5>
                  <h5 className='w-40 mt-2 h-3 bg-zinc-600 rounded-2xl'></h5>
               
                 </div>

                    </div>
                  </div>
         </div>
          
          
          </>  }
        </div>
      </div>      <div className='w-full relative'>

  <div className="custom-shape-divider-top-1655834631">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
    </svg>
</div>
      </div>

       <div ref={ref2} className='homefeaturedbox bg-transparent -mt-56 z-10 '>

        <div className='homefeaturedcont bg-transparent px-3 desktop:px-0 mincont '>
                <h3 className='my-10  py-0 text-white text-center w-full flex justify-center items-center relative'><div className='absolute w-full linefeatured'></div> <span className='h2h featline'> </span> </h3>

                <h3 className='my-10  py-0 text-white text-center w-full flex justify-center bg-transparent items-center relative'><div className='absolute bg-transparent w-full linefeatured '></div> <span className='h2h featline'> Recently Added</span> </h3>
                 <div className='w-full phone:px-1 newrecentgrid desktop:px-0 grid laptop:grid-cols-3 gap-3 tabletlg:grid-cols-3 tablet:grid-cols-3 phone:grid-cols-2  mb-5'>
             
                {!recentlyloading?
                ( recentlyAdded && recentlyAdded?.slice(0, 6).map((book,i) => (
                  <Link className='flex flex-1 justify-center h-full' to={`/openbook/${book._id}`} key={book._id} onClickCapture={handleOnItemClick} onDragStart={(e)=> {e.stopPropagation()}} 
                   onMouseEnter={() => {bookhovered(i)}}
                   onMouseLeave={() => {bookunhovered()}} 
                   
                   >
                  <div className='flex flex-wrap w-full h-full flex-1 ' key={book._id} style={{maxWidth:'250px'}}>
                  <div className='newhomerecentcont p-2 flex flex-col items-center ' style={{maxWidth:'100%'}}>
                    <div className='newhomeimgrecentcont'>
                     <img className="newrecentfeaturedImg" src={book.imgUri ? book.imgUri : require('.//style/images/placeholder_book1.png')} alt={book.title}  />
                    </div> 
                    <div className='newhomedetcont flex justify-center items-center'>
                      <p className='newhomedetconttitle'>{book.title}</p>
                      <p  className='newhomedetcontauhtor'>{book.author.toString()}</p>
                    </div>

                  </div>    
                 </div>
                  </Link>
                ))) :<>

                   <a className='flex flex-1 justify-center h-full'>
                              <div className='flex flex-wrap w-full h-full flex-1 ' style={{maxWidth:'250px'}} >
                  <div className='newhomerecentcont p-2 flex flex-col items-center ' style={{maxWidth:'100%'}}>
                    <div className='newhomeimgrecentcont flex items-center justify-center'>
                          <div className='newimgcontinside animate-pulse flex items-center mt-10' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
             <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-full"></div>
                
                    </div>
      </div>
                    </div> 
                    <div className='newhomedetcont flex justify-center items-center'>
                     
                      <div className='flex flex-col h-full animate-pulse newmostlikedtext2  px-1 w-full'>
                  <p className='w-full mt-1 h-4 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-20 mt-3 h-3 bg-zinc-600 rounded-2xl'></h5>
               
               
                 </div>
                    </div>

                  </div>    
                 </div>
                   </a>
                   <a className='flex flex-1 justify-center h-full'>
                              <div className='flex flex-wrap w-full h-full flex-1 ' style={{maxWidth:'250px'}} >
                  <div className='newhomerecentcont p-2 flex flex-col items-center ' style={{maxWidth:'100%'}}>
                    <div className='newhomeimgrecentcont flex items-center justify-center'>
                          <div className='newimgcontinside animate-pulse flex items-center mt-10' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
             <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-full"></div>
                
                    </div>
      </div>
                    </div> 
                    <div className='newhomedetcont flex justify-center items-center'>
                     
                      <div className='flex flex-col h-full animate-pulse newmostlikedtext2  px-1 w-full'>
                  <p className='w-full mt-1 h-4 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-20 mt-3 h-3 bg-zinc-600 rounded-2xl'></h5>
               
               
                 </div>
                    </div>

                  </div>    
                 </div>
                   </a>
                   <a className='flex flex-1 justify-center h-full'>
                              <div className='flex flex-wrap w-full h-full flex-1 ' style={{maxWidth:'250px'}} >
                  <div className='newhomerecentcont p-2 flex flex-col items-center ' style={{maxWidth:'100%'}}>
                    <div className='newhomeimgrecentcont flex items-center justify-center'>
                          <div className='newimgcontinside animate-pulse flex items-center mt-10' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
             <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-full"></div>
                
                    </div>
      </div>
                    </div> 
                    <div className='newhomedetcont flex justify-center items-center'>
                     
                      <div className='flex flex-col h-full animate-pulse newmostlikedtext2  px-1 w-full'>
                  <p className='w-full mt-1 h-4 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-20 mt-3 h-3 bg-zinc-600 rounded-2xl'></h5>
               
               
                 </div>
                    </div>

                  </div>    
                 </div>
                   </a>
                   <a className='flex flex-1 justify-center h-full'>
                              <div className='flex flex-wrap w-full h-full flex-1 ' style={{maxWidth:'250px'}} >
                  <div className='newhomerecentcont p-2 flex flex-col items-center ' style={{maxWidth:'100%'}}>
                    <div className='newhomeimgrecentcont flex items-center justify-center'>
                          <div className='newimgcontinside animate-pulse flex items-center mt-10' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
             <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-full"></div>
                
                    </div>
      </div>
                    </div> 
                    <div className='newhomedetcont flex justify-center items-center'>
                     
                      <div className='flex flex-col h-full animate-pulse newmostlikedtext2  px-1 w-full'>
                  <p className='w-full mt-1 h-4 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-20 mt-3 h-3 bg-zinc-600 rounded-2xl'></h5>
               
               
                 </div>
                    </div>

                  </div>    
                 </div>
                   </a>
                   <a className='flex flex-1 justify-center h-full'>
                              <div className='flex flex-wrap w-full h-full flex-1 ' style={{maxWidth:'250px'}} >
                  <div className='newhomerecentcont p-2 flex flex-col items-center ' style={{maxWidth:'100%'}}>
                    <div className='newhomeimgrecentcont flex items-center justify-center'>
                          <div className='newimgcontinside animate-pulse flex items-center mt-10' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
             <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-full"></div>
                
                    </div>
      </div>
                    </div> 
                    <div className='newhomedetcont flex justify-center items-center'>
                     
                      <div className='flex flex-col h-full animate-pulse newmostlikedtext2  px-1 w-full'>
                  <p className='w-full mt-1 h-4 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-20 mt-3 h-3 bg-zinc-600 rounded-2xl'></h5>
               
               
                 </div>
                    </div>

                  </div>    
                 </div>
                   </a>
                   <a className='flex flex-1 justify-center h-full'>
                              <div className='flex flex-wrap w-full h-full flex-1 ' style={{maxWidth:'250px'}} >
                  <div className='newhomerecentcont p-2 flex flex-col items-center ' style={{maxWidth:'100%'}}>
                    <div className='newhomeimgrecentcont flex items-center justify-center'>
                          <div className='newimgcontinside animate-pulse flex items-center mt-10' draggable='true' onDragStart={(e) => {e.preventDefault()}}>
             <div className="animate-pulse flex-1 flex-col space-y-2">
                        <div className="rounded bg-zinc-600 h-full"></div>
                
                    </div>
      </div>
                    </div> 
                    <div className='newhomedetcont flex justify-center items-center'>
                     
                      <div className='flex flex-col h-full animate-pulse newmostlikedtext2  px-1 w-full'>
                  <p className='w-full mt-1 h-4 bg-zinc-600 rounded-2xl'></p>

                 <h5 className='w-20 mt-3 h-3 bg-zinc-600 rounded-2xl'></h5>
               
               
                 </div>
                    </div>

                  </div>    
                 </div>
                   </a>
                    
                        
                </>
                
        
               
            
        
                }
      
                   
             


                 </div>
        </div>
      </div>


        <div className='homefeaturedbox  pb-36 -mt-32'>
  
        <div className='homefeaturedcont px-3 flex flex-col justify-center desktop:px-0 mt-44 '>
         <p className='mt-42 text-white flex self-center pt-12 text-center '>{fetchquote? <q>{fetchquote}</q>: <q className=''>Reading is to the mind what exercise is to the body.</q> }
           </p>
         <p className='text-white flex self-center mt-2'>– {fetchauthor? fetchauthor:'Richard Steele' }  </p>
 
       
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;


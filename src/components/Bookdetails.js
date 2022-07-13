import React, {useEffect, useState, useContext} from 'react';
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';


const Bookdetails= () => {
 
const { bookFeatured, isLoading, isSuccess, openbook, likeStatus } = useSelector(state => state.book);
 
  



    
 return (
     <>
    
     <div className='relative  flex ' >
     <div className='w-full  bookdetailcontainer  ' key={openbook._id}>
      <div className='blurthis absolute ' style={{backgroundImage: 'url(' + require('.//style/images/bg2.png') + ')',zIndex:"1"}}>   </div>   
     <div className='maxwidthopen  flex-row flex  grid grid-cols-12 self-center'>
     <div className='bookimge laptop:my-8 phone:my-0 py-6 tablet:py-6 desktop:py-8  col-span-12 desktop:col-span-2 tablet:col-span-4 '>
         <img className='openbookimage' src={openbook.imgUri ? openbook.imgUri : require('.//style/images/placeholder_book.jpg')} alt="No Image Preview"/>
     </div>
     <div className='titledescription laptop:my-8 phone:my-2 pb-2 tablet:py-4 desktop:py-8 col-span-12 desktop:col-span-7 tablet:col-span-8  px-6'>
         <h2 className='openbooktitle  flex phone:text-center tablet:text-left'>{openbook.title}</h2>
         <h3 className='openbookauthor py-2'><span className='openbookclassname'>Author: </span> {openbook.author}</h3>
          <div className='genrecircle inline-flex'>
                  <p className='openbookgenre genretext px-1'>Genre:</p>

                   {
                   openbook.genre ?
                   (openbook.genre.map(openbook => (
                    <a className='openbookgenre px-1' key={openbook}><p className='px-1'>{openbook}</p></a>
                   ))):<a>No genre available</a>
                   }


         </div>
         <div className='   flex flex-row openbookbuttons'>
             <a className='px-2 my-4 mx-1'>Borrow</a> <a className='px-2 my-4   mx-1' ><FaRegBookmark/></a> <a className='px-2  my-4  mx-1' >
         
               
                {()=>{
                    if(openbook.noOfLikes && openbook.noOfLikes){
                        console.log(openbook.noOfLikes.length)
                    }
                }}
               
              </a>
         </div>
        <h4 className='openbooksummary mb-2 '><p className='openbookclassname'>Overview:</p> An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.</h4>

     </div>
     <div className='moredetails py-4 tablet:py-6 desktop:py-8  desktop:col-span-3  phone:col-span-12 flex flex-col desktop:items-center'>
      <div className='flex laptop:my-8 phone:my-2 flex-col px-7 desktop:px-0 moredetcont'>
        {openbook.type? ( <p><span className='openbookclassname'>Material type: &nbsp; </span>{openbook.type}</p>):(null)}
        {openbook.form? ( <p><span className='openbookclassname'>Literary Form: &nbsp; </span>  {openbook.form}</p>):(null)}
        {openbook.publisher? (<p><span className='openbookclassname'>Publisher: &nbsp; </span>{openbook.publisher}</p>):(null)}
        {openbook.dateOfCopyright? (<p><span className='openbookclassname'>Copyright date: &nbsp; </span>{openbook.dateOfCopyright}</p>):(null)}
        {openbook.dateOfPublication? (<p><span className='openbookclassname'>Publication date: &nbsp; </span>{openbook.dateOfPublication}</p>):(null)}
        {openbook.isbn? ( <p><span className='openbookclassname'>ISBN: &nbsp; </span> {openbook.isbn}</p>):(null)}
        {openbook.callNumber? ( <p><span className='openbookclassname'>Call number: &nbsp;  </span>{openbook.callNumber}</p>):(null)}
         <p><span className='openbookclassname'>Availability: &nbsp; </span>{openbook.noOfCopies > 0? (<span className="text-emerald-400">Available</span>):(<span className="text-pink-700">Not Available</span>)}</p>

       </div>  
     </div>

     </div>
     </div>   

</div>
  
     
     
     
     </>
 );

};

export default Bookdetails;
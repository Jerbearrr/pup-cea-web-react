import React, { useState, useCallback, useRef, useEffect } from "react";
import { FaChevronDown, FaFileImage, FaSearch,FaUndo } from "react-icons/fa";
import { IoCloseSharp, } from "react-icons/io5";
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/openbook.css";
import "./style/addbook.css";
import Creatable from 'react-select/creatable';
import bookService from '../features/book/bookService';
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import { getUser } from "../features/auth/authSlice";
import { useSelector, useDispatch} from "react-redux";
import { getcontributedBook, managecancelreq } from '../features/book/bookSlice';
import { useNavigate, Link } from "react-router-dom";
import Pagination from "./Pagination";
import { useTabs, TabPanel } from "react-headless-tabs"
import { TabSelector } from './TabSelector';
import Select from 'react-select';
import Modal from 'react-modal';
import ButtonSpinner from './ButtonSpinner';
import { resetBook } from "../features/book/bookSlice";
const customStyles2 = {
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

    minHeight: '41px',

    maxWidth: '100%',


  }),
  valueContainer: (provided, state) => ({
    ...provided,

    padding: '0 5px',



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

    maxWidth: '100%',
  }),

  menuList: base => ({
    ...base,
    minHeight: "10px",


    padding: '0'

  }),
  option: styles => ({
    ...styles,

    lineHeight: '20px',

  })

}


const Contribute = () => {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

    const { isLoading, getcontributedbook, isError } = useSelector(state => state.book);
    const { user, isSuccess } = useSelector(state => state.auth);
  const [skipCount, setSkipCount] = useState(true);
   const [buttonloading, setbuttonloading]= useState(false)
     const [authorOptions, setAuthorOptions] = useState();
 const navigate = useNavigate();
const dispatch = useDispatch()
  const [options, setOptions] = useState([
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'declined', label: 'Declined' },

  ]); 
    const [pageloading, setpageloading] = useState(true)
    const [bgactive, setbgactive] = useState(true)
  const [selectedTab, setSelectedTab] = useTabs([
    'contribute',
    'contributionrequest',

  ]);

  useEffect(()=>{
    if(isError){
       dispatch(resetBook())
    }
  },[isError])
  useEffect(() => {

  
    window.scrollTo(0, 0);
    setpageloading(true)
    setSelectedTab(urlParams.get('tab')? urlParams.get('tab'):'contribute' )
    setPage(urlParams.get('page')? urlParams.get('page'):1 )
    setSelectedOptions({
      value: urlParams.get('option')?urlParams.get('option'):'all',
      label: urlParams.get('option')?urlParams.get('option'):'all'

    })
      if(urlParams.get('tab') === 'contributionrequest'){
          setbgactive(false)
          
         }else{
          setbgactive(true)
      }
   

  }, [])

  const pageNumber = 1;
  const [page, setPage] = useState(urlParams.get('page') ?urlParams.get('page'): pageNumber);
  const [pages, setPages] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({ value: 'all', label: 'All' });
  const handleChange = (options) => {
    setSelectedOptions(options);
  };
  const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )
  
  const userexist = getCookieValue('userpersist')
    useEffect(()=>{

   if (skipCount){
    
    setSkipCount(false)
    console.log(skipCount)
  };
   if (!skipCount){
   
    
   if (userexist && user.role ) {


   
       console.log(user.role)
       if(!user.role ){
        navigate(-1)
       }
   
   }else if(!userexist ){
      console.log('exit')
      navigate(-1)
     
   }}

  },[  skipCount, user])


  const [istabLoading, setistabLoading] = useState(false)
  
 


    useEffect(async () => {
   window.scrollTo(0, 0);
    if (userexist) {
      if (user.length !== 0) {

        if (selectedTab === 'contributionrequest') {
          dispatch(getcontributedBook({ page: page, status: selectedOptions.value }))
          setpageloading(false)
        
        }
     
      }
    } else {
   
    }

        if(selectedTab !== 'contribute'){
          setbgactive(false)
          
         }else{
          setbgactive(true)
         }

  }, [page, selectedOptions, selectedTab, user, istabLoading === true])

useEffect(() => {
    
  if(getcontributedbook){
    setPages(getcontributedbook.pages)
  }
    


  }, [getcontributedbook])





  const [typeOptions, setTypeOptions] = useState();
  const [genreOptions, setGenreOptions] = useState();
  const [seriesOptions, setSeriesOptions] = useState();
  const [formOptions, setFormOptions] = useState();
  const [imgData, setImgData] = useState();

 const [inputVal, setInputVal] =useState("")
  const inputRef = useRef(null)



  const handleInputHeight = () => {
const scrollHeight = inputRef.current.scrollHeight;
inputRef.current.style.height = scrollHeight + "px";
 };

 const handleInputChange = () => {
  handleInputHeight()
 }







 const makeLabels = (values) => {
    let options = [];
    // MAKE A LABEL FOR EACH GENRE VALUE
    values.forEach(value => {

      let label = value.split('_');
      let formattedLabel = [];
      //FORMAT LABEL INTO PROPER UPPERCASE AND CHANGE _ TO SPACE
      label.forEach(word => {
        formattedLabel.push(word.charAt(0).toUpperCase() + word.slice(1))
      })

      options = [...options, { value: value, label: formattedLabel.join(' ') }];

    })

    return options;
  }


  const [isActive, setActive] = useState(false);

  const onClickOutsideListener = () => {
    setActive(!isActive);
    setActive(false)
    document.removeEventListener("click", onClickOutsideListener)
  }




  useEffect(async () => {
    window.scrollTo(0, 0);
    console.log('whyreq')
    const { genres, types, forms, series, author } = await bookService.getUniqueFields();
    const isSuccess = localStorage.getItem('isCreated');
    setGenreOptions(makeLabels(genres));
    setSeriesOptions(makeLabels(series));
    setTypeOptions(makeLabels(types));
    setFormOptions(makeLabels(forms));
    setAuthorOptions(makeLabels(author))

    if (isSuccess === 'true') {
      toast.success('Book sent for approval');
      localStorage.removeItem('isCreated');
    }
  },[])



  const onChangePicture = e => {
     

    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };


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


  const resetpicture = ()=>{
       setImgData(null);

  }


 const resetfileData = () =>{
    
    document.getElementById("inputfile").value=null; 
  }

 const cancelborrowreq = (id) =>{
    setistabLoading(true)

    var decoded = jwt_decode(user.accessToken);
    var now = new Date();
    var time = now.getTime();
    var exp = new Date((decoded.exp * 1000) - (5 * 1000));

    if (time > exp) {

      dispatch(getUser()).then((response) => {
        if (response.payload.accessToken) {
          dispatch(managecancelreq(id)).then((res)=>{
            if(res){
              setistabLoading(false)
            }
          })
        }
      });

    } else {

      dispatch(managecancelreq(id)).then((res)=>{
            if(res){
              setistabLoading(false)
            }
          })
      
    }


 }


  const inputRef2 = useRef(null)

  const onFormSubmit = (event) => {

    setbuttonloading(true)
    event.preventDefault();
    let form = new FormData(event.target);
    bookService.contributeBook(form)
        .then(res => {
        if(res){
          toast.success('Book sent for approval');
          setbuttonloading(false)
          document.getElementById("addbookform").reset();
       
      }})
      .catch(err => {
         setbuttonloading(false)
        toast.error(err.message);
      })

  }


 


   const tabClicked = (tabstatus) =>{
          setPage(1)
         if(tabstatus === 'contributionrequest'){
        

         }
         setSelectedTab(tabstatus); 

   
    

   }
  useEffect(()=>{
    setPage(1)

  },[selectedOptions])
  useEffect(()=>{
     
         if(selectedTab !== 'contribute'){
          setbgactive(false)
          
         }else{
          setbgactive(true)
         }
     window.history.replaceState(null, null, `?tab=${selectedTab}&page=${ page}&option=${selectedOptions.value}`);
     console.log(options)
 
  },[page,selectedTab,selectedOptions])

  const [modalIsOpen, setIsOpen] = React.useState({ open: false, selectedBook: null });
   function openModal(i) {
    setIsOpen({ open: true, selectedBook: i });
  }
  function closeModal() {
    setIsOpen({ open: false, selectedBook: null });
  }
  

  return (

    
  

      <div className='relative  flex minheightset '>
             <Modal
                isOpen={modalIsOpen.open}
                shouldCloseOnOverlayClick={true}
                onRequestClose={closeModal}
                className={"seecontribute "}
                contentLabel="More details Modal"
              >
                {!isLoading ? (modalIsOpen.selectedBook !== null ?
                
                  < div className="flex flex-col relative ">
                    <button className='closeModal' onClick={closeModal}><   IoCloseSharp color="white" /></button>
                    <div className="flex flex flex-row grid grid-cols-12 w-full gap-3 tablet:px-3 phone:px-2 py-3" >
                    <div className="contimage  tablet:col-span-3 phone:col-span-12">
                      <div className="contrcontimg ">
                            <img className=" imagecontcont" src={getcontributedbook.bookquery[modalIsOpen.selectedBook].imgUri ? getcontributedbook.bookquery[modalIsOpen.selectedBook].imgUri : require('.//style/images/placeholder_book1.png')}/>
                   
                      </div>
                    </div>
                    <div className="conttitle tablet:col-span-9 phone:col-span-12">
                      <h4 className='text-white tablet:mr-8 phone:mr-0 mt-2' >Book Title:<span className='makethisbold text-white mx-2'> &nbsp;{getcontributedbook.bookquery[modalIsOpen.selectedBook].title}</span> </h4>
                      <h4 className='text-white mt-2' >Author: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].author.toString()} &nbsp;</span></h4>
                      <h4 className='text-white mt-2' >Genre: <span className='makethisbold text-white mx-2'>{
                      getcontributedbook.bookquery[modalIsOpen.selectedBook].genre.map(openbook => (
                          <div className='genrecircle inline-flex' key={openbook}> <a className='openbookgenre pr-0.5 mb-2 ' key={openbook}><span className='px-1 '>{openbook}</span></a></div>
                        ))  
                     }</span>
                     </h4>
                     <h4 className='text-white mt-1' >Description: <span className='makethisbold text-white mx-2 threelines'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].description} &nbsp;</span></h4>
                     <h4 className='text-white mt-1 ' >Series: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].series} &nbsp;</span></h4>
                     <h4 className='text-white  mt-1' >Volume: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].volume} &nbsp;</span></h4>
                     <h4 className='text-white  mt-1' >Edition: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].edition} &nbsp;</span></h4>
                 
                 
                    </div>
       

                    </div>
                    <div className=" tablet:px-3 phone:px-2 py-3 contmredetails flex grid tablet:grid-cols-2 phone:grid-cols-1 mt-4 pt-2">
                     <h4 className='text-white  mt-1' >Material Type: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].type} &nbsp;</span></h4>
                         <h4 className='text-white  mt-1' >Literary Form: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].form} &nbsp;</span></h4>
                         <h4 className='text-white  mt-1' >Publisher: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].publisher} &nbsp;</span></h4>
                         <h4 className='text-white  mt-1' >Copyright Date: <span className='makethisbold text-white mx-2'>{new Date(getcontributedbook.bookquery[modalIsOpen.selectedBook].copyrightDate).getFullYear()} &nbsp;</span></h4>
                         <h4 className='text-white  mt-1' >Publication Date: <span className='makethisbold text-white mx-2'>{new Date(getcontributedbook.bookquery[modalIsOpen.selectedBook].dateOfPublication).getFullYear()} &nbsp;</span></h4>
                          <h4 className='text-white  mt-1' >ISBN: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].isbn} &nbsp;</span></h4>
                          <h4 className='text-white  mt-1' >Call Number: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].callNumber} &nbsp;</span></h4>
                           <h4 className='text-white  mt-1' >No of Copies: <span className='makethisbold text-white mx-2'>{getcontributedbook.bookquery[modalIsOpen.selectedBook].noOfCopies} &nbsp;</span></h4> 
                   </div>
                    <div className=" tablet:px-3 phone:px-2 py-3 contmredetails flex grid grid-cols-1 mt-4 pt-2">
     
                      <h4 className='text-white  mt-1' >Digital Copy: <span className='makethisbold text-white mx-2'><a href={getcontributedbook.bookquery[modalIsOpen.selectedBook].digitalCopyPublic} target="_blank">  &nbsp;{getcontributedbook.bookquery[modalIsOpen.selectedBook].digitalCopyPublic}</a> &nbsp;</span></h4> 
                      <h4 className='text-white  mt-1' >Link: <span className='makethisbold text-white mx-2'><a href={getcontributedbook.bookquery[modalIsOpen.selectedBook].linkurl} target="_blank" >  &nbsp; {getcontributedbook.bookquery[modalIsOpen.selectedBook].linkurl}</a> </span></h4> 
                    </div>

                  

                  </div>:
                  <p className=' laptop:col-span-2 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p>) : null}
             
             
              </Modal>
        <div className={'w-full pb-32 bookdetailcontainer  '}>
             

                 <div className={'absolute parentabsoluter' + (bgactive? ' flex' : 'hidden')}>
              
                 <div className={'absolute ' + (imgData? 'blurcontainer' : 'blurcontainer2 ') } style={{ backgroundImage: 'url(' + `${imgData?imgData:''  }` + ')'}} > </div>   
                
                 </div>
         
          <TabPanel hidden={selectedTab !== 'contribute'}>
            
          <form id='addbookform' onSubmit={onFormSubmit} encType="multipart/form-data">
            <div className='maxwidthopen  flex-row flex  grid grid-cols-12 self-center desktop:px-1'>
             <div className="flex flex-col col-span-12 desktop:col-span-9 tablet:col-span-12 ">
             <div className="w-full flex flex-row my-6 phone:px-0 tabletlg:px-0.5 btnparent">
           
                <TabSelector
           
                  isActive={selectedTab === 'contribute'}
                  onClick={(e) => { 
                     e.preventDefault();;
                     tabClicked('contribute')}}
                > <a className="addbookbtn py-1 px-3" style={{backgroundColor:'#8e292c'}}>
                  Contribute a Book </a>
                </TabSelector>
                <TabSelector
   
        

                  isActive={selectedTab === 'contributionrequest'}
                  onClick={(e) => {
                    e.preventDefault();
                    tabClicked('contributionrequest')}}
                > <a className="addbookbtn py-1 px-3" >
                   Contribution requests </a>
                </TabSelector>
     




           
              
              
             </div>
             <div className="flex w-full flex-row grid grid-cols-12">
              <div className='bookimge justify-start laptop:my-1 phone:my-0 flex flex-col items-center flex-wrap pb-6 pt-2 tablet:py-6 desktop:py-3  col-span-12 desktop:col-span-3 tablet:col-span-4 ' >
                <img className='openbookimage self-center' src={imgData? imgData: require('.//style/images/placeholder_book1.jpg')} alt="No Image Preview" style={{width:'unset'}} />

                <div className='inputfilebtn mt-2 self-center'>
                  <label className='inputfilebtnbtn' htmlFor="formId">

                    <input name="book_img" onChange={onChangePicture} className='' type="file" accept="image/*" id="formId" hidden />

                    <p className='flex flex-row items-center gap-2'><FaFileImage />Select File</p>

                  </label>
                </div>
               <p className='inputfilebtn mt-2 self-center' onClick={resetpicture }>Reset Image</p>
       

              </div>
              <div className='titledescription laptop:my-1 phone:my-0 pb-10 tablet:py-4 desktop:py-3 col-span-12 desktop:col-span-9 tablet:col-span-8  tablet:px-6 phone:px-1'>

                <div className="form-groupaddbook flex flex-col ">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>Title:</label>
                  <input type="text" name="title" required />
                </div>
                <div className="form-groupaddbook mt-2 flex flex-col ">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>Author: </label>
                      <Creatable
                    isClearable
                    options={authorOptions}
                    isMulti
                    classNamePrefix="materialtype"
                    styles={customStyles2}
                    name="author"
                    required
                  />
                </div>
                <div className="form-groupaddbook mt-2 flex flex-col ">
                  <label className='addbooklabel'>Genre: </label>
                  <Creatable
                    isClearable
                    options={genreOptions}
                    isMulti
                    classNamePrefix="materialtype"
                    styles={customStyles2}
                    name="genre"
                  />
                </div>
                <div className="form-groupaddbook mt-2 mb-3 flex flex-col ">
                  <label className='addbooklabel'>Description:</label>
                  <textarea rows="1" 
                  name="description" 
                  className='textareadesc' 
                    ref={inputRef} 
                  onChange={handleInputChange}   
                   onKeyDown={(e) => { if (e.key === "Enter") {
            handleInputHeight(e);
            inputRef.current.style.height = "40px";
          
          }
        }}
                  />
                </div>

                <div className="form-groupaddbook mt-2 mb-3 flex flex-col ">
                  <label className='addbooklabel'>Series:</label>
                  <Creatable
                    name="series"
                    isClearable
                    options={seriesOptions}
                    classNamePrefix="materialtype"
                    styles={customStyles2}
                  />
                </div>

                <div className="form-groupaddbook mt-2  w-full grid grid-cols-2 gap-2">
                  <div>
                    <label className='addbooklabel'><span style={{ color: 'red' }}></span>Volume: </label>
                    <input type="number" name="volume" className="form-control my-1  w-full" autoComplete="off" ></input>
                  </div>
                  <div>
                    <label className='addbooklabel'><span style={{ color: 'red' }}></span>Edition: </label>
                    <input type="number" name="edition" className="form-control my-1  w-full" autoComplete="off" ></input>
                  </div>
                </div>

             

                 <div className="flex flex-row align-center mt-2">
                  <p className="flex items-center items-center my-1 delfilebtn px-1" onClick={ resetfileData}>X</p>
                  <input id="inputfile"  name="digitalCopy" type="file" className="form-control my-1" accept=".pdf" autoComplete="off"></input>
                 </div>
                 <div>
                      <p><span className='openbookclassname'>or add link of file: &nbsp; </span>	</p>
                      <input name="linkurl" className="infoaddbook" type='text'></input>
                 </div>
                <div className="mt-3 flex items-center desktop:flex phone:hidden flex-col">
                           {!buttonloading?
 
                                           <button type="submit" className="form-control my-1 addbooksubmit py-2 desktop:px-16 phone:px-8  mx-1"> Request Approval</button>
                                :<div className="form-control my-1 addbooksubmit py-2 desktop:px-16 phone:px-8  mx-1 flex items-center justify-center p-2" >&nbsp;<ButtonSpinner/></div>
                          }
       
                </div>
              </div>
             </div>
             </div>


              <div className='moredetails py-4 tablet:py-6 desktop:py-8  desktop:col-span-3  phone:col-span-12 flex flex-col desktop:items-center'>
                <div className='flex flex-col laptop:my-8 phone:my-0 px-1 desktop:px-0'>

                  <div className="w-full grid grid-row-2 desktop:grid-cols-1 laptop:grid-cols-1 tabletlg:grid-cols-2 tablet:grid-cols-2 phone:grid-cols-1 phone:gap-1 tablet:gap-1 tabletlg:gap-2">

                    <div className="">
                      <p><span className='openbookclassname'>Material type: &nbsp; </span></p>
                      <Creatable
                        name="type"
                        isClearable
                        options={typeOptions}
                        classNamePrefix="materialtype"
                        styles={customStyles}
                      />
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Literary Form: &nbsp; </span> </p>
                      <Creatable
                        name="form"
                        isClearable
                        options={formOptions}
                        classNamePrefix="materialtype"
                        styles={customStyles}
                      />
                    </div>
                    <div className="">
                      <p><span className='openbookclassname'><span style={{ color: 'red' }}></span>Publisher: &nbsp; </span>	</p>
                      <input name="publisher" className="infoaddbook" type='text' ></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Publication Date: &nbsp; </span>	</p>
                      <input name="dateOfPublication" className="infoaddbook w-full" type='date'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Publication Place: &nbsp; </span>	</p>
                      <input name="placeOfPublication" className="infoaddbook" type='text'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Copyright Date: &nbsp; </span>	</p>
                      <input name="copyrightDate" className="infoaddbook w-full" type='date'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>ISBN: &nbsp; </span>	</p>
                      <input name="isbn" className="infoaddbook" placeholder="(978/979)-xxxxx-xxxxxxx-xxxxxx-x" type='text'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>DOI: &nbsp; </span>	</p>
                      <input name="doi" className="infoaddbook" type='text'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Call number: &nbsp; </span>	</p>
                      <input name="callNumber" className="infoaddbook" type='text'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Number of Copies: &nbsp; </span>	</p>
                      <input name="noOfCopies" className="infoaddbook" type='number'></input>
                    </div>
                    <div className="mt-3 flex items-center phone:flex desktop:hidden flex-col">
                           {!buttonloading?
 
                                 <button type="submit" className="form-control my-1 addbooksubmit py-1 desktop:px-16 phone:px-8  mx-1"> Request Approval</button>
                                :<div className="form-control my-1 addbooksubmit py-1 desktop:px-16 phone:px-8  mx-1 flex items-center justify-center p-2" >&nbsp;<ButtonSpinner/></div>
                          }
                   </div>
                  </div>
                </div>
              </div>

            </div>
          </form>
          </TabPanel>
        
           <TabPanel hidden={selectedTab !== 'contributionrequest'}>
          
            <div className='maxwidthopen  flex-row flex  grid grid-cols-12 self-center desktop:px-1'>
             <div className="flex flex-col col-span-12 desktop:col-span-12 tablet:col-span-12 w-full">
             <div className="w-full flex flex-row my-6 phone:px-0  tabletlg:px-0.5 btnparent">
               <TabSelector
                  isActive={selectedTab === 'contribute'}
                  onClick={(e) => {
                     e.preventDefault();;
                    tabClicked('contribute')}}
                > <a className="addbookbtn py-1 px-3" >
                  Contribute a Book </a>
                </TabSelector>
                <TabSelector
                  isActive={selectedTab === 'contributionrequest'}
                  onClick={(e) => {
                     e.preventDefault();
                    tabClicked('contributionrequest')}}
                > <a className="addbookbtn py-1 px-3" style={{backgroundColor:'#8e292c'}}>
                  Contribution requests </a>
                </TabSelector>
         </div>
            <div className='flex bg-transparent optionborrow text-black w-full justify-between  pb-2 pr-1'>
             {!isLoading?<> <p className='bg-transparent  text-white px-1 resulttext'>No of Results: {!isLoading && getcontributedbook?.total }</p> 
              <Select options={options} value={selectedOptions} styles={customStyles} onChange={handleChange} menuPortalTarget={document.querySelector('body')} /></>:<> <p className='bg-transparent  text-white px-1 resulttext'>No of Results: ...loading</p> <Select   styles={customStyles} onChange={handleChange} menuPortalTarget={document.querySelector('body')} /></>} 
            </div>
               

                <div className='phone:mx-0.5 mt-2 laptop:mx-0  grid laptop:grid-cols-2 tabletlg:grid-cols-1 tablet:grid-cols-1 tablet:gap-3 phone:gap-2 '>

                    {
                    !istabLoading  ? (
                      getcontributedbook?.bookquery.length ?
                        (getcontributedbook?.bookquery.map((getborrowedbook, i) => (


                          <Link to={getborrowedbook.status === 'approved' ? `/openbook/${getborrowedbook.idlink}`:`/contribute?tab=${selectedTab}&page=${ page}&option=${selectedOptions.value}`} key={getborrowedbook._id}>
                          <div className='bookmarkcontainer text-white flex flex-row px-2  relative w-100' style={{backgroundColor:'#2a2c31'}}   key={getborrowedbook._id}>


                            <div className='bookmarksimgcont relative  my-3' style={{ zIndex: "2" }}>
                          
                                <img className=" " src={getborrowedbook.imgUri ? getborrowedbook.imgUri : require('.//style/images/placeholder_book1.jpg')} alt={getborrowedbook.bookTitle} />
                           
                            </div>

                            <div className=' relative removeshadow text-white flex flex-col pl-1 w-100' style={{ zIndex: "2" }}>
                              <div className='statusbar w-full flex  flex-row-reverse w-100'>

                                {getborrowedbook.status === 'pending' ?
                                  <>  
                                  
                                  <div className='relative  declinedbtn'  >
                                    <h5 className=' stattext flex mx-3 flex-1  absolute' >Pending</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </div>

                                    <div className='relative   declinebtn2' onClick={() => (cancelborrowreq(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute'  >cancel</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div></> : null
                                }
                                  {getborrowedbook.status === 'cancelled' ?
                                  <>  
                                  <div className='relative declinedbtn'  >
                                    <h5 className=' stattext flex mx-3 flex-1  absolute' >Cancelled</h5>
                                    <svg className='' width="150" height="25">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                    </svg>
                                  </div>
                                    <div className='relative   declinebtn2' onClick={() => (cancelborrowreq(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute'  >delete</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>

                                  </> : null
                                }
                                {getborrowedbook.status === 'approved' ?
                                  <>
                                    <div className='relative acceptbtn' >
                                      <h5 className=' stattext flex mx-3 flex-1  absolute' >Approved</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" stroke="#202125" />
                                      </svg>
                                    </div>
                              
                                  </> : null
                                }
                        
                                {getborrowedbook.status === 'declined' ?
                                  <>   <div className='relative declinedbtn'>
                                    <h5 className=' stattext flex px-3 flex-1  absolute'>{getborrowedbook.status}</h5>
                                    <svg width="150" height="24">
                                      <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 105 V 0" fill={getborrowedbook.status === 'pending' || getborrowedbook.status === 'declined' ? "#A43033" : "#3da450"} stroke="none" />

                                    </svg>

                                  </div>
                                    <div className='relative   declinebtn2' onClick={() => (cancelborrowreq(getborrowedbook._id))}  >
                                      <h5 className=' stattext flex mx-2 flex-1  absolute'  >delete</h5>
                                      <svg className='' width="150" height="25">
                                        <path d="m 1 0 c 6 2 24 -1 30 11 c 3 5 5 13 13 13 h 106 C 143 21 143 18 140 12 C 133 0 127 2 109 -1" stroke="#202125" />
                                      </svg>
                                    </div>
                               
                                  </> : null
                                }


                              </div>
                              <span className='mt-1' onClick={() =>{
                              if(getborrowedbook.status === 'approved')
                              {
                             
         
                              }else{
                                (openModal(i))
                              }
                                
                                
                                
                                
                                }} >
                                <h4 className='removeunderline mb-1'>{getborrowedbook.title}</h4>

                                <h6  ><span className='makethisbold mr-2'>Contributer Name:</span> {getborrowedbook.contributerFName} &nbsp; {getborrowedbook.contributerLName}</h6>
                                <h6 ><span className='makethisbold mr-2'>Date requested:</span>{new Date(getborrowedbook.dateRequested).toISOString().split('T')[0].replace(/-/g, '/')}</h6>
                                <h6 ><span className='makethisbold mr-2'>Status:</span>  {getborrowedbook.status} </h6>
                              </span>

                            </div>


                          </div>
                          </Link>


                        ))) :
                        <p className=' laptop:col-span-2 bg-zinc-900 phone:col-span-1 nodata px-3 pt-3 pb-10'>no data available</p>
                    ) : (<p className=' laptop:col-span-2 bg-zinc-900 phone:col-span-1 nodata px-3 pt-3 pb-10'>Loading...</p>)

                  }
                </div>
                {!pageloading ?
                  <Pagination page={page} pages={pages} changePage={setPage} /> : null
                }
           
     


 
              
        
       
             </div>



            </div>
         
          </TabPanel>
        </div>

      </div>




  
  )

};

export default Contribute;
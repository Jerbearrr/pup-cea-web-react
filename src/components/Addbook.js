import React, { useState, useCallback, useRef, useEffect } from "react";
import { FaChevronDown, FaFileImage, FaSearch } from "react-icons/fa";
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/openbook.css";
import "./style/addbook.css";
import Creatable from 'react-select/creatable';
import bookService from '../features/book/bookService';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser, reset, logoutUser } from "../features/auth/authSlice";
import Menu from "./Menu";
import { useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline} from "react-icons/io"
import { IoCloseSharp} from "react-icons/io5"
import { FaUserCircle } from "react-icons/fa";
import { useTabs, TabPanel } from "react-headless-tabs"
import { TabSelector } from './TabSelector';
import jwt_decode from "jwt-decode";
import { apiClientBook } from "../features/auth/requests";
import { isFulfilled } from "@reduxjs/toolkit";
import Modal from 'react-modal';
import ButtonSpinner from './ButtonSpinner';
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
    maxWidth: '250px',


  }),
  valueContainer: (provided, state) => ({
    ...provided,
    height: '30px',
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
    height: '30px',
    maxWidth: '270px',
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


const Addbook = () => {
    const { user, isSuccess } = useSelector(state => state.auth);
  const [skipCount, setSkipCount] = useState(true);
 const navigate = useNavigate();
  const [buttonloading, setbuttonloading]= useState(false)

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);


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
      console.log('skipcountnt')
       console.log(user.role)
       if(user.role !== 'b521c'){
        navigate(-1)
       }
   
   }else if(!userexist ){
      navigate(-1)
     
   }}

  },[  skipCount, user])

  const [typeOptions, setTypeOptions] = useState();
  const [genreOptions, setGenreOptions] = useState();
  const [seriesOptions, setSeriesOptions] = useState();
  const [formOptions, setFormOptions] = useState();
  const [imgData, setImgData] = useState(require('.//style/images/placeholder_book1.png'));
  const [editimgData, seteditImgData] = useState(require('.//style/images/placeholder_book1.png'));
  const inputRef = useRef(null);
  const dispatch = useDispatch();
 
  const [bookSearch, setbookSearch] = useState('');
  const [fetchedbook, setfetchbook]= useState('');
  const [searchloading, setsearchloading]=useState('');
  const [searchresultdiv , setsearchresultdiv]=useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(bookSearch);
  const [editbook, seteditBook] =useState(null);
  const [selecteditgenre, setselecteditgenre] = useState(null);
  const [selecteditseries, setselecteditseries] = useState(null);
  const [selecteditmaterial, setselecteditmaterial] = useState(null);
  const [selecteditform, setselecteditform] = useState(null);
  const [isimgnull, setisimgnull] = useState(false)
  const [isfilenull, setisfilenull] = useState(false)
  const [isfilenull2, setisfilenull2] = useState(false)

  
  const elementRef = useRef();

 const selectedgenreoptions = (genre) => {
 if(genre){
  let options = [];
    // MAKE A LABEL FOR EACH GENRE VALUE
    genre.forEach(value => {

      let label = value.split('_');
      let formattedLabel = [];
      //FORMAT LABEL INTO PROPER UPPERCASE AND CHANGE _ TO SPACE
      label.forEach(word => {
        formattedLabel.push(word.charAt(0).toUpperCase() + word.slice(1))
      })

      options = [...options, { value: value, label: formattedLabel.join(' ') }];

    })
    console.log(options)
    setselecteditgenre(options)
    return options;
}




}
 const selectedseriesoptions = (series) => {

 if(series){
 
    // MAKE A LABEL FOR EACH GENRE VALUE
    
    var labelcapitalize = series.charAt(0).toUpperCase() + series.slice(1);  
    var options ={ value: series, label: labelcapitalize };
    setselecteditseries(options)
    return options;
}else{
  setselecteditseries(null)
}

}

 const selectedmaterialoptions = (material) => {

 if(material){
 
    // MAKE A LABEL FOR EACH GENRE VALUE
    
    var labelcapitalize = material.charAt(0).toUpperCase() + material.slice(1);  
    var options ={ value: material, label: labelcapitalize };
    setselecteditmaterial(options)
    return options;
}else{
  setselecteditmaterial(null)
}

}

 const selectedformoptions = (item) => {

 if(item){
 
    // MAKE A LABEL FOR EACH GENRE VALUE
    
    var labelcapitalize = item.charAt(0).toUpperCase() + item.slice(1);  
    var options ={ value: item, label: labelcapitalize };
    setselecteditform(options)
    return options;
}else{
  setselecteditform(null)
}

}
 const divElement = elementRef.current;
  
  useEffect(() => {
        console.log(selecteditgenre)
        setsearchresultdiv(true)
         setsearchloading(true);
        const timer = setTimeout(() => setbookSearch(debouncedTerm), 1000);
        return () => clearTimeout(timer);
     
         
    }, [debouncedTerm])

 
  useEffect(() => {
     const getsearch = async()=>{
          
       const query =  await apiClientBook.get(`/getlivesearch?search=${bookSearch}`)
       console.log(query.data,'datasent') 
  
       setfetchbook(query.data) 
       setsearchloading(false);
       

     }
     
      if(bookSearch !== ''){

     
          console.log('pleasewait')
      
          
        getsearch() 
        
        
             
      }else{
        setsearchresultdiv(false)
      }
    }, [bookSearch]);

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




  const onLogout = () => {
    dispatch(logoutUser())
    dispatch(reset())
    navigate('/');
  }
  const [isActive, setActive] = useState(false);
  const toggleClass = () => {
    console.log(isActive)
    setActive(!isActive);
  };
  const onClickOutsideListener = () => {
    setActive(!isActive);
    setActive(false)
    document.removeEventListener("click", onClickOutsideListener)
  }

  const inputonClickOutsideListener = ()=>{
    document.removeEventListener("click", onClickOutsideListener)
    setsearchresultdiv(false)
  }


  useEffect(async () => {
    window.scrollTo(0, 0);
    console.log('whyreq')
    const { genres, types, forms, series } = await bookService.getUniqueFields();
  
    setGenreOptions(makeLabels(genres));
    setSeriesOptions(makeLabels(series));
    setTypeOptions(makeLabels(types));
    setFormOptions(makeLabels(forms));

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

const onChangeeditPicture = e => {
    
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        seteditImgData(reader.result);
        setImgData(reader.result);
        setisimgnull(false)
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    console.log(imgData)

  };
  
  const oneditfilechange = e =>{

    setisfilenull(false)
    setisfilenull2(false)
  }


  const resetpicture = ()=>{
       setImgData(null);

  }
  const reseteditData = ()=>{
     
        seteditImgData('');
        setImgData('');
        setisimgnull(true)
  
  }
  const reseteditfileData = () =>{
    
    document.getElementById("editinputfile").value=null; 
    setisfilenull(true)
  }
 const resetfileData = () =>{
    
    document.getElementById("inputfile").value=null; 
  }
  const [modalIsOpen, setIsOpen] = React.useState({ open: false });

  const openModal =()=> {
    console.log('sopen',modalIsOpen)
    setIsOpen({ open: true});
  }
  const closeModal =()=> {
    setIsOpen({ open: false });
  }
  const handleInputHeight = () => {
    const scrollHeight = inputRef.current.scrollHeight;
    inputRef.current.style.height = scrollHeight + "px";
  };

  const [inputVal2, setInputVal2] = useState("")
  const inputRef2 = useRef(null)

  const handleInputHeight2 = () => {
    const scrollHeight2 = inputRef2.current.scrollHeight;
    inputRef2.current.style.height = scrollHeight2 + "px";
  };
   
  const handleInputChange2 = () => {

  handleInputHeight2()
 }

 const handleInputChange = () => {

  handleInputHeight()
 }
  const onFormSubmit = (event) => {
    setbuttonloading(true)
    event.preventDefault();
    let form = new FormData(event.target);
    bookService.addBook(form)
      .then(res => {
        if(res){
          toast.success('Book Added Successfully');
          setbuttonloading(false)
          document.getElementById("addbookform").reset();
       
  }})
      .catch(err => {
        toast.error(err.message);
        setbuttonloading(false)
      })

  }
 const oneditFormSubmit = async(event) => {
     setbuttonloading(true)
    event.preventDefault();
    let form = new FormData(event.target);
    console.log(isimgnull)
   
    if(editbook?._id){
    const editedbook = await bookService.editBook(form).then(res => {
       if(res){
         console.log(res)
        toast.success('Book Edited Successfully');
        setbuttonloading(false)}
        
      })
      .catch(err => {
        toast.error(err.message);
        setbuttonloading(false)
     })

      return editedbook
     }else{
      toast.error('Please select a book first');
       setbuttonloading(false)
     }

  }
  const [deleteloading, setdeleteloading] = useState(false);
  const editdeletebook = async()=>{
    setbuttonloading(true)
    if(!deleteloading){
      
    if(editbook?._id){
      setdeleteloading(true)
      const editedbook = await bookService.editdeleteBook(editbook._id).then(res => {
       if(res){
         console.log(res)
         toast.success('Book Deleted Successfully');
         closeModal()

         setTimeout(() => {  setdeleteloading(false); }, 2000);
         setbuttonloading(false)
       
        }
       })
      .catch(err => {
        toast.error(err.message);
        setbuttonloading(false)
        setTimeout(() => {  setdeleteloading(false); }, 2000);
     })

      return editedbook
     }else{
      setbuttonloading(false)
       setTimeout(() => {  setdeleteloading(false); }, 2000);
      toast.error('Please select a book first');
     }

}


  }
  const [selectedTab, setSelectedTab] = useTabs([
    'addbook',
    'editbook',

  ]);

  useEffect(() => {

    window.scrollTo(0, 0);
    setSelectedTab(urlParams.get('tab') ?urlParams.get('tab'): 'addbook')


  }, [])

  const reseteditdata = () => { 
  
  document.getElementById("editform").reset();
  }    

   const tabClicked = (tabstatus) =>{ 
         setSelectedTab(tabstatus); 
   }

  useEffect(()=>{
     
     window.history.replaceState(null, null, `?tab=${selectedTab}`);
   
  },[selectedTab])

  if(user && user.role){
  return (
    <>

        <Modal
                isOpen={modalIsOpen.open}
                shouldCloseOnOverlayClick={true}
                onRequestClose={closeModal}
               
                 className={"editmodal"}

                contentLabel="More details Modal"
              >
                <>
                    <button className='closeModal' onClick={closeModal}><   IoCloseSharp color="white" /></button>
                    <div className='borrowermoredetailscont pt-5'>

                      
                      <h4 className='text-white mb-5 mt-5 ' ><span className='makethisbold '>Are you sure you want to delete this book?</span> </h4>
           

                      <h6 className='my-2 text-white  '><span className='makethisbold  my-4 text-emerald-400'>Title: &nbsp;</span> {editbook?.title}</h6>
                      <h6 className='my-2 text-white '><span className='makethisbold  my-4 text-emerald-400'>Author: &nbsp;</span> {editbook?.author}</h6>


                   <div className="mt-9 flex items-center  flex-row justify-center addformbtn flex-wrap gap-3">
                   <button type="button" className="form-control my-1 addbooksubmit py-1  phone:px-5  mx-1 text-white bg-red-600" onClick={closeModal} > No</button>
                   <button type="button" className="form-control my-1 addbooksubmit py-1  phone:px-5  mx-1 text-white bg-green-700 " onClick={editdeletebook}> Yes</button>
           
                 
                   </div>
                





                    </div></>


              </Modal>
   

      <div className='relative  flex '>
        <div className='w-full pb-12 bookdetailcontainer  '>
             

                 <div className='absolute parentabsoluter'>
              
                 <div className={'absolute ' + (imgData? 'blurcontainer' : 'blurcontainer2')} style={{ backgroundImage: 'url(' + `${imgData?imgData:require('.//style/images/placeholder_book1.png')  }` + ')'}} > </div>   
                
                 </div>
         
          <TabPanel hidden={selectedTab !== 'addbook'}>
          <form id='addbookform' onSubmit={onFormSubmit} encType="multipart/form-data">
            <div className='maxwidthopen  flex-row flex  grid grid-cols-12 self-center desktop:px-1'>
             <div className="flex flex-col col-span-12 desktop:col-span-9 tablet:col-span-12 ">
             <div className="w-full flex flex-row my-6 phone:px-1 tabletlg:px-0.5 btnparent">
           
                <TabSelector
                  isActive={selectedTab === 'addbook'}
                  onClick={(e) => {
                     e.preventDefault();
                    tabClicked('addbook')}}
                > <a className="addbookbtn py-1 px-3" style={{backgroundColor:'#8e292c'}}>
                  Add Book </a>
                </TabSelector>
                <TabSelector

                  type={"button"}
                  isActive={selectedTab === 'editbook'}
                  onClick={(e) => {

                    e.preventDefault();
                    tabClicked('editbook')}}
                >
                <a className="addbookbtn py-1 px-3 " > Edit Book </a>
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
                  <input name="author" type="text" style={customStyles2} required></input>
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
                  <textarea rows="1" name="description" 
                  className='textareadesc' 
                  onChange={handleInputChange2}
                  ref={inputRef2} onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleInputHeight2(e);
                      inputRef2.current.style.height = "40px";
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
               
                 <div className="flex flex-row mt-3 items-center">
                <label className="switch ">
                  <input type="checkbox" name='isprivate' defaultChecked={true}/>
                   <span className="slider round"></span>
                   
                </label> <p className="mx-2">Is file private?</p>
                </div>
                  <div className="form-groupaddbook flex flex-col mt-2 ">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>Alternative link:</label>
                  <input type="text" name="linkurl"  />
                </div>
                <div className="mt-3 flex items-center desktop:flex phone:hidden flex-col">
                    {!buttonloading?
 
                               <button type="submit" className="form-control my-1 addbooksubmit py-2 desktop:px-16 phone:px-8  mx-1"> Add Book</button>
                                :<div className="form-control my-1 addbooksubmit py-2 desktop:px-16 phone:px-8  mx-1 flex items-center justify-center " >&nbsp;<ButtonSpinner/></div>
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
 
                               <button type="submit" className="form-control my-1 addbooksubmit py-1 desktop:px-16 phone:px-8  mx-1"> Add Book</button>
                                :<div className="form-control my-1 addbooksubmit py-1 desktop:px-16 phone:px-8  mx-1 flex items-center justify-center " >&nbsp;<ButtonSpinner/></div>
                    }
                 </div>
                  </div>
                </div>
              </div>

            </div>
          </form>
          </TabPanel>
           <TabPanel hidden={selectedTab !== 'editbook'}>
          <form id="editform" onSubmit={oneditFormSubmit} autoComplete="off" encType="multipart/form-data">
            <div className='maxwidthopen  flex-row flex  grid grid-cols-12 self-center'>
             <div className="flex flex-col col-span-12 desktop:col-span-9 tablet:col-span-12 ">
             <div className="w-full flex flex-col my-6 phone:px-1 tabletlg:px-0.5 ">
      
             <div className="w-full flex flex-row btnparent">
                <TabSelector
                  isActive={selectedTab === 'addbook'}
                  onClick={(e) => {e.preventDefault(); tabClicked('addbook')}}
                > <a className="addbookbtn py-1 px-3" >
                  Add Book </a>
                </TabSelector>
                <TabSelector

                  isActive={selectedTab === 'editbook'}
                  onClick={(e) => {
                     e.preventDefault();
                    tabClicked('editbook')}}
                >
                <a className="addbookbtn py-1 px-3 " style={{backgroundColor:'#8e292c'}}> Edit Book </a>
                </TabSelector>
                
              </div>
               <div className="flex w-full flex-row grid grid-cols-12">
               <div className='  col-span-12 desktop:col-span-3 tablet:col-span-4 ' ></div>
               <div className='  col-span-12 desktop:col-span-9 tablet:col-span-8 tablet:px-5 phone:px-0 ' >
                  <div className="form-groupaddbook flex flex-col mt-4 ">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>Search book</label>
                  <input type="text" name="searchbook" ref={elementRef} onChange={e => setDebouncedTerm(e.target.value)}  onMouseLeave={() => {
                   document.addEventListener("click", inputonClickOutsideListener)
                  }}/>
                  <div className="relative" style={{display:'flex'}}>

                  <div className={`absolute searchresultbar `  + ( searchresultdiv ? 'block' : 'hidden') } >
                  
                  {searchloading?
                      <div className="resultcontainer w-full flex flex-row grid grid-cols-12 loadingcont" >
                           <div className="loading">
                            <div className="span1"></div>
                            <div className="span2"></div>
                            <div className="span3"></div>
                          </div>                 
                      </div>:

                  fetchedbook?.length > 0 ?
                 (fetchedbook.map((book,i) => (
                  
                     <div className="resultcontainer w-full flex flex-row grid grid-cols-12" key={book._id} 
                      onClick={async()=>{
                        reseteditdata();
                        seteditImgData(book.imgUri);
                        seteditBook(fetchedbook[i]); 
                        divElement.value = book.title;
                        selectedgenreoptions(book.genre && book.genre[0] !== ''? book.genre: '');
                        selectedseriesoptions(book.series);
                        selectedmaterialoptions(book.type);
                        selectedformoptions(book.form);
                        setImgData(book.imgUri);
                        setisimgnull(false)
                        setisfilenull(false)
                        setisfilenull2(false)
                  
                        
                        
                        }}>
                       <div className='  resultimgcont col-span-3 flex justify-center' >
                         <img className='resultimg self-center ' src={book.imgUri ? book.imgUri : require('.//style/images/placeholder_book1.png')} alt="No Image Preview" />
                       </div>
                       <div  className=' resultdetails relative col-span-9 ' >
                         <p className="resultdetailstitle ">{book.title}</p>
                         <p className="resultdetailsauthor mt-1">-{book.author}</p>
                       </div>                             
                      </div>

                    
                ))) :<p className="resultdetailstitle px-3 py-2">no results found</p>
                  
                  }
                  
      
 


                  </div>
                  
                  
                  </div>
                </div>


               </div>


               </div>
             </div>
             <div className="flex w-full flex-row grid grid-cols-12">
              <div className='bookimge justify-start laptop:my-1 phone:my-0 flex flex-col items-center flex-wrap pb-6 pt-2 tablet:py-6 desktop:py-3  col-span-12 desktop:col-span-3 tablet:col-span-4 ' >
                <img className='openbookimage self-center' src={editimgData? editimgData: require('.//style/images/placeholder_book1.png')} alt="No Image Preview" style={{width:'unset'}} />

                <div className='inputfilebtn mt-2 self-center'>
                  <label className='editinputfilebtnbtn' htmlFor="editbookimg">

                    <input id="editbookimg" name="editbook_img"   onChange={onChangeeditPicture} className=''  type="file" accept="image/*"  hidden />

                    <p className='flex flex-row items-center gap-2'><FaFileImage />Select File</p>
                   

                  </label>
                   
                </div>
                <p className='inputfilebtn mt-2 self-center' onClick={reseteditData}  >Reset Image</p>
              </div>
              <div className='titledescription laptop:my-1 phone:my-0 pb-10 tablet:py-4 desktop:py-3 col-span-12 desktop:col-span-9 tablet:col-span-8  tablet:px-6 phone:px-1'>
                
                <div className="form-groupaddbook flex flex-col hidden">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>Id:</label>
                  <input type="text" name="id"  defaultValue={editbook? editbook._id: ''} />
                </div>
                <div className="form-groupaddbook flex flex-col hidden">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>Id:</label>
                  <input type="text" name="digitalcopyinfile"  defaultValue={editbook? editbook.digitalCopy? editbook.digitalCopy: null: null } />
                </div>
                <div className="form-groupaddbook flex flex-col hidden">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>Id:</label>
                  <input type="text" name="publicdigitalcopyinfile"  defaultValue={editbook? editbook.digitalCopyPublic? editbook.digitalCopyPublic:null:null} />
                </div>
                <div className="form-groupaddbook flex flex-col hidden">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>isimgnull:</label>
                  <input type="text" name="isimgnull"  defaultValue={isimgnull} />
                </div>
                 <div className="form-groupaddbook flex flex-col hidden">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>isfilenull:</label>
                  <input type="text" name="isfilenull"  defaultValue={isfilenull} />
                </div>
                <div className="form-groupaddbook flex flex-col ">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>Title:</label>
                  <input type="text" name="title"  defaultValue={editbook? editbook.title: ''} required />
                </div>
                <div className="form-groupaddbook mt-2 flex flex-col ">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>Author: </label>
                  <input name="author" type="text" defaultValue={editbook? editbook.author: ''} style={customStyles2} required></input>
                </div>
                <div className="form-groupaddbook mt-2 flex flex-col ">
                  <label className='addbooklabel'>Genre: </label>
                  <Creatable
                    isClearable
                    options={genreOptions}

                     value={selecteditgenre}
                     onChange={(value) => {             
                     setselecteditgenre(value);
                     }}
                    isMulti
                    classNamePrefix="materialtype"
                    styles={customStyles2}
                    name="genre"
                    
               
                  />
                  
                </div>
                <div className="form-groupaddbook mt-2 mb-3 flex flex-col ">
                  <label className='addbooklabel'>Description:</label>
                  <textarea rows="1" name="description" className='textareadesc' defaultValue={editbook? editbook.description: ''} 
                  ref={inputRef} 
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleInputHeight(e);
                      inputRef.current.style.height = "40px";
                    }
                  }}
                  onChange={handleInputChange}
                
                  />
                </div>

                <div className="form-groupaddbook mt-2 mb-3 flex flex-col ">
                  <label className='addbooklabel'>Series:</label>
                  <Creatable
                    name="series"
                    isClearable
                    options={seriesOptions}
                    value={selecteditseries}
                    onChange={(value) => {             
                     setselecteditseries(value);
                    }}
                    classNamePrefix="materialtype"
                    styles={customStyles2}
                  
                  />
                </div>

                <div className="form-groupaddbook mt-2  w-full grid grid-cols-2 gap-2">
                  <div>
                    <label className='addbooklabel'><span style={{ color: 'red' }}></span>Volume: </label>
                    <input type="number"  defaultValue={editbook? editbook.volume: ''} name="volume" className="form-control my-1  w-full" autoComplete="off"></input>
                  </div>
                  <div>
                    <label className='addbooklabel'><span style={{ color: 'red' }}></span>Edition: </label>
                    <input type="number"  defaultValue={editbook? editbook.edition: ''} name="edition" className="form-control my-1  w-full" autoComplete="off" ></input>
                  </div>
                </div>

                <div className="mt-2 flex flex-col">
                  
                  
                  <label className='addbooklabel'>Digital Version: </label>
                  <div className="flex flex-row align-center">
                  <p className="flex items-center items-center my-1 delfilebtn px-1" onClick={ reseteditfileData}>X</p>
                  <input id="editinputfile" onChange={oneditfilechange}  name="editdigitalCopy" type="file" className="form-control my-1" accept=".pdf" autoComplete="off"></input>
                  </div>
                  { 
                    editbook && editbook.digitalCopy ?
                    <div className="flex flex-row ">   <p className="flex items-center items-center  delfilebtn px-1 " 
                     onClick={()=>{
                         
                       if( document.getElementById("editinputfile").files.length == 0 ){
                         setisfilenull(!isfilenull)
                         setisfilenull2(!isfilenull2)
                        }else{
                        setisfilenull2(!isfilenull2)
                        }
                        
                        
                        
                        }}>X</p>
                    
                    <p className={`${isfilenull2? 'hidden ': 'block py-1'}`} onClick={()=>window.open( `https://firebasestorage.googleapis.com/v0/b/pup-library-system-20553.appspot.com/o/${editbook.digitalCopy}?alt=media&token=70062270-30d2-4c35-9e1a-020470a712be`, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')}>Current File: <span className="spanfilename">https://firebasestorage.googleapis.com/v0/b/pup-library-system-20553.appspot.com/o/{editbook.digitalCopy}?alt=media&token=70062270-30d2-4c35-9e1a-020470a712be</span> </p>
                    </div>:
                     editbook && editbook.digitalCopyPublic ?
                        <div className="flex flex-row ">   <p className="flex items-center items-center  delfilebtn px-1 " 
                     onClick={()=>{
                         
                       if( document.getElementById("editinputfile").files.length == 0 ){
                         setisfilenull(!isfilenull)
                         setisfilenull2(!isfilenull2)
                        }else{
                        setisfilenull2(!isfilenull2)
                        }
                        
                        
                        
                        }}>X</p>
                    
                    <p className={`${isfilenull2? 'hidden ': 'block py-1'}`} onClick={()=>window.open( editbook.digitalCopyPublic, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')}>Current File: <span className="spanfilename">{editbook.digitalCopyPublic}</span> </p>
                    </div>: null


                    
                  }
                </div>

                <div className="flex flex-row mt-3 items-center">
                <label className="switch ">
                  <input type="checkbox" name='isprivate' defaultChecked={editbook && editbook.digitalCopy ? true:false}/>
                   <span className="slider round"></span>
                   
                </label> <p className="mx-2">Is file private?</p>
                </div>
                  <div className="form-groupaddbook flex flex-col mt-2 ">
                  <label className='addbooklabel'><span style={{ color: 'red' }}></span>Alternative link:</label>
                  <input type="text" name="linkurl"  defaultValue={editbook? editbook.linkurl: ''} />
                </div>
                <div className="mt-5 flex items-center laptop:flex phone:hidden flex-row justify-center addformbtn">
                                        {!buttonloading?
                                <>  
                                <button type="button" className="form-control my-1 addbooksubmit py-2 px-5  mx-2" onClick={() => {editbook?._id? setIsOpen({ open: true}):toast.error('Please select a book first')} }> Delete Book</button>
                   <button type="submit" className="form-control my-1 addbooksubmit py-2 px-8  mx-2"> Edit Book</button></>
 
                              
                                :<div className="form-control my-1 addbooksubmit py-2 px-8  mx-2 flex items-center justify-center " >&nbsp;<ButtonSpinner/></div>
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
                         value={selecteditmaterial}
                         onChange={(value) => {             
                         setselecteditmaterial(value);
                         }}
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
                         value={selecteditform}
                         onChange={(value) => {             
                         setselecteditform(value);
                         }}
                        classNamePrefix="materialtype"
                        styles={customStyles}
                      />
                    </div>
                    <div className="">
                      <p><span className='openbookclassname'><span style={{ color: 'red' }}></span>Publisher: &nbsp; </span>	</p>
                      <input name="publisher" defaultValue={editbook? editbook.publisher: ''} className="infoaddbook" type='text' ></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Publication Date: &nbsp; </span>	</p>
                      <input name="dateOfPublication" defaultValue={editbook && editbook?.dateOfPublication !== null ? new Date(editbook.dateOfPublication).toLocaleDateString('en-CA'): ''} className="infoaddbook w-full" type='date'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Publication Place: &nbsp; </span>	</p>
                      <input name="placeOfPublication" defaultValue={editbook ? editbook.placeOfPublication: ''} className="infoaddbook" type='text'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Copyright Date: &nbsp; </span>	</p>
                      <input name="copyrightDate" defaultValue={editbook && editbook?.copyrightDate !== null? new Date(editbook.copyrightDate).toLocaleDateString('en-CA'): ''}  className="infoaddbook w-full" type='date'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>ISBN: &nbsp; </span>	</p>
                      <input name="isbn" className="infoaddbook" defaultValue={editbook? editbook.isbn: ''} placeholder="(978/979)-xxxxx-xxxxxxx-xxxxxx-x" type='text'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>DOI: &nbsp; </span>	</p>
                      <input name="doi" className="infoaddbook" defaultValue={editbook? editbook.doi: ''} type='text'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Call number: &nbsp; </span>	</p>
                      <input name="callNumber" defaultValue={editbook? editbook.callNumber: ''} className="infoaddbook" type='text'></input>
                    </div>
                    <div>
                      <p><span className='openbookclassname'>Number of Copies: &nbsp; </span>	</p>
                      <input name="noOfCopies" defaultValue={editbook? editbook.noOfCopies: ''} className="infoaddbook" type='number'></input>
                    </div>
                        <div className="mt-5 flex items-center laptop:hidden phone:flex flex-row justify-center addformbtn flex-wrap">
                                {!buttonloading?
                                <>    <button type="button" className="form-control my-1 addbooksubmit py-1  phone:px-5  mx-1" onClick={() => {editbook?._id? setIsOpen({ open: true}):toast.error('Please select a book first')} }> Delete Book</button>
                             <button type="submit" className="form-control my-1 addbooksubmit py-1  phone:px-8  mx-1"> Edit Book</button></>
 
                              
                                :<div className="form-control my-1 addbooksubmit py-1  phone:px-5  mx-1 flex items-center justify-center " >&nbsp;<ButtonSpinner/></div>
                    }
               
           
                 
                </div>
                  </div>
                </div>
              </div>

            </div>
          </form>
          </TabPanel>
        </div>

      </div>




    </>
  );}else{
    return(null)
  }

};

export default Addbook;
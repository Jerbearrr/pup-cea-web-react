import React, { useState, Suspense, useRef, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/bookmarks.css";
import "./style/advancedsearch.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Footer";
import 'flowbite';
import Creatable from 'react-select/creatable';
import bookService from '../features/book/bookService';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import Scrolltotopbutton from './Scrolltotopbutton';
const SearchResults = React.lazy(() => import('./SearchResults'));

const Advancedsearch = () => {
  let params;

  const [genreOptions, setGenreOptions] = useState([]);
  const [formOptions, setFormOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [searchParams, setsearchparams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState();
  const [isLoading, setIsLoading] = useState(null);
  const [isloaded, setisloaded] = useState(true)


  const getDefaultGenres = () => {
    const selectedGenres = searchParams.getAll('genre');
    let defaultValues = [];
    selectedGenres.forEach(genre => {
      defaultValues.push({ value: genre })
    })

    return defaultValues;
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

  const sortOptions = [
    { label: 'Default', value: '0' },
    { label: 'Publish Date: Ascending', value: '1' },
    { label: 'Publish Date: Descending', value: '2' },
    { label: 'Acquisition Date: Ascending', value: '3' },
    { label: 'Acquisition Date: Descending', value: '4' },
  ];

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
  const customStyles3 = {
    control: (base, state) => ({
      ...base,
      /*border: state.isFocused ? 0 : 0,
      // This line disable the blue border
      boxShadow: state.isFocused ? 0 : 0,
      '&:hover': {
        border: state.isFocused ? 0 : 0
      }*/
      backgroundColor: 'none',
      margin: '0',
      width: '100%',
      border: 'none!important',

      color: '#f25459!important',
      boxShadow: 'none',
      minHeight: '0'



    }),
    valueContainer: (provided, state) => ({
      ...provided,
      padding: '0 5px',
      color: '#f25459',
    }),

    input: (provided, state) => ({
      ...provided,
      margin: '0px',
      color: '#f25459',
      padding: '0',
      fontSize: '0.8rem',


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
      padding: '0',
      boxShadow: 'none',
      border: '1px solid #43454c ',
      margin: '0',
      maxHeight: '8rem',


    }),
    menu: (base) => ({
      ...base,
      width: "100%!important",
      minWidth: "100%",
      margin: '0',


    }),
    option: styles => ({
      ...styles,

      lineHeight: '15px',
      fontSize: '0.8rem',
      backgroundColor: '#202125',
      color: '#f25459',
      zIndex: '99',
      margin: '0',
      padding: '4px',



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
    menu: (base) => ({
      ...base,
      width: "100%!important",
      minWidth: "100%"
    }),
    option: styles => ({
      ...styles,

      lineHeight: '20px',

    })

  }

  useEffect(async () => {
    setisloaded(true)
    setIsLoading(true);
    window.scrollTo(0, 0);
    // GET ALL UNIQUE GENRES FROM DATABASE
    let { genres, types, forms } = await bookService.getUniqueFields();

    console.log(searchParams.getAll('genre'));

    setGenreOptions(makeLabels(genres));
    setFormOptions(makeLabels(forms));
    setTypeOptions(makeLabels(types));


    // CONVERT URLSEARCHPARAMS TO OBJECT
  }, [])

  const [ispageLoading, setpageLoading] = useState(false);

  useEffect(() => {

    for (var entry of searchParams.entries()) {
      const [key, value] = entry;
      console.log(key, value);

      // ADD ALL VALUES TO KEYS EXCEPT THE GENRE PARAMS
      if (key !== 'genre' && value !== '') {
        params = {
          ...params,
          [key]: value
        }
      }
    }

    // INSERT GENRE ARRAY TO SEARCHQUERY OBJECT IF NOT BLANK
    if (searchParams.getAll('genre').length > 0) {
      params = {
        ...params,
        'genre': searchParams.getAll('genre')
      }
    }

    setSearchQuery(params)

    setisloaded(false)
    setIsLoading(false);
    setpageLoading(false)

    console.log(searchQuery, searchParams)
    console.log(searchParams.getAll('genre'));

  }, [ispageLoading])




  const advsubmit = (e) => {

    e.preventDefault();
    var formData = new FormData(document.getElementById("Advancedform"))
    const data = [...formData.entries()];
    const asString = data
      .map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
      .join('&');
    console.log(asString);
    window.history.replaceState(null, null, `advancedsearch?${asString}`);
    setsearchparams(asString)

    setpageLoading(true)




  }


  return (
    <>
      <div className='advancedsearchcont relative ' style={{ backgroundColor: '#070708' }}>
        <div className={!isloaded ? '' : 'hidden'}><Scrolltotopbutton loadedadv={isloaded} className='hidden' /></div>

        <div className='relative advancedsearchcont2  w-full  pt-7 pb-16 px-1'>

          <h1 className='advancetext' style={{ zIndex: "2" }}> Advanced Search </h1>
          <div className='advancedbox relative ' style={{ zIndex: "3" }}>

            <form id='Advancedform' className='phone:mx-3 tablet:mx-5 py-5'>

              <div className='flex-row flex  grid grid-cols-12 gap-3'>
                <div className="advform-group  py-2 px-3 flex flex-row  col-span-12 desktop:col-span-6 tablet:col-span-6 ">
                  <label className='mr-2 '>Title:</label>
                  <input type="text" name="title" className="form-control py-0 w-full px-0 " autoComplete="off" defaultValue={searchQuery?.title}></input>
                </div>
                <div className="advform-group  py-2 px-2 flex flex-row col-span-12 desktop:col-span-6 tablet:col-span-6 ">
                  <label className='mr-2 '>Keyword:</label>
                  <input type="text" name="keyword" className="form-control py-0 px-0 w-full " autoComplete="off" defaultValue={searchQuery?.keyword}></input>
                </div>
              </div>
              <div className='flex-row flex mt-2 grid grid-cols-12 gap-3'>
                <div className="advform-group  py-2 px-3 flex flex-row  col-span-12 desktop:col-span-3 tablet:col-span-6 ">
                  <label className='mr-2 '>Author:</label>
                  <input type="text" name="author" className="form-control py-0 w-full px-0 " autoComplete="off" defaultValue={searchQuery?.author}></input>
                </div>
                <div className="advform-group  py-2 px-2 flex flex-row col-span-12 desktop:col-span-3 tablet:col-span-6 ">
                  <label className='mr-2 '>Publisher:</label>
                  <input type="text" name="publisher" className="form-control py-0 px-0 w-full " autoComplete="off" defaultValue={searchQuery?.publisher}></input>
                </div>
                <div className="advform-group  py-2 px-3 flex flex-row  col-span-12 desktop:col-span-3 tablet:col-span-6 " style={{ zIndex: '99' }}>
                  <label className='mr-2 whitespace-nowrap '>Literary Form:</label>
                  <Select name='form' isClearable options={formOptions} className='selectadv' style={{ zIndex: '99' }} styles={customStyles3} classNamePrefix="itemtypeselect2 " defaultValue={{ label: searchQuery?.form, value: searchQuery?.form }} />
                </div>
                <div className="advform-group  py-2 px-2 flex flex-row col-span-12 desktop:col-span-3 tablet:col-span-6  ">
                  <label className='mr-2 '>ISBN:</label>
                  <input type="text" name='isbn' className="form-control py-0 px-0 w-full " autoComplete="off" defaultValue={searchQuery?.isbn}></input>
                </div>
              </div>
              <div className='flex-row flex mt-2 grid grid-cols-12 gap-3'>
                <div style={{ zIndex: '99' }} className="advform-group  py-2 px-3 flex flex-row  col-span-12 desktop:col-span-4 tablet:col-span-6 ">
                  <label className='mr-2 whitespace-nowrap '>Item Type:</label>
                  <Select style={{ zIndex: '99' }} name='type' isClearable options={typeOptions} className='selectadv' styles={customStyles3} classNamePrefix="itemtypeselect2 " defaultValue={{ label: searchQuery?.type, value: searchQuery?.type }} />
                </div>
                <div className="advform-group py-2 px-2 flex flex-row col-span-12 desktop:col-span-8 tablet:col-span-6 ">
                  <label className='mr-2 whitespace-nowrap '>Publication Date:</label>
                  <input type="date" name='startDate' className="form-control py-0 px-0 w-full" autoComplete="off" defaultValue={searchQuery?.startDate}></input>
                  <label className='mr-2 whitespace-nowrap '>-</label>
                  <input type="date" name='endDate' className="form-control py-0 px-0 w-full " autoComplete="off" defaultValue={searchQuery?.endDate}></input>

                </div>


              </div>

              <p className='mt-7 '>Genre/Subject:</p>
              <div className=" mt-2  w-full " style={{ zIndex: '3' }}>
                <Creatable
                  name='genre'
                  menuIsOpen={true}
                  hideSelectedOptions={false}

                  isClearable
                  options={genreOptions}
                  isMulti
                  classNamePrefix="genreadvbox"
                  styles={customStyles2}
                />
              </div>
              <div className='flex flex-row justify-between items-center mt-3 flex-wrap  '>


                <div className="advform-group  mb-2 mt-2  py-2 flex items-center self-center px-3 flex flex-row mr-4 ">
                  <label className='mr-2 whitespace-nowrap '>Sort:</label>
                  <Select name='sortType' isClearable options={sortOptions} className='selectadvsort' styles={customStyles3} classNamePrefix="itemtypeselect2 " defaultValue={sortOptions[searchQuery?.sortType]} />
                </div>
                <button type="submit" onClick={advsubmit} title="Search" aria-label="Submit Search" className='mb-2 advsubmitbtn flex  items-center py-2 px-3'><div className='flex flex-row items-center'><div><FaSearch /></div><p className='ml-2'>Search</p></div></button>
              </div>
            </form>


          </div>
          <h1 className='advancetext mt-5' style={{ zIndex: "2" }}> Search Results</h1>

          <Suspense fallback={<div style={{ color: "white" }}></div>}>
            <SearchResults searchQuery={searchQuery} pageisLoading={ispageLoading} />
          </Suspense>


        </div>
      </div>
      <Footer />
    </>
  );

};

export default Advancedsearch;
import React, { useEffect, useState } from 'react';
import { FaChevronRight } from "react-icons/fa";
import "./style/home.css";
import "./style/form.css";
import "./style/sidemenu.css";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import ButtonSpinner from './ButtonSpinner';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { verification } from '../features/auth/requests';

const Signup = () => {
  
  const [buttonloading, setbuttonloading]= useState(false)
  const { register, watch, setError, control, handleSubmit, formState: { errors } } = useForm();
  const TIMEOUT_DELAY = 60;
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(TIMEOUT_DELAY);
  const emailValue = watch('email');
  const passValue = watch('password');
  const departmentOptions = [
    { value: 'Computer Engineering', label: 'Computer Engineering' },
    { value: 'Civil Engineering', label: 'Civil Engineering' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
  ];
  const customStyles2 = {
    control: (base, state) => ({
      ...base,
      /*border: state.isFocused ? 0 : 0,
      // This line disable the blue border
      boxShadow: state.isFocused ? 0 : 0,
      '&:hover': {
         border: state.isFocused ? 0 : 0
      }*/
      backgroundColor: 'white',
      margin: '0',
      borderRadius: '0px!important',

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
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  useEffect(() => {
    window.scrollTo(0, 0);
    const message = localStorage.getItem('successMessage');

  }, [])

  useEffect(() => {
    
    if (isError) {
      toast.error(message)
       setbuttonloading(false)
      
    }

    if (isSuccess) {
      
       toast.success('User signed up successfully');
       setbuttonloading(false)
        document.getElementById("signupform").reset();
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  useEffect(() => {
    if (isDisabled) {
      timer > 0 && setTimeout(() => setTimer(currentTime => currentTime - 1), 1000);
    } else {
      setTimer(TIMEOUT_DELAY);
    }

  }, [isDisabled, timer])

  const sendCode = async (e) => {
    const request = { email: emailValue };

    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), (TIMEOUT_DELAY * 1000));
    try {
      await verification.post('/getCode', request);
    }
    catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
    }
  }

  const onSubmit = async (data, e) => {
    setbuttonloading(true)
    try {
      const userData = new FormData(e.target);
      dispatch(signup(userData));
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
      setbuttonloading(false)
    }
  }


  return (
          <div className=' ' style={{ backgroundColor: "#18191a", overflow: 'hidden' }}>
            <div className='flex ResumeContainer flex-col min-h-screen justify-center w-full '>
                <div className='relative flex advancedsearchcont2 items-center justify-items-center px-3'>

                      <div className='logincont  phone:mt-12 laptop:mt-28 mb-32 '>
                         <form id='signupform' className=' signupform p-4 ' onSubmit={handleSubmit(onSubmit)} >
              <div className="modal-header2 pb-4 flex items-center justify-center">
                <h4 className="modal-title">Signup</h4>
              </div>
              <div className="modal-body bg-light text-dark py-3">
                <div className="grid tablet:grid-cols-2 phone:grid-cols-1 gap-2">
                  <div className="form-group flex flex-col">
                    <label className=' '>First Name:</label>
                    <input {...register('firstName', { required: 'Please enter first name.' })} placeholder='Juan' className="form-control my-1" autoComplete="off" />
                    {errors.firstName && <p className='text-red-500'>{errors.firstName.message}</p>}
                  </div>
                  <div className="form-group flex flex-col">
                    <label className=' '>Last Name:</label>
                    <input {...register('lastName', { required: 'Please enter last name.' })} placeholder='Dela Cruz' className="form-control my-1" autoComplete="off" />
                    {errors.lastName && <p className='text-red-500'>{errors.lastName.message}</p>}
                  </div>
                </div>
                <div className="form-group my-3 flex flex-col">
                  <label className=' '>PUP Webmail:</label>
                  <input
                    {...register('email', { required: 'Please enter PUP Webmail', pattern: { value: /[a-z.]*[@]\biskolarngbayan.pup.edu.ph/, message: "Domain should be @iskolarngbayan.pup.edu.ph" } })} type="email" autoComplete="off" />
                  {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                </div>
                <div className="form-group my-3 flex flex-col">
                  <label className=''>E-mail Verification Code:</label>
                  <div className='flex flex-col justify-center items-end'>
                    <input {...register('code', { required: 'Please enter a verification code' })} type="text" className="w-full form-control my-1" autoComplete="off" />
                    <button onClick={sendCode} type='button' className='disabled:opacity-50 absolute w-24 mr-10 p-1 rounded text-sm bg-rose-400 text-black' disabled={!emailValue || errors.email || isDisabled}>{isDisabled ? timer : 'Send'}</button>
                  </div>
                  {errors.code && <p className='text-red-500'>{errors.code.message}</p>}
                </div>
                <div className="form-group my-3 flex flex-col">
                  <label className=' '>Student Number:</label>
                  <input {...register('studentNumber', { required: 'Please enter student number', pattern: { value: /[0-9]{4}-[0-9]{5}-[A-Z]{2}-(0|1)/, message: "Please follow the correct format" } })} type="text" placeholder='2018-00123-MN-0' className="form-control my-1  " autoComplete="off"></input>
                  {errors.studentNumber && <p className='text-red-500'>{errors.studentNumber.message}</p>}
                </div>
                <div className="form-group my-3 flex flex-col">
                  <label className=' '>Department:</label>
                  <Controller
                    name="department"
                    render={({ field }) => (
                      <Select
                        {...field}
                        isSearchable={false}
                        options={departmentOptions}
                        classNamePrefix="materialtype"
                        styles={customStyles2}
                      />
                    )}
                    control={control}
                    rules={{ required: 'Please enter your department' }}
                  />
                  {errors.department && <p className='text-red-500'>{errors.department.message}</p>}
                </div>
                <div className="form-group my-3 flex flex-col">
                  <label className=''>Password:</label>
                  <input type="password" {...register('password', { required: "Please enter your password" })} placeholder='*******' className="form-control my-1 " autoComplete="off"   ></input>
                  {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                </div>
                <div className="form-group my-3 flex flex-col">
                  <label className=''>Confirm Password:</label>
                  <input type="password" {...register('confirmPass', { required: 'Please confirm your password', validate: confirmPass => passValue === confirmPass || 'Password does not match' })} placeholder='*******' className="form-control my-1 " autoComplete="off"   ></input>
                  {errors.confirmPass && <p className='text-red-500'>{errors.confirmPass.message}</p>}
                </div>
                <div className="form-group my-3 flex flex-col">
                  <label className=''>Front ID Image: </label>
                  <input {...register('frontId', { required: 'Please upload front side of school ID for verification', validate: file => file[0].type === 'image/png' || file[0].type === 'image/jpeg' || "File type not supported" })} type="file" className="form-control my-1 text-white" accept="image/*" autoComplete="off"></input>
                  {errors.frontId && <p className='text-red-500'>{errors.frontId.message}</p>}
                </div>
                <div className="form-group my-3 flex flex-col">
                  <label className=''>Back ID Image: </label>
                  <input {...register('backId', { required: 'Please upload back side of school ID for verification', validate: file => file[0].type === 'image/png' || file[0].type === 'image/jpeg' || "File type not supported" })} type="file" className="form-control my-1 text-white" accept="image/*" autoComplete="off"></input>
                  {errors.backId && <p className='text-red-500'>{errors.backId.message}</p>}
                </div>

              </div>
              <div className="modal-footer justify-content-center ">
                <button className="flex items-center justify-center h-10 btn btn-light formsubmitbtn p-2 disabled:opacity-75" disabled={isLoading}>
                  {isLoading && <ButtonSpinner />}
                  Signup
                </button>
                <p className='flex flex-row mt-3 justify-center w-full items-center'> Already have an Account? </p>
                <div className='flex flex-col justify-center w-full my-3'>
                  <p className='flex flex-row justify-center w-full items-center '> <Link to='/studentlogin' className='mx-1 px-3 py-1 mt-1 loginadminbtn flex flex-row items-center'><span className='mr-2'>Login as Student </span> <FaChevronRight /></Link></p>
                </div>
              </div>
            </form>



                    </div>
                </div>



                <div className=' flex  w-full grow flex  flex items-end '>
                    <Footer className='w-full' />
                </div>
            </div>


        </div>
  

  );
};

export default Signup;
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Topnav from './Topnav';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { appendErrors, useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import ButtonSpinner from './ButtonSpinner';
import { Link } from 'react-router-dom';
import { apiClient, verification } from '../features/auth/requests';

const Forgotpass = () => {
    const { register, setError, clearErrors, reset, handleSubmit, formState: { errors } } = useForm();/*FOR EMAIL FORM PART*/
    const { handleSubmit: handleCodeSubmit, reset: resetCodeForm } = useForm(); /*FOR SEND CODE FORM*/
    const { register: changePassReg, setError: setChangePassError, watch: watchChangePass, handleSubmit: handleChangePass, formState: { errors: changePassErrors } } = useForm(); /* FORM CHANGE PASSWORD FORM */
    const [isEmailValidated, setEmailValidated] = useState(false);
    const [validatingEmail, setValidatingEmail] = useState(null);
    const [userData, setUserData] = useState(null);
    const [code, setCode] = useState(null);
    const [isSendingCode, setSendingCode] = useState(false);
    const [handlingChangePass, setChangingPass] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const validateEmail = (data) => {
        setValidatingEmail(true);

        apiClient.post('/emailExists', data)
            .then(({ data }) => {
                if (!data) {
                    setError('email', { type: 'notFound', message: 'Existing user with PUP Webmail not found.' });
                } else {
                    setEmailValidated(true);
                    setUserData(data);
                    reset();
                }
            })
            .catch(err => {
                toast.error(err.message);
            })
            .finally(() => {
                setValidatingEmail(false);

            })
    }

    const sendCode = () => {
        setSendingCode(true);
        verification.post('/getCode', userData)
            .then(({ data }) => {
                setCode(data);
                resetCodeForm();
            })
            .catch(err => toast.error(err.message))
            .finally(() => setSendingCode(false))
    }

    const changePassword = async (data) => {
        setChangingPass(true);
        apiClient.post('/forgetPassword', { email: userData.email, code: data.code, password: data.password, confirmPass: data.confirmPass })
            .then(response => {
                if (response.data) {
                    setIsSuccessful(true);
                }
            })
            .catch(error => {
                const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setChangePassError('code', { type: 'invalidCode', message })
            })
            .finally(() => setChangingPass(false))

    }

    return (
        <div className=' ' style={{ backgroundColor: "#18191a", overflow: 'hidden' }}>
            <div className='flex ResumeContainer flex-col min-h-screen justify-center w-full '>
                <div className='relative flex items-center justify-items-center px-3'>

                    {!isEmailValidated ?
                        (
                            <form id="validateEmail" className=' forgotmaincont py-3  mb-24 flex flex-col phone:mt-24 tablet:mt-36 mx-auto' onSubmit={handleSubmit(validateEmail)}>
                                <div className='header flex items-center px-5'>
                                    <h1 className='text-xl font-bold my-2'> Forgot Password </h1>
                                </div>
                                <div className='forgotcont flex flex-col px-5'>

                                    <div className="form-group my-3 flex flex-col ">
                                        <label className='font-medium '>Please enter your PUP Webmail registered to your account.</label>
                                        <input {...register('email', { required: 'Please enter your PUP Webmail', pattern: { value: /[a-z.]*[@]\biskolarngbayan.pup.edu.ph/, message: "Domain should be @iskolarngbayan.pup.edu.ph" }, onChange: () => clearErrors('email') })} type="text" className="form-control my-1" autoComplete='off' />
                                        {errors.email && <p className='text-xs text-red-700'>{errors.email.message}</p>}
                                    </div>
                                </div>

                                <div className={`px-5 pb-4 flex flex-row items-center justify-end submitchange flex-wrap flex`} >
                                    <button form='validateEmail' type='submit' className='flex justify-center ml-3 mt-4 p-2 font-medium disabled:opacity-75' disabled={validatingEmail}>
                                        {validatingEmail && <ButtonSpinner className="mr-2" />}
                                        Find Email
                                    </button>
                                </div>


                            </form>
                        ) :
                        (!code &&
                            <form className=' forgotmaincont py-3  mb-24 flex flex-col phone:mt-24 tablet:mt-36 mx-auto' onSubmit={handleCodeSubmit(sendCode)}>
                                <div className='header flex items-center px-5'>
                                    <h1 className='text-xl font-bold my-2'> Forgot Password </h1>
                                </div>
                                <div className='forgotcont flex flex-col px-5'>

                                    <div className="form-group my-3 flex flex-col m-12">
                                        <div className='rounded-2xl bg-neutral-100 p-4 my-4'>
                                            <p className='font-bold text-center'>Are you?</p>
                                            <p className='text-sm'><span className='font-semibold'>First Name:</span> {userData?.firstName}</p>
                                            <p className='text-sm'><span className='font-semibold'>Last Name:</span> {userData?.lastName}</p>
                                            <p className='text-sm'><span className='font-semibold'>Student No:</span> {userData?.studentNumber}</p>

                                        </div>

                                        <p className='font-medium '>Please confirm and click "Send code" button to send a verification code to the associated PUP Webmail</p>
                                    </div>
                                </div>

                                <div className={`px-5 pb-4 flex flex-row items-center justify-end submitchange flex-wrap flex`} >
                                    <button type='button' onClick={() => setEmailValidated(false)} className='flex justify-center ml-3 mt-4 p-2 font-medium disabled:opacity-75'>Is not you?</button>
                                    <button type='submit' className='flex justify-center ml-3 mt-4 p-2 font-medium disabled:opacity-75' disabled={isSendingCode}>
                                        {isSendingCode && <ButtonSpinner className="mr-2" />}
                                        Send Code
                                    </button>
                                </div>


                            </form>
                        )
                    }

                    {code && !isSuccessful &&
                        <form className=' forgotmaincont py-3  mb-24 flex flex-col phone:mt-24 tablet:mt-36 mx-auto' onSubmit={handleChangePass(changePassword)}>
                            <div className='header flex items-center px-5'>
                                <h1 className='text-xl font-bold my-2'> Forgot Password </h1>
                            </div>
                            <div className='forgotcont flex flex-col px-5'>

                                <div className={`form-group my-3  flex-col  flex`}>
                                    <label className='font-medium '>Please enter 4 digit code sent to your email.</label>
                                    <input {...changePassReg('code', { required: 'Please enter verification code from email' })} type="text" className="form-control my-1" maxLength="4" />
                                    {changePassErrors.code && <p className='text-xs text-red-700'>{changePassErrors.code.message}</p>}
                                </div>

                                <div className={`form-group my-1  flex-col  flex`}>
                                    <label className=' font-medium'>Enter new password.</label>
                                    <input {...changePassReg('password', { required: 'Please enter your new password.' })} type="password" className="form-control my-1" />
                                    {changePassErrors.password && <p className='text-xs text-red-700'>{changePassErrors.password.message}</p>}
                                </div>

                                <div className={`form-group mt-0  mb-4 flex-col  flex`}>
                                    <label className='font-medium'>Confirm new password.</label>
                                    <input {...changePassReg('confirmPass', { required: 'Please confirm your new password.', validate: confirmPass => confirmPass === watchChangePass('password') || 'Password do not match.' })} type="password" className="form-control my-1" />
                                    {changePassErrors.confirmPass && <p className='text-xs text-red-700'>{changePassErrors.confirmPass.message}</p>}
                                </div>
                            </div>

                            <div className={`px-5 pb-4 flex flex-row items-center justify-end submitchange flex-wrap flex`} >

                                <button type='button' onClick={sendCode} className='font-medium ml-3 mt-4 px-3 py-2 disabled:opacity-75' disabled={isSendingCode}>
                                    {isSendingCode && <ButtonSpinner className="mr-2" />}
                                    Resend Code
                                </button>
                                <button type='submit' className='flex justify-center ml-3 mt-4 p-2 font-medium disabled:opacity-75' disabled={handlingChangePass}>
                                    {handlingChangePass && <ButtonSpinner className="mr-2" />}
                                    Change Password
                                </button>

                            </div>


                        </form>
                    }

                    {isSuccessful &&
                        <div className=' forgotmaincont py-3  mb-24 flex flex-col phone:mt-24 tablet:mt-36 mx-auto' onSubmit={handleCodeSubmit(sendCode)}>
                            <div className='header flex items-center px-5'>
                                <h1 className='text-xl font-bold my-2'> Forgot Password </h1>
                            </div>
                            <div className='forgotcont flex flex-col px-5'>
                                <p className='font-medium py-6 text-center'>You have successfully changed your password.</p>
                            </div>

                            <div className={`px-5 pb-4 flex flex-row items-center justify-end submitchange flex-wrap flex`} >
                                <Link className='flex justify-center ml-3 mt-4 p-2 font-bold underline hover:text-neutral-500' to="/studentlogin">
                                    Login
                                </Link>
                            </div>
                        </div>
                    }
                </div>



                <div className=' flex  w-full grow flex  flex items-end '>
                    <Footer className='w-full' />
                </div>
            </div>


        </div>

    )

}

export default Forgotpass;
import { useEffect, useState } from 'react';
import Footer from './Footer';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import ButtonSpinner from './ButtonSpinner';
import { Link } from 'react-router-dom';
import { userApiWithCreds } from '../features/auth/requests';

const ChangePass = () => {
    const { register, handleSubmit, setError, watch, formState: { errors } } = useForm();
    const [isChangingPass, setChangingPass] = useState(false);
    const [isPasswordChanged, setPasswordChanged] = useState(false);
    const handleChangePass = (data) => {
        setChangingPass(true);

        userApiWithCreds.post('/changePassword', data)
            .then(({ data }) => {
                if (data) {
                    setPasswordChanged(true);
                }
            })
            .catch(error => {
                const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

                setError('currentPass', { type: 'wrongPass', message: message });
            })
            .finally(() => setChangingPass(false))
    }

    return (
        <div style={{ backgroundColor: "#18191a", overflow: 'hidden' }}>
            <div className='flex ResumeContainer flex-col min-h-screen justify-center w-full '>
                <div className='relative flex items-center justify-items-center px-3'>

                    <form className=' forgotmaincont py-3  mb-24 flex flex-col phone:mt-24 tablet:mt-36 mx-auto' onSubmit={handleSubmit(handleChangePass)}>
                        <div className='header flex items-center px-5'>
                            <h1 className='text-xl font-bold my-2'> Change Password</h1>
                        </div>
                        <div className='forgotcont flex flex-col px-5'>
                            {!isPasswordChanged ? (
                                <>
                                    <div className={`form-group my-3  flex-col  flex`}>
                                        <label className='font-medium '>Current Password</label>
                                        <input {...register('currentPass', { required: 'Please enter your current password' })} type="password" className="form-control my-1" />
                                        {errors.currentPass && <p className='text-xs text-red-700'>{errors.currentPass.message}</p>}
                                    </div>

                                    <div className={`form-group my-1  flex-col  flex`}>
                                        <label className=' font-medium'>Enter new password.</label>
                                        <input {...register('newPass', { required: 'Please enter your new password.' })} type="password" className="form-control my-1" />
                                        {errors.newPass && <p className='text-xs text-red-700'>{errors.newPass.message}</p>}
                                    </div>

                                    <div className={`form-group mt-0  mb-4 flex-col  flex`}>
                                        <label className='font-medium'>Confirm new password.</label>
                                        <input {...register('confirmNewPass', { required: 'Please confirm your new password.', validate: confirmPass => confirmPass === watch('newPass') || 'Password do not match.' })} type="password" className="form-control my-1" />
                                        {errors.confirmNewPass && <p className='text-xs text-red-700'>{errors.confirmNewPass.message}</p>}
                                    </div>
                                </>
                            ) : (
                                <div className='form-group my-3  flex-col  flex text-center'>
                                    <p>You have successfully changed your password.</p>
                                </div>
                            )}
                        </div>

                        <div className={`px-5 pb-4 flex flex-row items-center justify-end submitchange flex-wrap flex`} >

                            {!isPasswordChanged ? (
                                <button type='submit' className='flex justify-center ml-3 mt-4 p-2 font-medium disabled:opacity-75' disabled={isChangingPass}>
                                    {isChangingPass && <ButtonSpinner className="mr-2" />}
                                    Change Password
                                </button>
                            ) : (
                                <Link to='/' className='flex justify-center ml-3 mt-4 p-2 underline font-bold hover:opacity-75'>
                                    Go to Homepage
                                </Link>
                            )
                            }

                        </div>


                    </form>

                </div>



                <div className=' flex  w-full grow flex  flex items-end '>
                    <Footer className='w-full' />
                </div>
            </div>


        </div>

    )

}

export default ChangePass;
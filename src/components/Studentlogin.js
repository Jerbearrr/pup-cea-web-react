import React, { useEffect, useState, useContext } from 'react';
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import "./style/home.css";
import "./style/form.css";
import "./style/sidemenu.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reset, login } from '../features/auth/authSlice'
import Footer from './Footer';
import ButtonSpinner from './ButtonSpinner';

const Studentlogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { email, password } = formData;
    const [buttonloading, setbuttonloading]= useState(false)

    const { user, isSuccess, isError, message, isLoading } = useSelector(state => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password,
            role: '4d3b'
        }

        dispatch(login(userData));
        setbuttonloading(true)
    }

    useEffect(() => {
window.scrollTo(0, 0);
       if (isError === true) {
            setbuttonloading(false)
            toast.error(message);
            dispatch(reset());
           
        }

        if ( isSuccess) {
            setbuttonloading(false)
            dispatch(reset());
            navigate('/')
            toast.success('Login successfully');
            
            
        }
    }, [user, isError, isSuccess, message, navigate, dispatch])

    return (
        
         <div className=' ' style={{ backgroundColor: "#18191a", overflow: 'hidden' }}>
            <div className='flex ResumeContainer flex-col min-h-screen justify-center w-full '>
                <div className='relative flex advancedsearchcont2 items-center justify-items-center px-3'>

                      <div className='logincont  phone:mt-18 laptop:mt-36 mb-32 '>
                        <form className='loginform p-4' onSubmit={onSubmit}>


                            <div className="modal-header pb-4 flex items-center justify-center">
                                <h4 className="modal-title">Student Login</h4>
                            </div>
                            <div className="modal-body bg-light text-dark py-3">
                                <div className="form-group my-3 flex flex-col">
                                    <label className=' '>Email:</label>
                                    <input type="text" name='email' className="form-control my-1  " required="required" autoComplete="off" onChange={onChange}></input>
                                </div>
                                <div className="form-group my-3 flex flex-col">
                                    <label className=''>Password:</label>
                                    <input type="password" name='password' className="form-control my-1 " required="required" autoComplete="off" onChange={onChange}></input>
                                    <Link to='/forgotpassword' className='forgottext hover:text-neutral-300 underline'>Forgot Password?</Link>
                                </div>



                            </div>
                            <div className="modal-footer justify-content-center ">
                                {!buttonloading?
 
                                <input type="submit" className="btn btn-light formsubmitbtn p-2" value="Login"></input>
                                :<div className="btn btn-light formsubmitbtn flex items-center justify-center p-2" >&nbsp;<ButtonSpinner/></div>
                               } <div className='flex flex-col justify-center w-full my-3'>
                                    <p className='flex flex-row justify-center w-full items-center'> No account yet? <Link to='/signup' className='mx-1 underline hover:text-neutral-300'>Signup here</Link></p>
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

export default Studentlogin;
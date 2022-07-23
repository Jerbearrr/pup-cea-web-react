
import {Link } from 'react-router-dom';
import Footer from './Footer';
import {IoIosArrowBack} from 'react-icons/io'


const Error404 = () => {



    return (
        <div className=' ' style={{ backgroundColor: "white", overflow: 'hidden' }}>
            <div className='flex ResumeContainer flex-col min-h-screen justify-center w-full '>
                <div className='relative flex items-center justify-center px-3 flex-col ' style={{height:'500px'}}>

                    <h1 className='text-xl font-bold'>404</h1>
                    <p>Page not found!</p>
                    <Link  className='text-xs mt-2  ' to='/'> <p className='flex flex-row items-center rounded p-1' style={{backgroundColor:'#202125', color:'white'}}> <IoIosArrowBack/> &nbsp; Back to our site</p></Link>
                    

            
                </div>



                <div className=' flex  w-full grow flex  flex items-end '>
                    
                    <Footer className='w-full' />
                </div>
            </div>


        </div>

    )

}

export default Error404;
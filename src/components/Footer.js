import React from 'react';

const Footer= () => {
 return (
     <>
     <div className='footerbg flex flex-col justify-center text-center w-full py-8'>
     <h1 className='tabletlg:text-base phone:text-sm mb-1 font-bold'> PUP CEA Web Library </h1>
     <h1 className='text-slate-400 tabletlg:text-sm phone:text-xs'>PUP College of Engineering CEA Building, NDC Campus Anonas cor. Pureza St. </h1>
     <h1 className='text-slate-400 tabletlg:text-sm phone:text-xs'>Sta. Mesa, Manila, Philippines </h1>
     <h1 className='text-slate-300 tabletlg:text-base  phone:text-sm mt-1'>©2022 </h1>
     </div>
     </>
 );

};

export default Footer;
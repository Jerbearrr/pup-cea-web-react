import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf'
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Topnav from './Topnav';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ViewFile = () => {
    const { state } = useLocation();
    const [pageNum, setPageNum] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    return (
        <div className=' ' style={{ backgroundColor: "#18191a", overflow:'hidden' }}>
            <div className='flex ResumeContainer flex-col min-h-screen justify-center w-full '>
                <div className='relative'>
                <Document
                    className='print:hidden mx-1 phone:mt-10 laptop:mt-24 mb-24 PDFDocument'
                    file={state}
                    onContextMenu={(e) => e.preventDefault()}
                    onLoadSuccess={(pdf) => setLastPage(pdf.numPages)}
                    noData={<div className='text-white'>No PDF file is found.</div>}
                    loading={<div className='text-white'>Loading PDF...</div>}
                >
                    <Page pageNumber={pageNum} 
                    className={"PDFPage PDFPageOne"}
                    renderTextLayer={false} 
                    renderInteractiveForms={false}/>
                    {lastPage > 1 &&
                        <div className='absolute left-0 right-0  bottom-2 z-10 flex justify-center'>
                            <button className='bg-neutral-700 h-8 text-white mx-2 disabled:opacity-75 w-14  rounded-xl' onClick={() => setPageNum(prevPage => prevPage - 1)} disabled={pageNum === 1 || pageNum === 0}><ArrowBackIcon /></button>
                            <button className='bg-neutral-700 h-8 text-white mx-2 disabled:opacity-75 w-14  rounded-lg' onClick={() => setPageNum(prevPage => prevPage + 1)} disabled={pageNum == lastPage}><ArrowForwardIcon /></button>
                        </div>
                    }

                </Document>
</div>     <div className=' flex  w-full grow flex  flex items-end '>
                <Footer className='w-full'/>
            </div>
            </div>
       
            
        </div>

    )

}

export default ViewFile;
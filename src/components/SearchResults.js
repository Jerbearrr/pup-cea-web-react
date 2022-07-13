import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import bookService from '../features/book/bookService'
import { LoadingResults } from './LoadingResults'
import InfiniteScroll from 'react-infinite-scroll-component'

const SearchResults = ({ searchQuery }) => {
    const [query, setQuery] = useState();
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const NUM_PER_PAGE = 18;
    const [isLoading, setIsLoading] = useState(false);


    const handleNextData = async () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        bookService.searchBook(query, data.length)
            .then(results => {

                if (results.length < NUM_PER_PAGE) {
                    // Last Results 
                    setHasMore(false);
                }
                setData(prevData => {
                    return prevData.concat(results);
                })
                setIsLoading(false);
            })
    }

    // ON RENDER EVENT
    // SEARCH BOOKS FROM URL PARAM
    useEffect(() => {
        setQuery(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        console.log(data);
        console.log(query);
    }, [data, query])

    useEffect(async () => {
        if (query) {
            bookService.searchBook(query)
                .then(results => {
                    if (results.length === NUM_PER_PAGE) {
                        setHasMore(true);
                    }
                    setData(results);
                })
        }
    }, [query])

    return (
        <>
            {data.length > 0 ? (
                <InfiniteScroll
                    dataLength={data.length}
                    style={{ overflow: "hidden" }}
                    next={handleNextData}
                    hasMore={hasMore}
                    loader={<div><LoadingResults /></div>}
                >
                    <div style={{ zIndex: "2" }} className='searchresultcont w-full grid grid-row-2 desktop:grid-cols-6 laptop:grid-cols-6 tabletlg:grid-cols-4 tablet:grid-cols-4 phone:grid-cols-3 phone:gap-1 tablet:gap-1 tabletlg:gap-2 '>
                        {
                            data &&
                            (data.map(book => {
                                return (
                                    <Link to={`/openbook/${book._id}`} key={book._id}>
                                        <div className='h-full '>
                                            <div className="overflow-hidden recentcard ">

                                                <div className='imagecont advimgcont' style={{ zIndex: "2" }}>
                                                    <img className="text-center imagecontcont" src={book.imgUri ? book.imgUri : require('.//style/images/placeholder_book1.png')} alt={book.title} />
                                                </div>

                                                <div className="px-1 carddet " style={{ zIndex: "2" }}>
                                                    <div className=" cardtitle ">{book.title}</div>
                                                    <p className=" cardauthor  mb-1">
                                                        {book.author}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }))
                        }
                    </div>
                </InfiniteScroll>
            ) : (
                <div style={{ zIndex: "2", backgroundColor: "#2a2c31" }} className='searchresultcont w-full p-2 rounded-lg'>
                    <p className='text-bold text-white text-center'>No Results Found</p>
                </div>
            )}
        </>


    )
}

export default SearchResults;
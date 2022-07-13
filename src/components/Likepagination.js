import "./style/bookmarks.css";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux';
import { reset,  getUser, logoutUser } from '../features/auth/authSlice'


const Likepagination = ({ page, pages, changePage }) => {
  
    const dispatch = useDispatch()

   const { user, message } = useSelector(state => state.auth);

   var decoded = jwt_decode(user.accessToken);
   var now = new Date();
   var time = now.getTime();
   var exp = new Date((decoded.exp * 1000) -  (5*1000));


 let middlePagination;

  if (pages <= 5) {
    middlePagination = [...Array(pages)].map((_, idx) => (
      <button
        key={idx + 1}
        onClick={() =>{ 
            
       if(time > exp){  

        dispatch(getUser()).then((response)=>{
            if(response.payload.accessToken){
              changePage(idx + 1)
            }     
        });
        
        }else{ 
            
            changePage(idx + 1)
        }
        }}
        disabled={page === idx + 1 || !user.accessToken}
      >
      <p> {idx + 1}</p>
      </button>
    ));
  } else {
    const startValue = Math.floor((page - 1) / 5) * 5;

    middlePagination = (
      <>
        {[...Array(5)].map((_, idx) => (
          <button
            key={startValue + idx + 1}
            disabled={page === startValue + idx + 1 || !user.accessToken}
            onClick={() =>{ 
            
       if(time > exp){  

         dispatch(getUser()).then((response)=>{
            if(response.payload.accessToken){
             changePage(startValue + idx + 1)
            }     
        });
        
        }else{ 
            
            changePage(startValue + idx + 1)
        }
        }}
          >
           <p>{startValue + idx + 1}</p> 
          </button>
        ))}

        <button ><p>...</p></button>
        <button 
                 onClick={() =>{ 
            
       if(time > exp){  

           dispatch(getUser()).then((response)=>{
            if(response.payload.accessToken){
              changePage(pages)
            }     
        });
        
        }else{ 
            
            changePage(pages)
        }
        }}><p>{pages}</p></button>
      </>
    );

    if (page > 5) {
      if (pages - page >= 5) {
        middlePagination = (
          <>
            <button 
               onClick={() =>{ 
            
       if(time > exp){  

          dispatch(getUser()).then((response)=>{
            if(response.payload.accessToken){
              changePage(1)
            }     
        }); 
        
        }else{ 
            
            changePage(1)
        }
        }}
            
         ><p>1</p></button>
            <button><p>...</p></button>
            <button
             onClick={() =>{ 
            
       if(time > exp){  

         dispatch(getUser()).then((response)=>{
            if(response.payload.accessToken){
              changePage(startValue)
            }     
        }); 
        
        }else{ 
            
            changePage(startValue)
        }
        }}
            ><p>{startValue}</p></button>
            {[...Array(5)].map((_, idx) => (
              <button
                key={startValue + idx + 1}
                disabled={page === startValue + idx + 1 || !user.accessToken}

                    onClick={() =>{ 
            
       if(time > exp){  

         dispatch(getUser()).then((response)=>{
            if(response.payload.accessToken){
              changePage(startValue + idx + 1)
            }     
        }); 
        
        }else{ 
            
            changePage(startValue + idx + 1)
        }
        }}
            
              >
               <p>{startValue + idx + 1}</p> 
              </button>
            ))}

            <button><p>...</p></button>
            <button
              onClick={() =>{ 
            
       if(time > exp){  

         dispatch(getUser()).then((response)=>{
            if(response.payload.accessToken){
              changePage(pages)
            }     
        }); 
        
        }else{ 
            
            changePage(pages)
        }
        }}><p>{pages}</p></button>
          </>
        );
      } else {
        let amountLeft = pages - page + 5;
        middlePagination = (
          <>
              <button 
               onClick={() =>{ 
            
       if(time > exp){  

          dispatch(getUser()).then((response)=>{
            if(response.payload.accessToken){
               changePage(1)
            }     
        });  
        
        }else{ 
            
            changePage(1)
        }
        }}
            
         ><p>1</p></button>
            <button><p>...</p></button>
              <button
             onClick={() =>{ 
            
       if(time > exp){  

       
          dispatch(getUser()).then((response)=>{
            if(response.payload.accessToken){
               changePage(startValue)
            }     
        });  
        
        }else{ 
            
            changePage(startValue)
        }
        }}
            ><p>{startValue}</p></button>
            {[...Array(amountLeft)].map((_, idx) => (
              <button
                key={startValue + idx + 1}
                disabled={page === startValue + idx + 1 || !user.accessToken}
                style={
                  pages < startValue + idx + 1 ? { display: "none" } : null
                }
                onClick={() =>{ 
            
       if(time > exp){  

        dispatch(getUser()).then((response)=>{
            if(response.payload.accessToken){
              changePage(startValue + idx + 1)
            }     
        });
        
        }else{ 
            
            changePage(startValue + idx + 1)
        }
        }}
              >
               <p>{startValue + idx + 1}</p> 
              </button>
            ))}
          </>
        );
      }
    }
  }

  return (
    pages > 1 && (
      <div className="pagination">
        <button
          className="pagination__prev"
        onClick={() => changePage((page) => {
       if(time > exp){    
         dispatch(getUser()).then((response)=>{
            if(response.payload.accessToken){
              changePage(page - 1)
            }     
        });
      }else{ 
            
            changePage(page - 1)
        }

         })
        }
    
          disabled={page === 1}
        >
         <p>&#171;</p> 
        </button>
        {middlePagination}
        <button
          className="pagination__next"
       onClick={() => changePage((page) => {
       if(time > exp){    
        dispatch(getUser()).then((response)=>{
            if(response.payload.accessToken){
             changePage(page + 1)
            }     
        });
      }else{ 
            
            changePage(page + 1)
        }

         })
        }
          disabled={page === pages}
        >
         <p>&#187;</p> 
        </button>
      </div>
    )
  );
};

export default Likepagination;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import tokenRefresher from './tokenRefresher'
import { getUser } from '../auth/authSlice';
import { apiClientBook, apiClientBookPublic, apiClientBase } from '../auth/requests';
const refresh = tokenRefresher();
let store

export const injectStore = _store => {
    store = _store
}

const recentlyAdded = [];
const bookfeatured = [];
const openbook = [];
const likedbook = [];
const bookmarkedbook = [];
const likeStatus = [];
const relatedbook = [];
const borrowbook = [];
const getborrowedbook =[];
const getcontributedbook =[];
const sameseries =[];
const signrequests = []
const signRrequests = []
const likedbooks =[];
const seemore =[];
const randombooks =[{}];
const getusernotif =[]
const getjournals = []
const bookmarkpagecount = 1;

const initialState = {
    openbook: openbook? openbook : null ,
    bookmarkpagecount: bookmarkpagecount? bookmarkpagecount : 1,
    likedbook:  likedbook ?  likedbook : null,
    bookmarkedbook: bookmarkedbook? bookmarkedbook: null,
    getjournals: getjournals? getjournals:null,
    getborrowedbook: getborrowedbook? getborrowedbook: null,
    getborrowedbook: getcontributedbook? getcontributedbook: null,
    recentlyAdded: recentlyAdded ? recentlyAdded : null,
    bookfeatured: bookfeatured ? bookfeatured : null,
    signrequests: signrequests? signrequests:null,
    signRrequests : signRrequests ? signRrequests:null,
    borrowbook: borrowbook ? borrowbook : null,
    randombooks: randombooks? randombooks:null,
    likedbooks: likedbooks ? likedbooks : null,
    seemore: seemore ? seemore : null,
    sameseries: sameseries ? sameseries : null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    likeStatus: likeStatus ? likeStatus : null,
    relatedbook: relatedbook ? relatedbook : null,
    getusernotif: getusernotif ? getusernotif : null,
}
export const getFeaturedBook = createAsyncThunk('book/featured', async (_, thunkAPI) => {
    try {
        const res = await apiClientBookPublic.get('/featured');
        return res.data;
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();

        return thunkAPI.rejectWithValue(message);
    }
})
export const getRandomBook = createAsyncThunk('book/featuredrandom', async (_, thunkAPI) => {
    try {
        const res = await apiClientBookPublic.get('/getrandom');
        return res.data;
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();

        return thunkAPI.rejectWithValue(message);
    }
})

export const getRecentlyAdded = createAsyncThunk('book/recently-added', async (_, thunkAPI) => {
    try {
        const res = await apiClientBookPublic.get('/recently-added');
        return res.data;
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();

        return thunkAPI.rejectWithValue(message);
    }
})

export const getJournals = createAsyncThunk('book/getjournal', async ({page, limiter}, thunkAPI) => {
    try {
        const res = await apiClientBookPublic.get(`/getjournals?page=${page}&limit=${limiter}`);
        return res.data;
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();

        return thunkAPI.rejectWithValue(message);
    }
})

export const openBook = createAsyncThunk('/books', async (id, thunkAPI) => {
    try {
        const res = await apiClientBookPublic.get(`/${id.id}`);

        return res.data;



    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();

        return thunkAPI.rejectWithValue(message);
    }
})

export const likeBook = createAsyncThunk('/likebook', async (id, thunkAPI) => {


    try {

        const res = await apiClientBook.patch(`/${id}/likeBook`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})

export const bookmarkBook = createAsyncThunk('/bookmarkbook', async (id, thunkAPI) => {


    try {

        const res = await apiClientBook.patch(`/${id}/bookmarkBook`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})


export const getlikedBook = createAsyncThunk('/getlikedbook', async (page, thunkAPI) => {


    try {

        const res = await apiClientBook.get(`/getlikedBook?page=${page}`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})
export const getbookmarkBook = createAsyncThunk('/getbookmarkedbook', async (page, thunkAPI) => {


    try {

        const res = await apiClientBook.get(`/getbookmarkedBook?page=${page}`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})

export const getrelatedBooks = createAsyncThunk('/getrelatedbook', async (id, thunkAPI) => {


    try {

        const res = await apiClientBookPublic.get(`/${id}/getRelated`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})

export const checkborrowBook = createAsyncThunk('/checkborrowbook', async (id, thunkAPI) => {


    try {

        const res = await apiClientBook.get(`/${id}/borrowBook`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})
export const borrowBook = createAsyncThunk('/borrowbook', async (id, thunkAPI) => {


    try {

        const res = await apiClientBook.patch(`/${id}/setborrowBook`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})

export const getborrowedBook = createAsyncThunk('/getborrowedbook', async ({ page, status }, thunkAPI) => {


    try {

        const res = await apiClientBook.get(`/getborrowedbooks?page=${page}&status=${status}`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})
export const getcontributedBook = createAsyncThunk('/getcontributedbook', async ({ page, status }, thunkAPI) => {


    try {

        const res = await apiClientBook.get(`/getcontributedbooks?page=${page}&status=${status}`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})
export const getallcontributedBook = createAsyncThunk('/getallcontributedbook', async (page , thunkAPI) => {


    try {

        const res = await apiClientBook.get(`/getallcontributed?page=${page}`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})

export const getallborrowedBook = createAsyncThunk('/getallborrowedbook', async ({ page, status }, thunkAPI) => {


    try {

        const res = await apiClientBook.get(`/getallborrowedbooks?page=${page}&status=${status}`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})

export const manageBookRequests = createAsyncThunk('/managerequests', async (id, thunkAPI) => {


    try {

        const res = await apiClientBook.patch(`/${id}/manageRequests`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})

export const manageundoBookRequests = createAsyncThunk('/manageundorequests', async (id, thunkAPI) => {


    try {

        const res = await apiClientBook.patch(`/${id}/manageundoRequests`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})

export const managecancelreq = createAsyncThunk('/managecancelrequests', async (id, thunkAPI) => {


    try {

        const res = await apiClientBook.patch(`/${id}/managecancelreq`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }


})

export const getallrecentlyadded = createAsyncThunk('/allrecentlyadded', async (page, thunkAPI) => {


    try {

        const res = await apiClientBookPublic.get(`/allrecently-added?page=${page}`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }

})

export const getlikedbooks = createAsyncThunk('/liked-books', async (thunkAPI) => {


    try {

        const res = await apiClientBookPublic.get(`/likedbooks`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }

})

export const getalllikedbooks = createAsyncThunk('/allliked-books', async (page, thunkAPI) => {


    try {

        const res = await apiClientBookPublic.get(`/alllikedbooks?page=${page}`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }

})

export const getNotifs = createAsyncThunk('/getnotifs', async (_, thunkAPI) => {
    try {
        const res = await apiClientBook.get('/userNotifications');
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()


        return thunkAPI.rejectWithValue(message)
    }

})

export const signupRequests = createAsyncThunk('/signuprequest', async (page, thunkAPI) => {
    try {
        const res = await apiClientBase.get(`/verify/requests?page=${page}`);
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()


        return thunkAPI.rejectWithValue(message)
    }

})
export const verifySignuprequests = createAsyncThunk('/verifysignuprequest', async (id, thunkAPI) => {
    try {
        const res = await apiClientBase.post(`/verify/verifyUser`, { id });
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()


        return thunkAPI.rejectWithValue(message)
    }

})
export const rejectSignuprequests = createAsyncThunk('/rejectsignuprequest', async (id, thunkAPI) => {
    try {
        const res = await apiClientBase.post(`/verify/rejectUser`, { id });
        return res.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()


        return thunkAPI.rejectWithValue(message)
    }

})

export const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        resetBook: (state) => {
            state.getusernotifloading = false
            state.getusernotifsuccess = false
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFeaturedBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(getFeaturedBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.bookfeatured = action.payload;
            })
            .addCase(getFeaturedBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getRecentlyAdded.pending, state => { state.isLoading = true })
            .addCase(getRecentlyAdded.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.recentlyAdded = action.payload;
            })
            .addCase(getRecentlyAdded.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(openBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(openBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.openbook = action.payload.book;
                state.sameseries = action.payload.bookseries
            })
            .addCase(openBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(likeBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(likeBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

            })
            .addCase(likeBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(signupRequests.pending, state => {
                state.isLoading = true;
            })
            .addCase(signupRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.signrequests = action.payload;

            })
            .addCase(signupRequests.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
             .addCase(verifySignuprequests.pending, state => {
                state.isLoading = true;
            })
            .addCase(verifySignuprequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.signRrequests = action.payload;

            })
            .addCase(verifySignuprequests.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
                .addCase(rejectSignuprequests.pending, state => {
                state.isLoading = true;
            })
            .addCase(rejectSignuprequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.signRrequests = action.payload;

            })
            .addCase(rejectSignuprequests.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getlikedBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(getlikedBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.likedbook = action.payload;

            })
            .addCase(getlikedBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

           .addCase(getRandomBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(getRandomBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.randombooks = action.payload;

            })
            .addCase(getRandomBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(bookmarkBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(bookmarkBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

            })
            .addCase(bookmarkBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getbookmarkBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(getbookmarkBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.bookmarkedbook = action.payload;
                state.bookmarkpagecount = action.payload.pages;

            })
            .addCase(getbookmarkBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getrelatedBooks.pending, state => {
                state.isLoading = true;
            })
            .addCase(getrelatedBooks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.relatedbook = action.payload;

            })
            .addCase(getrelatedBooks.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(checkborrowBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(checkborrowBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.borrowbook = action.payload;

            })
            .addCase(checkborrowBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(borrowBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(borrowBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.borrowbook = action.payload;

            })
            .addCase(borrowBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getborrowedBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(getborrowedBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.getborrowedbook = action.payload;


            })
            .addCase(getborrowedBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
             .addCase(getcontributedBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(getcontributedBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.getcontributedbook = action.payload;


            })
            .addCase(getcontributedBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
             .addCase(getallcontributedBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(getallcontributedBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.getcontributedbook = action.payload;


            })
            .addCase(getallcontributedBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getallborrowedBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(getallborrowedBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.getborrowedbook = action.payload;


            })
            .addCase(getallborrowedBook.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(manageBookRequests.pending, state => {
                state.isLoading = true;
            })
            .addCase(manageBookRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.borrowbook = action.payload;
            })
            .addCase(manageBookRequests.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(manageundoBookRequests.pending, state => {
                state.isLoading = true;
            })
            .addCase(manageundoBookRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.borrowbook = action.payload;

            })
            .addCase(manageundoBookRequests.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(managecancelreq.pending, state => {
                state.isLoading = true;
            })
            .addCase(managecancelreq.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.borrowbook = action.payload;

            })
            .addCase(managecancelreq.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getallrecentlyadded.pending, state => {
                state.isLoading = true;
            })
            .addCase(getallrecentlyadded.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.seemore = action.payload;

            })
            .addCase(getallrecentlyadded.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getlikedbooks.pending, state => {
                state.isLoading = true;
            })
            .addCase(getlikedbooks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.likedbooks = action.payload;
            })
            .addCase(getlikedbooks.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getalllikedbooks.pending, state => {
                state.isLoading = true;
            })
            .addCase(getalllikedbooks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.seemore = action.payload;

            })
            .addCase(getalllikedbooks.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getJournals.pending, state => {
                state.isLoading = true;
            })
            .addCase(getJournals.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.getjournals = action.payload;

            })
            .addCase(getJournals.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
                  .addCase(getNotifs.pending, (state) => {
        state.getusernotifloading = true
     
      })
      .addCase(getNotifs.fulfilled, (state, action) => {
        state.getusernotifloading  = false
        state.getusernotifsuccess = true
        state.getusernotif = action.payload
      })
   
            


    }
})


export const { resetBook } = bookSlice.actions
export default bookSlice.reducer
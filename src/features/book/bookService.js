import axios from "axios"
import { apiClientBook, apiClientBookPublic } from '../auth/requests';

const searchBook = async (searchFilters, offset) => {
    try {
        const res = await apiClientBookPublic.post('/search', { ...searchFilters, offset: offset })
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

const getbookcount= async (searchFilters, offset) => {
    try {
        const res = await apiClientBookPublic.get('/getcountbook')
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

const topcontributor = async() => {
    try {
        const res = await apiClientBookPublic.get('/topcontributes')
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

const fetchnotifs = async(offset) =>{
   try {
        const res = await apiClientBook.get('/userNotifications', { offset: offset })
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

const getUniqueFields = async () => {
    try {
        const res = await apiClientBookPublic.get('/uniques');
        return res.data;
    } catch (err) {
        return err;
    }
}

const addBook = async (bookData) => {
    try {
        const res = await apiClientBook.post('/create', bookData);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}
const confirmContri = async(bookData) => {
    try {
        const res = await apiClientBook.post('/confirmcontri', bookData);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}
const declineContri = async(id) => {
    try {
        const res = await apiClientBook.post(`/${id}/declinecontribution`);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}
const delContribute = async(id) => {
    try {
        const res = await apiClientBook.post(`/${id}/delcontribute`);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}
const contributeBook = async(bookData) => {
    try {
        const res = await apiClientBook.post('/createcontribute', bookData);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}
const editdeleteBook = async(id) =>{
    try {
        const res = await apiClientBook.delete(`/${id}/deleteBook`);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}

const editBook = async (bookData) => {
    try {
        const res = await apiClientBook.patch('/editbook', bookData);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}


const getcontrolfeatured= async () => {
    try {
        const res = await apiClientBook.get('/getadmincontrolfeatured');
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}

const controlfeatured= async (id) => {
    try {
        const res = await apiClientBook.post(`/${id}/admincontrolfeatured`);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}

const delcontrolfeatured= async (id) => {
    try {
        const res = await apiClientBook.delete(`/${id}/delfeatured`);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}

const setquote = async (form) => {
    try {
        const res = await apiClientBook.post('/setquote', form);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}

const getquote = async () => {
    try {
        const res = await apiClientBookPublic.get('/getquote');
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}

const setdaylimit = async (form) => {
    try {
        const res = await apiClientBook.post('/setdaylimit',form);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}

const getdaylimit = async () => {
    try {
        const res = await apiClientBookPublic.get('/getdaylimit');
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}

const getalluser = async () => {
    try {
        const res = await apiClientBook.get('/getalluser');
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}
const deleteuser = async (id) => {
    try {
        const res = await apiClientBook.delete(`/${id}/deleteuser`);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}

const addadmin = async(form) => {
    try {
        const res = await apiClientBook.post(`/addadminacc`, form);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}
const delallborrow = async() => {
    try {
        const res = await apiClientBook.delete(`/delallborrow`);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}

const cancelreq = async(id) => {
    try {
        const res = await apiClientBook.delete(`/${id}/cancelreq`);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}
const notifylate = async(id) => {
    try {
        const res = await apiClientBook.post(`/${id}/notifylate`);
        return res.data;
    }
    catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        throw new Error(message);
    }

}
const bookService = {
    searchBook,
    getUniqueFields,
    addBook,
    editBook,
    editdeleteBook,
    fetchnotifs,
    contributeBook,
    confirmContri,
    declineContri,
    getcontrolfeatured,
    controlfeatured,
    delcontrolfeatured,
    setquote,
    getquote,
    setdaylimit,
    getdaylimit,
    getalluser,
    deleteuser,
    addadmin,
    delallborrow,
    cancelreq,
    notifylate,
    delContribute,
    getbookcount,
    topcontributor,

}

export default bookService;
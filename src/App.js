import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import "./App.css";
import 'flowbite';
import { UserContext } from "./features/UserContext";
import Home from "./components/Home";
import Browse2 from "./components/Browse2";
import Footer from "./components/Footer";
import Topnav from "./components/Topnav";
import Openbook from "./components/Openbook";
import Studentlogin from "./components/Studentlogin";
import Bookmarks from "./components/Bookmarks";
import Advancedsearch from "./components/Advancedsearch";
import Adminlogin from "./components/Adminlogin";
import Borrow from "./components/Borrow";
import Signup from "./components/Signup";
import Requestcopy from "./components/Requestcopy";
import Addbook from "./components/Addbook";
import Recentlyadded from "./components/Recentlyadded";
import Mostliked from "./components/Mostliked";
import Requests from "./components/Requests";
import ChangePass from "./components/ChangePass";
import SignupRequests from "./components/Signuprequests";
import Menu from "./components/Menu";
import Journals from "./components/Journals";
import FileRequests from "./components/FileRequests";
import Contribute from "./components/Contribute";
import ViewFile from './components/ViewFile';
import Forgotpass from "./components/Forgotpass";
import Admincontrol from "./components/Admincontrol";

function App() {

  return (
    <div >
      <Routes>

        <Route
          exact
          path="/"
          element={
            <>
              <Topnav />
              <Home />
            </>
          }
        />

        <Route
          path="/browse"
          element={
            <>

              <Topnav />
              <Browse2 />
              <Footer />

            </>
          }
        />

        <Route
          path="/openbook/:id"
          element={
            <>
              <Topnav />
              <Openbook />
              <Footer />

            </>
          }
        />

        <Route
          path="/studentlogin"
          element={
            <>

              <Topnav />
              <Studentlogin />
           

            </>
          }
        />
        <Route
          path="/forgotpassword"
          element={
            <>

              <Topnav />
              <Forgotpass />
            </>
          }
        />

        <Route
          path="/changepassword"
          element={
            <>

              <Topnav />
              <ChangePass />
            </>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <>

              <Topnav />
              <Bookmarks />
              <Footer />

            </>
          }
        />

        <Route
          path="/advancedsearch/"
          element={
            <>

              <Topnav />
              <Advancedsearch />



            </>
          }
        />
        <Route
          path="/recentlyadded"
          element={
            <>

              <Topnav />
              <Recentlyadded />



            </>
          }
        />
        <Route
          path="/journals"
          element={
            <>

              <Topnav />
              <Journals />



            </>
          }
        />
        <Route
          path="/mostliked"
          element={
            <>

              <Topnav />
              <Mostliked />



            </>
          }
        />

        <Route
          path="/adminlogin"
          element={
            <>

              <Topnav />
              <Adminlogin />
           



            </>
          }
        />


        <Route
          path="/borrow"
          element={
            <>

              <Topnav />
              <Borrow />
              <Footer />

            </>
          }
        />
        <Route
          path="/requests"
          element={
            <>

              <Topnav />
              <Requests />
              <Footer />



            </>
          }
        />
        <Route
          path="/signuprequests"
          element={
            <>

              <Topnav />
              <SignupRequests />
              <Footer />



            </>
          }
        />
        <Route
          path="/filerequests"
          element={
            <>

              <Topnav />
              <FileRequests />
              <Footer />



            </>
          }
        />
        <Route
          path="/viewFile"
          element={
            <>
              <Topnav />
              <ViewFile />

            </>
          }
        />
        <Route
          path="/requestedcopy"
          element={
            <>

              <Topnav />
              <Requestcopy />
              <Footer />



            </>
          }
        />
        <Route
          path="/controlpanel"
          element={
            <>

              <Topnav />
              <Admincontrol />




            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>

              <Topnav />
              <Signup />
        



            </>
          }
        />
        <Route
          path="/addbook"
          element={
            <>
              <Topnav />
              <Addbook />
              <Footer />

            </>
          }
        />

        <Route
          path="/contribute"
          element={
            <>
              <Topnav />
              <Contribute />
              <Footer />

            </>
          }
        />

      </Routes>
      <ToastContainer limit={2} />

    </div>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import 'flowbite';
import { Provider } from "react-redux";
import {store} from './app/store'
import {injectStore} from "./features/book/bookSlice";
import {injectStorebook} from "./features/auth/requests";
injectStorebook(store);
injectStore(store);

ReactDOM.render(
  <BrowserRouter >
    <Provider store={store}>
      
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

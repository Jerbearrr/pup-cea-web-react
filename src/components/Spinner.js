import React from "react";
import "./style/spinner.css";

export default function LoadingSpinner() {
  return (
    <div className="spinner w-full flex  self-center items-center justify-center">
        <div className="spinner-circle flex  self-center items-center justify-center spinner-circle-outer"></div>
  <div className="spinner-circle-off flex  self-center items-center justify-center spinner-circle-inner"></div>
  <div className="spinner-circle flex  self-center items-center justify-center spinner-circle-single-1"></div>
  <div className="spinner-circle flex  self-center items-center justify-center spinner-circle-single-2"></div>
  <div className="text">..Loading..</div>
    </div>
  );
}
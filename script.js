/*  Project 01_11_02

    Author: Gabriel Ortega
    Date: 8.31.18

    Filename: script.js
*/

"use strict";

// Global Variables
var httpRequest = false;
var entry = "^IXIC"

// Create XMLHttpRequest 
function getRequestObject() {
    try {
        httpRequest = new XMLHttpRequest();
    } catch (requestError){
        return false;
    }
    return httpRequest;
}

// Stop default submission
function stopSubmission(evt) {
    if (evt.preventDefault) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }
    getQuote();
}

function getQuote() {
    if (document.getElementsByTagName("input")[0].value) {
        entry = document.getElementsByTagName("input")[0].value;
    }
    if (!httpRequest) {
        httpRequest = getRequestObject();
    }
    
    httpRequest.abort();
    httpRequest.open("get", "StockCheck.php?t=" + entry, true);
    httpRequest.send(null);
    
    httpRequest.onreadystatechange = displayData;
}

function displayData() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        var stockResults = httpRequest.responseText;
        console.log(stockResults);
    }
}

// Run getRequestObject() on page load
var form = document.getElementsByTagName("form")[0];
if (window.addEventListener) {
    form.addEventListener("submit", stopSubmission, false);
    window.addEventListener("load", getQuote, false);
} else if (window.attachEvent) {
    form.attachEvent("onsubmit", stopSubmission);
    window.attachEvent("onload", getQuote);
}

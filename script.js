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
    } catch (requestError) {
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

// Function to retrieve data (stock quote) from the web server
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
    clearTimeout(updateQuote);
    var updateQuote = setTimeout('getQuote()', 10000);
}

// Check to see if we get the right data back and put in the data into our page
function displayData() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        var stockResults = httpRequest.responseText;
        var stockItems = stockResults.split(/,|\"/);
        for (var i = stockItems.length - 1; i >= 0; i--) {
            if (stockItems[i] === "") {
                    stockItems.splice(i, 1);
                }
        }
        document.getElementById("ticker").innerHTML = stockItems[0];
        document.getElementById("openingPrice").innerHTML = stockItems[6];
        document.getElementById("lastTrade").innerHTML = stockItems[1];
        document.getElementById("lastTradeDT").innerHTML = stockItems[2] + ", " + stockItems[3];
        document.getElementById("change").innerHTML = stockItems[4];
        document.getElementById("range").innerHTML = (stockItems[8] * 1).toFixed(2) + "&ndash;" + (stockItems[7] * 1).toFixed(2);
        document.getElementById("volume").innerHTML = (stockItems[9] * 1).toLocaleString();
    }
}

// Style the page to make it look more appealing
function formatTable() {
    var rows = document.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.background = "#9FE098";
    }
}

// Run getRequestObject() on page load
var form = document.getElementsByTagName("form")[0];
if (window.addEventListener) {
    form.addEventListener("submit", stopSubmission, false);
    window.addEventListener("load", formatTable, false);
    window.addEventListener("load", getQuote, false);
} else if (window.attachEvent) {
    form.attachEvent("onsubmit", stopSubmission);
    window.attachEvent("onload", formatTable);
    window.attachEvent("onload", getQuote);
}

//BROWSE FUNTIONALITY
document.getElementById("btn-search").addEventListener("click", function () {
    var textBox = document.getElementById("input-search");
    var searchVal = textBox.value;
    var sortBox = document.getElementById("select-sort");
    var sortVal = sortBox.value;
    var myJsonObject = null;
    var resultBox = document.getElementById("number");
    var resultNum = resultBox.value;
    var bestBox = document.getElementById("radio-best");
    var best
    var author = 'rowling'
    if(bestBox.checked)
    {
        best = bestBox.value;
    }
    else
    {
        best = '';
    }
    
    console.log("partial or full title String:" + searchVal);
    //clearLogicOperationDiv();
    makeTableRequest(searchVal, sortVal, resultNum, best);
  });

  jQuery(document).on('click','.clickableRow',function(e){
    if(e.target.nodeName == "TD"){
        window.location = $(this).data("href");
    }
});

$(document).ready(function() {
    if(document.URL == "http://localhost:5656/")
    {
        makeTableRequest('', 'title', 10, '');
    }
    else if(document.URL == "http://localhost:5656/author"){
        makeTableRequest('', 'title', 10, '');
    }
    
   });

function makeTableRequest(searchVal, sortVal, resultNum, best) {
    console.log("wow");
    const xhttp = new XMLHttpRequest();
    const url = "http://localhost:5656/" 

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );

    xhttp.send("like=" + searchVal + "&col=" + sortVal + "&id=" + best);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var finalQueryResult = xhttp.responseText;
            console.log(finalQueryResult);
            myJsonObject = JSON.parse(finalQueryResult);

            clearTable();
            var start = 0;
            var numResults = resultNum;
            numPages = ((myJsonObject.length / numResults) + 0.5) | 0; // 0.5 to fix rounding issues
            
            if(numPages <= 1)
            {
                console.log("initial");
                populateTable(myJsonObject, start, myJsonObject.length);
            }
            else
            {
                populateTable(myJsonObject, start, numResults);
            }
             
            var nextButton = document.getElementById('next');
            var prevButton = document.getElementById('prev');
            var pageText = document.getElementById('pages');
            prevButton.disabled = true; // initially disabled

            if(numPages > 1) // enough results for multiple pages
            {   
                nextButton.disabled = false;
                pageText.textContent = "Page 1 of " + numPages;
                nextButton.setAttribute('onclick', 'changePage(' + numResults + ',' + 2 + ',' + numPages + ')');
            }
            else{
                pageText.textContent = "Page 1 of 1"
                nextButton.disabled = true;
            }
        };
    };
};

function clearTable() {
    let count = $('#tableBrowseBody tr').length;
    //console.log("count is " + count);
    let i;
    for(i = 0; i < count; i++){
        //console.log("delete " + i)
        document.getElementById("tableBrowseBody").deleteRow(-1);
    }
}

function populateTable(json, start, end) {
    for (var i = start; i < end; i++) {
        insertRow(json[i], i)
    } 
}

function insertRow(rowData, i){
    var table = document.getElementById("tableBrowseBody");
    var row = table.insertRow(-1);
    row.className = "clickableRow";
    row.setAttribute('data-href', '/details/:'+ rowData.bookCode)
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    var cell6 = row.insertCell(6);
    var cell7 = row.insertCell(7);
    var cell8 = row.insertCell(8);

    var button = document.createElement('input');

    // Add to cart dynamic button creation
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Cart');
    button.setAttribute('onclick', 'addToCart(' + rowData.bookCode + ')');

    cell0.appendChild(button);

    // cover immage logic
    var img = document.createElement('img');
    img.src = rowData.cover;
    img.width = 100;
    img.length = 100;
    cell1.appendChild(img)

    cell2.innerHTML = rowData.title;
    cell3.innerHTML = rowData.authorFirst + " "+ rowData.authorLast;
    cell4.innerHTML = rowData.genre
    cell5.innerHTML = rowData.publisherName;
    cell6.innerHTML = "$" + rowData.price.toFixed(2); // Two decimal places
    if(rowData.Average == null) // no reviews
        {cell7.innerHTML = "N/A"}
    else
        {cell7.innerHTML = rowData.Average.toFixed(1)}; // One decimal place
    cell8.innerHTML = rowData.numCopies;

}

function changePage(numResults, currentPage, totalPages)
{
    
    var pageText = document.getElementById('pages');
    pageText.textContent = "Page " + currentPage + " of " + totalPages;

    clearTable();
    var start = (currentPage - 1) * numResults;
    var end = currentPage * numResults

    if(myJsonObject.length < end) // handles pages with less results
    {
        console.log("less results");
        end = myJsonObject.length;
    }
    
    populateTable(myJsonObject, start, end); 

    var nextButton = document.getElementById('next');
    var prevButton = document.getElementById('prev');
    
    if(currentPage == 1) // first page
    {
        prevButton.disabled = true;
        nextButton.disabled = false;
        nextButton.setAttribute('onclick', 'changePage(' + numResults + ',' + (currentPage + 1) + ',' + totalPages + ')');
    }
    else if(currentPage < totalPages) // any page in between
    {
        prevButton.disabled = false;
        nextButton.disabled = false;
        nextButton.setAttribute('onclick', 'changePage(' + numResults + ',' + (currentPage + 1) + ',' + totalPages + ')');
        prevButton.setAttribute('onclick', 'changePage(' + numResults + ',' + (currentPage - 1) + ',' + totalPages + ')');
    }
    else{ // last page
        prevButton.disabled = false;
        nextButton.disabled = true;
        prevButton.setAttribute('onclick', 'changePage(' + numResults + ',' + (currentPage - 1) + ',' + totalPages + ')');
    }
}

function addToCart(code){
    const xhttp = new XMLHttpRequest();
    const url = "http://localhost:5656/add" 

    id = window.localStorage.getItem('userId');
    
    console.log("sending post: " + id)

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );

    
    xhttp.send("code=" + code + "&id=" + id);
}
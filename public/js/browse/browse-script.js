//BROWSE FUNTIONALITY
document.getElementById("btn-search").addEventListener("click", function () {
    var textBox = document.getElementById("input-search");
    var searchVal = textBox.value;
    var sortBox = document.getElementById("select-sort");
    var sortVal = sortBox.value;
    var myJsonObject = null;
    console.log("partial or full title String:" + searchVal);
    //clearLogicOperationDiv();
    makeTableRequest(searchVal, sortVal);
  });

  jQuery(document).on('click','.clickableRow',function(e){
    if(e.target.nodeName == "TD"){
        window.location = $(this).data("href");
    }
});

function makeTableRequest(searchVal, sortVal) {
    const xhttp = new XMLHttpRequest();
    const url = "http://localhost:5656/" 

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );

    xhttp.send("like=" + searchVal + "&col=" + sortVal );

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var finalQueryResult = xhttp.responseText;
            console.log(finalQueryResult);
            myJsonObject = JSON.parse(finalQueryResult);

            clearTable();
            var start = 0;
            var numResults = 2;
            numPages = myJsonObject.length / numResults;
            if(numPages < 1)
            {
                populateTable(myJsonObject, start, myJsonObject.length);
            }
            else
            {
                populateTable(myJsonObject, start, numResults);
            }
             
            var nextButton = document.getElementById('next');
            var prevButton = document.getElementById('prev');
            prevButton.disabled = true; // initially disabled
            if(numPages > 1) // enough results for multiple pages
            {   
                if(myJsonObject.length < (numResults * 2)) // handles a second page with less results
                {
                    console.log("less results");
                    nextButton.setAttribute('onclick', 'changePage(' + (start + numResults) + ',' + myJsonObject.length + ',' + 2 + ',' + numPages + ')');
                }
                else
                {
                    nextButton.setAttribute('onclick', 'changePage(' + (start + numResults) + ',' + (numResults * 2) + ',' + 2 + ',' + numPages + ')');
                }
            }
            else{
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

    var button = document.createElement('input');

    // SET INPUT ATTRIBUTE.
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Cart');

    // ADD THE BUTTON's 'onclick' EVENT.
    button.setAttribute('onclick', 'addToCart(' + rowData.bookCode + ')');

    cell0.appendChild(button);

    //cell0.innerHTML = 'What';
    cell1.innerHTML = rowData.title;
    cell2.innerHTML = rowData.authorFirst + " "+ rowData.authorLast;
    cell3.innerHTML = rowData.genre
    cell4.innerHTML = rowData.publisherName;
    cell5.innerHTML = "$" + rowData.price.toFixed(2); // Two decimal places
    if(rowData.Average == null)
        {cell6.innerHTML = "N/A"}
    else
        {cell6.innerHTML = rowData.Average.toFixed(1)}; // One decimal place
    cell7.innerHTML = rowData.numCopies;

}

function changePage(start, end, currentPage, totalPages)
{
    clearTable();
    populateTable(myJsonObject, start, end); 

    var nextButton = document.getElementById('next');
    var prevButton = document.getElementById('prev');
    
    if(currentPage == 1) // first page
    {
        prevButton.disabled = true;
        nextButton.disabled = false;
        nextButton.setAttribute('onclick', 'changePage(' + (end) + ',' + (end + (end - start)) + ',' + (currentPage + 1) + ',' + totalPages + ')');
    }
    else if(currentPage < totalPages) // any page in between
    {
        prevButton.disabled = false;
        nextButton.disabled = false;

        if(myJsonObject.length < (end + (end - start))) // handles a last page with less results
        {
            nextButton.setAttribute('onclick', 'changePage(' + (end) + ',' + myJsonObject.length + ',' + (currentPage + 1) + ',' + totalPages + ')');
        }
        else
        {
            nextButton.setAttribute('onclick', 'changePage(' + (end) + ',' + (end + (end - start)) + ',' + (currentPage + 1) + ',' + totalPages + ')');
        }
        prevButton.setAttribute('onclick', 'changePage(' + (start - (end - start)) + ',' + (start) + ',' + (currentPage - 1) + ',' + totalPages + ')');
    }
    else{ // last page
        prevButton.disabled = false;
        nextButton.disabled = true;
        prevButton.setAttribute('onclick', 'changePage(' + (start - (end - start)) + ',' + (start) + ',' + (currentPage - 1) + ',' + totalPages + ')');
    }
}

function addToCart(code){   
    console.log(code);
    const xhttp = new XMLHttpRequest();
    const url = "http://localhost:5656/add" 

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );

    
    xhttp.send("code=" + code);
}
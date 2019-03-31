document.getElementById("btn-search").addEventListener("click", function () {
  var textBox = document.getElementById("input-search");
  var searchVal = textBox.value;
  var sortBox = document.getElementById("select-sort");
  var sortVal = sortBox.value;
  console.log("partial or full title String:" + searchVal);
  //clearLogicOperationDiv();
  makeTableRequest(searchVal, sortVal);

});


//jQuery(document).on('click','.clickableRow',function(){
//    window.location = $(this).data("href");
//});

jQuery( document ).ready(function(){
    jQuery( ".clickableRow" ).click( function( e ){
      window.location=$(this).data("href");;
    });
  } );

jQuery(document).ready(function($) {
    $(".clickableRow").on("click", function () {
        console.log("clickable");
        window.location = $(this).data("href");
    });
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
            var myJsonObject = JSON.parse(finalQueryResult);

            clearTable();
            populateTable(myJsonObject, myJsonObject.length);     
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

function populateTable(json, length) {
    for (var i = 0; i < length; i++) {
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

/*
function displayTable1(partialOrFullTitle) {
    var parentDiv = document.getElementById("logicDiv");
    let table = document.getElementById("tableBrowse");

    let query = getSearchQuery1(partialOrFullTitle);
    let url = "localhost";
    let params = "table=" + "search" + "&query=" + query;

    console.log("Search query:" + query);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var finalQueryResult = xhr.responseText;
            console.log(finalQueryResult);
            var myJsonObject = JSON.parse(finalQueryResult);
            for (var i = 0; i < myJsonObject.length; i++) {
                populateTable1(myJsonObject[i], "searchResult", i);
            }
        }
    };

    xhr.open("POST", url, true);

    xhr.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );

    xhr.send(params);
}


  function Go() {
    clearLogicOperationDiv();
    var operation = getOperationSelected();
    if (operation == "Search") {
        console.log("Search selected");
        performSearch();
    } else {
        console.log("error at Go()");
    }
}

function getOperationSelected() {
    var radioButtonValue;
    radioButtonValue = "Search";

    return radioButtonValue;
}


function clearLogicOperationDiv() {
    var operationLogicDiv = document.getElementById("logicDiv");
    while (operationLogicDiv.hasChildNodes()) {
        operationLogicDiv.removeChild(operationLogicDiv.firstChild);
    }
}



function performSearch() {
    console.log("This is inside performSearch");
    var OpLogicDiv = document.getElementById("logicDiv");
    var inputTextBox = createTextBox(
        OpLogicDiv,
        "search" + "_" + "1",
        "Enter a book title (partial or full) and search: ",
        ""
    );
    var button = document.createElement("button");
    button.innerHTML = "Search";

    OpLogicDiv.appendChild(button);

    button.addEventListener("click", function () {
        clearLogicOperationDiv();
        var partialOrFullTitle = inputTextBox.value;

        console.log("partial or full title String:" + partialOrFullTitle);
        displaySearchResultTable(partialOrFullTitle);
    });
}

function displaySearchResultTable(partialOrFullTitle) {
    var parentDiv = document.getElementById("logicDiv");
    var table = document.createElement("TABLE");
    table.className = "altrowstable";
    table.id = "searchTable";
    parentDiv.appendChild(table);
    console.log(table);
    var query = getSearchQuery(partialOrFullTitle);
    var url = "localhost";
    var params = "table=" + "search" + "&query=" + query;
    console.log("Search query:" + query);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var finalQueryResult = xhr.responseText;
            console.log(finalQueryResult);
            var myJsonObject = JSON.parse(finalQueryResult);


            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
            var row = table.insertRow(-1);
            row.className = "headingrowcolor2";
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);
            var cell8 = row.insertCell(7);
            var cell9 = row.insertCell(8);

            cell1.innerHTML = "title".bold();
            cell2.innerHTML = "availability".bold();
            cell5.innerHTML = "authorFirst".bold();
            cell6.innerHTML = "authorLast".bold();
            cell7.innerHTML = "publisherCode".bold();
            cell8.innerHTML = "publisherName".bold();
            cell9.innerHTML = "city".bold();
            for (var i = 0; i < myJsonObject.length; i++) {
                populateTable(myJsonObject[i], "searchResult", i);
            }
        }
    };
    xhr.open("POST", url, true);

    xhr.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );

    xhr.send(params);
}



function getSearchQuery1(partialOrFullTitle) {
    var searchQ =
        "select B.title, B.numCopies, A.authorLast, A.authorFirst, P.publisherName from book B, author A, publisher P, wrote W where (B.publisherCode ~ P.publisherCode and A.authorNum ~ W.authorNum and W.bookCode ~ B.bookCode) and B.title LIKE " +
        '"%' +
        partialOrFullTitle +
        '%"';
    return searchQ;
}

function getSearchQuery(partialOrFullTitle) {
    var searchQ =
        "select B.title, B.numCopies, A.authorNum,A.authorLast,A.authorFirst,P.publisherCode,P.publisherName,P.city from book B, author A,publisher P, wrote W where (B.publisherCode ~ P.publisherCode and A.authorNum ~ W.authorNum and W.bookCode ~ B.bookCode) and B.title LIKE " +
        '"%' +
        partialOrFullTitle +
        '%"';
    return searchQ;
}

function createTextBox(parent, ID, lable, text) {
  var newDiv = document.createElement("div");
  newDiv.id = "divOf_" + ID;
  newDiv.className = "newDiv";
  var element = document.createElement("input");
  element.id = ID;

  var label = document.createElement("Label");
  label.innerHTML = lable;

  element.setAttribute("type", "text");
  element.setAttribute("value", text);
  element.setAttribute("name", "Test Name");
  element.setAttribute("style", "width:200px");

  label.setAttribute("style", "font-weight:normal");

  newDiv.appendChild(label);
  newDiv.appendChild(element);
  parent.appendChild(newDiv);
  return element;
}



function populateTable(json, tablesql, i) {
  var table = document.getElementById("myTable");

  if (tablesql == "searchResult") {
    console.log("searchResult selected");
    var table = document.getElementById("searchTable");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);

    cell1.innerHTML = json.title;
    cell2.innerHTML = json.OnHand;
    cell3.innerHTML = json.BranchNum;
    cell4.innerHTML = json.authorNum;
    cell5.innerHTML = json.authorLast;
    cell6.innerHTML = json.authorFirst;
    cell7.innerHTML = json.publisherCode;
    cell8.innerHTML = json.publisherName;
    cell9.innerHTML = json.city;
  } 
   else {
    console.log("Error at populateTable");
  }
}*/
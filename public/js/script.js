document.getElementById("btn-search").addEventListener("click", function () {
  var textBox = document.getElementById("input-search");
  var searchVal = textBox.value;
  console.log("partial or full title String:" + searchVal);
  //clearLogicOperationDiv();
  makeTableRequest(searchVal);
});


jQuery(document).on('click','.clickableRow',function(){
    window.location = $(this).data("href");
});

jQuery(document).ready(function($) {
    $(".clickableRow").on("click", function () {
        console.log("clickable");
        window.location = $(this).data("href");
    });
});


function makeTableRequest(searchVal) {
    const xhttp = new XMLHttpRequest();
    const url = "http://localhost:5656/" 

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );
    xhttp.send("like=" + searchVal + "&col=title" );

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var finalQueryResult = xhttp.responseText;
            console.log(finalQueryResult);
            var myJsonObject = JSON.parse(finalQueryResult);

            clear();
            populateTable(myJsonObject, myJsonObject.length);     
        };
    };
};

function clear() {
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

function insertRow(rowData, num){
    var table = document.getElementById("tableBrowseBody");
    var row = table.insertRow(-1);
    row.className = "clickableRow";
    row.setAttribute('data-href', '/details/:'+ rowData.bookCode)
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);

    cell0.innerHTML = num;
    cell1.innerHTML = rowData.title;
    cell2.innerHTML = rowData.authorFirst + " "+ rowData.authorLast;
    cell3.innerHTML = rowData.publisherName;
    cell4.innerHTML = rowData.numCopies;
}


function moveToCart(itemId){
    console.log(itemId);
    const xhttp = new XMLHttpRequest();
    const url = "http://localhost:5656/addCart" 

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );

    
    xhttp.send("code=" + itemId);
}

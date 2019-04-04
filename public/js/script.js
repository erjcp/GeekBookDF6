

// document.getElementById("btn-search").addEventListener("click", function ()
//  {
//   var textBox = document.getElementById("input-search");
//   var searchVal = textBox.value;
//   var sortBox = document.getElementById("select-sort");
//   var sortVal = sortBox.value;
//   console.log("partial or full title String:" + searchVal);
//   //clearLogicOperationDiv();
//   makeTableRequest(searchVal, sortVal); /// MAKING A TABLE REQUEST

// });


// jQuery(document).on('click','.clickableRow',function(){
//     window.location = $(this).data("href");
// });

// jQuery(document).ready(function($) {
//     $(".clickableRow").on("click", function () {
//         console.log("clickable");
//         window.location = $(this).data("href");
//     });
// });





//function makeTableRequest(data), endpoint)  
function makeTableRequest(data)
{
    {
        const xhttp = new XMLHttpRequest();
        const url = "http://localhost:5656/register" 
        //const url = "http://localhost:5656/" + endpoint; 

        xhttp.open("POST", url, true);
        //- xhttp.setRequestHeader(
        //-     "Content-type",
        //-     "application/x-www-form-urlencoded"
        //- );
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        console.log("Sending ", data)
        xhttp.send(JSON.stringify(data));
    }



//     xhttp.send("like=" + searchVal + "&col=" + sortVal );

//     xhttp.onreadystatechange = function() 
//     {
//         if (this.readyState == 4 && this.status == 200) 
//         {
//             var finalQueryResult = xhttp.responseText;
//             console.log(finalQueryResult);
//             var myJsonObject = JSON.parse(finalQueryResult);

//             clearTable();
//             populateTable(myJsonObject, myJsonObject.length);     
//         };
//     };
    
// };

// function clearTable() {
//     let count = $('#tableBrowseBody tr').length;
//     //console.log("count is " + count);
//     let i;
//     for(i = 0; i < count; i++){
//         //console.log("delete " + i)
//         document.getElementById("tableBrowseBody").deleteRow(-1);
//     }
// }

// function populateTable(json, length) {
//     for (var i = 0; i < length; i++) {
//         insertRow(json[i], i)
//     } 
// }

// function insertRow(rowData, num){
//     var table = document.getElementById("tableBrowseBody");
//     var row = table.insertRow(-1);
//     row.className = "clickableRow";
//     row.setAttribute('data-href', '/details/:'+ rowData.bookCode)
//     var cell0 = row.insertCell(0);
//     var cell1 = row.insertCell(1);
//     var cell2 = row.insertCell(2);
//     var cell3 = row.insertCell(3);
//     var cell4 = row.insertCell(4);
//     var cell5 = row.insertCell(5);
//     var cell6 = row.insertCell(6);
//     var cell7 = row.insertCell(7);

//     cell0.innerHTML = num;
//     cell1.innerHTML = rowData.title;
//     cell2.innerHTML = rowData.authorFirst + " "+ rowData.authorLast;
//     cell3.innerHTML = rowData.genre
//     cell4.innerHTML = rowData.publisherName;
//     cell5.innerHTML = "$" + rowData.price.toFixed(2); // Two decimal places
//     if(rowData.Average == null)
//         {cell6.innerHTML = "N/A"}
//     else
//         {cell6.innerHTML = rowData.Average.toFixed(1)}; // One decimal place
//     cell7.innerHTML = rowData.numCopies;
// }


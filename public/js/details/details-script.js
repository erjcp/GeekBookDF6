// DETAILS FUNTIONALITY
// ADD USERNAME NICKNAME TO INSERT REVIEW
var userId = '0002';


$(document).ready(function() {
    //console.log("ON PAGE LOAD!!");
  makeReviewsRequest();
 });


document.getElementById("postReview").addEventListener("click", function () {
    var disabled = document.getElementById("input-title-review").hasAttribute("Disabled");
    if(!disabled){
        var radio = document.getElementsByClassName("reviewRating");
        var heading = document.getElementById("input-title-review").value;
        var nickName = "Nickname test replace me";
        var reviewDate = new Date().toISOString().slice(0, 19);
        var score = 1;
        var review = document.getElementById("input-review").value;
    
        var i;
        for (i = 0; i < radio.length; i++) {
            if (radio[i].checked){
                score = radio[i].value;
            }
        }
    
        var data = {heading: heading, nickName: nickName, reviewDate: reviewDate, score: score, heading: heading, review: review};
        console.log("THIS IS THE JSON DATA");
        console.log(data);
        
        //makeReviewsRequest();
        makeReviewInsert(data);   
        clearForm(); 
        //insertReview(data, true);
    } else {
        showMessage("You have already posted a review for this book!");
    }


  });


function showMessage(message){
    var alert = document.getElementById('alertMessage');
    alert.innerHTML = message;
    alert.style.display = "block";
}

function makeReviewInsert(data){
    var result;
    var location = window.location.href;
    console.log("Location website is: " + location)
    
    const xhttp = new XMLHttpRequest();
    const url = location;

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );
    xhttp.send("request=insert&heading="+data.heading+"&nickName="+data.nickName+"&date="+data.reviewDate+"&score="+data.score+"&review="+data.review);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var finalQueryResult = xhttp.responseText;
            console.log("result is:"+finalQueryResult+"|");
            var myJsonObject = JSON.parse(finalQueryResult);
            console.log("paresed result is:"+myJsonObject+"|");
            if (typeof myJsonObject.errno !== 'undefined'){
                disableReviews();
                showMessage("You have already posted a review for this book!");
            }
            if (myJsonObject.affectedRows == 1){
                insertReview(data, true); 
                disableReviews();
            }
            //console.log("BEFORE POPULATE!");
            //clearTable();
            //populateReviews(myJsonObject, myJsonObject.length);     
        };
    };
};


function makeReviewsRequest() {
    var location = window.location.href;
    console.log("Location website is: " + location)
    
    const xhttp = new XMLHttpRequest();
    const url = location;

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );
    xhttp.send("request=select");

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var finalQueryResult = xhttp.responseText;
            console.log(finalQueryResult);
            var myJsonObject = JSON.parse(finalQueryResult);
            //console.log("BEFORE POPULATE!");
            //clearTable();
            populateReviews(myJsonObject, myJsonObject.length);     
        };
    };
};

function clearForm(){
    var title = document.getElementById('input-title-review');
    var body = document.getElementById('input-review');

    title.value = "";
    body.value = "";
}

function disableReviews(){
    var title = document.getElementById('input-title-review');
    var body = document.getElementById('input-review');

    clearForm();
    title.setAttribute("Disabled", "");
    body.setAttribute("Disabled", "");
}

function populateReviews(json, length) {
    for (var i = 0; i < length; i++) {
        insertReview(json[i]);
    } 
}

function insertReview(data, isTop = false){
    if(data.customerId == userId){
        disableReviews();
    }
    var list = document.getElementById("reviewUl");
    var firstItem = list.firstChild;
    
    var listItem = document.createElement("li");
    var rows = [];
    var colInRows = [];

    for (i = 0; i < 4; i++){
        rows[i] = document.createElement("div");
        colInRows[i] = document.createElement("div");

        rows[i].className = "row";
        colInRows[i].className = "col";

        rows[i].appendChild(colInRows[i]);
    }

    var userDiv = document.createElement("div");
    userDiv.className = "pull-left"
    var userImage = document.createElement("img");
    userImage.className = "rounded-circle profilepic";
    userImage.src = "http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png";
    var userName = document.createElement("strong");
    userName.className = "text-success";
    userName.innerHTML = "@"+data.nickName;
    userDiv.appendChild(userImage);
    userDiv.appendChild(userName);
    colInRows[0].appendChild(userDiv);


    var title = document.createElement("h6");
    title.innerHTML = data.heading + " - ";
    var rating = document.createElement("span");
    rating.className = "text-muted pull-right";
    rating.innerHTML = data.score;
    title.appendChild(rating);
    colInRows[1].appendChild(title);


    var date = document.createElement("span");
    date.className = "text-muted";
    // Split timestamp into [ Y, M, D, h, m, s ]
    var t = data.reviewDate.split("T");
    // Apply each element to the Date function
    //var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
    date.innerHTML = t[0];
    colInRows[2].appendChild(date);

    var pdiv = document.createElement("div");
    pdiv.className = "media-body";
    var body = document.createElement("p");
    body.innerHTML = data.review;
    pdiv.appendChild(body);
    colInRows[3].appendChild(pdiv);

    rows.forEach(function(e){
        listItem.appendChild(e);
    });

    if(isTop){
        list.insertBefore(listItem, firstItem);
    }else{
        list.appendChild(listItem);
    }
    

}

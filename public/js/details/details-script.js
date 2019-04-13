// DETAILS FUNTIONALITY
// ADD USERNAME NICKNAME TO INSERT REVIEW
var userId = 1;
var detailsIsUpdate = false;

const INSERT = 1;
const SELECT = 2;
const UPDATEHR = 3;
const UPDATES = 4;
const UPDATEHSR = 5;
const ERROR = -1;
const ERROR2 = -2;
/*
var score;
console.log(average);
if (average== undefined)
{
    score = 'N/A';
}
else
{
    score = average + ' out of 5 Stars';
}*/

$(document).ready(function() {
    //console.log("ON PAGE LOAD!!");
  makeReviewsRequest();
 });

function getFormData(){
    var radio = document.getElementsByClassName("reviewRating");
    var heading = document.getElementById("input-title-review").value;
    var nickName = "Nickname test replace me";
    var reviewDate = new Date().toISOString().slice(0, 19);
    var score = "";
    var review = document.getElementById("input-review").value;

    var i;
    for (i = 0; i < radio.length; i++) {
        if (radio[i].checked){
            score = radio[i].value;
        }
    }

    var data = {heading: heading, nickName: nickName, reviewDate: reviewDate, score: score, review: review};
    return data;
}

function updateButton(e){
    var data = getFormData();
    var type = getPostType(data);
    var button = document.getElementById("postReview");
    switch(type) {
        case INSERT:
          // INSERTS 
          button.innerHTML = "New Post"  
          break;
        case UPDATEHR:
          // UPDATED HEADING AND REVIEW
          button.innerHTML = "Update Post" 
          break;
        case UPDATES:
          // code block
          button.innerHTML = "Update Post" 
          break;
        case UPDATEHSR:
          // code block
          button.innerHTML = "Update Post" 
          break;
        case ERROR:
          // code block
          button.innerHTML = "Invalid Post" 
          break;
        case ERROR2:
          // code block
          button.innerHTML = "Invalid Post" 
          break;
        default:
          // code block
      }
    
}

document.getElementById("postReview").addEventListener("click", function () {
    var disabled = document.getElementById("input-title-review").hasAttribute("Disabled");
    var validData = true;
    if(!disabled){
        /*
        var radio = document.getElementsByClassName("reviewRating");
        var heading = document.getElementById("input-title-review").value;
        var nickName = "Nickname test replace me";
        var reviewDate = new Date().toISOString().slice(0, 19);
        var score = "";
        var review = document.getElementById("input-review").value;
    
        var i;
        for (i = 0; i < radio.length; i++) {
            if (radio[i].checked){
                score = radio[i].value;
            }
        }*/
    
        var data = getFormData();

        console.log("THIS IS THE JSON DATA");
        console.log(data);

        var choice = getPostType(data);

        if (choice !== ERROR && choice !== ERROR2){
            makeReviewInsert(data, choice);
            makeReviewsRequest(); 
            clearForm(); 
            showMessage(choice);
        }else{
            if (choice == ERROR){
                showMessage("Please fill in missing Title or Comment!");
            }else{
                showMessage("Please give a Score or Comment with Title!");
            }
            
        }
    } else {
        showMessage("You have already posted a review for this book!");
    }


  });


function showMessage(message){
    var alert = document.getElementById('alertMessage');
    alert.style.display = "block";
    $("#alertMessage").removeClass("alert-danger");
    $("#alertMessage").addClass("alert-success");
    switch(message) {
        case INSERT:
          // code block
          alert.innerHTML = "Review posted!";
          break;
        case UPDATEHR:
          // code block
          console.log("YESSS");
          alert.innerHTML = "Review comment updated!";
          break;
        case UPDATES:
          // code block
          alert.innerHTML = "Review score updated!";
          break;
        case UPDATEHSR:
          // code block
          alert.innerHTML = "Review updated!";
          break;
        default:
          // code block
          alert.innerHTML = message;
          $("#alertMessage").removeClass("alert-success");
          $("#alertMessage").addClass("alert-danger");
      }



}

function hideMessage(){
    var alert = document.getElementById('alertMessage');
    alert.style.display = "none";
}

function getPostType(data){
    var isScore = false;
    var isHeading = false;
    var isReview = false;

    for (var key in data){
        if(key == "score" && data[key] !== ""){
            isScore = true;
        } else if(key == "heading" && data[key] !== ""){
            isHeading = true;
        } else if(key == "review" && data[key] !== ""){
            isReview = true;
        }
    }

    if (!detailsIsUpdate){
        if(isHeading !== isReview){
            return ERROR;
        }else{
            if(!isHeading && !isReview && !isScore){
                return ERROR2;
            }else{
                return INSERT;
            }
            
        }
    }

    else if ((isHeading && isReview) && !isScore){
        return UPDATEHR;
    }else if ((!isHeading && !isReview) && isScore){
        return UPDATES;
    }else if (isHeading && isReview && isScore){
        return UPDATEHSR;
    }else{
        return ERROR2;
    }
}

function makeReviewInsert(data, choice){
    var request=choice;
    var location = window.location.href;
    //console.log("Location website is: " + location)
    
    const xhttp = new XMLHttpRequest();
    const url = location;

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );
    xhttp.send("request="+request+"&heading="+data.heading+"&customerId="+userId+"&date="+data.reviewDate+"&score="+data.score+"&review="+data.review);
    console.log("SENT: request="+request+"&heading="+data.heading+"&customerId="+userId+"&date="+data.reviewDate+"&score="+data.score+"&review="+data.review);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var finalQueryResult = xhttp.responseText;
            console.log(request+": result is- "+finalQueryResult+"|");
            var myJsonObject = JSON.parse(finalQueryResult);
            console.log("paresed result is:"+myJsonObject+"|");
            if (typeof myJsonObject.errno !== 'undefined'){
                //disableReviews();
                //showMessage("You have already posted a review for this book!");
            }
            if (myJsonObject.affectedRows == 1){
                //insertReview(data, true); 
                //disableReviews();
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
    xhttp.send("request="+SELECT);
    console.log("SENT: request="+SELECT);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var finalQueryResult = xhttp.responseText;
            console.log("SELECT: result is- "+finalQueryResult);
            var myJsonObject = JSON.parse(finalQueryResult);
            //console.log("BEFORE POPULATE!");
            //clearTable();
            clearReviews();
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

function setUpdate(bool){
    detailsIsUpdate = bool;
}

function clearReviews(){
    var list = document.getElementById("reviewUl");
    list.innerHTML = '';
    
}

function populateReviews(json, length) {
    for (var i = 0; i < length; i++) {
        insertReview(json[i]);
    } 
}

function insertReview(data, isTop = false){
    console.log()
    if(data.customerId == userId){
        setUpdate(true);
        //disableReviews();
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
    title.innerHTML = data.heading;
    if (data.heading !== "" && data.heading !== null){
        title.innerHTML += "  ";
    } 
    var rating = document.createElement("span");
    rating.className = "text-muted pull-right";
    if (data.score !==null) {
 
        for(i = 0; i<parseInt(data.score); i++){
            console.log("making star!");
            var star = document.createElement("i");
            star.className = "fas fa-star";
            star.setAttribute("style", "color: gold;");
            title.appendChild(star)
        }
    }
    //rating.innerHTML = data.score;
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
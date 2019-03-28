
// DETAILS FUNTIONALITY

document.getElementById("postReview").addEventListener("click", function () {
    var reviewBox = document.getElementById("input-search");
    var reviewBody = reviewBox.value;
    var rating = getRating();


    console.log("partial or full title String:" + searchVal);
    //clearLogicOperationDiv();
    makeTableRequest(searchVal);
  });

function getRating(){
    let radios = document.getElementsByName('rating');
    let rating = -1;

    for (var i = 0, length = radios.length; i < length; i++)
    {
        if (radios[i].checked)
        {

            rating = radios[i].value;

            break;
        }
    }
    return rating;
}
var cartList = [];
var saveList = [];
var cartTotal = 0;
jQuery(document).ready(function() {
    console.log("Loading");
  cartRequest();
 });

 function cartRequest() {
    
    const xhttp = new XMLHttpRequest();
    const url = "http://localhost:5656/cart";

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );
    xhttp.send("");

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var finalQueryResult = xhttp.responseText;
            console.log(finalQueryResult);
            var myJsonObject = JSON.parse(finalQueryResult);
            populateCart(myJsonObject, myJsonObject.length);
            //console.log("jsonObject: " + myJsonObject);
            //call function reload cart
            loadCart();
            console.log("loadCart called");
        };
    };
};

function populateCart(json, length){
    for (var i = 0; i < length; i++) {
        insertItem(json[i]);
    } 
    console.log("populate cart");
}

//inserts item into array
function insertItem(cartItem){

    var item = {
        cover: cartItem.cover,
        title : cartItem.title,
        price : cartItem.price,
        bookId : cartItem.bookId,
        cartType : cartItem.cartType,
        quantity : cartItem.quantity
    }
    if(item.cartType == 1){
        cartList.push(item);
    }
    else{saveList.push(item);}

     
    console.log(item);

}

function removeItem(key, type){
    clearTable("saveBody", 0);
    clearTable("cartBody", 1);

    if(type === 1){
        var cartItem = cartList[key];
        //cartTotal -=(cartItem.quantity * cartItem.price);
        cartList.splice(key, 1);
    }
    else{
        saveList.splice(key, 1);  
    }

    loadCart();
    console.log("item removed");
}

function clearTable(body, num) {
    console.log("hello");
    let count = $("#"+body +" tr").length;
    console.log("count is " + count);
    let i;
    for(i = 0; i < count; i++){
        //console.log("delete " + i)
        document.getElementById(body).deleteRow(-1);
    }
    
}

function moveItem(key, num){
    
    clearTable("saveBody", 0);
    clearTable("cartBody", 1);

    var cartItem;
    
    if(num === 1){
        cartItem = cartList[key];
        //cartTotal -=(cartItem.quantity * cartItem.price);
        cartItem.cartType = 0;
        saveList.push(cartItem);
        cartList.splice(key, 1);
    }
    else{
        cartItem = saveList[key];
        cartItem.cartType = 1;
        cartList.push(cartItem);
        saveList.splice(key, 1);
    }
    loadCart();
    console.log("moved: ");


}


function loadCart(){
    console.log("loading cart");
    var cartBody = "cartBody";
    loadCart1(cartBody, cartList, 1);
    var saveBody = "saveBody";
    loadCart1(saveBody, saveList, 0);
}

function loadCart1(body, arr, type){
    var t = document.getElementById(body);

    if(type === 1){
        cartTotal = 0;
    }
    for(j = 0; j < arr.length; j++){
        
        var row = t.insertRow(-1);
        var cell = row.insertCell(0)
        var cell0 = row.insertCell(1);
        var cell1 = row.insertCell(2);
        var cell2 = row.insertCell(3);
        var cell3 = row.insertCell(4);

        var productDiv = document.createElement("div");
        productDiv.className = "wrapper";
        var imageDiv = document.createElement("div");
        imageDiv.className = "left";
        imageDiv.style = "width:20%";
        var image = document.createElement("img");
        image.style = "width:100px;height:100px;";
        image.src = arr[j].cover;
        imageDiv.appendChild(image);
        productDiv.appendChild(imageDiv);
        cell.appendChild(productDiv);


        var titleDiv = document.createElement("div");
        var title = document.createElement("h4");
        titleDiv.style = "width:50%";
        titleDiv.className = "right";
        title.innerHTML = arr[j].title;
        titleDiv.appendChild(title);


        var addButton = document.createElement("button");
        addButton.id = "btn-info";
        addButton.style = "background-color: #008CBA";
        if (body === "cartBody"){addButton.innerHTML = "Save for Later";}
        else{addButton.innerHTML = "Add To Cart";}
        addButton.setAttribute('onclick', 'moveItem('+j+', '+type+')');
        
        titleDiv.appendChild(addButton);
        //productDiv.appendChild(titleDiv);
        cell0.appendChild(titleDiv);

        var removeButton = document.createElement("button");
        removeButton.id = "btn-danger";
        removeButton.style = "background-color:#f44336";
        removeButton.innerHTML = "Remove";
        removeButton.setAttribute('onclick', 'removeItem('+j+', '+type+')');

        titleDiv.appendChild(removeButton);
        //productDiv.appendChild(titleDiv);
        //cell0.appendChild(productDiv);

        var formatPrice = currencyFormat(arr[j].price);
        var price = document.createElement("div");
        price.innerHTML = formatPrice;
        price.style = "text-align:center";
        cell1.appendChild(price);

        var q = document.createElement("input");
        q.type = "number";
        q.placeholder = arr[j].quantity;
        q.id = "input-quantity";
        q.min = 1;
        q.max = 100;
        cell2.appendChild(q);

        //var num = document.getElementById("input-quantity").value;
        
        q.setAttribute('onchange', 'changeQuantity(this.value, '+j+', '+type+')');


        var subTotal = arr[j].price * arr[j].quantity;
        if(type === 1){cartTotal += subTotal;}
        var formatSub = currencyFormat(subTotal);
        var sub = document.createElement("div");
        sub.innerHTML = formatSub;
        sub.style = "text-align:center";
        cell3.appendChild(sub);

        
        
        
        
    }
    var formatTotal = currencyFormat(cartTotal);
    var totalDisplay = document.getElementById("totalBody");
    totalDisplay.innerHTML = "Total: " + formatTotal;
    console.log("total" + formatTotal);
    
}

function changeQuantity(num, key, type){
    clearTable("saveBody", 0);
    clearTable("cartBody", 1);


    var cartItem;
    if(type ===1){
        cartItem = cartList[key];
        console.log(cartItem);
        cartItem.quantity = num;
        cartList[key] = cartItem;
        console.log("replaced quantity" + cartItem);
    }
    else{
        cartItem = saveList[key];
        cartItem.quantity = num;
        saveList[key] = cartItem;

        console.log("replaced quantity: " + saveList[key].quantity);
    }

    loadCart();
}

function currencyFormat(num) {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
<<<<<<< HEAD
  }
=======
  }

  function updateCart(){
    
    clearCart();
    for (var i = 0; i < length; i++) {
        updateCart(i, 1);
    } 
    for (var i = 0; i < length; i++) {
        updateCart(i, 0);
    } 
    console.log("updateCart");
  }

  function clearCart(){
    const xhttp = new XMLHttpRequest();
    const url = "http://localhost:5656/clearCart" 

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );


  }

  function updateCart1(i, type){
    const xhttp = new XMLHttpRequest();
    const url = "http://localhost:5656/updateCart" 

    var cartItem;

    if(type === 1){
        cartItem = cartList[i];
    }
    else{
        cartItem = saveList[i];
    }

    var orderId = cartItem.orderId;
    var bookId = cartItem.bookId;
    var cartType = cartItem.cartType;
    var quantity = cartItem.quantity;

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );

    
    xhttp.send("orderId=" + orderId + "bookId=" + bookId + "cartType=" + cartType + "quantity=" + quantity);
  }

  document.getElementById("btn-warning").addEventListener("click", function () {
    updateCart();
  });
  document.getElementById("btn-success").addEventListener("click", function () {
    updateCart();
  });
>>>>>>> parent of a07bb3c... trying to merge

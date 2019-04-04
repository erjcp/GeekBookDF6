//gets an element by id
function getInputVal(id) {
  const input = document.getElementById(id);
  return input.value;
}

//declarations

var address = getInputVal("address");
var city = getInputVal("city");
var zip = getInputVal("zip");
var state = getInputVal("state");

//build object with all the fields
function schema(

  address,
  city,
  zip,
  state
) {
 
  this.address = address;
  this.city = city;
  this.zip = zip;
  this.state = state;
}

//submit the data
function getdata() {
  var data = schema(
    
    address,
    city,
    zip,
    state
  );
  console.log(data.toString());
}

//gets an element by id
function getInputVal(id) {
  const input = document.getElementById(id);
  return input.value;
}

//declarations
var email = getInputVal("email");
var pw = getInputVal("pw");
var firstName = getInputVal("firstName");
var lastName = getInputVal("lastName");
var nickName = getInputVal("nickName");
var address = getInputVal("address");
var city = getInputVal("city");
var zip = getInputVal("zip");
var state = getInputVal("state");

//build object with all the fields
function schema(
  email,
  pw,
  firstName,
  lastName,
  nickName,
  address,
  city,
  zip,
  state
) {
  this.email = email;
  this.pw = pw;
  this.firstName = firstName;
  this.lastName = lastName;
  this.nickName = nickName;
  this.address = address;
  this.city = city;
  this.zip = zip;
  this.state = state;
}

//submit the data
function getdata() {
  var data = schema(
    email,
    pw,
    firstName,
    lastName,
    nickName,
    address,
    city,
    zip,
    state
  );
  console.log(data.toString());
}

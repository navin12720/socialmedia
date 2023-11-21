const form = document.getElementById("frm");
const email = document.getElementById("email");
const passfield = document.getElementById("password");
const confirmPassField = document.getElementById("conform");
String.prototype.isEmail = function () {
  return !!this.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
};
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!email.value.trim().isEmail()) {
    email.parentElement.classList.add("error");
    return;
  } else {
    email.parentElement.classList.remove("error");
  }
  if (passfield.value.trim() != confirmPassField.value.trim()) {
    passfield.parentElement.classList.add("error");
    confirmPassField.parentElement.classList.add("error");
    return;
  } else {
    form.submit();
  }
});

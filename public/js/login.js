const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn"); 
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
document.getElementById("showthis1").style.display = "none";

document.getElementById('checkbox1').onclick = function() {
  // call toggleSub when checkbox clicked
  // toggleSub args: checkbox clicked on (this), id of element to show/hide
  toggleSub(this, 'showthis1');
};

// called onclick of checkbox
function toggleSub(box, id) {
  // get reference to related content to display/hide
  var el = document.getElementById(id);
  
  if ( box.checked ) {
      el.style.display = 'block';
  } else {
      el.style.display = 'none';
  }
}

document.getElementById("showthis2").style.display = "none";

document.getElementById('checkbox2').onclick = function() {
  // call toggleSub when checkbox clicked
  // toggleSub args: checkbox clicked on (this), id of element to show/hide
  toggleSub(this, 'showthis2');
};

// called onclick of checkbox
function toggleSub(box, id) {
  // get reference to related content to display/hide
  var el = document.getElementById(id);
  
  if ( box.checked ) {
      el.style.display = 'block';
  } else {
      el.style.display = 'none';
  }
}

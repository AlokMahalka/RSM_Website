
const inputs = document.querySelectorAll(".input");
function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}
function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}
inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
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

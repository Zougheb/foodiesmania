function init(){
	attachClickToProfileImage();
}

function attachClickToProfileImage(){

	if(document.getElementById('image-file')){
		let imageFileEl = document.getElementById('image-file');
		imageFileEl.onclick = () => {
			document.getElementById('image-profile-upload').style.visibility = "visible";
		}
	}
	
}
init();

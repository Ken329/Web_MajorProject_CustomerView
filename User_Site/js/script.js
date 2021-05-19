var firebaseConfig = {
    apiKey: "AIzaSyDygRZqNcr-77d6r80_4kDZwT-K_mRS6hU",
    authDomain: "eatsy-d60ac.firebaseapp.com",
    databaseURL: "https://eatsy-d60ac-default-rtdb.firebaseio.com",
    projectId: "eatsy-d60ac",
    storageBucket: "eatsy-d60ac.appspot.com",
    messagingSenderId: "32542278845",
    appId: "1:32542278845:web:ea6cefe70affab0e8463d4",
    measurementId: "G-3QZNVWFP62"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var error = document.getElementById("error_message");
var loading = document.getElementById("loading_message");

document.getElementById("submit").addEventListener("click", function(){
    var name = getData("name");
    var price = getData("price");
    var desc = getData("description");
    var e = document.getElementById("categories")
    var cate = e.options[e.selectedIndex].text;
    var image = document.getElementById("image").files[0];
    
    if(!check(name) || !check(price) || !check(desc) || !check(cate) || !check(image)){
        error.style.display = "flex";
    }else{
        var storageRef = firebase.storage().ref('images/'+name);
        var uploadTask = storageRef.put(image);

        uploadTask.on("state_changed", function(snapshot){
            var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            var wholeProgress = Math.floor(progress);
            loading.style.display = "flex";
            loading.innerHTML = "Uploading " + wholeProgress + " %";
        },function(error){
            console.log(error.message);
        },function(){
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
                firebase.database().ref('food/').push().set({
                    name:name,
                    price:price,
                    description:desc,
                    categories:cate,
                    imageURL:downloadURL,
                    availability:"yes"
                },function(error){
                    if(error){
                        alert("Error appeared");
                    }else{
                        setTimeout(loading.style.display = "none", 2000);
                        document.getElementById("user_form").reset();
                    }
                })
            })
        })
    }
    setTimeout(hide, 3000);
})
function hide(){
    error.style.display = "none";
}
function check(data){
    if(data === null || data === "" || data == undefined){
        return false;
    }
    return true;
}
function getData(id){
    return document.getElementById(id).value;
}
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
firebase.initializeApp(firebaseConfig);

var menu = document.getElementById("menu_div");
var loader = document.getElementById("loader");

getData();

function getData(){
    let html = "";
    firebase.database().ref("food/").once("value").then(function(snapshot){
        var data = snapshot.val();
        for(let[key, value] of Object.entries(data)){
            html+= `<div class="menu-main-content">`;
            html+= `<img src="${value.imageURL}" alt="" srcset="">`;
            html+= `<form>`;
            html+= `<label>Name: </label>`;
            html+= `<input type="text" name="name" id="name${key}" placeholder="Name" value="${value.name}">`;
            html+= `<label>Price: </label>`;
            html+= `<input type="text" name="price" id="price${key}" placeholder="Price" value="${value.price}">`;
            html+= `<label>Available: </label>`;
            html+= `<input type="text" name="available" id="available${key}" placeholder="yes / no" value="${value.availability}">`;
            html+= `</form>`;
            html+= `<div>`;
            html+= `<button id="${key}" class="edit-btn" type="button" onClick="editMenu(this.id)">Edit</button>`;
            html+= `<button id="${key}" class="delete-btn" type="button" onClick="removeMenu(this.id)">Delete</button>`;
            html+= `</div>`;
            html+= `</div>`;
        }
        menu.innerHTML = html;
        loader.style.display = "none";
        menu.style.display = "flex";
    })
}
function editMenu(id){
    var name = document.getElementById("name"+id).value;
    var price = document.getElementById("price"+id).value;
    var available = document.getElementById("available"+id).value;
    
    if(available === "yes"|| available === "no"){
        firebase.database().ref('food/'+id).update({
            name:name,
            price:price,
            availability:available
        },function(error){
            if(error){
                console.log("Error Occured");
            }else{
                alert("Updated Successfully");
                window.location.reload();
            }
        })
    }else{
        alert("Only accept yes / no in Availability section");
    }
}
function removeMenu(id){
    console.log(id);
}
// firebase verification
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

document.getElementById('categories-go-back').addEventListener('click', function(){
    //window.open('/', "_self");
    window.open('/Web_MajorProject_CustomerView/', "_self");
})
document.getElementById("categories-restaurant-con").addEventListener('click', function(e){
    //window.open(`../menu.html?restaurantID=${e.target.id}`, "_self");
    window.open(`/Web_MajorProject_CustomerView/menu.html?restaurantID=${e.target.id}`, "_self");
})

document.addEventListener('DOMContentLoaded', function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const categories = urlParams.get('categories');

    document.getElementById('categories-restaurant-h4').innerHTML = `${categories} Cuisine Restaurant`

    let html = "";

    if(categories === "All"){
        firebase.firestore().collection("user").get()
        .then(function(doc){
            doc.forEach((element)=>{
                html += `<div class="restaurant-div">
                            <img src="${element.data().user_image}" alt="" srcset="">
                            <div class="restaurant-div-info">
                                <h4>${element.data().user_restaurant}</h4>
                                <p>${element.data().user_cuisine}</p>
                                <p>From ${element.data().user_start_time} to ${element.data().user_end_time}</p>
                            </div>
                            <div class="click-me" id="${element.data().user_id}"></div>
                        </div>`;
            })
            document.getElementById("categories-restaurant-con").innerHTML = html;
        })
    }else{
        firebase.firestore().collection("user").where("user_cuisine", "==", categories).get()
        .then(function(doc){
            doc.forEach((element)=>{
                html += `<div class="restaurant-div">
                            <img src="${element.data().user_image}" alt="" srcset="">
                            <div class="restaurant-div-info">
                                <h4>${element.data().user_restaurant}</h4>
                                <p>${element.data().user_cuisine}</p>
                                <p>From ${element.data().user_start_time} to ${element.data().user_end_time}</p>
                            </div>
                            <div class="click-me" id="${element.data().user_id}"></div>
                        </div>`;
            })
            document.getElementById("categories-restaurant-con").innerHTML = html;
        })
    }
})
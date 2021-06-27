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

// restaurant div
var trenRestaurantCon = document.getElementById('trending-restaurant-con');
var trenRestaurantSelect = document.getElementById('trending-restaurant-select');
var trenRestaurantSearch = document.getElementById('trending-restaurant-search');
var trenRestaurantAll = document.getElementById('trending-restaurant-all');

//cuisine div
var cuisineCon = document.getElementById('cuisine_con');

var result = [];

getData();

trenRestaurantSelect.onchange = function(){
    alterData(trenRestaurantSelect.value, "categories", result);
}
trenRestaurantSearch.oninput = function(){
    alterData(trenRestaurantSearch.value, "search", result);
}
cuisineCon.addEventListener('click', function(e){
    if(e.target.className === "cuisine"){
        window.open(`/categories.html?categories=${e.target.id}`, "_self");
        //window.open(`/Web_MajorProject_CustomerView/categories.html?categories=${e.target.id}`, "_self");
    }
})
trenRestaurantAll.addEventListener('click', function(e){
    //window.open(`../categories.html?categories=All`, "_self");
    window.open(`/Web_MajorProject_CustomerView/categories.html?categories=All`, "_self");
})
trenRestaurantCon.addEventListener('click', function(e){
    if(e.target.className === "click-me"){
        //window.open(`../menu.html?restaurantID=${e.target.id}`, "_self");
        window.open(`/Web_MajorProject_CustomerView/menu.html?restaurantID=${e.target.id}`, "_self");
    }
})

function getData(){
    firebase.firestore().collection('user').get()
    .then(function(doc){
        doc.forEach((element)=>{
            result.push(element.data());
        })
        putData(result);
    })
}

function alterData(type, action, result){
    var newResult = [];
    if(action == "categories"){
        result.forEach((element)=>{
            if(element.user_cuisine === type){
                newResult.push(element);
            }
        })
    }else{
        result.forEach((element)=>{
            var name = element.user_restaurant.substring(0, type.length).toLowerCase();
            if(name === type.toLowerCase()){
                newResult.push(element);
            }
        })
    }
    putData(newResult);
}

function putData(result){
    let html = "";
    if(result.length !== 0){
        result.forEach((element)=>{
            html += `<div class="restaurant-div">
                        <img src="${element.user_image}" alt="" srcset="">
                        <div class="restaurant-div-info">
                            <h4>${element.user_restaurant}</h4>
                            <p>${element.user_cuisine}</p>
                            <p>From ${element.user_start_time} to ${element.user_end_time}</p>
                        </div>
                        <div class="click-me"  id="${element.user_id}"></div>
                    </div>`;
         })
    }else{
        html += `<h4 class="restaurant-h4">No restaurant found</h4>`;
    }
    trenRestaurantCon.innerHTML = html;
}
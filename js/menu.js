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

var result = [];
var categories = [];
var categoriesCon = document.getElementById('menu-categories-con');
var displayCon = document.getElementById('menu-display-con');

document.getElementById('categories-go-back').addEventListener('click', function(){
    //window.open('/', "_self");
    window.open('/Web_MajorProject_CustomerView/', "_self");
})

document.addEventListener('DOMContentLoaded', function(){
    var baseUrl = (window.location).href;
    var restaurantID = baseUrl.substring(baseUrl.lastIndexOf('=') + 1);
    

    firebase.firestore().collection('user').where("user_id", "==", restaurantID).get()
    .then((doc)=>{
        doc.forEach((element)=>{
            document.body.style.backgroundImage = `url(${element.data().user_image})`;
            firebase.firestore().collection("user").doc(element.data().user_id).collection('menu').get()
            .then((doc)=>{
                doc.forEach((element)=>{
                    result.push(element.data());
                })
                alterData();
            })
        })
    })
})

function alterData(){
    result.forEach((data)=>{
        categories.push(data.food_categories);
    })
    categories = uniq(categories);
    putCategories(categories);
    putDisplay(categories, result);
}

function putCategories(categories){
    let htmlCategories = "";
    let htmlDisplay = "";
    for(var i = 0; i < categories.length; i++){
        htmlCategories += `<li><a href="#${categories[i]}">${categories[i]}</a></li>`;
        htmlDisplay += `<h3 id="${categories[i]}">${categories[i]}</h3>
                    <div class="display-con-div" id="${categories[i]}_con"></div>`
    }
    categoriesCon.innerHTML = htmlCategories;
    displayCon.innerHTML = htmlDisplay;
}
function putDisplay(categories, display){
    for(var i = 0; i < categories.length; i++){
        var con = document.getElementById(categories[i] + "_con");
        let html = "";
        for(var k = 0; k < display.length; k++){
            if(display[k].food_categories === categories[i]){
                if(display[k].food_discount === "yes"){
                    var disPrice = parseFloat(display[k].food_price) - 2;
                    html += `<div class="menu-display-div">
                            <img src="${display[k].food_image}" alt="" srcset="">
                            <h4>${display[k].food_name}</h4>
                            <p>$${display[k].food_price}</p>
                            <button>Add to cart</button>
                            <div class="discount-logo">
                                <i class="fas fa-tags"></i>
                                RM 2 OFF
                            </div>
                            <div class="discount-price">
                                <div></div>
                                <p>$${disPrice}</p>
                            </div>
                        </div>`;
                }else{
                    html += `<div class="menu-display-div">
                            <img src="${display[k].food_image}" alt="" srcset="">
                            <h4>${display[k].food_name}</h4>
                            <p>$${display[k].food_price}</p>
                            <button>Add to cart</button>
                        </div>`;
                }
            }
        }
        con.innerHTML = html;
    }
}

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
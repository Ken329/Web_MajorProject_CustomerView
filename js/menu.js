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
var food_id = [];
var cart = [];
var categoriesCon = document.getElementById('menu-categories-con');
var displayCon = document.getElementById('menu-display-con');
var cartQuan = document.getElementById('cart_count');
var sideCartDisplay = document.getElementById('side-cart-display');

checkCartSize();
// ocalhost server
// document.getElementById('categories-go-back').addEventListener('click', function(){
//     window.open('/', "_self");
// })

// github server
document.getElementById('categories-go-back').addEventListener('click', function(){
    window.open('/Web_MajorProject_CustomerView/', "_self");
})

document.addEventListener('DOMContentLoaded', function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const restaurantID = urlParams.get('restaurantID');

    firebase.firestore().collection('user').where("user_id", "==", restaurantID).get()
    .then((doc)=>{
        doc.forEach((element)=>{
            document.body.style.backgroundImage = `url(${element.data().user_image})`;
            firebase.firestore().collection("user").doc(element.data().user_id).collection('menu').get()
            .then((doc)=>{
                doc.forEach((element)=>{
                    food_id.push(element.id);
                    result.push(element.data());
                })
                alterData();
            })
        })
    })
})

document.getElementById('menu-display-con').addEventListener("click", function(e){
    if(e.target.className === "add-btn"){
        var obj = {
            food_id: e.target.dataset.id,
            food_image: result[e.target.dataset.index].food_image,
            food_name: result[e.target.dataset.index].food_name,
            food_price: result[e.target.dataset.index].food_price,
            food_discount: result[e.target.dataset.index].food_discount,
            food_avaiable: result[e.target.dataset.index].food_available,
            quantity: 1,
            index: e.target.dataset.index
        };
        addToCart(obj);
        checkCartSize();
        cartCount();
        displayCart();
    }
})
sideCartDisplay.addEventListener('click', (e) => {
    if(e.target.className === "detail-btn plus"){
        for(var i = 0; i < cart.length; i++){
            if(e.target.dataset.id === cart[i].food_id){
                var total = parseFloat(e.target.dataset.price) / parseFloat(e.target.dataset.quantity);
                cart[i].food_price = Number(parseFloat(cart[i].food_price) + total).toFixed(2);
                cart[i].quantity += 1;
                document.getElementById("cart_quantity"+e.target.dataset.id).innerHTML = cart[i].quantity;
                document.getElementById("cart_price"+e.target.dataset.id).innerHTML = cart[i].food_price;
                cartCount();
                return;
            }
        }
    }
    if(e.target.className === "detail-btn minus"){
        for(var i = 0; i < cart.length; i++){
            if(e.target.dataset.id === cart[i].food_id){
                var total = parseFloat(e.target.dataset.price) / parseFloat(e.target.dataset.quantity);
                cart[i].food_price = Number(parseFloat(cart[i].food_price) - total).toFixed(2);
                cart[i].quantity -= 1;
                if(cart[i].quantity === 0){
                    cart.splice(i, i+1);
                    document.getElementById("content_div"+e.target.dataset.id).style.display = 'none';
                }else{
                    document.getElementById("cart_quantity"+e.target.dataset.id).innerHTML = cart[i].quantity;
                    document.getElementById("cart_price"+e.target.dataset.id).innerHTML = cart[i].food_price;
                }
                cartCount();
                return;
            }
        }
    }
})  

function addToCart(data){
    if(data.food_discount === "yes"){
        data.food_price = parseFloat(data.food_price) - 2;
    }
    if(cart.length === 0){
        cart.push(data);
        return;
    }
    for(var i = 0; i < cart.length; i++){
        if(data.food_id === cart[i].food_id){
            if(data.food_discount === "yes"){
                cart[i].food_price = Number(parseFloat(cart[i].food_price) + parseFloat(result[data.index].food_price) - 2).toFixed(2);
            }else{
                cart[i].food_price = Number(parseFloat(cart[i].food_price) + parseFloat(result[data.index].food_price)).toFixed(2);
            }
            cart[i].quantity += 1;
            return;
        }
    }
    cart.push(data);
}

function checkCartSize(){
    if(cart.length === 0){
        document.getElementById('side-add').style.color = "#080808";
    }else{
        document.getElementById('side-add').style.color = "#23F426";
    }
}

function cartCount(){
    var count = 0;
    for(var i = 0; i < cart.length; i++){
        count += cart[i].quantity;
    }
    cartQuan.innerHTML = count;
}

function displayCart(){
    var html = "";
    for(var i = 0; i < cart.length; i++){
        html += `<div id="content_div${cart[i].food_id}" class="content-div">
                    <img src="${cart[i].food_image}" alt="${cart[i].food_name}">
                    <div class="content-div-detail">
                        <input disabled="true" type="text" value="${cart[i].food_name}">
                        <div class="detail-div">
                            <div><div 
                                class="detail-btn minus"
                                data-id="${cart[i].food_id}"
                                data-quantity="${cart[i].quantity}"
                                data-price="${cart[i].food_price}">-</div>
                                    <span id="cart_quantity${cart[i].food_id}">${cart[i].quantity}</span>
                                <div 
                                class="detail-btn plus"
                                data-id="${cart[i].food_id}"
                                data-quantity="${cart[i].quantity}"
                                data-price="${cart[i].food_price}">+</div></div>
                            <p id="cart_price${cart[i].food_id}">${cart[i].food_price}</p>
                        </div>
                    </div>
                </div>`
    }
    sideCartDisplay.innerHTML = html;
}
function modifyingData(id){
    console.log(id)
}
function alterData(){
    result.forEach((data)=>{
        categories.push(data.food_categories);
    })
    categories = uniq(categories);
    putCategories(categories);
    putDisplay(categories, result, food_id);
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
function putDisplay(categories, display, food){
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
                            <div class="btn-con">
                                <button id="add-cart" class="add-btn" data-id="${food[k]}" data-index="${k}">Add to cart</button>
                            </div>
                            <div class="discount-logo">
                                <i class="fas fa-tags"></i>
                                RM 2 OFF
                            </div>
                            <div class="discount-div"></div>
                            <p class="discount-p">$${disPrice}</p>
                        `;
                }else{
                    html += `<div class="menu-display-div">
                            <img src="${display[k].food_image}" alt="" srcset="">
                            <h4>${display[k].food_name}</h4>
                            <p>$${display[k].food_price}</p>
                            <div class="btn-con">
                                <button id="add-cart" class="add-btn" data-id="${food[k]}" data-index="${k}">Add to cart</button>
                            </div>
                        `;
                }
                if(display[k].food_available === "no"){
                    html += `<div class="not-available">
                                Not Available
                            </div>
                            </div>`;
                }else{
                    html += `</div>`;
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
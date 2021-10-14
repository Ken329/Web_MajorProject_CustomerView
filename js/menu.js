// localhost server
// document.getElementById('categories-go-back').addEventListener('click', function(){
//     window.open('/', "_self");
// })

// github server
document.getElementById('categories-go-back').addEventListener('click', function(){
    window.open('/Web_MajorProject_CustomerView/', "_self");
})

var result = [];
var categories = [];
var food_id = [];
var cart = [];
var categoriesCon = document.getElementById('menu-categories-con');
var displayCon = document.getElementById('menu-display-con');
var cartQuan = document.getElementById('cart_count');
var sideCartDisplay = document.getElementById('side-cart-display');

var paymentMethod = "";

checkCartSize();

// button clicked function
document.addEventListener('DOMContentLoaded', function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // get restaurant id
    const restaurantID = urlParams.get('restaurantID');

    // get table no
    const tableNo = urlParams.get("table_no");
    document.getElementById("dine_in_no").value = tableNo;

    fetch("https://eatsy-0329.herokuapp.com/getRestaurantMenuById", {
        method: "POST",
        body: `id=${restaurantID}`,
        headers: { 'Content-type': 'application/x-www-form-urlencoded' }
    })
    .then((res) => res.json())
    .then((data) => {
        var myData = data.data;
        document.body.style.backgroundImage = `url(${myData[0]})`
        for(var i = 1; i < myData.length; i+=2){
            food_id.push(myData[i]);
        }
        for(var i = 2; i < myData.length; i+=2){
            result.push(myData[i]);
        }
        alterData();
    })
})

document.getElementById('menu-display-con').addEventListener("click", function(e){
    // add food to cart funtion
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
    // cart increasing item function
    if(e.target.className === "detail-btn plus"){
        for(var i = 0; i < cart.length; i++){
            if(e.target.dataset.id === cart[i].food_id){
                var total = parseFloat(e.target.dataset.price) / parseFloat(e.target.dataset.quantity);
                cart[i].food_price = Number(parseFloat(cart[i].food_price) + total).toFixed(2);
                cart[i].quantity += 1;
                document.getElementById("cart_quantity"+e.target.dataset.id).innerHTML = cart[i].quantity;
                document.getElementById("cart_price"+e.target.dataset.id).innerHTML = "RM " + cart[i].food_price;
                cartCount();
                var total = totalAmount(cart);
                var sst = total * 0.06;
                var myTotal = parseFloat(total) + parseFloat(sst);
                document.getElementById("price_p").innerHTML = `Total Price: RM${total}`
                document.getElementById("sst_p").innerHTML = `SST: RM${sst.toFixed(2)}`
                document.getElementById("totalPrice_p").innerHTML = `Total Price + SST: RM${myTotal.toFixed(2)}`
                checkoutMenuFunction();
                return;
            }
        }
    }
    // cart decreasing item function
    if(e.target.className === "detail-btn minus"){
        for(var i = 0; i < cart.length; i++){
            if(e.target.dataset.id === cart[i].food_id){
                var total = parseFloat(e.target.dataset.price) / parseFloat(e.target.dataset.quantity);
                cart[i].food_price = Number(parseFloat(cart[i].food_price) - total).toFixed(2);
                cart[i].quantity -= 1;
                if(cart[i].quantity === 0){
                    cart.splice(i, 1);
                    document.getElementById("content_div"+e.target.dataset.id).style.display = 'none';
                }else{
                    document.getElementById("cart_quantity"+e.target.dataset.id).innerHTML = cart[i].quantity;
                    document.getElementById("cart_price"+e.target.dataset.id).innerHTML = "RM " + cart[i].food_price;
                }
                cartCount();
                var total = totalAmount(cart);
                var sst = total * 0.06;
                var myTotal = parseFloat(total) + parseFloat(sst);
                document.getElementById("price_p").innerHTML = `Total Price: RM ${total}`
                document.getElementById("sst_p").innerHTML = `SST: RM ${sst.toFixed(2)}`
                document.getElementById("totalPrice_p").innerHTML = `Total Price + SST: RM ${myTotal.toFixed(2)}`
                if(cart.length <= 0){
                    let html = `<div class="empty-cart">Empty Cart</div>`;
                    sideCartDisplay.innerHTML = html;
                    checkCartSize();
                }
                checkoutMenuFunction();
                return;
            }
        }
    }
    // checkout cart function
    if(e.target.id === "checkout_btn"){
        document.getElementById("cart_con").style.right = "-420px";
        document.getElementById("checkout_con").style.display = "flex";
    }
})  
document.getElementById("checkout_menu").addEventListener("click", (e) => {
    if(e.target.className === "checkout-btn"){
        proceedToCheckout();
    }
});

// ** cart function **
function updateCheckoutType(){
    var con = document.getElementsByClassName("personal-detail fade-in");
    for(var myCon of con){
        myCon.style.display = "none";
    }
    var type = document.getElementsByClassName("checkout-type");
    for(var myType of type){
        if(myType.checked){
            document.getElementById(myType.value+"_con").style.display = "flex";
        }
    }
}
function updateCheckoutPayment(){
    var con = document.getElementsByClassName("personal-payment fade-in");
    for(var myCon of con){
        myCon.style.display = "none";
    }
    var payment = document.getElementsByClassName("checkout-payment");
    for(var myPayment of payment){
        if(myPayment.checked){
            document.getElementById(myPayment.value+"_con").style.display = "flex";
        }
    }
}
function updatePaymentClickFunction(selectedPayment){
    var div = document.getElementsByClassName("payment-div");
    for(var myDiv of div){
        myDiv.style.backgroundColor = "#fff";
    }
    document.getElementById(selectedPayment+"_div").style.backgroundColor = "#D3D2D2";
    paymentMethod = selectedPayment;
}

// checkout function
function closeCheckout(){
    document.getElementById("cart_con").style.right = "0px";
    document.getElementById("checkout_con").style.display = "none";
}
function checkoutMenuFunction(){
    var con = document.getElementById("checkout_menu");
    let  html = "";
    var total = 0;
    html += "<h4>Your order</h4>";
    for(var i = 0; i < cart.length; i++){
        total += parseFloat(cart[i].food_price);
        html += `<div class="checkout-menu-div">
                    <img src="${cart[i].food_image}" alt="" srcset="">
                    <div class="checkout-menu-detail">
                        <p>${cart[i].food_name}</p>
                        <div class="menu-detail-div">
                            <p>Quantity: ${cart[i].quantity}</p>
                            <p>RM ${cart[i].food_price}</p>
                        </div>
                    </div>
                </div>`
    }
    var sst = total * 0.06;
    var amount = total + sst;
    html += `<div class="checkout-menu-total">
                <p>Total Price: RM ${total.toFixed(2)}</p>
                <p>SST: RM ${sst.toFixed(2)}</p>
                <p>Total Price + SST: RM ${amount.toFixed(2)}</p>
            </div>
            <button class="checkout-btn">Proceed to transaction</button>`;
    con.innerHTML = html;
}
function proceedToCheckout(){
    var detail = document.getElementsByClassName("checkout-type");
    var payment = document.getElementsByClassName("checkout-payment");
    var count = 0;
    var userDetail = "", userPayment = "";
    for(var myDetail of detail){
        if(myDetail.checked){
            userDetail = myDetail.value;
            count++;
        }
    }
    for(var myPayment of payment){
        if(myPayment.checked){
            userPayment = myPayment.value;
            count++;
        }
    }
    if(count <= 1){
        alert("Please select either one option before proceeding to checkout");
    }else{
        if(userPayment === "online"){
            if(userDetail === "take_away"){
                var input = document.getElementsByClassName("take-away-input");
                var data = [];
                var check = true;
                for(var myInput of input){
                    if(myInput.value === ""){
                        check = false;
                        break;
                    }
                    data.push(myInput.value);
                }
                if(check){
                    if(validateEmail(data[2])){
                        if(paymentMethod === ""){
                            alert("Please select one payment method before proceed to checkout")
                        }else{
                            const queryString = window.location.search;
                            const urlParams = new URLSearchParams(queryString);
                            const restaurantID = urlParams.get('restaurantID');
                            var total = totalAmount(cart);
                            var myTotal = parseFloat(total) + parseFloat(total * 0.06);
                            
                            fetch("https://eatsy-0329.herokuapp.com/cashInRestaurant", {
                                method: "POST",
                                body: `id=${restaurantID}&amount=${myTotal.toFixed(2)}`,
                                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
                            })
                            .then((res) => res.json())
                            .then((myRes) => {
                                if(myRes.data){
                                    var newCart = updateNewCart(cart);
                                    var id = uniqueId();
                                    fetch('https://eatsy-0329.herokuapp.com/takeAwayFromRestaurant', {
                                        method: "POST",
                                        body: `orderId=${id}&id=${restaurantID}&food=${JSON.stringify({food:newCart})}&amount=${myTotal.toFixed(2)}&customer=${data[0]}&phone=${data[1]}&email=${data[2]}&type=take away&status=pending&method=${filterPaymentMethod(paymentMethod)}`,
                                        headers: { 'Content-type': 'application/x-www-form-urlencoded' }
                                    })
                                    .then((res) => res.json())
                                    .then((resData) => {
                                        Email.send({
                                            Host : "smtp.elasticemail.com",
                                            Username : "ken_037729@hotmail.com",
                                            Password : "072F65389C8D6C6019BC661B5AC8A2089A18",
                                            To : data[2],
                                            From : "ken_037729@hotmail.com",
                                            Subject : "Order Confirmation From Eatsy Services",
                                            Body : `Dear ${data[0]}, your order has been recieved by the restaurant, you may check your order status
                                            with this link https://ken329.github.io/Web_MajorProject_CustomerView/tracking.html?restaurantID=${restaurantID}&orderID=${id}. 
                                            If any information is incorrect, kindly update with the stuff over there`
                                        })
                                        .then( () => 
                                            window.open(`/Web_MajorProject_CustomerView/tracking.html?restaurantID=${restaurantID}&orderID=${id}`, "_self")
                                            // window.open(`/tracking.html?restaurantID=${restaurantID}&orderID=${id}`, "_self")
                                        );
                                    })
                                }
                            })
                        }
                    }
                }else{
                    alert("Please fill in your personal info before checking out");
                }
            }else{
                var input = document.getElementsByClassName("dine-in-input");
                var data = [];
                var check = true;
                for(var myInput of input){
                    if(myInput.value === ""){
                        check = false;
                        break;
                    }
                    data.push(myInput.value);
                }
                if(check){
                    if(validateEmail(data[3])){
                        if(paymentMethod === ""){
                            alert("Please select one payment method before proceed to checkout")
                        }else{
                            const queryString = window.location.search;
                            const urlParams = new URLSearchParams(queryString);
                            const restaurantID = urlParams.get('restaurantID');
                            var total = totalAmount(cart);
                            var myTotal = parseFloat(total) + parseFloat(total * 0.06);
                            fetch("https://eatsy-0329.herokuapp.com/cashInRestaurant", {
                                method: "POST",
                                body: `id=${restaurantID}&amount=${myTotal.toFixed(2)}`,
                                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
                            })
                            .then((res) => res.json())
                            .then((myRes) => {
                                if(myRes.data){
                                    var newCart = updateNewCart(cart);
                                    var id = uniqueId();
                                    fetch('https://eatsy-0329.herokuapp.com/dineInFromRestaurant', {
                                        method: "POST",
                                        body: `orderId=${id}&id=${restaurantID}&food=${JSON.stringify({food:newCart})}&amount=${myTotal.toFixed(2)}&customer=${data[1]}&table_no=${data[0]}&phone=${data[2]}&email=${data[3]}&type=dine in&status=pending&method=${filterPaymentMethod(paymentMethod)}`,
                                        headers: { 'Content-type': 'application/x-www-form-urlencoded' }
                                    })
                                    .then((res) => res.json())
                                    .then((resData) => {
                                        Email.send({
                                            Host : "smtp.elasticemail.com",
                                            Username : "ken_037729@hotmail.com",
                                            Password : "072F65389C8D6C6019BC661B5AC8A2089A18",
                                            To : data[2],
                                            From : "ken_037729@hotmail.com",
                                            Subject : "Order Confirmation From Eatsy Services",
                                            Body : `Dear ${data[1]}, your order has been recieved by the restaurant, you may check your order status
                                            with this link https://ken329.github.io/Web_MajorProject_CustomerView/tracking.html?restaurantID=${restaurantID}&orderID=${id} and your table no ${data[0]}. 
                                            If any information is incorrect, kindly update with the stuff over there.`
                                        })
                                        .then( () => 
                                            window.open(`/Web_MajorProject_CustomerView/tracking.html?restaurantID=${restaurantID}&orderID=${id}`, "_self")
                                            // window.open(`/tracking.html?restaurantID=${restaurantID}&orderID=${id}`, "_self")
                                        );
                                    })
                                }
                            })
                        }
                    }
                }else{
                    alert("Please fill in your personal info before checking out");
                }
            }
        }else{
            document.getElementById('cash_con').scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
}

// ** menu section **
// display side categories
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

// displaying food function
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

// ** cart function **
// adding new food to cart
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
// updating cart size
function checkCartSize(){
    if(cart.length === 0){
        document.getElementById('side-add').style.color = "#080808";
    }else{
        document.getElementById('side-add').style.color = "#23F426";
    }
}
// calculate cart size amount
function cartCount(){
    var count = 0;
    for(var i = 0; i < cart.length; i++){
        count += cart[i].quantity;
    }
    cartQuan.innerHTML = count;
}

// displaying added food function
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
                            <p id="cart_price${cart[i].food_id}">RM  ${cart[i].food_price}</p>
                        </div>
                    </div>
                </div>`
    }
    var total = totalAmount(cart);
    var sst = total * 0.06;
    var myTotal = parseFloat(total) + parseFloat(sst);
    html += `<div class="content-div-price">
                <p id="price_p">Total Price: RM ${total}</p>
                <p id="sst_p">SST: RM ${sst.toFixed(2)}</p>
                <p id="totalPrice_p">Total Price + SST: RM ${myTotal.toFixed(2)}</p>
            </div>
            <button id="checkout_btn">Pay to Checkout</button>`
    sideCartDisplay.innerHTML = html;
    checkoutMenuFunction();
}

// updating cart
function alterData(){
    result.forEach((data)=>{
        categories.push(data.food_categories);
    })
    categories = uniq(categories);
    putCategories(categories);
    putDisplay(categories, result, food_id);
}

// personal used function
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
function validateEmail(mail){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}
function totalAmount(data){
    var total = 0;
    for(var i = 0; i < data.length; i++){
        total += parseFloat(data[i].food_price);
    }
    return total.toFixed(2);
}
function updateNewCart(data){
    var newCart = [];
    for(var i = 0; i < data.length; i++){
        var newData = {
            id: data[i].food_id,
            quantity: data[i].quantity,
            price: data[i].food_price
        }
        newCart.push(newData);
    }
    return newCart;
}
function filterPaymentMethod(method){
    switch(method){
        case "visa":
            return "Visa Credit/ Debit card";
        case "paypal":
            return "Paypal Online Payment";
        case 'apple':
            return "Apple Pay";
        default:
            return "AliPay";
    }
}
function alertUser(message, path){
    alert(message);
    window.open(path, "self");
}
// generating unique id function 
function uniqueId () {
    var idStrLen = 32;
    var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
    idStr += (new Date()).getTime().toString(36) + "_";
    do {
        idStr += (Math.floor((Math.random() * 35))).toString(36);
    } while (idStr.length < idStrLen);

    return (idStr);
}
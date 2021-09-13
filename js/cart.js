// localhost server
// home.addEventListener('click', function(){
//     window.open('/', "_self");
// })

// github sever
home.addEventListener('click', function(){
    window.open('/Web_MajorProject_CustomerView/', "_self");
})

// cart function
var home = document.getElementById('home-btn')

var cart_btn = document.getElementById('cart_btn');
var cart_con = document.getElementById('cart_con');

var checklist_btn = document.getElementById('side-cart-dropdown');
var checklist_con = document.getElementById('checklist-con');
var dropIcon = document.getElementById('dropdown-icon');
var clickHere = document.getElementById('side-cart-click');

// checklist 
var checkin = document.getElementById('side-checkin');
var add = document.getElementById('side-add');
var payment = document.getElementById('side-payment');
var done = document.getElementById('side-done');

var check = true;
var checklist = true;

document.addEventListener("DOMContentLoaded", function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const restaurantID = urlParams.get('restaurantID');

    if(restaurantID !== null){
        checkin.style.color = "#23F426";
        
    }else{
        checkin.style.color = "#080808";
    }
})

cart_btn.addEventListener('click', function(){
    if(check){
        cart_con.style.right = "0";
        check = false;
    }else{
        cart_con.style.right = "-420px";
        check = true;
    }
})
checklist_btn.addEventListener('click', function(){
    if(checklist){
        checklist_con.style.marginTop = "-120px";
        checklist = false;
    }else{
        checklist_con.style.marginTop = "0px";
        checklist = true;
    }
})


// cart function
var home = document.getElementById('home-btn')

var cart = document.getElementById('cart');
var cart_btn = document.getElementById('cart_btn');
var cart_con = document.getElementById('cart_con');

var check = true;

home.addEventListener('click', function(){
    window.open('/', "_self");
})

cart_btn.addEventListener('click', function(){
    if(check){
        cart_con.style.right = "0";
        check = false;
    }else{
        cart_con.style.right = "-400px";
        check = true;
    }
})
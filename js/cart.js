// cart function
var home = document.getElementById('home-btn')

var cart_btn = document.getElementById('cart_btn');
var cart_con = document.getElementById('cart_con');

var check = true;

home.addEventListener('click', function(){
    window.open('/', "_self");
    //window.open('/Web_MajorProject_CustomerView/', "_self");
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
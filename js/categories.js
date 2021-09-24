// localhost server
// document.getElementById('categories-go-back').addEventListener('click', function(){
//     window.open('/', "_self");
// })
// document.getElementById("categories-restaurant-con").addEventListener('click', function(e){
//     if(e.target.className === "click-me"){
//         window.open(`../menu.html?restaurantID=${e.target.id}`, "_self");
//     }
// })

// github server
document.getElementById('categories-go-back').addEventListener('click', function(){
    window.open('/Web_MajorProject_CustomerView/', "_self");
})
document.getElementById("categories-restaurant-con").addEventListener('click', function(e){
    if(e.target.className === "click-me"){
        window.open(`/Web_MajorProject_CustomerView/menu.html?restaurantID=${e.target.id}`, "_self");
    }
})

// get price range
function getPriceRange(range){
    var price = parseInt(range);
    let html = '';
    for(var i = 0; i < price; i++){
        html += '<i class="fas fa-dollar-sign"></i>'
    }
    return html;
}

// button clicked function
document.addEventListener('DOMContentLoaded', function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const categories = urlParams.get('categories');

    document.getElementById('categories-restaurant-h4').innerHTML = `${categories} Cuisine Restaurant`

    let html = "";

    if(categories === "All"){
        // all food function
        fetch("https://eatsy-0329.herokuapp.com/getAllMenuRestaurant", {
            method: 'GET',
            headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        })
        .then((res) => res.json())
        .then((data) => {
            var myData = data.data;
            for(var i = 0; i < myData.length; i++){
                html += `<div class="restaurant-div">
                            <img src="${myData[i].user_image}" alt="" srcset="">
                            <div class="restaurant-div-info">
                                <h4>${myData[i].user_restaurant}</h4>
                                <p>${myData[i].user_cuisine}</p>
                                <p>${getPriceRange(myData[i].user_price_range)}</p>
                            </div>
                            <div class="click-me" id="${myData[i].user_id}"></div>
                        </div>`;
            }
            document.getElementById("categories-restaurant-con").innerHTML = html;
        })
    }else{
        // specific categories function
        fetch("http://localhost:4000/getRestaurantByCategories", {
            method: 'POST',
            body: `categories=${categories}`,
            headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        })
        .then((res) => res.json())
        .then((data) => {
            var myData = data.data;
            for(var i = 0; i < myData.length; i++){
                html += `<div class="restaurant-div">
                            <img src="${myData[i].user_image}" alt="" srcset="">
                            <div class="restaurant-div-info">
                                <h4>${myData[i].user_restaurant}</h4>
                                <p>${myData[i].user_cuisine}</p>
                                <p>${getPriceRange(myData[i].user_price_range)}</p>
                            </div>
                            <div class="click-me" id="${myData[i].user_id}"></div>
                        </div>`;
            }
            document.getElementById("categories-restaurant-con").innerHTML = html;
        })
    }
})
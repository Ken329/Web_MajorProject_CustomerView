function refreshBtn(){
    window.location.reload();
}
document.addEventListener("DOMContentLoaded", () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const restaurantID = urlParams.get('restaurantID');
    const orderID = urlParams.get('orderID');

    fetch('https://eatsy-0329.herokuapp.com/trackOrderWithId', {
        method: "POST",
        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        body: `restaurantId=${restaurantID}&orderId=${orderID}`
    })
    .then((res) => res.json())
    .then((data) => {
        var myData = data.data[0];
        let html = `<div class="tracking-order">
                        <h4>Your order detail</h4>
                        <p>Customer Name: ${myData.order_customer}</p>
                        <p>Customer Email: ${myData.order_email}</p>
                        <p>Customer Phone Number: +6${myData.order_phone}</p>
                        <p>Total Amount: RM ${myData.order_amount}</p>
                        <p>Paying Method: ${myData.order_method}</p>
                        <p>Having Method: ${myData.order_type}</p>
                        <h4>Your order: </h4>
                        <div id="tracking_order_div" class="tracking-order-div"></div>
                    </div>
                    <div class="tracking-status">
                        <div id="tracking_level" class="tracking-level">
                            <div class="tracking-level-dot" data-level=1></div>
                            <div class="tracking-level-dot" data-level=2></div>
                            <div class="tracking-level-dot" data-level=3></div>
                            <div class="tracking-level-dot" data-level=4></div>
                            <div class="tracking-level-dot" data-level=5></div>
                        </div>
                        <div class="tracking-detail">
                            <p>Order are still pending by the restaurant</p>
                            <p>Order has been approved by the restaurant</p>
                            <p>Start preparing by the kitchen</p>
                            <p>Your order are around the corner</p>
                            <p>Done with your order</p>
                        </div>
                    </div>`
        document.getElementById("tracking_con").innerHTML = html;
        getTrackingLevel(myData.order_status)
        getStatusMenu(myData.order_food)
    })
})
function getTrackingLevel(status){
    switch(status){
        case "pending":
            document.getElementById("tracking_level").style.background = "-webkit-linear-gradient(top, #62FD7F 10%, #F1F1F1 10%)";
            var trackBtn = document.getElementsByClassName("tracking-level-dot");
            for(var myBtn of trackBtn){
                if(parseInt(myBtn.dataset.level) <= 1){
                    myBtn.style.backgroundColor = "#62FD7F";
                }
            }
            break;
        case "approve":
            document.getElementById("tracking_level").style.background = "-webkit-linear-gradient(top, #62FD7F 30%, #F1F1F1 10%)";
            var trackBtn = document.getElementsByClassName("tracking-level-dot");
            for(var myBtn of trackBtn){
                if(parseInt(myBtn.dataset.level) <= 2){
                    myBtn.style.backgroundColor = "#62FD7F";
                }
            }
            break;
        case "prepare":
            document.getElementById("tracking_level").style.background = "-webkit-linear-gradient(top, #62FD7F 50%, #F1F1F1 10%)";
            var trackBtn = document.getElementsByClassName("tracking-level-dot");
            for(var myBtn of trackBtn){
                if(parseInt(myBtn.dataset.level) <= 3){
                    myBtn.style.backgroundColor = "#62FD7F";
                }
            }
            break;
        case "almost":
            document.getElementById("tracking_level").style.background = "-webkit-linear-gradient(top, #62FD7F 70%, #F1F1F1 10%)";
            var trackBtn = document.getElementsByClassName("tracking-level-dot");
            for(var myBtn of trackBtn){
                if(parseInt(myBtn.dataset.level) <= 4){
                    myBtn.style.backgroundColor = "#62FD7F";
                }
            }
            break;
        case "done":
            document.getElementById("tracking_level").style.background = "-webkit-linear-gradient(top, #62FD7F 100%, #F1F1F1 10%)";
            var trackBtn = document.getElementsByClassName("tracking-level-dot");
            for(var myBtn of trackBtn){
                if(parseInt(myBtn.dataset.level) <= 5){
                    myBtn.style.backgroundColor = "#62FD7F";
                }
            }
            break;

    }
}
function getStatusMenu(food){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const restaurantID = urlParams.get('restaurantID');

    const myFood = JSON.parse(food);
    const foodList = myFood.food;
    var foodListId = [];

    for(var i = 0; i < foodList.length; i++){
        foodListId.push(foodList[i].id)
    }

    fetch('https://eatsy-0329.herokuapp.com/trackingFoodWithId', {
        method: "POST",
        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        body: `restaurantId=${restaurantID}&foodId=${foodListId}`
        })
    .then((res) => res.json())
    .then((data) => {
        const myFood = data.data;
        let html = "";
        for(var i = 0; i < myFood.length; i++){
            html += `<div class="order-div">
                        <img src="${myFood[i].food_image}" alt="" srcset="">
                        <div class="order-detail">
                            <h5>${myFood[i].food_name}</h5>
                            <div>
                                <p>RM ${foodList[i].price}</p>
                                <p>Quanity: ${foodList[i].quantity}</p>
                            </div>
                        </div>
                    </div>`  
        }
        document.getElementById("tracking_order_div").innerHTML = html;
    })
}
$(document).ready(function(){
      function fetchStockPrices(){
            console.log("Fetching Prices")

            $.ajax({
                  type:'GET',
                  url:'http://localhost:8820/stockPrice',
                  success: function(response){
                        $('.stockprices').html(response);
                        console.log("success!")
                  },
                  error: function(xhr,status,error){
                        console.log(error)
                  }
            })
            
      }
      fetchStockPrices()
})
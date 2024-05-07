$(document).ready(function(){
      $('#sellForm').submit(function(event){
            event.preventDefault()

            var stockSymbol=$('#stockSymbol').val()
            var quantity=$('#quantity').val()

            $.ajax({
                  type: 'POST',
                  url: 'http://localhost:8820/players/sell',
                  contentType: 'application/json',
                  data: JSON.stringify({stockSymbol,quantity}),
                  success: function(response){
                        alert('Sell successful')
                  },
                  error: function(xhr,status,error){
                        alert('Failed to sell. Not enough stocks');
                  }

            })
      })
});
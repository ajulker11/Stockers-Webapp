$(document).ready(function(){
      $('#buyForm').submit(function(event){
            event.preventDefault()

            var stockSymbol=$('#stockSymbol').val()
            var quantity=$('#quantity').val()

            $.ajax({
                  type: 'POST',
                  url: 'http://localhost:8820/players/buy',
                  contentType: 'application/json',
                  data: JSON.stringify({stockSymbol,quantity}),
                  success: function(response){
                        alert('Purchase successful')
                  },
                  error: function(xhr,status,error){
                        alert('Purchase Failed. Not enough cash');
                  }

            })
      })
});
$(document).ready(function(){
      $('#declareWinnerForm').submit(function(event){
            event.preventDefault()

            var gameid=$('#gameid').val()

            $.ajax({
                  type: 'POST',
                  url: 'http://localhost:8820/admins/declareWinner',
                  contentType: 'application/json',
                  data: JSON.stringify({gameid}),
                  success: function(response){
                        alert(response)
                        alert("GAME ENDED.")
                  },
                  error: function(xhr,status,error){
                        alert('Failed to declare Winner');
                  }

            })
      })
});
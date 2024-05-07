$(document).ready(function() {
      $('#registerForm').submit(function(event) {
        event.preventDefault();
        console.log("Hello")
    
        var username= $('#name').val();
        var email= $('#email').val();
        var token=$('#token').val()
        var gameid=$('#gameid').val()
        var maxPlayer=$('#maxPlayer').val()
    
        $.ajax({
          type: 'POST',
          url: 'http://localhost:8820/admins/createGame', 
          data: {
            name: username,
            email: email,
            token:token,
            gameid:gameid,
            maxPlayer:maxPlayer
          },
          success: function(response) {
            alert('Game Creation Succesfull!');
          },
          error: function(xhr, status, error) {
            console.log('Status:', status);
            console.log('Error:', error);
            alert("Game with the given Game ID already exists")
          }
          
        });
      });
    });
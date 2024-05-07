$(document).ready(function() {
      $('#registerForm').submit(function(event) {
        event.preventDefault();
        console.log("Hello")
    
        var username = $('#name').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var token=$('#token').val()
    
        $.ajax({
          type: 'POST',
          url: 'http://localhost:8820/admins/register',
          data: {
            name: username,
            email: email,
            password: password,
            token:token,
          },
          success: function(response) {
            alert('Registration Successful!');
            window.location.href = 'makeGame.html';
          },
          error: function(xhr, status, error) {
            console.log('Status:', status);
            console.log('Error:', error);
            alert("Invalid Token. Try again")
            
          }
          
        });
      });
    });
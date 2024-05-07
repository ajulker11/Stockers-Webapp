$(document).ready(function() {
      $('#registerForm').submit(function(event) {
        event.preventDefault();
        console.log("Hello")
    
        var username = $('#name').val();
        var email = $('#email').val();
        var password = $('#password').val();
    
        $.ajax({
          type: 'POST',
          url: 'http://localhost:8820/players/register',
          data: {
            name: username,
            email: email,
            password: password
          },
          success: function(response) {
            alert('Registration Successful!')
            window.location.href = 'login.html';
          },
          error: function(xhr, status, error) {
            console.log('Status:', status);
            console.log('Error:', error);
            alert("Same user or email already exists. Try again")
           
            
          }
          
        });
      });
    });
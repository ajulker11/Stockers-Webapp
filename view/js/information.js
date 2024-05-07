$(document).ready(function() {
      function fetchGames() {
          $.ajax({
              url:'http://localhost:8820/players/viewGames',
              type:'GET',
              success: function(games) {
                  const gamesContainer=$('#gameContainer');
                  gamesContainer.empty(); 
  
                  games.forEach(function(game) {
                      const gameDiv=`
                          <div class="game">
                              <h5 style="color: aliceblue; text-align: center;">GameID: ${game}</h5>
                              <h5 style="color: aliceblue; text-align: center;">Max Players: ${10}</h5>
                              <div style="text-align: center;">
                                <a href="gameReg.html">
                                    <button class="btn">Register</button>
                                </a>
                              </div>
                          </div>
                      `;
                      gamesContainer.append(gameDiv);
                  });
              },
              error: function(xhr, status, error) {
                  console.error('Error fetching games:', error);
              }
          });
      }
  
      fetchGames(); 
  });
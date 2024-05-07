# COMP3100 Project part 3
## Name: Ahmed Julkernain 
## MUN Student no: 202126082 

### Description of repo layout and architecture
The project is seperated into four main folders. We have our model folder, controller folder, utils folder and the test folder. This layout was inspired from the Contacts V4 codebase. <br><br>
- The utils folder consist of all the necesarry files needed to run the project for instance the database connection, stockApi call and validating user inputs.  
- The model folder is the main logic for the project. it consists of classes for admin, game, player, and portfolio. 
- The controller folder holds controller files that basically controls all the http api calls from app.mjs and it deals with them. 

UPDATE: we now have an entire front-end folder called view which consists of the HTML,CSS and JavaScript files.

<br> 

## VIDEO PRESENTATION 

Please have a look at the following link: https://youtu.be/AXYJ3C9dot0

## UPDATES TO UNIT TESTS FROM BEFORE 

There has been 5 new api calls added for the front end. Therefore I have 5 new unit tests testing each of the new API calls. <br>

The professor has allowed me to submit a video instead of writing a readme, therefore please look at this really quick video which explains the unit tests. 

link: https://youtu.be/ErzxI_jNbYw 

As explained in the video as well, please make sure to run the unit test twice if all the tests does not pass the first time. 

## Instructions to run front-end 

I have included a package.json. Please see that for the dependencies. After this, Please have the app.mjs server running and if you are using VS code, go to the login.html page located under 'view' folder and click on Go Live. 

### EVERYTHING BELOW ARE FROM PROJECT PART 2 WHICH ARE ALL STILL RELEVANT



## API/HTTP Requests & Services and Associated unit testing 
### Player Registration Feature
- Endpoint: POST /players/register 
- Description: Registers a player into the stock website 
- Feature supported: 'register players for a game' 

Unit Tests: 
-  'Test for player registration'
      - Register a new user successfully.
      - Prevent registration with duplicate details.
      - Verify the user's data is stored correctly.

### Starting Cash Feature 
- Endpoint: GET /players/startingCash 
- Description: Assures that all players are provided with a starting cash account 
- Feature supported: provide all players a starting cash account in their portfolio 

Unit Tests: 
-  'Test for Starting Cash Balance for Player'
      - Ensure a successful response when querying starting cash balance.
      - Confirm the starting cash balance matches the expected amount.

### Buy and Sell Feature 
For Buy: 
- EndPoint: POST /players/:username/buy 
- Description: Allows a player with username to buy stocks with the given stock symbol at the current NYSE prices. 
- Feature supported: allow player buy actions at the current NYSE prices 

For Sell: 

- EndPoint: POST players/:username/sell 
- Description:  Allows a player with username to sell stocks with the given stock symbol at the current NYSE prices. 
- Feature supported: allow player sell actions at the current NYSE prices

Unit Tests: 

- 'Buy Stock Tests'
  - Check if Alice can purchase stock successfully.
   - Verify the purchased stock is added to Alice's portfolio. 
- Sell Stock Tests
   - Confirm Alice can sell stock when she has enough.
   - Test that selling fails when Alice doesn't have enough stock. 

### Tracking Portfolio and its Value Feature 
- Endpoint: GET /players/:username/value 
- Description: Allows for showing that portfolio with its value is stored in the database. 
- Feature supported: keep track of each player's portfolio and its value 

Unit Tests: 
- 'Portfolio tracking and valuation tests'
    - Verify retrieving the portfolio value works for Alice.
    - Check that fetching portfolio value for a non-existent user fails with a 404 status. 

### Declare winner Feature 
- EndPoint: POST /admins/:username/declareWinner 
- Description: Ends the game and makes the player with the highest portfolio value declared as the winner. 
- Feature supported: declare a winner at the end of the game 

Unit Test: 

- Declare Winner Tests
   - Ensure the system can declare a winner for a specified game. 

### Maintain player login and profile Feature 
- EndPoint: GET /admins/playersList 
- Description: Gives the list of players with all their login and profile information from the database. 
- Feature Supported: maintain player login and profile information 

Unit Tests: 
- Player List Tests
   - Verify that the players list can be successfully retrieved.
   - Ensure the fetched players list is an array.
   - Check that the known player, Alice, exists in the players list. 

### Admins create games Feature: 
First, the admin has to register than create the game. <br>
For Admin registering: 

- EndPoint: POST /admins/register 
- Description: registers an admin user to the stockwebsite 

Unit Tests:  
- Admin Registration Tests
    - Confirm that a new admin can register successfully.
    - Verify that registering the same admin again is not allowed.
    - Check that registration with an invalid token is rejected. 

For Admin Creating game: 

- Endpoint: POST /admins/createGame 
- Description: creates a game for players to join. 

Unit Tests: 
- Game Creation Tests
    - Check that a new game can be successfully created.
    - Ensure that creating a game with an existing ID is not allowed.
    - Confirm the game's existence after its creation.

Feature supported: admin users that can create games 

### Optional Feature 1: View opponent's portfolio 
- Endpoint: GET /players/viewPortfolio 
- Description: allows to view the portfolio of another user in the game. 
- Feature supported: optional viewing of competitor's portfolios 

Unit Tests: 
- View Competitor Portfolio Tests
     - Verify retrieving the portfolio for a specified user and game ID is successful.
     - Check that a non-existent user or game ID results in a 404 status error.

### Optional Feature 2:  Register for a particular game (can be more than 1) 
- Endpoint: POST /players/:username/registerGame 
- Description: Allows a player to register for any available game. It can be more than 1. One player can play two games at a time if they wanted.  
- Feature supported: Optional feature of player registration in games. 

Unit Tests: 
- Game Registration Tests 
    - Confirm Alice can register for a specified game successfully.
    - Ensure a portfolio is created for Alice with the corresponding game ID after registration.

## OTHER API CALLS 

There are some other api calls that are not directly addressing any of the 9 wanted features. However, they are essential for the project's codebase: 

## Viewing Game
- Endpoint: GET /players/viewGames 
- Description: Allows players to view available games. 
- Feature supported: Players can see a list of games they can register for or participate in.  

Unit Test: 
- View Games Tests
  - Check if the system successfully retrieves the list of available games, expecting the response to be an array of game IDs. 

- Endpoint: GET /games/check 
- Description: Verifies if a game exists in the database.
- Feature supported: Used to check the existence of a game.  

Unit Test: 
- Check Game Existence Tests
   - Verify that querying a specific game ID returns the correct game, indicating the game exists in the system.


## Running Unit Tests 

Firstly make sure that the server is running in the background. You may need to install the necessary node modules like npm install express. Also, you need to ensure that MongoDB is running locally on the default port (27017). Then run the following command: 
- npx mocha ./test/unitTest.mjs

All tests are passing which indicates that all functionalities are working as expected.  

## API LIMITATION 
The API I am using has 25 calls per day. I have already used that up so I have commented up the API calling code and the function is returning a random number. I API code works correctly, and you can also have a look at it. I had to comment it out so that I can still run my tests. I have discussed this limitation with professor brown and he suggested me to write this here to make it easier for you. 

## Regards 
I have shown and discussed all my code functionalities and features with Dr. Brown and he is okay with my features and codebase. Thank you. 









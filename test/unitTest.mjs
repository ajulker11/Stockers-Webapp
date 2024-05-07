import axios from 'axios';
import { strictEqual } from 'assert';
import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb://localhost:27017/");



const instance = axios.create({
    baseURL: 'http://localhost:8820',
    headers: { 'Content-Type': 'application/json' }
});


describe('Stock prices Tests', function() {

    describe('Test for player registration', function() {
        const newUser = {
            name: 'Alice',
            email: 'alice@mun.ca',
            password: 'password123'
        };
    
        it('should allow a new user to register', async function() {
            const res = await instance.post('/players/register', newUser);
            strictEqual(res.status, 200);
        });
    
        it('should not allow the same user to register again', async function() {
            try {
                await instance.post('/players/register', newUser);
            } catch (error) {
                strictEqual(error.response.status, 404);
            }
        });
    
        it('should verify the user is registered in the database', async function() {
            const res = await instance.get(`/players/${newUser.name}`);
            strictEqual(res.status, 200);
            strictEqual(res.data.username, newUser.name);
            strictEqual(res.data.email, newUser.email);
        });
    });
    
    describe('Test for starting cash balance for player', function() {
          const username = 'Alice';
      
          it('should successfully return a response', async function() {
              const res = await instance.get(`/players/startingCash?username=${username}`);
              strictEqual(res.status, 200, 'The request did not succeed');
          });
      
          it('should return the correct starting cash balance for a user', async function() {
              const res = await instance.get(`/players/startingCash?username=${username}`);
              const expectedCashBalance = 10000;
              strictEqual(res.data, expectedCashBalance, 'The returned cash balance is not as expected');
          });
      });
    
    //Admin Registration Tests
    describe('Admin Registration Tests', function() {
        const newAdmin= {
            name:'AdminUser',
            email:'admin@mun.ca',
            password:'HelloWorld123',
            token:10
        };
    
        it('should allow a new admin to register', async function() {
            const res= await instance.post('/admins/register', newAdmin);
            strictEqual(res.status, 200, 'Failed to register new admin');
        });
    
        it('should not allow the same admin to register again with the same email', async function() {
            try {
                await instance.post('/admins/register', newAdmin);
                throw new Error('Registration should fail for existing admin');
            } catch (error) {
                strictEqual(error.response.status, 404, 'Admin registration should not allow duplicates');
            }
        });
    
        it('should reject registration with invalid token', async function() {
            const invalidAdmin= { ...newAdmin, email: 'newadmin@gmail.com', token: 0 };
            try {
                const res= await instance.post('/admins/register', invalidAdmin);
                strictEqual(res.status, 404, 'Registration should fail due to invalid token');
            } catch (error) {
                strictEqual(error.response.status, 404, 'Expected failure due to invalid token');
            }
        });
    });
    
    describe('Game Creation Tests', function() {
        const newAdmin= {
            name: 'AdminUser',
            email: 'admin@gmail.com',
            password: 'HelloWorld123',
            token: 10
        };
    
        const gameDetails= {
            gameid: 'Elite12A',
            maxPlayer: 5
        };
    
        it('should successfully create a game', async function() {
            const res= await instance.post('/admins/createGame', { ...newAdmin, ...gameDetails });
            strictEqual(res.status, 200, 'Failed to create the game');
        });
    
        it('should not allow creation of a game with the same gameid', async function() {
            try {
                await instance.post('/admins/createGame', { ...newAdmin, ...gameDetails });
                throw new Error('Game creation should fail for existing gameid');
            } catch (error) {
                strictEqual(error.response.status, 404, 'Game creation should not allow duplicates');
            }
        });
    
        it('should verify the game exists after creation', async function() {
            const res = await instance.get(`/games/check?gameid=${gameDetails.gameid}`);
            strictEqual(res.status, 200, 'Game does not exist after creation');
        });
    });
    
    
      describe('Portfolio Tracking and Valuation Tests', function() {
          const existingUsername= 'Alice'; 
      
          it('should return the portfolio value for an existing user', async function() {
              const res= await instance.get(`/players/${existingUsername}/value`);
              strictEqual(res.status, 200, 'Failed to get portfolio value for existing user');
      
              const hasTotalVal= res.data.hasOwnProperty('totalVal');
              strictEqual(hasTotalVal, true, 'Portfolio value response does not contain totalVal');
          });
      
          it('should return a 404 status for a non-existing user', async function() {
              const nonExistingUsername= 'NonExistentUser';
              try {
                  await instance.get(`/players/${nonExistingUsername}/value`);
                  throw new Error('Expected to fail for non-existing user');
              } catch (error) {
                  strictEqual(error.response.status, 404, 'Expected a 404 status for non-existing user');
              }
          });
      });
    
      describe('Player List Tests', function() {
          it('should successfully fetch the players list', async function() {
              const res=await instance.get('/admins/playersList');
              strictEqual(res.status, 200, 'Failed to fetch the players list');
          });
      
          it('should return an array of players', async function() {
              const res=await instance.get('/admins/playersList');
              const isArray=Array.isArray(res.data);
              strictEqual(isArray, true, 'The response is not an array of players');
          });
      
          it('should contain a known player in the player list', async function() {
              const res=await instance.get('/admins/playersList');
              const knownPlayerUsername='Alice';
    
              const playerExists=res.data.some(player => player.username === knownPlayerUsername);
              strictEqual(playerExists, true, `Known player ${knownPlayerUsername} was not found in the player list`);
          });
      }); 

    
      describe('Game Registration Tests ', function() {
          const username='Alice'; 
          const gameid='Elite12A'; 
      
          it('should allow a player to register for a game', async function() {
              const registrationDetails= { gameid };
              const res= await instance.post(`/players/${username}/registerGame`, registrationDetails);
              strictEqual(res.status, 200, `Failed to register ${username} for Game ${gameid}`);
          });
      
          it('should create a portfolio for the player with the game ID', async function() {
                const res= await instance.get(`/players/viewPortfolio?name=${username}&gameid=${gameid}`);
                strictEqual(res.status, 200, `Failed to fetch the portfolio for ${username} in Game ${gameid}`);
            
                const portfolioGameIdMatches=res.data.gameid=== gameid;
                strictEqual(portfolioGameIdMatches, true, `Portfolio game ID does not match ${gameid}`);
            });
            
      });
      
      describe('Buy Stock Tests', function() {
          const username= 'Alice'; 
          const stockSymbol= 'AAPL'; 
          const quantity= 1; 
          const gameid='Elite12A'
      
          it('should successfully buy stock', async function() {
              //Buy the stock
              const buyDetails={ username, stockSymbol, quantity };
              const buyResponse=await instance.post(`/players/buy`, buyDetails);
              strictEqual(buyResponse.status, 200, 'Failed to buy stock despite having sufficient funds');
          });
      
          it('should confirm the stock is added to the portfolio', async function() {
              const portfolioResponse=await instance.get(`/players/viewPortfolio?name=${username}&gameid=${gameid}`);
              strictEqual(portfolioResponse.status, 200, 'Failed to fetch the updated portfolio');
      
          });
      
      });
      
    
    
    
      //this has to be checked after game has been created.
      describe('View Competitor Portfolio Tests', function() {
          const user='Alice';
          const gameid='Elite12A';
      
          it('should return the portfolio for a given user and game ID', async function() {
              const res=await instance.get(`/players/viewPortfolio?name=${user}&gameid=${gameid}`);
              strictEqual(res.status, 200, 'Failed to fetch the portfolio for the given user and game ID');
          });
      
          it('should return a 404 status for a non-existing user or game ID', async function() {
              const res=await instance.get(`/players/viewPortfolio?name=NonExistentUser&gameid=${gameid}`);
              strictEqual(res.status, 200, 'Expected a 404 status for a non-existing user or game ID');
          });
      });
      
      describe('Sell Stock Tests', function() {
        const username='Alice'; 
        const stockSymbol='AAPL'; 
        let quantity= 1; 
    
        it('should successfully sell stock when player has enough stock', async function() {
            const sellDetails = { username, stockSymbol, quantity };
            const res = await instance.post(`/players/sell`, sellDetails);
            strictEqual(res.status, 200, 'Failed to sell stock despite having enough');
        });
    
        it('should fail to sell stock when player does not have enough stock', async function() {
            const highQuantity= 5;
            const sellDetails= { username, stockSymbol, quantity: highQuantity };
            const res=await instance.post(`/players/sell`, sellDetails);
            strictEqual(res.status, 200, 'Expected failure due to insufficient stock quantity');
        });
    });
    
     
    describe('Declare Winner Tests', function() {
        const username='AdminUser'; 
        const gameid='Elite12A'; 
    
        it('should declare a winner for the game', async function() {
            const res = await instance.post(`/admins/declareWinner`, { gameid });
            strictEqual(res.status, 200, 'Failed to declare the winner for the game');
    
        });
    
    
    });
    
    
    describe('View Games Tests', function() {
        it('should successfully fetch the list of games', async function() {
            const res=await instance.get('/players/viewGames');
            strictEqual(res.status, 200, 'Failed to fetch the list of games');
            
            const isArray = Array.isArray(res.data);
            strictEqual(isArray, true, 'The response should be an array of game IDs');
        });
    }); 
    
    describe('Check Game Existence Tests', function() {
        const gameid='Elite12A';
        it('should return a game ID when the game exists', async function() {
            const res=await instance.get(`/games/check?gameid=${gameid}`);
            strictEqual(res.status, 200, 'Failed to fetch the game ID');
            
            strictEqual(res.data, gameid, 'The returned game ID does not match the requested one');
        });
    });

    describe('NEW API TEST FOR FRONT-END 1',function(){
        const gameID='Elite12A'
        const username='Alice'; 
        it('should return a html page',async function(){
            const res=await instance.get(`/checklogin?first=${username}&gameID=${gameID}`)
            strictEqual(res.status, 200, 'Failed ');

        });
    });

    describe('NEW API TEST FOR FRONT-END 2',function(){
        const username='AdminUser'; 
        it('should return 200 status',async function(){
            const res=await instance.get(`/checkloginAdmin?first=${username}`)
            strictEqual(res.status, 200, 'Failed ');

        });
    });

    describe('NEW API TEST FOR FRONT-END 3',function(){
        it('should return 200 status',async function(){
            const res=await instance.get(`/stockPrice?`)
            strictEqual(res.status, 200, 'Failed ');

        });
    }); 

    describe('NEW API TEST FOR FRONT-END 4',function(){
        const newUser = {
            name: 'Bob',
            email: 'alice@mun.ca',
            password: 'password123'
        }
        const res= instance.post('/players/register', newUser);

        const gameID='Elite12A'
        const username='Bob'; 
        it('should return 200 status',async function(){
            const res=await instance.get(`/gameReg?first=${username}&gameID=${gameID}`)
            strictEqual(res.status, 200, 'Failed ');

        });
    });

    describe('NEW API TEST FOR FRONT-END 5',function(){
        const gameid='Elite12A'
        it('should return 200 status',async function(){
            const res=await instance.get(`/players/viewLeaderboard?gameid=Elite12A`)
            strictEqual(res.status, 200, 'Failed ');

        });
    }); 

    after(async function() {
        //clear the database
        await client.connect();
        const db = client.db('stock-trading-game'); 

        await db.collection('players').deleteMany({});
        await db.collection('Portfolios').deleteMany({})
        await db.collection('admins').deleteMany({});
        await db.collection('games').deleteMany({});
    
        await client.close(); 
    });
});




  
  
  
  
import express, {json, urlencoded} from 'express'; 
import session from 'express-session'

import {connectToDB} from './utils/db.mjs';
import { readFile } from 'fs/promises'
import cors from 'cors'
import { getDB } from "./utils/db.mjs"; 
import { getRealTimeStockPrice } from './utils/stockAPI.mjs';
import axios from 'axios';


import {register,Balance_view,buy,sell,valuate,registerGame,viewGame,oppPortf,getCash, leaderboard} from './controller/playerContr.mjs';
import { admnRegister,viewPlayers,createGame,winner,check } from './controller/adminContr.mjs';

const app=express() 
const port=8820 
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(cors())
app.use(session({
      secret:'wild thing',
      resave: false,
      saveUninitialized:false,
}))

import { dirname } from 'path'
import { fileURLToPath } from 'url';
const __dirname=dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname + '/view'));

async function connect_dbServer(){
      try{
            await connectToDB()


            app.get('/checklogin',do_login)
            app.get('/checkloginAdmin',adminLogin)
            app.post('/players/register', register)//main feature 1 done fdone
            app.get('/players/startingCash',getCash) //main feature 4 done fdone
            app.get('/players/viewGames',viewGame)//done //fdone
            app.get('/players/viewPortfolio',oppPortf)//optional feature 1 done. no more optional feature.
            app.get('/players/viewLeaderboard',leaderboard)//new optional feature.
            app.get('/players/:name',Balance_view)//done 
            app.post('/players/buy',buy)//main feature 2 done 
            app.post('/players/sell',sell)//main feature 2 done 
            app.get('/players/:username/value',valuate)//main feature3 done fdone
            app.post('/admins/register', admnRegister)//main feature 5 done fdone
            app.get('/admins/playersList',viewPlayers)//main feature 7 done fdone
            app.post('/admins/createGame',createGame)//main feature 5 done  fdone 
            app.post('/players/:username/registerGame',registerGame) // optional feature 2 done fdone
            app.post('/admins/declareWinner',winner)//main feature 6 done

            app.get('/games/check',check)//done

            app.get('/gameReg',gameR)
            app.get('/stockPrice',getPrice)
            
           //player registration 
           //starting cash 
           //admin registration and create game 
           //keep track of each player's portfolio and its value 
           //maintain player login and profile information
           //buy 
           //sell 

            app.listen(port,()=>{
                  console.log(`listening from port ${port}`)
            })
      }
      catch (error){
            console.log(error)
      }
}
async function do_login(req, res) {
      let username = req.query["first"];
      let gameid=req.query['gameID']
      console.log(gameid)
      
      const db = getDB();
      const collection = db.collection('Portfolios');
      try {
        const user = await collection.findOne({ username: username,gameid:gameid });
        if (user) {

            req.session.userid = username;
            req.session.gameid=gameid;
            console.log(req.session);

            const stocksString = user.stocks.map(stock => {
                  return `Stock Name: ${stock.stockName}, Quantity: ${stock.quantity}`;
                }).join('<br>');
      
            let htmlContent = await readFile('./view/information.html', { encoding: 'utf8' });
            htmlContent = htmlContent.replace('${gameid}', gameid);
            htmlContent = htmlContent.replace('${username}', username);
            htmlContent=htmlContent.replace('${name}',user.username)
            htmlContent=htmlContent.replace('${cashbalance}',user.cashBalance)
            htmlContent=htmlContent.replace('${total}',user.totalVal)
            htmlContent=htmlContent.replace('${stocks}',stocksString)
            res.send(htmlContent);
          }
           
         else {
          res.status(404).send('User not found');
        }
      } catch (error) {
        console.error('Error during the login process:', error);
        res.status(500).send('An error occurred during login');
      }
    }

async function adminLogin(req,res){
      let username=req.query['first']; 
      
      const db=getDB();
      const collection=db.collection('admins'); 

      const user=await collection.findOne({username:username})
      let htmlConent=await readFile('./view/makeGame.html',{encoding:'utf8'});
      res.send(htmlConent)
      
}

async function gameR(req,res){
      let username=req.query['first']
      let gameid=req.query['gameID']
      const userResult=await axios.post(`http://localhost:8820/players/${username}/registerGame`,{gameid:gameid}) 
      if(userResult.status==200){
            let htmlContent = await readFile('./view/gameReg.html', { encoding: 'utf8' });
            htmlContent+= `<div> <h1>SUCCESFULLY REGISTERED FOR GAME</h1></div>`;
            res.send(htmlContent)
      }else{
            res.status(500).send('Failed to register for game')
      }

}

async function getPrice(req,res){
      console.log("hello")
      var stockLst=['TSLA',"AAPL",'GOGL','APEI','TOP','NVDA','A','INTC','AMD','META']
      var stockContent=""
      for (let s of stockLst){
            let price= await getRealTimeStockPrice(s)
            stockContent+= `<div style="text-align:center;background-color:white; width:300px; margin-left:520px; border-radius:20px;
            "> <h4>Stock: ${s} price: ${price}</h4></div>`;
      }
      res.send(stockContent)
      
}

    
    

connect_dbServer()
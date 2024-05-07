import { Player } from "../model/player.mjs"; 
import { validate_fields } from "../utils/validate.mjs";
import { Portfolio } from "../model/portfolio.mjs";
import { Game } from "../model/game.mjs";
import { getDB } from "../utils/db.mjs";

export async function register(req,res){
      let name=req.body.name 
      let email=req.body.email 
      let password=req.body.password

      //now we need to check that the inputs are valid. 

      let is_valid= await validate_fields(name,email,password) 

      if (is_valid){
            //we need to put in a check so that the same username or email cannot be used again 
            let check= await Player.match(name,email)
            if (!check){
                  let new_player=new Player(name,email,password);
                  let response=await new_player.create()
                  //let portfolio= await new_player.viewPortfolio()
                  res.json("Successfully Registered")
            }
            else{
                  let response="The username or email has been taken. Please try different combinations"
                  res.status(404).json(response)
            } 
      }
      else{
            res.sendStatus(404)
      }

}

export async function Balance_view(req,res){
      let username=req.params.name 
      let balance=await Player.viewBalance(username)
      if (balance){
            res.json(balance)
      }
      else{
            res.sendStatus(404)
      }
       
}

export async function buy(req,res){
      console.log("Hello from buy")

      let username=req.session?.userid || req.body.username;
      let gameid=req.session?.gameid || req.body.gameid 

      let stockSymbol=req.body.stockSymbol;
      let quantity=req.body.quantity

      const player=await Player.findByUsername(username)

      if(gameid && player){
            const result=await Player.buyStockGame(player,stockSymbol,quantity,gameid)
            if(result){
                  let response=`Purchase succesfull. Stock: ${stockSymbol} Quanitity: ${quantity}`
                  res.json(response)
            }
            else{
                  res.status(404).send("Insufficent funds")
            }
      }
      else if(player){
            console.log("Hello")
            const result= await Player.buyStock(player,stockSymbol,quantity)
            if(result){
                  let response=`Purchase succesfull. Stock: ${stockSymbol} Quanitity: ${quantity}`
                  res.json(response)
            }
            else{
                  res.status(404).send("Insufficent funds")
            }
      }
      else{
            res.sendStatus(404)
      } 
}

export async function sell(req,res){
      let username=req.session?.userid || req.body.username;
      let gameid=req.session?.gameid || req.body.gameid 

      let stockSymbol=req.body.stockSymbol;
      let quantity=req.body.quantity
      const player=await Player.findByUsername(username)

      if(gameid&&player){
            const result=await Player.sellStockGame(player,stockSymbol,quantity,gameid)
            if(result){
                  let response=`Succesfully sold. Stock: ${stockSymbol} Quanitity: ${quantity}`
                  res.json(response)
            }
            else{
                  res.status(404).send("Do not have enough stocks to sell or stock not found")
            }
      }
      else if(player){
            const result= await Player.sellStock(player,stockSymbol,quantity)
            if(result){
                  let response=`Succesfully sold. Stock: ${stockSymbol} Quanitity: ${quantity}`
                  res.json(response)
            }
            else{
                  res.sendStatus(200)
            }
      }
      else{
            res.sendStatus(404)
      }
} 

export async function valuate(req,res){
      let username=req.params.username 
      const player=await Portfolio.findByUsername(username) 
      if (player){
            const result= await Portfolio.valuatePortfolio(player)
            res.json(result)
      }
      else{
            res.sendStatus(404)
      }


}
export async function registerGame(req,res){
      let username=req.params.username 
      let gameid=req.body.gameid
      const player=await Player.findByUsername(username)

      if (player){
            const game=await Game.findByGameId(gameid)
            if(game){
                  const result= await Game.Register(username,gameid)
                  if (result){
                        res.json(`${username} succesfully registerd for Game ${gameid}`)
                  }
                  else{
                        res.status(404).json("Player is already registered")
                  }
            }
            else{
                  res.status(404).json("Game not found")
            }
      }
      else{
            res.status(404).json("Invalid playerID")
      }


}

export async function viewGame(req,res){
      const result= await Game.viewGameList()

      if(result){
            res.json(result)
      }
      else{
            res.sendStatus(404)
      }
} 

export async function oppPortf(req,res){
      let gameid=req.query.gameid 
      let user=req.query.name
      const result=await Player.viewPortfolio(user,gameid) 

      if (result){
            res.json(result)
      }
      else{
            res.sendStatus(200)
      }
}

export async function getCash(req,res){

      let username=req.query.username 


      const player= await Player.findByUsername(username)

      res.json(player.cashBalance)
}

export async function leaderboard(req,res){
      //we will search all the players for the given game id. 
      let gameid=req.query.gameid 
      if (gameid){
            const game= await Game.findByGameId(gameid)
            let players=game.playerList 

            const db=getDB()

            const collection=db.collection('Portfolios')

            let arr=[]
            let str=""

            for (let i=0;i<players.length;i++){
                  const player=await collection.findOne({username:players[i],gameid:gameid}) 
                  arr.push(player)
            }
            //sort the array based on totalVal  
            function swap(arr,xp,yp){
                  var temp=arr[xp]
                  arr[xp]=arr[yp]
                  arr[yp]=temp
            }

            var i, j, min_indx; 
            for(i=0;i<arr.length-1;i++){
                  min_indx=i;
                  for (j=i+1;j<arr.length;j++){
                        if(arr[j].totalVal>arr[min_indx].totalVal){
                              min_indx=j
                        }
                  }
                  swap(arr,min_indx,i)
            } 

            let playerlist=[]
            for(let player of arr){
                  str+=player.username
                  str+=", Total Valuation: "+player.totalVal
                  playerlist.push(str)
                  str=""
            }
            res.json(playerlist)
      }
}
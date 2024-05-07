import { Admin } from "../model/admin.mjs";
import { validate_fields } from "../utils/validate.mjs";
import { Game } from "../model/game.mjs";



export async function admnRegister(req,res){
      let name=req.body.name 
      let email=req.body.email 
      let password=req.body.password
      let token=req.body.token

      //now we need to check that the inputs are valid. 

      let is_valid= await validate_fields(name,email,password) 

      if (is_valid){
            //we need to put in a check so that the same username or email cannot be used again 
            let check= await Admin.match(name,email)
            if (!check){
                  let new_admin=new Admin(name,email,password);
                  let confirmAdmin= await new_admin.adminValidate(token)
                  if (confirmAdmin){
                        let response=await new_admin.create()
                        res.json("Successfully Registered")
                  }
                  else{
                        res.status(404).json("Invalid token number. please contact administrator for admin token")
                  }
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

export async function viewPlayers(req,res){
      const players=await Admin.viewPlayerlist()

      if(players){
            res.json(players)
      }
      else{
            res.sendStatus(404)
      }
}

export async function createGame(req,res){
      let name=req.body.name 
      let email=req.body.email 
      let token=req.body.token
      let gameid=req.body.gameid 
      let maxPlayer=req.body.maxPlayer

      let check=await Admin.match(name,email)

      if (check){
            let verify=await Admin.adminValidate(token)
            if (verify){
                  const game=new Game(gameid,maxPlayer)
                  const result=await Game.findByGameId(gameid) 
                  if(!result){
                        game.create()
                        const response=`Game Created. Game Id: ${gameid}`
                        res.json(response)
                  }
                  else{
                        res.status(404).json("Game with the given Game ID already exists")
                  }
                  
            }
            else{
                  res.status(404).json("Unable to verify admin")
            }
      }
      else{
            res.sendStatus(404)
      }
} 

export async function winner(req,res){
      let gameid=req.body.gameid 
      
      if (gameid){
            const game= await Game.findByGameId(gameid)
            let players=game.playerList 

            const result= await Admin.findWinner(players,gameid)

            res.json(`THE WINNER IS ${result.username}`)
      }else{
            res.send(404)
      }
}

export async function check(req,res){
      let gameid=req.query.gameid 

      const result= await Game.findByGameId(gameid)

      res.json(result.gameID)
}
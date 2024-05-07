import { getDB } from "../utils/db.mjs" 
import { Portfolio } from "./portfolio.mjs"

export class Game{
      constructor(gameId, maxPlayers){
            this.gameID=gameId 
            this.maxPlayers=maxPlayers
            this.playerList=[]
      }

      async create(){
            const db=getDB()
            const collection=db.collection('games')



      
            const result=await collection.insertOne(this)
            return result 
      } 

      static async findByGameId(id){
            const db=getDB()
            const collection=db.collection('games')
            const game=await collection.findOne({gameID:id}) 

            return game
      }

      static async Register(username,gameid){
            const db=getDB();
            const gameCollection=db.collection('games');
            const portfolioCollection=db.collection('Portfolios');
        
            const game=await Game.findByGameId(gameid);
        
            for(var i=0;i<game.playerList.length;i++){
                if(game.playerList[i]===username){
                    return false;
                }
            }
        
            game.playerList.push(username);
        
            const update=await gameCollection.updateOne({gameID:game.gameID},{$set:{playerList:game.playerList}});
        
            let portfolio=new Portfolio(username,10000,[],10000);
            portfolio.gameid=gameid;
        
            const portfolioResult=await portfolioCollection.insertOne(portfolio);
        
            return true;
        }

      static async viewGameList(){
            const db=getDB()
            const collection=db.collection('games')

            const games= await collection.find().toArray()

            let gamesArray=[]
            for(var i=0;i<games.length;i++){
                  gamesArray.push(games[i].gameID)
            }

            return gamesArray
      }

      
}
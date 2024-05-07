import { getDB } from "../utils/db.mjs"; 
import bcrypt from 'bcrypt' 
import { Game } from "./game.mjs";

export class Admin{
      constructor(username,email,password){
            this.username=username 
            this.email=email 
            this.password=password 
            this.token=10
      }

      async create(){
            const db=getDB()
            const collection=db.collection('admins')

            const saltRounds=10; 
            const hashedPass=await bcrypt.hash(this.password,saltRounds); 
            this.password=hashedPass


            const result=await collection.insertOne(this)
            return result 
      }

      static async match(user_name,email){
            const db=getDB() 

            const collection=db.collection('admins')


            const user=await collection.findOne({username:user_name})
            const em=await collection.findOne({email:email})


            if(user==null&&em==null){
                  return false;
            }else{
                  return true
            }
      }

      async adminValidate(val){
            return this.token==val
      }

      static async adminValidate(val){
            return val==10
      }

      static async viewPlayerlist(){
            const db=getDB()
            const collection=db.collection('players')

            try{
                  const players=await collection.find().toArray();
                  return players; 
            }
            catch (error){
                  console.log("error")
                  return [];
            }
      
      }

      //admins will be able to create games

      static async findWinner(players,gameid){

            //check who has max totalvalue 

            let max=0 
            let winner;

            const db=getDB()

            const collection=db.collection('Portfolios')


            for (let i=0;i<players.length;i++){
                  const player=await collection.findOne({username:players[i],gameid:gameid}) 
                  if(player.totalVal>max){
                        max=player.totalVal
                        winner=player
                  }

            }


            return winner

      }
      
}
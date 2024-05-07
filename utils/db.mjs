import {MongoClient} from 'mongodb' 

const mongoURL="mongodb://localhost:27017/"

const client=new MongoClient(mongoURL,{useNewUrlParser:true,useUnifiedTopology:true})


var db; 


export async function connectToDB(){
      try{
            //first we need to wait database to be connected 
            await client.connect()
            db=await client.db('stock-trading-game')
            console.log("Connected succesfully to mongoDB")
      }
      catch (error){
            throw error; 
      }
}

export function getDB(){
      return db; 
}

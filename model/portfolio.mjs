import { getRealTimeStockPrice } from "../utils/stockAPI.mjs"
import { getDB } from "../utils/db.mjs"

export class Portfolio{
      constructor(username,cashBalance,stocks,totalVal){
            this.username=username 
            this.cashBalance=cashBalance
            this.stocks=stocks 
            this.totalVal=totalVal
            this.gameid;
      }

      static async valuate(user){
            //valuate the actual portfolio 
            let val=0
            for(let i=0;i<user.stocks.length;i++){
                  let price=await getRealTimeStockPrice(user.stocks[i].stockName)
                  console.log(`new price is ${price}`)
                  let total=price*user.stocks[i].quantity
                  val+=total
            }

            return val+user.cashBalance
      } 

      static async findByUsername(user){
            const db=getDB()

            const collection=db.collection('Portfolios')
            const user1=await collection.findOne({username:user}) 

            return user1
      }

      static async valuatePortfolio(user){


            const val=await Portfolio.valuate(user)
            const db=getDB()

            const collection=db.collection('Portfolios')

            await collection.updateOne({username: user.username},{$set:{cashBalance:user.cashBalance,stocks:user.stocks,totalVal:val}})
            const user1=await collection.findOne({username:user.username})
            return user1

            
      }
}


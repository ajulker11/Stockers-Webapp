//the player model. This will interact with the database and everything. 

import { getDB } from "../utils/db.mjs"; 
import bcrypt from 'bcrypt'
import {getRealTimeStockPrice} from '../utils/stockAPI.mjs'
import { Portfolio } from "./portfolio.mjs";


export class Player{
      constructor(username,email,password){
            this.username=username 
            this.email=email 
            this.cashBalance=10000;
            //this.portfolio=[]
            this.password=password
            this.stocks=[]
            //this.portfolio.push(this.username)
            //this.portfolio.push(this.cashBalance)

      } 

      async create(){
            const db=getDB()
            const collection=db.collection('players')

            const saltRounds=10; 
            const hashedPass=await bcrypt.hash(this.password,saltRounds); 
            this.password=hashedPass

            this.makePortfolio()

            const result=await collection.insertOne(this)
            return result 
      } 

      async makePortfolio(){
            let portfolio=new Portfolio(this.username,this.cashBalance,this.stocks,this.cashBalance);

            
            const db=getDB() 
            const collection=db.collection('Portfolios')

            await collection.insertOne(portfolio)
      }

      static async viewBalance(user_name){
            const db=getDB() 
            //find the document from the database using the username 
            const collection=db.collection('players')


            const user=await collection.findOne({username:user_name}) 

            if (user!=null){
                  return user;
            }else{
                  return null;
            }
      }

      static async match(user_name,email){
            const db=getDB() 

            const collection=db.collection('players')


            const user=await collection.findOne({username:user_name})
            const em=await collection.findOne({email:email})


            if(user==null&&em==null){
                  return false;
            }else{
                  return true
            }
      }

      static async viewPortfolio(user,gameid){
            if (gameid){
                  const db=getDB() 
                  const collection=db.collection('Portfolios')
                  const user1=await collection.findOne({username:user,gameid:gameid})


                  if (!user1) {
                        return null;  // Explicitly return null if no document is found
                  }
                
                    return user1;
                

            }
      }

      static async findByUsername(username){
            const db=getDB()

            const collection=db.collection('players')
            const user=await collection.findOne({username:username}) 

            return user

           
      }

      static async buyStock(user,stockSymbol,quantity){
            console.log(user,stockSymbol,quantity)
            
            let price= await getRealTimeStockPrice(stockSymbol)
            //let price=120.31
            quantity=Number(quantity)
            let total=price*quantity 

            //implementing the actual logic for buying 
          

            if (user.cashBalance>=total){
                  user.cashBalance-=total 
                  //update portfolio 
                  if (user.stocks.length>=1){
                        let found=false
                        for(var i=0;i<user.stocks.length;i++){
                              if(stockSymbol==user.stocks[i].stockName){
                                    found=true
                                    user.stocks[i].quantity+=quantity
                              }
                        }
                        if (!found){
                              let new_stock=new Stock(stockSymbol,quantity)
                              user.stocks.push(new_stock)
                        }
                  }
                  else{
                        let new_stock=new Stock(stockSymbol,quantity)
                        user.stocks.push(new_stock)
                  }

                  const db=getDB()
                  const collection=db.collection('players')
                  await collection.updateOne({username: user.username},{$set:{cashBalance:user.cashBalance,stocks:user.stocks}})

                  const collection2=db.collection('Portfolios') 
                  const val= await Portfolio.valuate(user)
                  await collection2.updateOne({username: user.username},{$set:{cashBalance:user.cashBalance,stocks:user.stocks,totalVal:val}})
                  
                  return true;
                  
            }
            else{
                  return false;
            }
      } 

      static async buyStockGame(user,stockSymbol,quantity,gameid){
            let price= await getRealTimeStockPrice(stockSymbol)
            //let price=120.31
            quantity=Number(quantity)
            let total=price*quantity 
            
            //implementing the actual logic for buying 
      

            const db=getDB()
            const collection2=db.collection('Portfolios')

            const portf=await collection2.findOne({username:user.username,gameid:gameid}) 

            if (portf.cashBalance>=total){
                  portf.cashBalance-=total 
                  //update portfolio 
                  if (portf.stocks.length>=1){
                        let found=false
                        for(var i=0;i<portf.stocks.length;i++){
                              if(stockSymbol==portf.stocks[i].stockName){
                                    found=true
                                    portf.stocks[i].quantity+=quantity
                              }
                        }
                        if (!found){
                              let new_stock=new Stock(stockSymbol,quantity)
                              portf.stocks.push(new_stock)
                        }
                  }
                  else{
                        let new_stock=new Stock(stockSymbol,quantity)
                        portf.stocks.push(new_stock)
                  }

                  const val= await Portfolio.valuate(portf)
                  const update=await collection2.updateOne({username: user.username,gameid:gameid},{$set:{cashBalance:portf.cashBalance,stocks:portf.stocks,totalVal:val}})

                  return true
            }
            else{
                  return false;
            }
      }      


      static async sellStock(user,stockSymbol,quantity){
            let price= await getRealTimeStockPrice(stockSymbol)
            quantity=Number(quantity)
            let total=price*quantity 

            if (user.stocks.length>=1){
                  let found=false
                  for(var i=0;i<user.stocks.length;i++){
                        if(stockSymbol==user.stocks[i].stockName){
                              found=true
                              if(user.stocks[i].quantity>=quantity){
                                    user.stocks[i].quantity-=quantity
                                    user.cashBalance+=total;
                                    break;
                              } 
                              else{
                                    return false
                              }
                              
                        }
                  }

                  if (!found){
                        return false
                  }
                  const db=getDB()
                  const collection=db.collection('players')
                  await collection.updateOne({username: user.username},{$set:{cashBalance:user.cashBalance,stocks:user.stocks}})

                  //update the corresponding portfolio database 

                  const collection2=db.collection('Portfolios') 
                  const val=await Portfolio.valuate(user)
                  await collection2.updateOne({username: user.username},{$set:{cashBalance:user.cashBalance,stocks:user.stocks,totalVal:val}})

                  return true
            }
            else{
                  return false
            }
      }

      static async sellStockGame(user,stockSymbol,quantity,gameid){
            let price= await getRealTimeStockPrice(stockSymbol)
            //let price=120.31
            quantity=Number(quantity)
            let total=price*quantity 

            const db=getDB()
            const collection2=db.collection('Portfolios')

            const portf=await collection2.findOne({username:user.username,gameid:gameid}) 

            if (portf.stocks.length>=1){
                  let found=false
                  for(var i=0;i<portf.stocks.length;i++){
                        if(stockSymbol==portf.stocks[i].stockName){
                              found=true
                              if(portf.stocks[i].quantity>=quantity){
                                    portf.stocks[i].quantity-=quantity
                                    portf.cashBalance+=total;
                                    break;
                              } 
                              else{
                                    return false
                              }
                              
                        }
                  }

                  if (!found){
                        return false
                  }

                  const val= await Portfolio.valuate(portf)
                  const update=await collection2.updateOne({username: user.username,gameid:gameid},{$set:{cashBalance:portf.cashBalance,stocks:portf.stocks,totalVal:val}})

                  return true 
            }
            else{
                  return false
            }

      }

}


class Stock{
      constructor(stockName,quantity){
            this.stockName=stockName
            this.quantity=quantity
      }
      getStockName(){
            return this.stockName
      }
}
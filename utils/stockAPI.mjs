import axios from 'axios'

const BASE_URL='https://www.alphavantage.co/query' 
const API_KEY=' 2DITH6P6V2XKO8IR'

export async function getRealTimeStockPrice(stockSYmbol){
      const params={
            function: 'TIME_SERIES_INTRADAY',
            symbol: stockSYmbol, 
            interval: '5min',
            apikey:API_KEY
      }; 

      try{
            const response=await axios.get(BASE_URL,{params});
            const data=response.data 

            //const timeSeries=data['Time Series (5min)']
            //const latestTIme=Object.keys(timeSeries)[0];
            //const latestData=timeSeries[latestTIme];
            //const latestPrice=latestData['4. close'];

            //return latestPrice 

            const randomNumber = Math.floor(Math.random() * (180 - 120 + 1)) + 120;

            return randomNumber;

      }
      catch (error){
            throw error;
      }

}


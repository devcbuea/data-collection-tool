"use strict"
let Search = require("../classes/search.class")
let client = require("../../../config/lib/elasticsearch")

module.exports = {
 async search(req, res) {
    //first check if search query params exist
    console.log(req.query)
    if (req.query.keyword.length > 1) {
      let distance = req.query.distance ? (500 + parseInt(req.query.distance) + "m") : null
      let lat = req.query.distance ? parseFloat(req.query.lat) : null
      let lon = req.query.distance ? parseFloat(req.query.lon) : null      
      let finalResults = []
      let queryText = req.query.keyword 
      let queryDocuments = req.query.documents ? req.query.documents.split(',') : []
      
      try{
          for(let qDocument of queryDocuments){
            let results = await Search.searchGeneral(queryText, qDocument, distance, lat, lon)
            finalResults = finalResults.concat(results)
          }
          finalResults = finalResults.length <= 1 ? finalResults : finalResults.sort(function(a, b){
            return b._score - a._score
          })
          return res.jsonp(finalResults);
      } catch (e){
          res.status(500)
          console.log(e)
          return res.send("An error occured.")
      }
    } else{
      
      res.json({ status: "error", message: "search empty" })
    }
  },
  async suggestions(req, res){
      let keyword = req.query.keyword
      if(keyword && keyword.length > 3){
          try{
            let results = await Search.getSuggestions(keyword, { document: "product"})
            res.json(results)
            console.log(results)
          } catch(e){
            console.log(e)
          }
          
      }else{
         return 
      }
  }
}

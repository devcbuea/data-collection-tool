"use strict"
let config = require('../../../config/env/default')
let client = require("../../../config/lib/elasticsearch")
let indexSearchableFields = {
    "product": ['name', 'description', 'address', 'brand', 'color', 'category.text', 'city'],
    "business": ['name', 'description', 'website', 'category.text', 'city', 'address1', 'country']
}
/**
 * @class Search
 */
class Search{
    /**
     * @constructor constructor
     */
    constructor(){}
    /**
     * 
     * @param {string} keyword Keyword
     * @param {array} documentToSearch Array of documents to search
     */
    searchGeneral(keyword, documentToSearch ,distance){
        //construct search query
        return new Promise( (resolve, reject) => {
            //construct search query
            console.log(keyword)
            // search for 
            client.search({
                index: documentToSearch,
                body: {
                    query: {
                        multi_match: {
                            query: keyword,
                            "type": "cross_fields",                            
                            fields: indexSearchableFields[documentToSearch] || ['name'],
                            tie_breaker: 0.3,
                            minimum_should_match: "75%" 
                        }
                    }
                }
            }, (err, results) => { //callback to search
                if(err){
                    reject(err)
                }else{
                    if(results.hits.total === 0){
                        resolve([])
                    }else{
                        resolve(results.hits.hits)
                    }    
                }
            })
        })    
    }

    getSuggestions(keyword, options){
        let body = {}
        body._source = "suggest"
        body.suggest = {
            "search-suggestions": {
                "text": keyword,
                "completion": {
                    "field": "suggest",
                    "size": 10,
                    "fuzzy": {
                        "fuzziness": 2
                    }
                }
            }
        }
        if(options.geolocate){
            body.query = {
                "bool": {
                    "filter": {
                        "geo_distance": {
                            "distance": options.distance || "1km", //1km
                            "location": options.location
                        }
                    }
                }
            }
        }
        return new Promise((resolve, reject) =>{
            client.search({
                index: options.document,
                type: "_doc",
                body: body
            }, (err, results) => { //callback to search
                console.log(results)
                if (err) {
                    reject(err)
                } else {
                    if (results.suggest['search-suggestions'].length === 0) {
                        resolve([])
                    } else {
                        resolve(results.suggest['search-suggestions'])
                    }
                }
            })
        })
    }
}

module.exports = new Search()
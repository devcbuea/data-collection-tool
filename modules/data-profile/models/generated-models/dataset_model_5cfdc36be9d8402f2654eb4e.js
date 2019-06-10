
    const mongoose = require('mongoose')
    const Schema = mongoose.Schema    
    let dataset_model_5cfdc36be9d8402f2654eb4e = new Schema(
        {"data_profile":{"ref":"Data-Profile","required":true},
		"created_at":{"required":true,"default":1560134507740},
		"age":{"type":"number","required":false},
		"country":{"type":"string","required":false}}
    )    
    module.exports = mongoose.model('dataset_model_5cfdc36be9d8402f2654eb4e', dataset_model_5cfdc36be9d8402f2654eb4e)
const suggestionsModel = require('../models/suggestions');
const { validationResult } = require('express-validator');

function subtractday(thisdate, days){ //currdate - days
    var date = new Date(thisdate);
    date.setDate(date.getDate() - days);
    return date;
}

function getdatesarr(today, minus){
    var datearr = new Array();
    var currdate = new Date(today);
    var i = 0;
    while(i<=minus && i != 0){
        datearr.push(new Date(currdate));
        currdate = subtractday(currdate, 1);
        i = i + 1;
    }
    return datearr;
}

exports.makesuggestions = (inv, fordays, req,res)=>{

}
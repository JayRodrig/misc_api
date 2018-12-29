// ----- GLOBAL VARIABLES
const express = require('express')();
const request = require('request');
const port = 3000;

// ----- HELPER FUNCTIONS
const giphyCall = (searchQuery, cb) => {
    const baseURL = `http://api.giphy.com/v1/gifs/search`;
    const key = `YOPsdQEqzXOrOi5bYLyY4p9GlcIfOeW8`;

    request.get(`${baseURL}?q=${searchQuery}&api_key=${key}`, (err, res, body) => {
        const data = JSON.parse(body);
        cb(data);
    });
}

// ----- EXPRESS CALLBACKS
express.get('/math/add', (request, response) => {
    const requestK = Object.keys(request.query);
    const requestV = Object.values(request.query);

    const responseObj = {
        input:{}, 
        sumString:'', 
        sum:0,
    }
    
    for (let i = 0; i < requestK.length; i++){
        if (!(parseInt(requestV[i], 10))) {
            response.json({
                'error': `Non-numeric value encountered. All inputs MUST be numbers.`,
            });
            return;
        }
        
        responseObj.input[`${requestK[i]}`] = requestV[i];
        
        if (i !== requestK.length - 1) {
            responseObj.sumString += `${requestV[i]} + `;
        } else {
            responseObj.sumString += `${requestV[i]}`;
        }

        responseObj.sum += parseInt(requestV[i], 10);
    }
    
    response.json(responseObj);
});

express.get('/math/multiply', (request, response) => {
    const requestK = Object.keys(request.query);
    const requestV = Object.values(request.query);
   
    const responseObj = {
       input: {},
       productString: '',
       product:1,
    } 

    for (let i = 0; i < requestK.length; i++) {
        if (!(parseInt(requestV[i], 10))) {
            response.json({
                'error': `Non-numeric value encountered. All inputs MUST be numbers.`,
            });
            return;
        }
    
        responseObj.input[`${requestK[i]}`] = requestV[i];

        if (i !== requestK.length - 1) {
           responseObj.productString += `${requestV[i]} * `
        } else {
           responseObj.productString += `${requestV[i]}`
        }

        responseObj.product *= requestV[i];
    }
    response.json(responseObj);
});

express.get('/gif', (request, response) => {
    const gifArr = [];
    const requestV = Object.values(request.query);

    if (requestV.length > 1) {
        response.json({
            'error': `More than one input entered. Only ONE input per request is accepted.`,
        });
        return;
    }

    giphyCall(requestV[0], (data) => {
        for (let i = 0; i < data.data.length; i++) {
            gifArr.push(data.data[i].images.original.url);
        }
        response.json(gifArr);
    });
});

express.listen(port, () => {
    console.log('app is listening');
});
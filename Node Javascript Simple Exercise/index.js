const express = require('express');
const path = require('path');
const cookieParser= require("cookie-parser");
const bodyParser = require('body-parser');
const moment = require('moment-timezone'); // For handling time and date

const app = express();
const port = 5085;


app.use(
    express.json(),
    express.urlencoded({ extended: true }),
    cookieParser(),
    express.static(path.join(__dirname, 'public')),
    bodyParser.urlencoded({ extended: true })
  );
  

app.get('/Q1F1', (req, res) => {
  console.log(req.query);
  let num = req.query.number;
  res.send("Received your request! number: " + num +"<br>result is "+     findSummation(num));
});

app.get('/Q1F2', (req, res) => {
console.log(req.query);
  let str = req.query.str;
  res.send("Received your request! str: " + str +"<br>result is "+
    uppercaseFirstandLast(str));
});

app.post('/Q1F3', (req, res) => {
    const { array } = req.body;
    const numbers = array.split(',').map((num) => parseFloat(num));
    const result = findAverageAndMedian(numbers);
    res.send(`Average: ${result.average}, Median: ${result.median}`);
});


app.post('/Q1F4', (req, res) => {
    const { str } = req.body; 
    const result = find4Digits(str);
    res.send(result || 'False');
});




app.get('/readcookie', (req, res) => {
    let visits = req.cookies.visits ? parseInt(req.cookies.visits) : 0;
    visits++;
  
    const isFirstVisit = visits === 1;
    const currentDate = moment().tz('America/New_York'); // Change time zone as needed
    const lastVisitDate = req.cookies.lastVisit
      ? moment(req.cookies.lastVisit).tz('America/New_York')
      : null;
  
      res.cookie('visits', visits, { httpOnly: true });
      res.cookie('lastVisit', currentDate.toISOString(), { httpOnly: true });
      
  
    let message;
  
    if (isFirstVisit) {
      message = 'Welcome to my webpage! It is your first time here.';
    } else {
      message = `Hello, this is the ${visits} time that you are visiting my webpage.`;
  
      if (lastVisitDate) {
        const lastVisitFormatted = lastVisitDate.format('ddd MMM D HH:mm:ss z YYYY');
        message += `\nLast time you visited my webpage on: ${lastVisitFormatted}`;
      }
    }
  
    res.send(message);
});

app.get('/delcookie', (req, res) => {
    res.clearCookie('visits');
    res.clearCookie('lastVisit');
    res.send('Cookies deleted');
});


app.get('/phone', (req, res) => {
    const submittedPhone = req.query.phone || '';
  
    // Regular expression to match the format ddd-ddd-dddd
    const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  
    if (phoneRegex.test(submittedPhone)) {
      res.send(`Correct phone number format: ${submittedPhone}`);
    } else {
      res.send(`Incorrect phone number format: ${submittedPhone}`);
    }
  });
  

app.use((req, res, next) => {
    res.status(404).send("Sorry, the page you're looking for doesn't exist.");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


function findSummation(n) {
    if (isNaN(n) || n <= 0) {
        return false;
    }
    
    let summation = 0;
    for (let i = 1; i <= n; i++) {
        summation += i;
    }
    
    return summation;
}


function uppercaseFirstandLast(wordString) {
    const words = wordString.split(' ');
    const modifiedWords = words.map(word => {
        if (word.length >= 2) {
            const firstChar = word[0].toUpperCase();
            const lastChar = word[word.length - 1].toUpperCase();
            return firstChar + word.slice(1, -1) + lastChar;
        }
        return word;
    });
    
    return modifiedWords.join(' ');
}


function findAverageAndMedian (arr) {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    const average = sum / arr.length;
    const sortedArr = arr.slice().sort((a, b) => a - b);
    const median =
        arr.length % 2 === 0
            ? (sortedArr[arr.length / 2 - 1] + sortedArr[arr.length / 2]) / 2
            : sortedArr[(arr.length - 1) / 2];
    return { average, median };
};

function find4Digits(str) {
    console.log('Input string:', str);

    let digitCount = 0;
    let result = '';

    for (const char of str) {
        if (/\d/.test(char)) {
            result += char;
            digitCount++;

            if (digitCount === 4) {
                break;
            }
        }
    }

    return result || false;
}







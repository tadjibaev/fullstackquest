const request = require('request');
const fs = require('fs');


const mdSourceUrl = "https://raw.githubusercontent.com/sudheerj/javascript-interview-questions/master/README.md";


exports.questions = [];
request.get(mdSourceUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        let mdContent = body;
        let lines = mdContent.split("\n");
        let numLines = lines.length;
        let lastQuestionLine = null;
        let answer = '';
        for (let i = 0; i < numLines; i++) {
          let position = lines[i].search('###');
          if (position !== -1 && position !== 0) {
            answer = '';
            lastQuestionLine = i;
            exports.questions.push({
              question: lines[i].substring(position+4, lines[i].length),
              answer: null
            })
          }
          if (lastQuestionLine !== null && i > lastQuestionLine) {
            answer += (lines[i] + '\n');
            exports.questions[exports.questions.length - 1].answer = answer.trim();
          }
          
        }
    }
});
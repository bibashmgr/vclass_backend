const { getEmailInfo } = require('../helpers/emailExtractor.js');

let email1 = 'bibashthapamagar@gmail.com';
let email2 = 'be2018se635@gces.edu.np';
let payload = getEmailInfo(email2);

console.log(payload);

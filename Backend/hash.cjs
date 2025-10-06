const bcrypt = require('bcrypt');

const password = "Admin";
const hash=bcrypt.hashSync(password,10);

console.log(hash);
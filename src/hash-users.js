const bcrypt = require('bcrypt');

const users = [
  { email: 'juan@demo.com', password: '12345' },
  { email: 'ana@demo.com', password: '12345' },
  { email: 'luis@demo.com', password: '12345' },
  { email: 'carlos@demo.com', password: '12345' },
  { email: 'webibygrauberg@gmail.com', password: '12345' },
  { email: 'jonathangrauberg@gmail.com', password: '12345' },
];

(async () => {
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`UPDATE usuario SET password = '${hash}' WHERE email = '${user.email}';`);
  }
})();

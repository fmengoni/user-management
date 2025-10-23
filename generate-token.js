const jwt = require('jsonwebtoken');

const secret = 'dev-secret'; // mismo que usa tu JwtStrategy

// Lo que tu JwtStrategy espera en el payload
const payload = {
  username: 'fmengoni',
  roles: [{ _id: '5e486f22-0986-4fb9-b1c9-83bac79ee306' }],
};

// Firmamos el token (1 hora de duración)
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('✅ JWT generado:\n');
console.log(token);

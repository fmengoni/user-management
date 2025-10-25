const jwt = require('jsonwebtoken');

const secret = 'dev-secret'; // mismo que usa tu JwtStrategy

// Lo que tu JwtStrategy espera en el payload
const payload = {
  username: 'fmengoni',
  roles: [{ _id: '68fbe6a54e612b3c65a0fd39' }],
};

// Firmamos el token (1 hora de duración)
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('✅ JWT generado:\n');
console.log(token);

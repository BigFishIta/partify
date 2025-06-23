export const jwtConstants = {
  // In produzione leggi da process.env.JWT_SECRET
  secret: process.env.JWT_SECRET || 'supersecret'
};
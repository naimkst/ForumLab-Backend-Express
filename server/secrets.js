const secrets = {
  dbUri:
    process.env.DB_URI ||
    'mongodb+srv://naimkst:rCti0FAyR8qSkyyM@forumlab.w640zhp.mongodb.net/test',
};
const getSecret = (key) => secrets[key];

module.exports = { getSecret };

require('dotenv').config();
const { GraphQLClient } = require('graphql-request');

const endpoint = process.env.CLOUDFLARE_API_ENDPOINT || 'https://api.cloudflare.com/client/v4/graphql';
const { CLOUDFLARE_API_TOKEN } = process.env;
const headers = { authorization: `Bearer ${CLOUDFLARE_API_TOKEN}` };
const client = new GraphQLClient(endpoint, { headers });

module.exports = client;

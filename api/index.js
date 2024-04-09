require('dotenv').config();
const express = require('express');
const {google} = require('googleapis');
const https = require('https');

const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'postmessage',
);
//set scopes



app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/auth/google', async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  
  res.json(tokens);
});
// get token by refresh token
app.post('/auth/google/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  const { tokens } = await oAuth2Client.refreshToken(refresh_token); // exchange code for tokens
  res.json(tokens);
});

//get userInfo
app.post('/auth/google/userinfo', async (req, res) => {
  const { tokens } = req.body;
  oAuth2Client.setCredentials(tokens);
  const userInfo = await google.oauth2('v2').userinfo.get({
    auth: oAuth2Client,
  });
  res.json(userInfo.data);
});
// revoke token
app.post('/auth/google/revoke', async (req, res) => {
  const { tokens } = req.body;
  const response = await oAuth2Client.revokeToken(tokens.access_token);
  res.json(response);
});


app.listen(3000, () => console.log(`server is running`));
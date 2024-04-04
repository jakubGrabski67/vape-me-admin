// const { google } = require('googleapis');
// const { OAuth2 } = google.auth;

// exports.handler = async (event, context) => {
//   try {
//     const code = event.queryStringParameters.code;

//     // Konfiguracja klienta OAuth2
//     const oauth2Client = new OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       `${process.env.URL}/.netlify/functions/googleOAuth`
//     );

//     // Uzyskanie dostępu do tokenu
//     const { tokens } = await oauth2Client.getToken(code);
//     const accessToken = tokens.access_token;

//     // Pobranie informacji o użytkowniku z Google
//     const userInfo = await google.oauth2('v2').userinfo.get({ auth: oauth2Client });

//     // Przetworzenie informacji o użytkowniku
//     const user = {
//       email: userInfo.data.email,
//       name: userInfo.data.name,
//       picture: userInfo.data.picture,
//     };

//     // Zwrócenie informacji o użytkowniku w odpowiedzi HTTP
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ user, accessToken }),
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Internal Server Error' }),
//     };
//   }
// };

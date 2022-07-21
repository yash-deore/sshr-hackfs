import axios from 'axios'; // axios requests

const twitterToken = process.env.TWITTER_TOKEN;
const twitterId = process.env.TWITTER_ID;

module.exports = async (req, res) => {
  console.log('call twiter api from local---');
  const config = {
    method: 'get',
    url: `https://api.twitter.com/2/users/${twitterId}/tweets?tweet.fields=text&max_results=5`,
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `${twitterToken}`,
    },
  };
  let _res = await axios(config);
  console.log(_res.data);
  res.status(200).json(_res.data);
};

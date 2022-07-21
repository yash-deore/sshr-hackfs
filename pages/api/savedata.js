import axios from 'axios'; // axios requests
const pinataSDK = require('@pinata/sdk');

const pinataApiKey = process.env.PINATA_API_KEY || '';
const pinataApiSecret = process.env.PINATA_API_SECRET || '';
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

module.exports = async (req, res) => {
  console.log('call Pinata to save file in IPFS---');

  const { name, datatype, recent } = req.query;
  console.log(`Name ${name} Datatype ${datatype} recent ${recent}`);

  var metadata = {
    name: name,
    datatype: datatype,
    recent: recent,
  };

  //console.log('Metadata:', metadata);

  // const config = {
  //   method: 'post',
  //   url: `https://api.twitter.com/2/users/${twitterId}/tweets?tweet.fields=text&max_results=5`,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // };
  // let _res = await axios(config);
  // console.log(_res.data);
  // res.status(200).json(_res.data);

  try {
    const response = await pinata.pinJSONToIPFS(metadata);
    console.log('esponse: ', response);
    res.send({ response });
  } catch (error) {
    res.status(501);
    console.log('Error in savedata(): ', error);
  }
  res.end();
};

// Remove bodyParser from endpoint
export const config = {
  api: {
    bodyParser: false,
  },
};

import axios from 'axios'; // axios requests
const pinataSDK = require('@pinata/sdk');

const pinataApiKey = process.env.PINATA_API_KEY || '';
const pinataApiSecret = process.env.PINATA_API_SECRET || '';
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

module.exports = async (req, res) => {
  console.log('call Pinata to save file in IPFS---');

  const { name, description, image, attributes } = req.query;
  console.log(
    `Name ${name} description ${description} image ${image} attributes ${attributes}`
  );

  var metadata = {
    name: name,
    description: description,
    image: image,
    attributes: attributes,
  };

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

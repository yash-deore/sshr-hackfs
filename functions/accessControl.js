import {CHAIN} from "../constants"
export function accessControlArray(encrypterAddress, receiverAddress) {
  return [
    {
      contractAddress: "",
      standardContractType: "",
      chain: CHAIN,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: encrypterAddress,
      },
    },
    {operator: "or"},
    {
      contractAddress: "",
      standardContractType: "",
      chain: CHAIN,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: receiverAddress,
      },
    },
  ];
}

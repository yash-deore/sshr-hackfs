export function accessControlArray(encrypterAddress, receiverAddress) {
  const accessArray = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: encrypterAddress,
      },
    },
    { operator: "or" },
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: receiverAddress,
      },
    },
  ];

  return accessArray;
}

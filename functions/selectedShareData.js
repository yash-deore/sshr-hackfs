let dataToBeShared = [];

export function selectedShareData(
  basicCondition,
  basicData,
  personalCondition,
  personalData,
  medicalCondition,
  medicalData
) {
  if (basicCondition) dataToBeShared[0] = basicData;
  else dataToBeShared[0] = null;

  if (personalCondition) dataToBeShared[1] = personalData;
  else dataToBeShared[1] = null;

  if (medicalCondition) dataToBeShared[2] = medicalData;
  else dataToBeShared[2] = null;

  return dataToBeShared;
}

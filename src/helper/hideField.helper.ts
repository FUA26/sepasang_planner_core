import { Prisma } from '@prisma/client';

export const exclude = (modelName, fields) => {
  const modelFields = {
    ...Prisma[`${firstLetterUpperCase(modelName)}ScalarFieldEnum`],
  };
  fields.forEach((field) => delete modelFields[field]);
  Object.keys(modelFields).forEach((key) => (modelFields[key] = true));
  return modelFields;
};

export const firstLetterUpperCase = (word) => {
  const upperCase = word.charAt(0).toUpperCase() + word.slice(1);
  return upperCase;
};

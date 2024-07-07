const PHONE_RULE = /^\+?[1-9]\d{1,14}$/;
const PHONE_ERROR = 'Phone number is not valid format. Example: +12345678901';

export const REGEX = {
  PHONE: PHONE_RULE,
};

export const ERROR_MESSAGE = {
  PHONE: PHONE_ERROR,
};

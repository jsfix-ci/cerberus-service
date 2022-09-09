import { STRINGS } from '../constants';

// TODO: Where does this come from?
const getAccountEmail = (account) => {
  if (!account) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return STRINGS.UNKNOWN_TEXT;
};

const getAccountMobile = (account) => {
  if (!account) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return account?.contacts?.mobile?.value || STRINGS.UNKNOWN_TEXT;
};

const getAccountTelephone = (account) => {
  if (!account) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return account?.contacts?.phone?.value || STRINGS.UNKNOWN_TEXT;
};

const getAddress = (account) => {
  if (!account) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return account?.address || undefined;
};

const getAccountReference = (account) => {
  if (!account) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return account?.reference || STRINGS.UNKNOWN_TEXT;
};

const getShortName = (account) => {
  if (!account) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return account?.shortName || STRINGS.UNKNOWN_TEXT;
};

const getAccountName = (account) => {
  if (!account) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return account?.name || STRINGS.UNKNOWN_TEXT;
};

const getAccount = (targetTask) => {
  return targetTask?.movement?.account || undefined;
};

const AccountUtil = {
  address: getAddress,
  email: getAccountEmail, // TODO: See comment above
  get: getAccount,
  mobile: getAccountMobile,
  name: getAccountName,
  shortName: getShortName,
  reference: getAccountReference,
  telephone: getAccountTelephone,
};

export default AccountUtil;

export {
  getAccount,
  getAccountName,
  getAddress,
  getAccountMobile,
  getAccountReference,
  getAccountTelephone,
  getShortName,
};

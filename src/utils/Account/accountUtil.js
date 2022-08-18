import { STRINGS } from '../constants';

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
  get: getAccount,
  name: getAccountName,
};

export default AccountUtil;

export {
  getAccount,
  getAccountName,
};

const onRequest = (req, token) => {
  const headers = { ...req.headers, Authorization: `Bearer ${token}` };
  return { ...req, headers };
};

const formHooks = {
  onRequest,
};

export default formHooks;

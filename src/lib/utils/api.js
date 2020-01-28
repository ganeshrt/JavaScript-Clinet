import axios from 'axios';
import * as dotenv from 'dotenv';

export const callAPI = async ({
  url, method, data = {}, params = {}, headers = {},
}) => {
  console.log('In callAPI =>', url, method, data, params, headers);
  const res = await axios({
    method,
    url,
    data,
    params,
    headers,
  });

  return res;
};

import axios from 'axios';

/**
 * Checks to see if the sign is accepting requests. This is done
 * before any requests to update the sign can be made.
 * @param {string} officerName The name of the officer requesting the sign
 * @returns {ApiResponse} ApiResponse Object containing the response data
 */
export async function healthCheck(officerName) {
  let status = {};
  status.error = false;
  return status;
}

/**
 * Update the text of the sign.
 * @param {Object} signData - An object containing all of the sign data (text,
 * colors, etc.) sent to the RPC client.
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function updateSignText(signData) {
  let status = {};
  console.log(signData)
  await axios
    .post('/', { ...signData })
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

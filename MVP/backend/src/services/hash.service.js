import crypto from 'crypto';

function sha256(data){
  if (typeof data !== 'string') data = JSON.stringify(data);
  return '0x' + crypto.createHash('sha256').update(data).digest('hex');
}

export { sha256 };

//hashes the given data using sha256 and returns the hash. If the data is not a string, it converts it to a string using JSON.stringify before hashing. The hash is prefixed with '0x' to indicate that it is a hexadecimal value.
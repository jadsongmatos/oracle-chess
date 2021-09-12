export function compressVec(vec) {

  let result = "";

  for (let i = 0; i < vec.length; i++) {
    // parseInt("1"+String("0000000" + vec[i].toString(2)).slice(-7), 2) == vec[i] + 128 ?
    result = result + String.fromCharCode(vec[i] + 32);
  }
  return result;
}

export function decompressVec(string) {
  if (string) {
    let result = [];
    for (let i = 0; i < string.length; i++) {
      //parseInt("0" + string[i].charCodeAt().toString(2).substring(1), 2) == string[i].charCodeAt() - 128 ?
      result.push(string[i].charCodeAt() - 32);
    }
    return result;
  }
  return false;
}

export default {compressVec, decompressVec}
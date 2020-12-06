const KILOBYTE = 1e3;
const MEGABYTE = 1e6;
const GIGABYTE = 1e9;
const TERABYTE = 1e12;

function getTopThreeDigits(sizeInBytes, divisor) {
  const endIndex = sizeInBytes % divisor ? 4 : 3;
  return (sizeInBytes / divisor).toString().substr(0, endIndex);
}

function humanizeFileSize(sizeInBytes) {
  if (sizeInBytes >= TERABYTE) {
    return 'really big (> 1TB)'
  } else if (sizeInBytes >= GIGABYTE) {
    const topThreeDigits = getTopThreeDigits(sizeInBytes, GIGABYTE);
    return topThreeDigits + ' GB';
  } else if (sizeInBytes >= MEGABYTE) {
    const topThreeDigits = getTopThreeDigits(sizeInBytes, MEGABYTE);
    return topThreeDigits + ' MB';
  } else if (sizeInBytes >= KILOBYTE) {
    const topThreeDigits = getTopThreeDigits(sizeInBytes, KILOBYTE);
    return topThreeDigits + ' KB';
  } else {
    return sizeInBytes + ' B';
  }
}

module.exports = { humanizeFileSize };

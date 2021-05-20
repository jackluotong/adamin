const NodeRSA = require('node-rsa')

const encrypt = function (buffer) {
  var publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSFJgsUGxdqb0MFD38kCYORUoUdDxWlpfUrtOJqkFqcK+0eYg9C/3TRjbfpyhxzLZH0YdmxYDNKhA1/nDmRO8Wl0totlg1ZCxh5fxlrW+ssr209/zNHoHMJe4B2ZVx0StJrzl/tjCzXcULw3MkBlqtQPgvMSq+TrkXlvUzDp1xTwIDAQAB'
  var pubKey = new NodeRSA(publicKey, 'public')
  pubKey.setOptions({ encryptionScheme: 'pkcs1' })
  return pubKey.encrypt(buffer, 'base64')
}

export default encrypt

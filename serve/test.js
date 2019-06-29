const aesEncrypt = (buffer, mode, key, iv) => {
  const cipher = crypto.createCipheriv('aes-128-' + mode, key, iv)
  return Buffer.concat([cipher.update(buffer),cipher.final()])
}

const linuxapi = (object) => {
  const text = JSON.stringify(object)
  return {
      eparams: aesEncrypt(Buffer.from(text), 'ecb', linuxapiKey, '').toString('hex').toUpperCase()
  }
}
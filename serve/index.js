const $request = require('./request');
const crypto = require('crypto')
const request = require('request')
const Qs = require('querystring')


const _encSecKey ='84ca47bca10bad09a6b04c5c927ef077d9b9f1e37098aa3eac6ea70eb59df0aa28b691b7e75e4f1f9831754919ea784c8f74fbfadf2898b0be17849fd656060162857830e241aba44991601f137624094c114ea8d17bce815b0cd4e5b8e2fbaba978c6d1d14dc3d1faf852bdd28818031ccdaaa13a6018e1024e2aae98844210';
const _key = 'TA3YiYCfY2dDJQgg'
const _VI = '0102030405060708'
const _NONCE='0CoJUm6Qyw8W8jud';

/**
 * @description: 编码
 * @param {type} 
 * @return: 
 */
function aesDecrypt(encrypted, key) {
  const cipher = crypto.createCipheriv('aes-128-cbc', key, _VI);
  return Buffer.concat([cipher.update(encrypted),cipher.final()]).toString('base64')
}

/**
 * @description: 数据整理
 * @param {type} 
 * @return: 
 */
function prepare(data){
  return {
    'params': aesDecrypt(aesDecrypt(JSON.stringify(data), _NONCE), _key),
    'encSecKey': _encSecKey
  }
}

function playlist(playlist_id){
  let _url='http://music.163.com/weapi/v3/playlist/detail?csrf_token=';
  let data={
      'id': playlist_id,
      'n': 1000,
      'csrf_token':'',
  }
  return $request(_url,prepare(data))
}

function lyric(song_id){
  let _url='http://music.163.com/weapi/song/lyric?csrf_token=';
  let data={
      'id': song_id,
      'os':'pc',
      'lv':-1,
      'kv':-1,
      'tv':-1,
      'csrf_token':''
  }
  return $request(_url, prepare(data))
}

module.exports = { playlist, lyric }
// playlist(311363779)
// lyric(347230)
// .then((res)=>{
//   console.log(res)
// }).catch(e=>{
//   console.warn('Error:',e)
// })
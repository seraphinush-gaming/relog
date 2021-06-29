'use strict';

const en = {
  'error_char_exceed_count': 'Invalid argument. number exceeds character count.',
  'error_char_non_exist': 'Invalid argument. character does not exist.',
  'error_cmd_non_exist': 'Invalid argument. usage : relog [&lt;name&gt;|&lt;num&gt;|list|nx|?]',
  'info': 'Usage : relog [&lt;name&gt;|&lt;num&gt;|list|nx]'
}

const kr = {
  'error_char_exceed_count': '잘못된 인수입니다. 숫자가 캐릭터 수를 초과합니다.',
  'error_char_non_exist': '잘못된 인수입니다. 존재하지 않는 캐릭터입니다.',
  'error_cmd_non_exist': '잘못된 인수입니다. 사용 : 캐선 [&lt;이름&gt;|&lt;숫자&gt;|목록|다음|?]',
  'info': '사용 : 캐선 [&lt;이름&gt;|&lt;숫자&gt;|목록|다음]'
}

function get_message(publisher, error) {
  switch (publisher) {
    case 'bh':
      return kr[error];
    default:
      return en[error];
  }
}

module.exports = { get_message };
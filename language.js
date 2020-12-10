'use strict';

const en = {
  'error_char_exceed_count': 'Invalid argument. number exceeds character count.',
  'error_char_non_exist': 'Invalid argument. character does not exist.',
  'error_cmd_non_exist': 'Invalid argument. usage : relog [<name>|(<num>|list|nx|+]'
}

const kr = {
  'error_char_exceed_count': '유효하지 않은 명령어입니다. 캐릭터 수보다 더 큰 숫자입니다.',
  'error_char_non_exist': '유효하지 않은 명령어입니다. 없는 캐릭터입니다.',
  'error_cmd_non_exist': '유효하지 않은 명령어입니다. 사용 : 캐선 [<이름>|<숫자>|list|nx|+]',
}

function get_message(publisher, error) {
  switch (publisher) {
    case 'nx':
      return kr[error];
    default:
      return en[error];
  }
}

module.exports = { get_message };
'use strict';

const { get_message } = require('./language.js');

class relog {

  constructor(mod) {

    this.mod = mod;
    this.command = mod.command;

    // init
    this.index = -1;
    this.list = [];

    // command
    mod.command.add(['relog', '캐선'], {
      '$none': () => {
        this.send(get_message(mod.publisher, 'error_cmd_non_exist'));
      },
      'list': () => {
        this.list.forEach((ch, i) => { this.send((i + 1) + ' : ' + ch.name); });
      },
      'nx': () => {
        this.try_relog_next();
      },
      '+': () => {
        this.try_relog_next();
      },
      '$default': (name) => {
        let index = parseInt(name);
        if (!isNaN(index)) {
          if (index > this.list.length) {
            this.send(get_message(mod.publisher, 'error_char_exceed_count'));
          } else {
            this.index = index - 1;
            this.relog();
          }
        } else {
          if (this.get_user_index(name)) {
            this.relog();
          } else {
            this.send(get_message(mod.publisher, 'error_char_non_exist'));
          }
        }
      }
    });

    // code
    mod.hookOnce('S_GET_USER_LIST', mod.majorPatchVersion >= 101 ? 19 : 18, { order: -100 }, (e) => {
      e.characters.forEach((ch) => {
        let { id, name, position } = ch;
        this.list[--position] = { id, name };
      });
    });

    mod.hook('C_SELECT_USER', 1, { order: 100, filter: { fake: null } }, (e) => {
      this.index = this.list.findIndex((ch) => ch.id === e.id);
      mod.log('.. relogging into character ' + (this.index + 1) + '. ' + this.list[this.index].name);
    });

  }

  destructor() {
    this.command.remove(['relog', '캐선']);
  }

  // helper
  get_user_index(name) {
    let res = this.list.findIndex((ch) => ch.name.toLowerCase() === name.toLowerCase());
    if (res >= 0) {
      this.index = res;
      return true;
    }
    return false;
  }

  relog() {
    let id = this.list[this.index].id;

    this.mod.send('C_RETURN_TO_LOBBY', 1, {});

    let hook_2;
    let hook_1 = this.mod.hookOnce('S_PREPARE_RETURN_TO_LOBBY', 1, () => {
      this.mod.send('S_RETURN_TO_LOBBY', 1, {});

      hook_2 = this.mod.hookOnce('S_RETURN_TO_LOBBY', 1, () => {
        process.nextTick(() => {
          this.mod.send('C_SELECT_USER', 1, { id: id, unk: 0 });
        });
      });
    });

    this.mod.setTimeout(() => {
      if (hook_1) this.mod.unhook(hook_1);
      if (hook_2) this.mod.unhook(hook_2);
    }, 15000);
  }

  try_relog_next() {
    if (!this.list[++this.index])
      this.index = 0;
    this.relog();
  }

  send(msg) { this.command.message(': ' + msg); }

  // reload
  saveState() {
    let state = {
      index: this.index,
      list: this.list
    }
    return state;
  }

  loadState(state) {
    this.index = state.index;
    this.list = state.list;
  }

}

module.exports = { NetworkMod: relog };
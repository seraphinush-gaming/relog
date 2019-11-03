'use strict';

const { get_message } = require('./language.js');

class relog {

  constructor(mod) {

    this.m = mod;
    this.c = mod.command;

    this.index = -1;
    this.list = [];

    this.c.add(['relog', '캐선'], {
      '$none': () => {
        this.send(get_message(this.m.region, 'error_non_exist'));
      },
      'list': () => {
        this.list.forEach((c, i) => { this.send((i+1) + ' : ' + c.name); });
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
            this.send(get_message(this.m.region, 'error_char_non_exist'));
          } else {
            this.index = index - 1;
            this.relog();
          }
        } else {
          if (this.get_user_index(name)) {
            this.relog();
          } else {
            this.send(get_message(this.m.region, 'error_char_exceed_count'));
          }
        }
      }
    });

    this.m.hookOnce('S_GET_USER_LIST', this.m.majorPatchVersion >= 86 ? 17 : 16, { order: -100 }, (e) => {
      e.characters.forEach((c) => {
        let { id, name, position } = c;
        this.list[--position] = { id, name };
      });
    });

    this.m.hook('C_SELECT_USER', 1, { order: 100, filter: { fake: null } }, (e) => {
      this.index = this.list.findIndex((c) => {
        return c.id === e.id;
      });
      this.m.log('.. relogging into character ' + (this.index + 1) + '. ' + this.list[this.index].name);
    });

  }

  destructor() {
    this.c.remove(['relog', '캐선']);
  }

  // helper
  get_user_index(name) {
    let res = this.list.findIndex((c) => c.name.toLowerCase() === name.toLowerCase());
    if (res >= 0) {
      this.index = res;
      return true;
    }
    return false;
  }

  relog() {
    let id = this.list[this.index].id;

    this.m.send('C_RETURN_TO_LOBBY', 1, {});

    let hook_2;
    let hook_1 = this.m.hookOnce('S_PREPARE_RETURN_TO_LOBBY', 1, () => {
      this.m.send('S_RETURN_TO_LOBBY', 1, {});

      hook_2 = this.m.hookOnce('S_RETURN_TO_LOBBY', 1, () => {
        process.nextTick(() => {
          this.m.send('C_SELECT_USER', 1, { id: id, unk: 0 });
        });
      });
    });

    this.m.setTimeout(() => {
      if (hook_1) this.m.unhook(hook_1);
      if (hook_2) this.m.unhook(hook_2);
    }, 15000);
  }

  try_relog_next() {
    if (this.list[++this.index]) {
      this.relog();
    } else {
      this.index = 0;
      this.relog();
    }
  }

  send() { this.c.message(': ' + [...arguments].join('\n\t - ')); }

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

module.exports = relog;
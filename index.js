'use strict';

class Relog {

  constructor(mod) {

    this.mod = mod;
    this.cmd = mod.command;

    this.idx = -1;
    this.list = [];

    this.cmd.add(['relog', '캐선'], {
      'nx': () => {
        (++this.idx) > this.list.length ? this.idx = 1 : null;
        this.relog();
      },
      '+': () => {
        (++this.idx) > this.list.length ? this.idx = 1 : null;
        this.relog();
      },
      '$default': (name) => {
        if (!isNaN(name)) {
          if (parseInt(name) > this.list.length) {
            this.send(`Invalid argument. number exceeds character count.`);
          } else {
            this.idx = name;
            this.relog();
          }
        } else {
          if (this.getUserIndex(name)) {
            this.relog();
          } else {
            this.send(`Invalid argument. character does not exist.`);
          }
        }
      },
      'none': () => { this.send(`Invalid argument. usage : relog ([name|number])`); }
    });

    this.mod.hookOnce('S_GET_USER_LIST', 16, { order: -100 }, (e) => {
      this.list = [];
      e.characters.forEach((c, i) => {
        let { id, name, position } = c;
        this.list[i] = { id, name, position };
      });
    });

    this.mod.hook('C_SELECT_USER', 1, { order: 100, filter: { fake: null } }, (e) => {
      this.idx = this.list.find((c) => c.id === e.id).position;
      console.log('.. relogging into character ' + this.list[this.idx - 1].name);
    });

  }

  destructor() {
    this.cmd.remove(['relog', '캐선']);

    this.list = undefined;
    this.idx = undefined;

    this.cmd = undefined;
    this.mod = undefined;
  }

  // helper
  getUserIndex(name) {
    let res = this.list.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (res) {
      this.idx = res.position;
      return true;
    } else {
      return false;
    }
  }

  relog() {
    let id = this.list[this.idx - 1].id

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

  send() { this.cmd.message(': ' + [...arguments].join('\n\t - ')); }

  // reload
  saveState() {
    let state = {
      userIndex: this.idx,
      userList: this.list
    }
    return state;
  }

  loadState(state) {
    this.idx = state.userIndex;
    this.list = state.userList;
  }

}

module.exports = function RelogLoader(mod) {
  return new Relog(mod);
}
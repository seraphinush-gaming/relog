'use strict';

const { get_message } = require('./language.js');

class Relog {

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
      '목록': () => {
        this.list.forEach((ch, i) => { this.send((i + 1) + ' : ' + ch.name); });
      },
      'nx': () => {
        this.relogNext();
      },
      '다음': () => {
        this.relogNext();
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
          if (this.get_userIndex(name)) {
            this.relog();
          } else {
            this.send(get_message(mod.publisher, 'error_char_non_exist'));
          }
        }
      },
      '?': () => this.send(get_message(mod.publisher, 'info'))
    });

    // code
    // mod.majorPatchVersion >= 101 ? 19 : 18
    // mod.majorPatchVersion >= 103 ? 20 : 19
    mod.hookOnce('S_GET_USER_LIST', mod.majorPatchVersion >= 104 ? 21 : 20, { order: -100 }, (e) => {
      e.characters.forEach((ch) => {
        let { id, name, position } = ch;
        this.list[--position] = { id, name };
      });
    });

    mod.hook('C_SELECT_USER', 1, { order: 100, filter: { fake: null } }, (e) => {
      this.index = this.list.findIndex((ch) => ch.id === e.id);
      mod.log('.. logging into character ' + (this.index + 1) + '. ' + this.list[this.index].name);
    });

  }

  destructor() {
    this.command.remove(['relog', '캐선']);

    this.command = undefined;
    this.mod = undefined;
  }

  // helper
  get_userIndex(name) {
    let res = this.list.findIndex((ch) => ch.name.toLowerCase() === name.toLowerCase());
    if (res >= 0) {
      this.index = res;
      return true;
    }
    return false;
  }

  async countdown(time) {
    if (time >= 0) {
      this.send(`Switching in ${time}`);
      await this.sleep(1000);
      this.countdown(--time);
    }
  }

  relog() {
    let id = this.list[this.index].id;

    this.mod.send('C_RETURN_TO_LOBBY', 1, {});

    let hook_2;
    let hook_1 = this.mod.hookOnce('S_PREPARE_RETURN_TO_LOBBY', 1, (e) => {

      hook_2 = this.mod.hookOnce('S_RETURN_TO_LOBBY', 1, () => {
        process.nextTick(() => {
          this.mod.send('C_SELECT_USER', 1, { id: id, unk: 0 });
        });
      });

      this.countdown(e.time);
      return false;
    });

    this.mod.setTimeout(() => {
      if (hook_1) this.mod.unhook(hook_1);
      if (hook_2) this.mod.unhook(hook_2);
    }, 15000);
  }

  relogNext() {
    if (!this.list[++this.index]) this.index = 0;
    this.relog();
  }

  send(msg) { this.command.message(': ' + msg); }

  sleep(ms) { return new Promise((resolve) => { this.mod.setTimeout(resolve, ms); }); }

  // reload
  saveState() {
    const state = {
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

module.exports = { NetworkMod: Relog };
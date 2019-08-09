'use strict';

class Relog {

  constructor(mod) {

    this.mod = mod;
    this.cmd = mod.command;

    this.index = -1;
    this.list = [];

    this.cmd.add(['relog', '캐선'], {
      '$none': () => {
        if (this.mod.region === 'kr') {
          this.send(`유효하지 않는 명령어. 사용 : 캐선 [list|nx|+|(이름)|(숫자)]`);
        } else {
          this.send(`Invalid argument. usage : relog [list|nx|+|(name)|(num)]`);
        }
      },
      'list': () => {
        this.list.forEach((c, i) => { this.send(i + ' : ' + c.name) });
      },
      'nx': () => {
        this.tryRelogNext();
      },
      '+': () => {
        this.tryRelogNext();
      },
      '$default': (name) => {
        let index = parseInt(name);
        if (!isNaN(index)) {
          if (index > this.list.length) {
            if (this.mod.region === 'kr') {
              this.send(`유효하지 않는 명령어. 캐릭터 수보다 더 큰 숫자입니다.`);
            } else {
              this.send(`Invalid argument. number exceeds character count.`);
            }
          } else {
            this.index = index - 1;
            this.relog();
          }
        } else {
          if (this.getUserIndex(name)) {
            this.relog();
          } else {
            if (this.mod.region === 'kr') {
              this.send(`유효하지 않는 명령어. 없는 캐릭터입니다.`);
            } else {
              this.send(`Invalid argument. character does not exist.`);
            }
          }
        }
      },
      'none': () => { this.send(`Invalid argument. usage : relog ([name|number])`); }
    });

    this.mod.hookOnce('S_GET_USER_LIST', this.mod.majorPatchVersion >= 85 ? 0 : 15, { order: -100 }, (e) => {
      e.characters.forEach((c) => {
        let { id, name, position } = c;
        console.log(position + ', ' + id + ', ' + name);
        this.list[--position] = { id, name };
      });
    });

    this.mod.hook('C_SELECT_USER', 1, { order: 100, filter: { fake: null } }, (e) => {
      this.index = this.list.findIndex((c) => {
        return c.id === e.id;
      });
      console.log('.. relogging into character ' + (this.index + 1) + '. ' + this.list[this.index].name);
    });

  }

  destructor() {
    this.cmd.remove(['relog', '캐선']);

    this.list = undefined;
    this.index = undefined;

    this.cmd = undefined;
    this.mod = undefined;
  }

  // helper
  getUserIndex(name) {
    let res = this.list.findIndex((c) => c.name.toLowerCase() === name.toLowerCase());
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

  tryRelogNext() {
    if (this.list[++this.index]) {
      this.relog();
    } else {
      this.index = 0;
      this.relog();
    }
  }

  send() { this.cmd.message(': ' + [...arguments].join('\n\t - ')); }

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

module.exports = function RelogLoader(mod) {
  return new Relog(mod);
}
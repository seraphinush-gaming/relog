```
Support seraph via donations, thanks in advance !
```

# relog [![](https://img.shields.io/badge/paypal-donate-333333.svg?colorA=0070BA&colorB=333333)](https://www.paypal.me/seraphinush) [![](https://img.shields.io/badge/patreon-pledge-333333.svg?colorA=F96854&colorB=333333)](https://www.patreon.com/seraphinush)
tera-toolbox module to switch character by chat command

## Auto-update guide
- Create a folder called `relog` in `tera-toolbox/mods` and download >> [`module.json`](https://raw.githubusercontent.com/ylennia-archives/relog/master/module.json) << (right-click this link and save as..) into the folder

## Usage
- `relog` · `캐선`
### Arguments
- `<name>`
  - Relog to user `name`
- `<n>`
  - Relog to `n`-th character in your character list
- `nx` · `다음`
  - Relog to the next character in your character list
  - Wraps back around to the first character in your character list
- `list` · `목록`
  - Send character list to player chat
- `?`
  - Send command and arguments to chat

## Known issues
- If your character gets hit within 10 seconds of relog, the client and server state will desync and you will have to restart client.
- If you use relog while dead, the client may crash.

## Changelog
<details>
    2.02
    - Changed `+` option to `다음` option
    - Added `목록` option as alias to `list` option
    - Added `?` option
    2.01
    - Added `list` option
    2.00
    - Revised code
    1.00
    - Initial fork

</details>
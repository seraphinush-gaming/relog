<p align="center">
<a href="#">
<img src="https://github.com/seraphinush-gaming/pastebin/blob/master/logo_ttb_trans.png?raw=true" width="200" height="200" alt="tera-toolbox, logo by Foglio" />
</a>
</p>

# relog [![paypal](https://img.shields.io/badge/paypal-donate-333333.svg?colorA=253B80&colorB=333333)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=B7QQJZV9L5P2J&source=url) [![paypal.me](https://img.shields.io/badge/paypal.me-donate-333333.svg?colorA=169BD7&colorB=333333)](https://www.paypal.me/seraphinush)
tera-toolbox module to to switch character by chat command
```
Support seraph via paypal donations, thanks in advance !
```

## Auto-update guide
- Create a folder called `relog` in `tera-toolbox/mods` and download >> [`module.json`](https://raw.githubusercontent.com/ylennia-archives/relog/master/module.json) << (right-click this link and save as..) into the folder

## Usage : `relog` | `캐선`
- __`relog {name}`__
  - Relog to user `name`
- __`relog {n}`__
  - Relog to `n`-th character in your character list
- __`relog nx` | `relog +`__
  - Relog to the next character in your character list
  - Wraps back around to the first character in your character list
- __`relog list`__
  - Send character list to player chat

## Known issues
- If your character gets hit within 10 seconds of relog, the client and server state will desync and you will have to restart client.
- If you use relog while dead, the client will crash.

## Changelog
<details>

    2.01
    - Added `list` option
    2.00
    - Revised code
    1.00
    - Initial fork

</details>
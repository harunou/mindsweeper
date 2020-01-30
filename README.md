# Task description

Desired result:

* Develop simple UI interface for the minesweeper game
* Solve levels and (?) find 4 passwords
* Host the code in a private Github repo and share it with `dev-home-task@evolutiongaming.com` user
* Email passwords and link to the repo to `dtsikhanchuk@evolutiongaming.com`

Game UI requirements:

* Backend located at `wss://hometask.eg1236.com/game1/`
* API documentation available via request 'help' to the backend ws endpoint
* UI application should keep connection during user game session
* Game has 4 levels
* Level board dimension is not static

Solving the levels:

* It is allowed to use minesweeper solving algorithm

API:

`help`

```text
Message from server
help      - returns valid commands
new L     - starts new session, L=1|2|3|4
map       - returns the current map
open X Y  - opens cell at X,Y coordinates
```

`new 1`, `new 2`, `new 3`, `new 4`

Valid command

```text
new: OK
```

Invalid command

```text
Unknown command. Send 'help' to view documentation.
```

`map`

Level is not set

```text
map: Not started
```

Level is set

```text
map:
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
```

User lost

```text
map:
1*□□□□□□□□
112□□□□□□□
00111112□□
00000001□□
00001111□□
00112□□□□□
012□□□□□□□
01□□□□□□□□
02□□□□□□□□
01□□□□□□□□
```

`open X Y`<br/>
Note: coordinate origin is in the top left corner

Level is not set

```text
open: Not started
```

Valid `X`, `Y`

```text
open: OK
```

Invalid `X`, `Y`

```text
open: Out of bounds
```

Open `X`, `Y` with bomb cell

```text
open: You lose
```

Open `X`, `Y` resolves the game

```text
open: You win. The password for this level is: ThisWasEasy
```

`Unknown command`

```text
Unknown command. Send 'help' to view documentation.
```

# Ax - [ VERSION 4.0.0+ ]

<img width=50 src="http://7j1zwt.com1.z0.glb.clouddn.com/logo.png" alt="Ax">

> <img src="https://travis-ci.org/DemonCloud/Ax.svg?branch=master" alt="building pass">

<img src="https://nodei.co/npm/ax-js.png" alt="npm info">

<br>

<br>

## The Fast MV JavaScript Framework. 

It require `Struct` utils lib, for the sake of better organization application structure with modular architecture( **AMD or CommonJS specification** ). This is not to replace `Backbone` or `Angular` etc, maybe it boring form of entertainment. Of course, it can cooperate with `React` & `Vue` very well.

<br>

### The Ax design target

* **model** - immutable, fast, persistence, safety
* **view** - simple, fast, container, virtualDOM
* **atom** - connector, fast, independent

<br>

### Install

Install `ax` and `struct`

```shell
yarn install ax-js ax-struct-js

# or

npm install ax-js ax-struct-js
```

Directly download [ Link ](https://github.com/DemonCloud/Ax/archive/master.zip);

<br>

### Prepare Feature VERSION v4+

1. Remove `route` from `ax` , just focus `model` `view` and `atom`

2. `model` extend more useful API, as `model.lock`

3. `atom` more fast with use `struct` connect

4. `moudle` interface to given way to make plugin in `ax`

5. Make plugin use `moudle` API. prepare for `Ax-Loader` && `Ax-Router`

6. addMore `struct` function with benchmark, as `sort(inertSort)`,`sort(quickSort)`

<br>

### Document (current version 3.3.33 -> v3)

> The Document will rebuild on 4.0

<br>

**Document V3 📃** : [ Use Ax in your Project ](https://demoncloud.github.io/Ax/v3)

require [ Struct ] : [ Struct - the C Lang JavaScript Utils Lib ](https://github.com/DemonCloud/struct)

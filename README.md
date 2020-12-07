# Setup Nativescript Action
![Build & Test](https://github.com/hrueger/setup-nativescript/workflows/Build%20&%20Test/badge.svg)

This is a GitHub Action to setup the NativeScript development environment on Windows, Linux and macOS.

## Supports
|                   | Windows           | Ubuntu            | MacOSX            |
|-------------------|-------------------|-------------------|-------------------|
| Android           |:heavy_check_mark: |:heavy_check_mark: |:heavy_check_mark: |
| iOS               | 1)                | 1)                |:heavy_check_mark: |

> 1: `iOS` builds are only supported on OSX.


## How to use

Put this in your workflow file:
```yml
- uses: hrueger/setup-nativescript@v1.1.0
```

You can specify the NativeScript CLI version like so:
```yml
- uses: hrueger/setup-nativescript@v1.1.0
  with:
    nativescript-version: '7.0.10'
```

## License
MIT
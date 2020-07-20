# Node line-by-line experiment

This is a small experiment with reading files line-by-line in Node.js (JavaScript), in which I compare the speed and memory footprint of different approaches to reading and processing large files line-by-line.

Make sure to read my article about it:

- [Reading a file line-by-line in node](https://daniguardiola.me/blog/reading-a-file-line-by-line-in-node)

The most relevant code can be found in the [`password_checkers.js`](password_checkers.js) file.

## Setup

You will need a recent version of Node.js, and bash if you want to run the `run_all.sh` script.

Install the dependencies:

```bash
cd /path/to/node-line-by-line
yarn
# or npm
npm i
```

## Usage

### Run all tests

```bash
# with yarn
yarn all 'password'
# with npm
npm run all 'password'
# directly with bash
./run_all.sh
```

### Run a specific test

```bash
# with yarn
yarn whole_file 'password'
# with npm
npm run whole_file 'password'
# directly with node
node password_checker_whole_file.js 'password'
```

The string 'whole file' can be replaced with any other method. Check the files or the `package.json` file to see the other available methods.

### Options

You can specify the chunk size (for stream-based methods) in kilobytes by passing a second argument to any of the commands above. For example:

```bash
yarn read_stream '12345' 8
npm run readline 'letmein' 128
./run_all 'hey' 32
node password_checker_line_reader.js 'pass' 4
```

## Important files

```bash
# source code of the methods
password_checkers.js
# helpers for calling the methods from CLI
password_checker_whole_file.js
password_checker_read_stream.js
password_checker_readline.js
password_checker_line_reader.js
# CLI runner
cli.js
# script that runs all methods
run_all.sh
# file with all the passwords
xato-net-10-million-passwords.txt
```

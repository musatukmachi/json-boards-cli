# JSON Boards CLI

This repo is a submission for the ARM technical challenge: JSON Boards CLI.

## How to Run
You will need node to run the program. This can be downloaded at [https://nodejs.org/en/download](https://nodejs.org/en/download) or run `sudo apt-get install nodejs` in a bash terminal (macOS, Linux).

Download this repo, then in the terminal run 
`npm link`
then run
`json-boards <directory>`

Alternatively you can run the program using node with
`node JSONBoards.js <directory>`
in which case you won't need to run `npm link`. 

Replace `<directory>` with a folder path containing JSON files.

The program is written in typescript for readability and ease of use purposes, the typescript file is not needed to run the program.
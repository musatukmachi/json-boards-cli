#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
function readJSONFiles(dir) {
    if (!dir) {
        console.error("No directory provided. Please run the script in the format `node combine-json-files.js <directory>`.");
        process.exit(1);
    }
    else if (!fs.existsSync(dir)) {
        console.error("Directory ".concat(dir, " does not exist, please provide a valid directory."));
        process.exit(1);
    }
    var files = fs.readdirSync(dir);
    return files;
}
function combineBoards(files) {
    // get content of files and put into one array, keep track of unique vendors
    var boards = [];
    var vendorsSet = new Set();
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        if (!file.endsWith(".json"))
            continue;
        var filePath = path.join(dir, file);
        var content = fs.readFileSync(filePath, 'utf8');
        var boardsFile = JSON.parse(content);
        if (boardsFile.boards) {
            for (var _a = 0, _b = boardsFile.boards; _a < _b.length; _a++) {
                var board = _b[_a];
                if (board.vendor)
                    vendorsSet.add(board.vendor);
                boards.push(board);
            }
        }
    }
    // sort objects by vendor then name
    boards.sort(function (a, b) {
        // if there are boards with undefined vendors or both undefined vendors and names, then return 0 (no priority),
        // this way, localeCompare will handle things by putting defined values before undefined values (default behaviour)
        try {
            if (a.vendor === b.vendor) {
                return a.name.localeCompare(b.name);
            }
            return a.vendor.localeCompare(b.vendor);
        }
        catch (err) {
            return 0;
        }
    });
    // create output object
    return {
        boards: boards,
        _metadata: {
            total_vendors: vendorsSet.size,
            total_boards: boards.length
        }
    };
}
// main
var dir = process.argv[2];
var files = readJSONFiles(dir);
var combinedBoards = combineBoards(files);
var outputFilePath = path.join(process.cwd(), "combined-boards.json");
fs.writeFileSync(outputFilePath, JSON.stringify(combinedBoards, null, 2));

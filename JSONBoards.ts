#!/usr/bin/env node
interface BoardsFile {
    boards: Board[];
}

interface Board {
    name: string;
    vendor: string;
}

interface CombinedBoards {
    boards: Board[];
    _metadata: {
        total_vendors: number;
        total_boards: number;
    }
}

import * as path from "path";
import * as fs from "fs";

function readJSONFiles(dir: string): string[] {
    if(!dir) {
        console.error("No directory provided. Please run the script in the format `node combine-json-files.js <directory>`.");
        process.exit(1);
    }
    else if(!fs.existsSync(dir)) {
        console.error(`Directory ${dir} does not exist, please provide a valid directory.`);
        process.exit(1);
    }
    const files = fs.readdirSync(dir);
    return files;
}

function combineBoards(files: string[]): CombinedBoards {
    // get content of files and put into one array, keep track of unique vendors
    const boards: Board[] = [];
    const vendorsSet = new Set<string>();
    for(const file of files) {
        if(!file.endsWith(".json")) continue;

        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        try {
            const boardsFile: BoardsFile = JSON.parse(content);
            if(boardsFile.boards) {
                for(const board of boardsFile.boards) {
                    if(board.vendor) vendorsSet.add(board.vendor);
                    boards.push(board);
                }
            }
        }
        catch(err) {
            console.error(`Error parsing file ${file}, skipping this file. Error: ${err.message}`);
        }
    }

    // sort objects by vendor then name
    boards.sort((a, b) => {
        // if there are boards with undefined vendors or both undefined vendors and names, then return 0 (no priority),
        // this way, localeCompare will handle things by putting defined values before undefined values (default behaviour)
        try {
            if(a.vendor === b.vendor) {
                return a.name.localeCompare(b.name);
            }
            return a.vendor.localeCompare(b.vendor);
        }
        catch(err) {
            return 0;
        }
        
    });

    // create output object
    return {
        boards: boards,
        _metadata : {
            total_vendors: vendorsSet.size,
            total_boards: boards.length
        }
    };
}

// main
const dir = process.argv[2];
const files = readJSONFiles(dir);

const combinedBoards = combineBoards(files);

const outputFilePath = path.join(process.cwd(), "combined-boards.json");
fs.writeFileSync(outputFilePath, JSON.stringify(combinedBoards, null, 2));
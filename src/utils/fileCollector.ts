import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Function that Recursively collects all files in a given directory and its sub-directories
export function collectFiles(dirPath: string): string[] {
    const entries: string[] = readdirSync(dirPath);
    let files: string[] = [];

    // Loop through each entry in the directory
    for (const entry of entries) {
        const fullPath: string = join(dirPath, entry);

        // It is a category sub-folder 
        if (statSync(fullPath).isDirectory()) {
            // Recurse into it and merge results.
            files = files.concat(collectFiles(fullPath));
        }
        // Command file (either .ts or .js)
        else if (entry.endsWith('.ts') || entry.endsWith('.js')) {
            // Add the command file to the list
            files.push(fullPath);
        }
    }

    return files;
}
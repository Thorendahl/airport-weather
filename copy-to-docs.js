const fs = require('fs-extra');
const path = require('path');

const sourceDir = 'dist/airport-weather';
const targetDir = 'docs';

async function copyToDocs() {
    try {
        // Check if source directory exists
        if (!await fs.pathExists(sourceDir)) {
            console.error(`❌ Source directory '${sourceDir}' does not exist. Please build the project first.`);
            process.exit(1);
        }

        // Create docs directory if it doesn't exist
        if (!await fs.pathExists(targetDir)) {
            await fs.ensureDir(targetDir);
            console.log(`✅ Created '${targetDir}' directory`);
        }

        // Copy all files and folders from source to target
        await fs.copy(sourceDir, targetDir, { overwrite: true });
        console.log(`✅ Successfully copied files from '${sourceDir}' to '${targetDir}'`);
        console.log('🎉 Script completed successfully!');
    } catch (error) {
        console.error(`❌ Error copying files: ${error.message}`);
        process.exit(1);
    }
}

copyToDocs();

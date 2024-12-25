const fs = require('fs');
const path = require('path');

const PZ_PROJECT_DIR = process.argv[2];
console.assert(PZ_PROJECT_DIR, "Project Dir Macro was not set up!")

const PZ_MOD_NAME = path.basename(PZ_PROJECT_DIR)
const PZ_MOD_WORKSHOP_DIR = path.join(PZ_PROJECT_DIR, "../../Workshop", PZ_MOD_NAME, "Contents", "mods", PZ_MOD_NAME);

build();

async function build() {
    await createModStructure();
    await copyFiles();
}

async function createModStructure() {
    console.log("Creating Project Zomboid Mod Structure...")
    await ensureDirectoryExists(PZ_MOD_WORKSHOP_DIR)
}

async function copyFiles() {
    await fs.readdir(PZ_PROJECT_DIR, {withFileTypes: true, recursive: true}, async (err, files) => {
        const dir_entries = files.filter(filterNonHiddenFiles)

        console.log("Copying files...")
        for (const entry of dir_entries) {
            const entry_path = path.join(entry.parentPath, entry.name);
            const relative_path = entry_path.substring(entry_path.indexOf(PZ_MOD_NAME) + PZ_MOD_NAME.length);
            const destination_path = path.join(PZ_MOD_WORKSHOP_DIR, relative_path);

            logSameLine(`Copying... ${entry.name}`)

            if (!entry.isDirectory())
                fs.copyFile(entry_path, destination_path, (err) => {
                    if(err)
                        console.error(err);
                });
            else
                await ensureDirectoryExists(destination_path)
        }

        process.stdout.clearLine(0);
    });
}

function filterNonHiddenFiles(dir_entry) {
    return !/(^|\/)\.[^\/.]/.test(path.join(dir_entry.parentPath, dir_entry.name))
}

async function ensureDirectoryExists(destinationPath) {
    try {
        await fs.promises.access(destinationPath);
    } catch (err) {
        if (err.code === 'ENOENT')
            await fs.promises.mkdir(destinationPath, { recursive: true });
        else
            console.error(err);
    }
}

function logSameLine(message) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(message);
}




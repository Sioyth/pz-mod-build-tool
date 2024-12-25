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
    console.log("Creating Project Zomboid Mod Structure")
    await fs.access(PZ_MOD_WORKSHOP_DIR, (e) => {
        if(e && e.code === "ENOENT")
            fs.mkdir(PZ_MOD_WORKSHOP_DIR, {recursive: true}, (e) => {
                if(e)
                    console.error(e);
            })
    })
}

async function copyFiles() {
    let dir_entries = fs.readdirSync(PZ_PROJECT_DIR, {withFileTypes: true, recursive: true});
    dir_entries = dir_entries.filter(filterNonHiddenFolders)

    console.log("Copying files")
    for (const entry of dir_entries) {
        const entry_path = path.join(entry.parentPath, entry.name);
        const relative_path = entry_path.substring(entry_path.indexOf(PZ_MOD_NAME) + PZ_MOD_NAME.length);
        const destination_path = path.join(PZ_MOD_WORKSHOP_DIR, relative_path);

        if (!entry.isDirectory())
            fs.copyFile(entry_path, destination_path, (e) => {
                if(e)
                    console.error(e);
            });
        else
            fs.access(destination_path, (e) => {
                if(e && e.code === "ENOENT")
                    fs.mkdir(destination_path, {recursive: true}, (e) => {
                        if(e)
                            console.error(e);
                    })
            })
    }
}

function filterNonHiddenFolders(dir_entry) {
    return !/(^|\/)\.[^\/.]/.test(path.join(dir_entry.parentPath, dir_entry.name))
}

async function ensureDirectoryExists(destinationPath) {
    return fs.access(destinationPath, (err) => {
        if (err && err.code === 'ENOENT')
            fs.mkdir(destinationPath, { recursive: true }, (mk_dir_error) => {
                if (mk_dir_error)
                    console.error(mk_dir_error);
            });
        else if (err)
            console.error(err);
    });
}



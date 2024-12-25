const fs = require('fs');
const path = require('path');

const PZ_PROJECT_PATH = process.argv[2];

console.assert(!PZ_PROJECT_PATH, "Project Dir Macro was not passed!")

const PZ_MOD_NAME = path.basename(PZ_PROJECT_PATH)
const PZ_WORKSHOP_PATH = path.join(PZ_PROJECT_PATH, "../../Workshop");

const PZ_WORKSHOP_MOD_PATH = path.join(PZ_WORKSHOP_PATH, PZ_MOD_NAME);

console.log(`Project Path = ${PZ_PROJECT_PATH}`)
console.log(`Workshop Path = ${PZ_WORKSHOP_PATH}`)
console.log(`Mod Path = ${PZ_MOD_NAME}`)

let filterNonHiddenFolders = (dir_entry) => !/(^|\/)\.[^\/.]/.test(path.join(dir_entry.parentPath, dir_entry.name))

build();

function build() {
    console.assert(fs.existsSync(PZ_WORKSHOP_PATH), "Project Zomboid Workshop path not found");

    console.log("Creating Project Zomboid Mod Structure")
    if(!fs.existsSync(PZ_WORKSHOP_MOD_PATH))
        fs.mkdirSync(PZ_WORKSHOP_MOD_PATH)

    const contents_dir = path.join(PZ_WORKSHOP_MOD_PATH, "Contents");
    if(!fs.existsSync(contents_dir))
        fs.mkdirSync(contents_dir)

    const mods_dir = path.join(contents_dir, "mods");
    if(!fs.existsSync(mods_dir))
        fs.mkdirSync(mods_dir)

    const mod_dir = path.join(mods_dir, PZ_MOD_NAME);
    if(!fs.existsSync(mod_dir))
        fs.mkdirSync(mod_dir)

    let dir_entries = fs.readdirSync(PZ_PROJECT_PATH, {withFileTypes:true, recursive: true});
    dir_entries = dir_entries.filter(filterNonHiddenFolders)

    console.log("Copying files")
    for (const dir_entry of dir_entries) {
        const entry_path = path.join(dir_entry.parentPath, dir_entry.name);
        const destination_path = entry_path.substring(entry_path.indexOf(PZ_MOD_NAME) + PZ_MOD_NAME.length);
        fs.copyFileSync(entry_path, destination_path);
    }
}



const fs = require('fs');
const path = require('path');

const PZ_PROJECT_DIR = process.argv[2];
console.assert(PZ_PROJECT_DIR, "Project Dir Macro was not set up!")

const PZ_MOD_NAME = path.basename(PZ_PROJECT_DIR)
const PZ_WORKSHOP_DIR = path.join(PZ_PROJECT_DIR, "../../Workshop");
const PZ_WORKSHOP_ROOT_MOD_DIR = path.join(PZ_WORKSHOP_DIR, PZ_MOD_NAME);

const filterNonHiddenFolders = (dir_entry) => !/(^|\/)\.[^\/.]/.test(path.join(dir_entry.parentPath, dir_entry.name))

build();

function build() {
    console.assert(fs.existsSync(PZ_WORKSHOP_DIR), "Project Zomboid Workshop path not found");

    console.log("Creating Project Zomboid Mod Structure")
    if(!fs.existsSync(PZ_WORKSHOP_ROOT_MOD_DIR))
        fs.mkdirSync(PZ_WORKSHOP_ROOT_MOD_DIR)

    const contents_dir = path.join(PZ_WORKSHOP_ROOT_MOD_DIR, "Contents");
    if(!fs.existsSync(contents_dir))
        fs.mkdirSync(contents_dir)

    const mods_dir = path.join(contents_dir, "mods");
    if(!fs.existsSync(mods_dir))
        fs.mkdirSync(mods_dir)

    const mod_dir = path.join(mods_dir, PZ_MOD_NAME);
    if(!fs.existsSync(mod_dir))
        fs.mkdirSync(mod_dir)

    let dir_entries = fs.readdirSync(PZ_PROJECT_DIR, {withFileTypes:true, recursive: true});
    dir_entries = dir_entries.filter(filterNonHiddenFolders)

    console.log("Copying files")
    for (const entry of dir_entries) {
        const entry_path = path.join(entry.parentPath, entry.name);
        const relative_path = entry_path.substring(entry_path.indexOf(PZ_MOD_NAME) + PZ_MOD_NAME.length);
        const destination_path = path.join(mods_dir, relative_path);

        if(!entry.isDirectory())
            fs.copyFileSync(entry_path, destination_path);
        else if(!fs.existsSync(destination_path))
            fs.mkdirSync(destination_path)
    }
}



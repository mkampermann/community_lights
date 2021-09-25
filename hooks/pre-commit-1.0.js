#!/usr/bin/env node

const fs = require('fs');
const mvPath = './CommunityLightingMVDemo/data/';
const mzPath = './CommunityLightingMZDemo/data/';
const mvFiles = fs.readdirSync(`${mvPath}`);
const mzFiles = fs.readdirSync(`${mzPath}`);
const util = require('util');
const exec = util.promisify(require('child_process').exec);
let command = '';

try {
  mvFiles.forEach(file => {
    // Load file, pretty the JSON, and write it back
    const mvFilePath = `${mvPath}${file}`;
    const json = fs.readFileSync(mvFilePath, { encoding: "utf8" });
    fs.writeFileSync(mvFilePath, JSON.stringify(JSON.parse(json), null, 2));
    command += ` ${mvFilePath}`;
  });

  mzFiles.forEach(file => {
    // Load file, pretty the JSON, and write it back
    const mzFilePath = `${mzPath}${file}`;
    const json = fs.readFileSync(mzFilePath, { encoding: "utf8" });;
    fs.writeFileSync(mzFilePath, JSON.stringify(JSON.parse(json), null, 2));
    command += ` ${mzFilePath}`;
  });


  async function addFiles() {
    const { stdout, stderr } = await exec(`git add ${command}`);
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  }

  async function ignoreSpaces() {
    const { stdout, stderr } = await exec(`git diff --ignore-all-space`);
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  }
  addFiles();
  ignoreSpaces();
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}


/*
#!/bin/sh
#
# An example hook script to verify what is about to be committed.
# Called by "git commit" with no arguments.  The hook should
# exit with non-zero status after issuing an appropriate message if
# it wants to stop the commit.
#
# To enable this hook, rename this file to "pre-commit".

##if git rev-parse --verify HEAD >/dev/null 2>&1
##then
##	against=HEAD
##else
##	# Initial commit: diff against an empty tree object
##	against=$(git hash-object -t tree /dev/null)
##fi

# If you want to allow non-ASCII filenames set this variable to true.
##allownonascii=$(git config --type=bool hooks.allownonascii)

# Redirect output to stderr.
##exec 1>&2

# Cross platform projects tend to avoid non-ASCII filenames; prevent
# them from being added to the repository. We exploit the fact that the
# printable range starts at the space character and ends with tilde.
##if [ "$allownonascii" != "true" ] &&
  # Note that the use of brackets around a tr range is ok here, (it's
  # even required, for portability to Solaris 10's /usr/bin/tr), since
  # the square bracket bytes happen to fall in the designated range.
  ##test $(git diff --cached --name-only --diff-filter=A -z $against |
    ##LC_ALL=C tr -d '[ -~]\0' | wc -c) != 0
##then
##	cat <<\EOF
##Error: Attempt to add a non-ASCII file name.
##
##This can cause problems if you want to work with people on other platforms.
##
##To be portable it is advisable to rename the file.
##
##If you know what you are doing you can disable this check using:
##
##  git config hooks.allownonascii true
##EOF
##	exit 1
##fi

# If there are whitespace errors, print the offending file names and fail.
##exec git diff-index --check --cached $against --
*/

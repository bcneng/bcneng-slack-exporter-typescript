#!/bin/bash


json_array() {
  echo -n '['
  while [ $# -gt 0 ]; do
    x=${1//\\/\\\\} 
    echo -n \"${x//\"/\\\"}\"
    [ $# -gt 1 ] && echo -n ', '
    shift
  done
  echo ']'
}

for dir in $(find data/* -type d) 
do
    rm ${dir}/index.json
    declare -a files=()
    for file in $(find ${dir} -maxdepth 1 -type f ! -name "index.json")
    do
        file=${file##*/}
        file=${file%.*}
        files+=("$file")
    done 
    json_array "${files[@]}" >> ${dir}/index.json
done
rm -rf dist/data
cp -r data/ dist/

#!bin/bash
rm -rf dist/data
cp -r data/ dist/

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

for dir in $(find dist/data/* -type d) 
do
    files=($dir/*)
    files=(${files[@]##*/})
    files=(${files[@]%.*})
    json_array "${files[@]}" >> ${dir}/index.json
done

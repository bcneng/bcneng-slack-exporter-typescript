#!bin/bash

cp -r data/ dist/
for entry in dist/data/*
do 
    if [ -d "$entry" ]; then
        for file in $entry/*; do
            echo "${file##*/}"
        done
    fi
done


#!/bin/bash

export repoUrl="$repoUrl"
export projectid="$projectid"
export cstring="$cstring"

git clone "$repoUrl" /home/app/output/"$projectid"

exec node script.js

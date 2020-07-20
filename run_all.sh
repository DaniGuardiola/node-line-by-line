echo "Running all methods with password '$1'!"

ARGS="$@" # capture the argv for use inside the 'run' function

TIMES=()
MEMORIES=() # oh, the memories

run () {
    OUTPUT=$(node password_checker_$1.js $ARGS | \
        grep -e '>' -e 'Time spent' -e 'Memory used' | \
        tee /dev/tty) # prints stdin to the terminal but still pipes it to stdout
    REGEXP="Time spent: ([0-9\.]+)([m]?)s.Memory used: ([0-9\.]+)MB"

    if [[ $OUTPUT =~ $REGEXP ]]
    then
        TIME="${BASH_REMATCH[1]}"
        IN_MS="${BASH_REMATCH[2]}" # captures the "m" in "ms" if present
        if [ -z "$IN_MS" ]
        then
            TIME=$(node -pe "$TIME * 1000")
        fi
        TIMES+=( $TIME )
        MEMORY="${BASH_REMATCH[3]}"
        MEMORIES+=( $MEMORY )
    fi
}

printf "\n---------------------------------------\n"
printf "\n- Method #1: loading the whole file 💀"
printf "\n  ===================================\n\n"
run whole_file

printf "\n---------------------------------------\n"
printf "\n- Method #2: ReadStream"
printf "\n  ====================\n\n"
run read_stream

printf "\n---------------------------------------\n"
printf "\n- Method #3: readline"
printf "\n  ==================\n\n"
run readline

printf "\n---------------------------------------\n"
printf "\n- Method #4: line-reader"
printf "\n  =====================\n\n"
run line_reader
printf "\n---------------------------------------\n"

printf "\nTime comparison"
printf "\n===============\n\n"
TIMES_STRING="${TIMES[*]}"
echo "[${TIMES_STRING//${IFS:0:1}/, }]" | npx wunderbar --min 0

printf "\nMemory usage comparison"
printf "\n=======================\n\n"
MEMORIES_STRING="${MEMORIES[*]}"
echo "[${MEMORIES_STRING//${IFS:0:1}/, }]" | npx wunderbar --min 0

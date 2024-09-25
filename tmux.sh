#!/bin/bash

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "tmux is not installed. Please install tmux and try again."
    exit 1
fi

# Name of the tmux session
SESSION_NAME="dev_environment"

# Check if the session already exists
tmux has-session -t $SESSION_NAME 2>/dev/null

# If the session doesn't exist, create it
if [ $? != 0 ]; then
    # Create a new session
    tmux new-session -d -s $SESSION_NAME

    # Split the window into panes
    tmux split-window -h
    tmux select-pane -t 0
    tmux split-window -v

    # Run commands in the panes
    tmux send-keys -t 0 "pnpm dev" C-m

    # Ask user if they want to start the Cloudflare tunnel
    read -p "Do you want to start the Cloudflare tunnel as well? (Y/N) [Y]: " start_tunnel
    start_tunnel=${start_tunnel:-Y}
    if [[ "$start_tunnel" =~ ^[Yy]$ ]]; then
        tmux send-keys -t 1 "cloudflared tunnel run dev" C-m
    else
        echo "Cloudflare tunnel will not be started."
    fi

    # Pane 2 is left empty for interactive use

    # Attach to the session
    tmux attach-session -t $SESSION_NAME
else
    echo "Session $SESSION_NAME already exists. Attaching to it."
    tmux attach-session -t $SESSION_NAME
fi
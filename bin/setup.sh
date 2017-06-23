tmux split-window -h
tmux send-keys "cd ui && npm run watch" Enter
tmux split-window -v
tmux send-keys "cd server && npm run serve" Enter
tmux resize-pane -R 70
tmux resize-pane -D 30

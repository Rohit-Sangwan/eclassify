#!/bin/bash

set -e

# Function to display status messages
status_message() {
    echo "==== $1 ===="
}

# Update system and install curl
# status_message "Updating system and installing curl"
# sudo apt update && sudo apt install -y curl

# Install NVM

# if [ ! -f nvm.sh ]; then
  status_message "Installing NVM"
  wget -O nvm.sh https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

  # Load NVM
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

  # Install Node.js
  status_message "Installing Node.js"
  nvm install 20
# else
#   nvm use 20
# fi

# Verify Node.js installation
node -v

if ! pm2 -v  ; then
  # Install PM2 globally
  status_message "Installing PM2"
  npm install -g pm2
fi

# Function to find an available port
find_available_port() {
    for port in $(seq 8003 9001); do
        if ! sudo lsof -i :$port > /dev/null 2>&1; then
            echo $port
            return 0
        fi
    done
    echo "No available ports found between 8001 and 9001" >&2
    return 1
}

# Find an available port
status_message "Finding an available port"
PORT=$(find_available_port)
if [ $? -ne 0 ]; then
    exit 1
fi
echo "Found available port: $PORT"

# Update .htaccess file
status_message "Updating .htaccess file"
sed -i "s/http:\/\/127\.0\.0\.1:[0-9]*\//http:\/\/127.0.0.1:$PORT\//g" .htaccess

# Update package.json file
status_message "Updating package.json file"
sed -i "s/NODE_PORT=*[0-9]*/NODE_PORT=$PORT/" package.json

# Install project dependencies
status_message "Installing project dependencies"
npm install --loglevel verbose


# Build the project
status_message "Building the project"
npm run build

# Start the project with PM2
status_message "Starting the project with PM2"
pm2 start npm --name "eClassify" -- start

# Display PM2 processes
status_message "Displaying PM2 processes"
pm2 ls

status_message "Installation and deployment complete!"
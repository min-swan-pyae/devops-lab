#!/usr/bin/env bash

APP_URL="http://127.0.0.1:3000"
APP2_URL="http://127.0.0.1:3001"

FAILED=0

LOG_FILE="$HOME/devops-lab/logs/health-check.log"
LOG_FILE2="$HOME/devops-lab/logs/health-check2.log"
	
mkdir -p "$(dirname "$LOG_FILE")"
mkdir -p "$(dirname "$LOG_FILE2")"

TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S')"

if curl --silent --show-error --fail \
  --max-time 3 "$APP_URL" > /dev/null; then
  echo "$TIMESTAMP OK - Application 1 is responding" | tee -a "$LOG_FILE"
else
  echo "$TIMESTAMP ERROR - Application 1 is unavailable" | tee -a "$LOG_FILE"
FAILED=1
fi

if curl --silent --show-error --fail \
  --max-time 3 "$APP2_URL" > /dev/null; then

  echo "$TIMESTAMP OK - Application 2 is responding" | tee -a "$LOG_FILE2"
else
  echo "$TIMESTAMP ERROR - Application 2 is unavailable" | tee -a "$LOG_FILE2"
FAILED=1
fi

exit "$FAILED"
# Check both applications and return a combined exit status

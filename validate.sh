	#!/usr/bin/env bash
set -e

echo "Checking Bash script syntax..."
bash -n health-check.sh
bash -n validate.sh

echo "Bash syntax checks passed!"


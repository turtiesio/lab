#!/bin/bash

ENV=$1

if [[ $NODE_ENV != $ENV ]]; then
    for i in {1..20}; do
        echo "❌ Can only run in [$ENV] environment. Current environment: [$NODE_ENV]"
    done
    exit 1
fi

echo "✅ Running in [$ENV] environment. pass"

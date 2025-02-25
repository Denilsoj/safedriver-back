#!/bin/bash

set -e

echo "migrating prisma"
bunx prisma migrate deploy

echo "run server"
bun run dev
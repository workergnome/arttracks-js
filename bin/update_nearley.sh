#!/usr/bin/env bash
node node_modules/nearley/bin/nearleyc.js parsers/date_string_parser.ne -o parsers/date_string_parser.js
node node_modules/nearley/bin/nearleyc.js parsers/date_parser.ne -o parsers/date_parser.js

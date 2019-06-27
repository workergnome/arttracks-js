#!/usr/bin/env bash
node node_modules/nearley/bin/nearleyc.js grammars/date_string_parser.ne -o grammars/date_string_parser.js
node node_modules/nearley/bin/nearleyc.js grammars/date_parser.ne -o grammars/date_parser.js

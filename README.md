This is a port of much of the underlying Art Tracks logic from Ruby to Javascript.  Currently, it just includes the Date logic.

This is very much a work in progress and very much under development.  Things won't work like you expect them to.

It uses the Nearley.js parser to process the underlying syntax.  These grammars are (as you'd expect) within the `grammars/` folder with the `.ne` extension.  There's a script at `bin/update_nearly.sh` that will compile the `.ne` files into javascript files, and `yarn run grammar` will watch those files and recompile on save.




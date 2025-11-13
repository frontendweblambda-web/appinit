## README.md

```
# @appinit/cleanup


Provides all cleanup and rollback utilities for Appinit engine & CLI.


## Features
- Track temporary files and folders
- Cleanup all temp files at the end of scaffolding
- Rollback partial scaffolds on failure
- Works with @appinit/install and @appinit/engine


## API
### registerTemp({ path, type })
Register temp file/dir to be deleted later.


### cleanupAll()
Remove all registered temp items.


### rollback({ cwd, createdFiles, createdDirs })
Rollback file system state after a failed scaffold.


## Notes
- Fully ESM-compatible
- Dependency-free except @appinit/utils
- Safe for Turborepo caching & pipelines
```

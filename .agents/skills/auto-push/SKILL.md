---
name: auto-push
description: Starts a background daemon task that watches the workspace for file changes and automatically commits and pushes them to git every 10 seconds.
---

# Auto-Push Watcher

When the user asks you to start auto-pushing their manual code changes or mentions this skill, you must execute the following PowerShell script as a long-running background daemon (`IsDaemon = true`) using the `run_command` tool. 

This script checks `git status` every 10 seconds. If it detects uncommitted changes, it stages, commits, and pushes them automatically.

### The Script:
```powershell
while ($true) {
    $status = git status --porcelain
    if ($status) {
        Write-Host "Changes detected. Committing and pushing..."
        git add .
        git commit -m "Auto-commit: User made manual changes"
        git push
    }
    Start-Sleep -Seconds 10
}
```

**Instructions for Agent:**
1. Use the `run_command` tool to run the above script.
2. Set `IsDaemon: true`.
3. Set `WaitMsBeforeAsync: 1000`.
4. Inform the user that the auto-push daemon is running in the background.

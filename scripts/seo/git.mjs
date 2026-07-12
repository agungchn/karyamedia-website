// Git helper for the SEO automation pipeline.
// Commits changes to src/data/articles.ts and pushes to the current branch.
// The pre-commit hook still runs and will BLOCK the commit if any new
// article violates the standard. Set GIT_PUSH_DISABLED=1 to skip the push
// (useful for local testing).

import { execSync } from "node:child_process"
import { tmpdir } from "node:os"
import { writeFileSync, mkdtempSync } from "node:fs"
import { join } from "node:path"

export function commitAndPush(message) {
  execSync("git add src/data/articles.ts", { stdio: "inherit" })
  const status = execSync("git status --porcelain src/data/articles.ts").toString().trim()
  if (!status) {
    console.log("Tidak ada perubahan articles.ts untuk di-commit.")
    return false
  }
  const dir = mkdtempSync(join(tmpdir(), "km-"))
  const msgFile = join(dir, "msg.txt")
  writeFileSync(msgFile, message)
  execSync(`git commit -F "${msgFile}"`, { stdio: "inherit" })
  if (process.env.GIT_PUSH_DISABLED) {
    console.log("GIT_PUSH_DISABLED aktif — push dilewati.")
  } else {
    execSync("git push origin HEAD", { stdio: "inherit" })
  }
  return true
}

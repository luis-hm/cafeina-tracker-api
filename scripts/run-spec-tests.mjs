import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const verificationDir = path.join(repoRoot, '.spec', 'verification')
const jestReport = path.join(verificationDir, 'jest-results.json')
const frontendJestReport = path.join(
  verificationDir,
  'frontend-jest-results.json',
)
const combinedReport = path.join(verificationDir, 'all-results.json')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

mkdirSync(verificationDir, { recursive: true })
for (const report of [jestReport, frontendJestReport, combinedReport]) {
  rmSync(report, { force: true })
}

const commands = [
  ['run', 'test:jasmine'],
  ['run', 'test:jest:report'],
  ['--prefix', 'frontend', 'run', 'test:report'],
]

let failed = false
for (const args of commands) {
  const result = spawnSync(npmCommand, args, {
    cwd: repoRoot,
    stdio: 'inherit',
  })
  failed ||= result.status !== 0
}

function readReport(reportPath) {
  try {
    return JSON.parse(readFileSync(reportPath, 'utf8'))
  } catch {
    failed = true
    return { testResults: [] }
  }
}

const reports = [readReport(jestReport), readReport(frontendJestReport)]
const testResults = reports.flatMap((report) => report.testResults ?? [])
const assertionResults = testResults.flatMap(
  (suite) => suite.assertionResults ?? [],
)
const passed = assertionResults.filter((test) => test.status === 'passed').length
const failedTests = assertionResults.filter((test) => test.status === 'failed').length
const pending = assertionResults.length - passed - failedTests

writeFileSync(
  combinedReport,
  JSON.stringify(
    {
      success: !failed && failedTests === 0,
      numTotalTests: assertionResults.length,
      numPassedTests: passed,
      numFailedTests: failedTests,
      numPendingTests: pending,
      numTotalTestSuites: testResults.length,
      testResults,
    },
    null,
    2,
  ),
)

if (failed || failedTests > 0) {
  process.exitCode = 1
}

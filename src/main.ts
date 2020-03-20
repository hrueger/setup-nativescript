import * as core from '@actions/core'
import * as childProcess from 'child_process'

async function run(): Promise<void> {
  try {
    const osvar = process.platform.toLowerCase()

    if (osvar === 'darwin') {
      // MacOSX
    } else if (osvar === 'win32') {
      // Windows
      exec('setx', [
        'path',
        "'%path%;c:\\Program Files (x86)\\Android\\android-sdk\\build-tools\\29.0.3'"
      ])
    } else {
      // Linux
    }
    exec('npm', ['i', '-g', 'nativescript'])
    exec('tns', ['doctor'])
  } catch (error) {
    core.setFailed(error.toString())
  }
}

function exec(cmd: string, args: string[]): void {
  console.log(`Executing command "${cmd}" with ${args.toString()}`)
  const child = childProcess.spawnSync(cmd, args, {encoding: 'utf8'})
  console.log('Process finished.')
  if (child.error) {
    throw Error(child.stderr)
  }
  console.log('stdout: ', child.stdout)
  console.log('stderr: ', child.stderr)
  if (child.status !== 0) {
    core.setFailed(`Command failed with status code ${child.status}.`)
    process.exit()
  }
}

run()

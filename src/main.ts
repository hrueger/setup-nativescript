import * as core from '@actions/core'
import {exec as execute} from '@actions/exec'

async function run(): Promise<void> {
  try {
    await exec('npm config set unsafe-perm=true')
    const osvar = process.platform.toLowerCase()

    if (osvar === 'darwin') {
      // MacOSX
      await exec('npm i -g nativescript')
    } else if (osvar === 'win32') {
      // Windows
      await exec(
        'setx path "%path%;c:\\Program Files (x86)\\Android\\android-sdk\\build-tools\\29.0.3"'
      )
      await exec('npm i -g nativescript')
    } else {
      // Linux
      await exec('sudo npm i -g nativescript')
    }
    await exec('tns doctor')
  } catch (error) {
    core.setFailed(error.toString())
  }
}

async function exec(cmd: string): Promise<void> {
  console.log(`Executing command "${cmd}"`)
  let myOutput = ''
  let myError = ''

  const options: any = {}
  options.listeners = {
    stdout: (data: Buffer) => {
      myOutput += data.toString()
    },
    stderr: (data: Buffer) => {
      myError += data.toString()
    }
  }
  await execute(cmd, [], options)
  console.log('Process finished.')
  console.log(`Output: ${myOutput}`)
  if (myError) {
    core.setFailed(`Command failed with error ${myError}.`)
    process.exit()
  }
}

run()

import * as core from '@actions/core'
import * as path from 'path'
import {exec as execute} from '@actions/exec'
import {installAndroidSdk} from './thirdparty/android-emulator-runner/src/sdk-installer'

async function run(): Promise<void> {
  try {
    const version = core.getInput('nativescript-version') || 'latest'
    const nativescriptInstallCmd = `npm i -g nativescript@${version}`

    const osvar = process.platform.toLowerCase()

    if (osvar === 'darwin') {
      // MacOSX
      await exec('pip install six')
      await exec('brew install android-commandlinetools')
      await installAndroidSdk(29, 'default', 'x86', undefined)
      await exec(nativescriptInstallCmd)
    } else if (osvar === 'win32') {
      // Windows
      await exec(
        'setx path "%path%;c:\\Program Files (x86)\\Android\\android-sdk\\build-tools\\29.0.3"'
      )
      await exec(nativescriptInstallCmd)
    } else {
      // Linux
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require(path.join(__dirname, './setup-android.js'))
      await exec(nativescriptInstallCmd)
    }
  } catch (error) {
    core.setFailed(error.toString())
  }
}

async function exec(cmd: string): Promise<void> {
  console.log(`Executing command "${cmd}"`)
  const options: any = {}
  const statusCode = await execute(cmd, [], options)
  console.log('Process finished.')
  if (statusCode !== 0) {
    core.setFailed(`Command exited with code ${statusCode}`)
    process.exit()
  }
}

run()

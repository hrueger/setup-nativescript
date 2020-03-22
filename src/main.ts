import * as core from '@actions/core'
import {exec as execute} from '@actions/exec'

async function run(): Promise<void> {
  try {
    await exec('npm config set unsafe-perm=true')
    const osvar = process.platform.toLowerCase()

    if (osvar === 'darwin') {
      // MacOSX
      await exec('pip install six')
      await exec('npm i -g nativescript')
    } else if (osvar === 'win32') {
      // Windows
      await exec(
        'setx path "%path%;c:\\Program Files (x86)\\Android\\android-sdk\\build-tools\\29.0.3"'
      )
      await exec('npm i -g nativescript')
    } else {
      // Linux
      await exec(
        'wget --output-document=android-sdk.zip https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip'
      )
      await exec('sudo unzip -d $ANDROID_HOME android-sdk.zip')
      await exec(
        'echo "y" | sudo $ANDROID_HOME/tools/bin/sdkmanager "platform-tools platforms;android-28 build-tools;28.0.3"'
      )
      await exec('sudo npm i -g nativescript')
    }
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
  const statusCode = await execute(cmd, [], options)
  console.log('Process finished.')
  console.log(`Output: ${myOutput}`)
  console.log(`Errors: ${myError}`)
  if (statusCode !== 0) {
    core.setFailed(`Command exited with code ${statusCode}`)
    process.exit()
  }
}

run()

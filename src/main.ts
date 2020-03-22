import * as core from '@actions/core'
import {exec as execute} from '@actions/exec'

async function run(): Promise<void> {
  try {
    await exec('npm config set unsafe-perm=true')
    const osvar = process.platform.toLowerCase()

    if (osvar === 'darwin') {
      // MacOSX
      await exec('pip install six')
      await exec('brew install maven')
      await exec('brew install gradle')
      await exec('brew cask install android-sdk')
      await exec(
        'sdkmanager platform-tools platforms;android-28 build-tools;28.0.3 --licenses'
      )
      await exec('export MAVEN_HOME=/usr/local/opt/maven')
      await exec('export GRADLE_HOME=/usr/local/opt/gradle')
      await exec('export ANDROID_HOME=/usr/local/opt/android-sdk')
      await exec('export PATH=$MAVEN_HOME/bin:$PATH')
      await exec('export PATH=$GRADLE_HOME/bin:$PATH')
      await exec('export PATH=$ANDROID_HOME/tools:$PATH')
      await exec('export PATH=$ANDROID_HOME/platform-tools:$PATH')
      await exec('export PATH=$ANDROID_HOME/build-tools/19.1.0:$PATH')
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

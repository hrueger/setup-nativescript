import * as core from '@actions/core'
import {exec as execute} from '@actions/exec'
import {installAndroidSdk} from './thirdparty/helperaction/src/sdk-installer'

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
      await installAndroidSdk(29, 'default', 'x86', undefined)
      await exec('npm i -g nativescript')
    } else if (osvar === 'win32') {
      // Windows
      await exec(
        'setx path "%path%;c:\\Program Files (x86)\\Android\\android-sdk\\build-tools\\29.0.3"'
      )
      await exec('npm i -g nativescript')
    } else {
      // Linux

      await exec('mkdir -p /opt/android/sdk')
      await exec(
        'curl --silent --show-error --location --fail --retry 3 --output /tmp/sdk-tools-linux-4333796.zip https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip'
      )
      await exec(
        'unzip -q /tmp/sdk-tools-linux-4333796.zip -d /opt/android/sdk'
      )
      await exec('rm /tmp/sdk-tools-linux-4333796.zip')
      core.exportVariable('ANDROID_HOME', '/opt/android/sdk')
      core.exportVariable('ADB_INSTALL_TIMEOUT', '120')
      core.addPath(
        '/opt/android/sdk/emulator:/opt/android/sdk/tools:/opt/android/sdk/tools/bin:/opt/android/sdk/platform-tools'
      )
      await exec('/bin/bash -c "yes | sdkmanager --licenses"')
      await exec('sdkmanager --update')
      await exec(
        'sdkmanager "tools" "platform-tools" "extras;android;m2repository"  "extras;google;m2repository" "extras;google;google_play_services"'
      )
      await exec(
        'sdkmanager "build-tools;29.0.0" "build-tools;29.0.1" "build-tools;29.0.2"'
      )
      await exec('sdkmanager "platforms;android-29"')
      await exec('sudo npm i -g nativescript')
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

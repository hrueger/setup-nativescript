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
      /*await exec('yes | sdkmanager --licenses', true)
      await exec(
        'sdkmanager platform-tools platforms;android-28 build-tools;28.0.3'
      )
      await exec('export MAVEN_HOME=/usr/local/opt/maven')
      await exec('export GRADLE_HOME=/usr/local/opt/gradle')
      await exec('export ANDROID_HOME=/usr/local/opt/android-sdk')
      await exec('export PATH=$MAVEN_HOME/bin:$PATH')
      await exec('export PATH=$GRADLE_HOME/bin:$PATH')
      await exec('export PATH=$ANDROID_HOME/tools:$PATH')
      await exec('export PATH=$ANDROID_HOME/platform-tools:$PATH')
      await exec('export PATH=$ANDROID_HOME/build-tools/19.1.0:$PATH')*/
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
      /*await exec('mkdir /opt/android-sdk')
      await exec(
        'curl --output /opt/android-sdk/sdk-tools-linux.zip https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip'
      )
      await exec(
        'unzip /opt/android-sdk/sdk-tools-linux.zip -d /opt/android-sdk'
      )
      await exec(
        '/bin/bash -c "yes | /opt/android-sdk/tools/bin/sdkmanager --licenses"'
      )
      console.log('Licenses accepted!')
      await exec(
        '/opt/android-sdk/tools/bin/sdkmanager --install "tools" "emulator" "platform-tools" "platforms;android-28" "build-tools;28.0.3" "extras;android;m2repository" "extras;google;m2repository"'
      )*/

      //////////////

      /*await exec('sudo apt update')
      await exec(
        'sudo apt install -qqy git locales ca-certificates curl unzip lcov sudo python3-dev python3-pip python3-setuptools python3-wheel python3-cffi apt-transport-https lsb-release'
      )*/

      /*await exec('sudo pip3 install -U lxml')
      await exec('pip3 install -U beautifulsoup4')
      await exec('pip3 install -U crcmod')
      await exec('sudo ln -sf /usr/share/zoneinfo/Etc/UTC /etc/localtime')*/

      /*await exec('/bin/bash -c "curl -sL https://firebase.tools | bash"')

      core.exportVariable('CLOUD_SDK_REPO', 'cloud-sdk-$(lsb_release -c -s)')

      await exec(
        '/bin/bash -c "echo "deb https://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list"'
      )
      await exec(
        'curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -'
      )

      await exec('sudo apt update')

      await exec('sudo apt install -y google-cloud-sdk')
      await exec(
        'gcloud config set component_manager/disable_update_check true'
      )

      await exec('sudo apt -y autoremove')*/

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

      await exec('mkdir ~/.android')

      await exec(
        '/bin/bash -c "echo \'### User Sources for Android SDK Manager\' > ~/.android/repositories.cfg"'
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

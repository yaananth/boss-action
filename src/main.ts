import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const slashcommand: string = core.getInput('slash')
    core.setOutput('slashcommand', slashcommand)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

import * as core from '@actions/core'
import {context} from '@actions/github'
import {IIssuePayload} from './Types'

async function run(): Promise<void> {
  try {
    const slashcommand = `/${core.getInput('slash')}`
    core.setOutput('slashcommand', slashcommand)
    const comment: string = (context.payload as IIssuePayload).comment.body
    if (!comment.startsWith(slashcommand)) {
      core.setFailed(
        `Note: Boss is configured to run with slash command "${slashcommand}"`
      )
      return
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

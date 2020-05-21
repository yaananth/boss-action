import * as path from 'path'

import * as core from '@actions/core'
import {context} from '@actions/github'

import {IIssuePayload} from './Types'
import {Constants} from './Constants'

async function run(): Promise<void> {
  try {
    const slashcommand = `/${core.getInput('slash')}`
    core.setOutput('slashcommand', slashcommand)
    const comment: string = (context.payload as IIssuePayload).comment.body
    if (!comment.startsWith(slashcommand)) {
      console.log(
        `Note: Boss is configured to run with slash command "${slashcommand}"`
      )
      return
    }
    const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE as string
    const srcPath = path.join(GITHUB_WORKSPACE, Constants.BOSS_DIR)
    console.log(`Source path is ${srcPath}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

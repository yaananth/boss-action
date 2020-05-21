import * as core from '@actions/core'
import {context} from '@actions/github'

import {IEventPayload} from './Types'
import {Helper} from './Helper'
import {Orchestrator} from './Orchestrator'

async function run(): Promise<void> {
  try {
    const slashCommand = `/${core.getInput('slash')}`
    const comment: string = (context.payload as IEventPayload).comment.body
    if (!comment.startsWith(slashCommand)) {
      console.log(
        `Note: Boss is configured to run with slash command "${slashCommand}"`
      )
      return
    }

    //const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE as string
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string
    const BOSS_TOKEN = process.env.BOSS_TOKEN as string
    const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY as string

    const helper = new Helper(GITHUB_TOKEN, BOSS_TOKEN)
    const orchestrator = new Orchestrator({
      helper,
      command: comment.replace(slashCommand, '').trim(),
      nwo: GITHUB_REPOSITORY
    })
    await orchestrator.runAsync()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

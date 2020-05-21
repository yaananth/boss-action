export interface IIssuePayload {
  comment: IIssueComment
}

export interface IIssueComment {
  body: string
}

interface IRunnerContext {
  os: string
  tool_cache: string
  temp: string
  workspace: string
}

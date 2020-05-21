# The boss
Run any action as you please using custom slash commands and by sending payloads!


## Usage

[DEMO](https://github.com/yaananth/boss-action/issues/1)

### workers.json

> This file has to be at `.boss/workers.json` [sample](https://github.com/yaananth/boss-action/tree/master/.boss/workers.json)

Sample:
```
[
{	
  "command": "(hello)([\\w+ ]+)",	
  "worker": "hello"	
}
]
```

- `command`: Regex to run on issue or PR comment. This regex should be group matching, first group should match the command and rest of groups are sent as payloads to the worker
- `worker`: Should point to worker file name (with out `.yml`) in `.boss/workers`

### workers yml

> Note: These have to be at `.boss/workers/` [sample](https://github.com/yaananth/boss-action/tree/master/.boss/workers.json)

Just github action yml but only the [`steps` part](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idsteps)

> Multiple jobs are not supported, we inject one job with the steps in worker 

Example:
```
steps:
- name: Checkout
  uses: actions/checkout@v2
- name: Hello
  run: |
    echo hey boss, I got ${{ github.event.client_payload.boss_payload_0 }}!  for comment with Id ${{ github.event.client_payload.commentId }}
```

### Payloads from comments

Payloads in your worker workflows can be obtained using prefix `github.event.client_payload`
This action injects payloads using keys `boss_payload_#payloadNumber`.

This also injects additional payloads:

- `github.event.client_payload.commentId`: Id of the `comment` that triggered this work

Example:

Command is `"(hello)([\\w+ ]+)"`
Comment is `hello boss`
`(hello)` matches the command.
`boss` matches `([\\w+ ]+)` group and hence becomes payload.
So, worker is triggered with payload `boss_payload_0` with value as `boss`

### To activate

> Note: `BOSS_TOKEN` should be added as secret. It is your PAT token with scopes `admin:repo_hook, repo, workflow`. This token creates worker workflow and dispatches events to trigger it. `GITHUB_TOKEN` can't be used as it's limited ([read](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#using-the-github_token-in-a-workflow))

####  `/boss`


```
on: issue_comment

jobs:
  boss:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2
    - name: RunBoss
      uses: yaananth/boss-action@v1
      env:
        BOSS_TOKEN: "${{ secrets.BOSS_TOKEN }}"
        GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```

#### Custom slash command
```
on: issue_comment

jobs:
  boss:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2
    - name: RunBoss
      uses: yaananth/boss-action@v1
      with:
        slash: "bossmate"
      env:
        BOSS_TOKEN: "${{ secrets.BOSS_TOKEN }}"
        GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```

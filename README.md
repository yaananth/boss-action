# The boss

## Usage

### workers.json

> This file has to be at `.boss/workers.json`

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

Just github action yml but only the [`steps` part](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idsteps)

> Multiple jobs are not supported, we inject one job with the steps in worker 

Example:
```
steps:
- name: Checkout
  uses: actions/checkout@v2
- name: Hello
  run: |
    echo hey boss, I got ${{ github.event.client_payload.boss_payload_0 }}!
```

### Payloads from comments

Payloads in your worker workflows can be obtained using prefix `github.event.client_payload`
We inject payloads using keys `boss_payload_#payloadNumber`.

Example:

Command is `"(hello)([\\w+ ]+)"`
Comment is `hello boss`
`(hello)` matches the command.
`boss` matches `([\\w+ ]+)` group and hence becomes payload.
So, worker is triggered with payload `boss_payload_0` with value as `boss`

### To activate `/boss`
```
on: issue_comment

jobs:
  boss:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2
    - name: RunBoss
      uses: ./
      env:
        BOSS_TOKEN: "${{ secrets.BOSS_TOKEN }}"
        GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```

### To activate custom slash command
```
on: issue_comment

jobs:
  boss:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2
    - name: RunBoss
      uses: ./
      with:
        slash: "bossmate"
      env:
        BOSS_TOKEN: "${{ secrets.BOSS_TOKEN }}"
        GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```

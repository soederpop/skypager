workflow "New workflow" {
  on = "push"
  resolves = ["Build Docker Container"]
}

action "Build Docker Container" {
  uses = "actions/docker/cli@c08a5fc9e0286844156fefff2c141072048141f6"
  args = "[\"build\", \"-t\", \"datapimp/skypager\"]"
}

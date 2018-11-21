# Skypager Introduction

## Setting up the @skypager portfolio for local development 

First clone the repo and install the dependencies.  This will kick off
a postinstall script which builds the core dependencies.

```shell
$ git clone git@github.com:skypager/skypager.git
$ cd skypager
$ yarn
```

A few of our apps, and test suites, rely on a google cloud api's service account JSON file.

This file needs to be copied to the following projects.

```shell
$ mkdir -p src/apps/webapp/secrets src/helpers/sheet/secrets src/examples/sheets-server/secrets
$ cp serviceAccount.json src/apps/webapp/secrets/
$ cp serviceAccount.json src/helpers/sheet/secrets
$ cp serviceAccount.json src/examples/sheets-server/secrets/
```

As an alternative, you can read this serviceAcount.json file into an environment variable `process.env.SERVICE_ACCOUNT_DATA`

## Navigating The Skypager Source Tree 

The skypager project is a lerna monorepo that uses yarn workspaces.  

It is used to publish multiple packages under the `@skypager/` scope on npm.

In [the src folder](../../../src) you will find different subfolders.  

```
- src/
  - apps/
  - examples/
  - features/
  - helpers/
  - main/
  - runtime/
  - runtimes/
```

Inside [the apps folder](../../../src/apps) are multiple projects that get deployed as web, mobile, or desktop applications.

Inside [the examples folder](../../../src/examples) are example projects that use the skypager architecture to do interesting things.

Inside [the features folder](../../../src/features) you'll find different `@skypager/features-*` modules which can be loaded into your runtime.

Inside [the helpers folder](../../../src/helpers) you'll find different `@skypager/helpers-*` modules which can be loaded into your runtime.

Inside [the runtime folder](../../../src/runtime) you'll find the core `@skypager/runtime` library, and a number of various utilities and classes that it provides. 

Inside [the runtimes folder](../../../src/runtimes) you'll find environment specific runtimes.  An environment specific runtime extends `@skypager/runtime` with helpers and features that are suitable to an environment. 

## Building All The Projects

From the @skypager portfolio root:

```shell
$ yarn build:all
```

## Testing All The Projects

From the @skypager portfolio root:

```shell
$ yarn test 
```

## Working with individual projects

Everywhere in the src tree you find a `package.json`, you have a project you can work with.  

The best way to interact with any project is through `yarn run`.

Generally you should be able to run `yarn build` and `yarn test` on every project.






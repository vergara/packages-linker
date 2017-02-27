# packages-linker
This tool is intended for developers who use one single version control repository for all of their modules in a project. It allows you to:
1. If you prefer to structure your projects using multiple small npm modules instead of require*ing*('../....../module') them as files and you don't want to make your npm modules public, this tool allows you to avoid using *private npm* to achieve that.
2. Independently of whether you use public or private npm or you don't, you can instantly test changes in your modules from app(s) or other modules' unit tests using them. This is accomplished by automatically linking all your packages together with *npm link*.

## Installing the tool
`npm i packages-linker -g`

## Avoid using *private npm*
This tools allows you to avoid paying for private npm while allowing you to structure your repository as if you were using it. This allows you to start using private npm anytime without making any structural changes in your repository.

### Structuring your project
1. You will need to use a *scope* for your packages, just as if you were using private npm. This means all your packages names will be of the form @myscope/package-name.
2. *require* your packages just the way you would as if you were using private npm: `var myModule = require('@myscope/my-module')`.
3. Don't add your modules in your package.json *dependencies* section. That's the only change you will have to make when you decide to move to hosting your modules in private npm.

## See changes in your modules immediately reflected in your apps or in other modules' unit tests.
After npm install*ing* your dependencies, just run the tool and start working on your modules. When running your apps or other modules' unit tests, your changes in the module will be effected without any intervention from your side.

## Running the tool
After npm installing your dependencies for an app, you need to run the tool to link all your modules together:

`packages-linker /root/dir/of/my/repo @myscope`

Every time you npm install your dependencies, you need to run the tool again. If your project contains only one app, you may want to run the tool as a postinstall script. If you have multiple apps, you may prefer to npm install your dependencies for all of them before you run the tool.

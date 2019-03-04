# vot cli
```
                  _              _   _
 __   __   ___   | |_      ___  | | (_)
 \ \ / /  / _ \  | __|    / __| | | | |
  \ V /  | (_) | | |_    | (__  | | | |
   \_/    \___/   \__|    \___| |_| |_|

```

## Install
```
npm install -g vot
```

## Usage
`vot`
```
Usage: vot <command> [options]

Options:
  -V, --version                                  output the version number
  -h, --help                                     output usage information

Commands:
  init [options] <template-name> <project-name>  generate a project from a template
  list [options]                                 list available online templates
  info                                           print debugging information about your environment

  Run vot <command> --help for detailed usage of given command.
```

`vot init -h`
```
Usage: init [options] <template-name> <project-name>

generate a project from a template

Options:
  -c, --clone        use git clone when fetching remote template
  -o, --offline      use cached template
  -r, --repo [path]  use a custom repo, default: "ura-admin-templates/"
  -h, --help         output usage information
```

`vot list -h`
```
Usage: list [options]

list available online templates

Options:
  -r, --repo [url]  use a custom online repo, default: "https://api.github.com/users/ura-admin-templates/repos"
  -h, --help        output usage information
```

#!/usr/bin/env node

const chalk   = require('chalk')
const fs      = require('fs')
const glob    = require('glob')
const nano    = require('cssnano')
const Promise = require('bluebird')
const sass    = require('node-sass')

const opts = {
  demarcator: {
    start: '\@critical',
    end:   '\@endcritical'
  },
  deps: [
    'assets/scss/_mixins.scss',
    'assets/scss/_variables.scss'
  ],
  glob: {
    ignore: [
      '**/node_modules/**',
      '**/assets/**'
    ]
  },
  sass: {},
  nano: {}
}

const sassTask = (scss) => {
  const sassOpts = Object.assign({}, opts.sass, { data: scss })

  sass.render(sassOpts, (err, result) => {
    if(err) return console.log(chalk.red(err))

    nano.process(result.css, opts.nano).then(resultNano => {
      try {
        fs.writeFileSync('dist/css/critical.css', resultNano)
        console.log(chalk.green('Critical CSS complete'))
      }
      catch(e){
        console.log(chalk.red(e))
      }
    }).catch(err => {
      console.log(chalk.red(err))
    })
  })
}

const extractCritical = (contents) => {
  const re = new RegExp("\/\/\\s"+opts.demarcator.start+"\\n([\\s\\S]*?)\\n\/\/\\s"+opts.demarcator.end, 'g')
  const groups = []
  let match
  while(match = re.exec(contents)) groups.push(match[1])
  return groups
}

const parseFiles = (files) => {
  let concat = ''

  opts.deps.map(dep => {
    const contents  = fs.readFileSync(dep).toString()
    concat = `${concat}${contents}`
  })

  files.map(file => {
    const contents  = fs.readFileSync(file).toString()
    extractCritical(contents).map(critical => {
      concat = `${concat}${critical}`
    })
  })

  sassTask(concat)
}

glob('**/*.scss', opts, (err, files) => {
  if(err) return console.log(chalk.red(err))
  parseFiles(files)
})

#!/usr/bin/env node

const fs      = require('fs')
const Promise = require('bluebird')
const program = require('commander')
const chalk   = require('chalk')
const rimraf  = require('rimraf')

const jsEntry  = './assets/js/index.js'
const cssEntry = './assets/scss/main.scss'

const normalizeName = (name, type) => {
  switch(type){
    case 'pascal':
      return name
        .replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
        .replace(/\s+/g, '')
        .replace('-', '')
    case 'kebab':
      return name
        .replace(/\s+/g, '-').toLowerCase()
    case 'camel':
      return name
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => index == 0 ? letter.toLowerCase() : letter.toUpperCase())
        .replace(/\s+/g, '')
        .replace('-', '')
    default:
      return name
  }
}

const makeJS = (name) => {
  const n = normalizeName(name, 'pascal')
  const s = normalizeName(name, 'kebab')
  return `import styles_${n} from './_${s}.scss'

const ${n} = () => {
  console.log('Hello ${name}')
}

module.exports = ${n}
  `
}

const makeSCSS = (name) => {
  const n = normalizeName(name, 'camel')
  return `.${n} {

  &-subcomponent {
    color: #56a0d3;
  }

}
  `
}

const makePartial = (name) => {
  const n = normalizeName(name, 'camel')
  return `<div class="${n}">
  <div class="${n}-subcomponent">${name}</div>
</div>
  `
}

const makeLayout = (name) => {
  const n = normalizeName(name, 'camel')
  const s = normalizeName(name, 'snake')
  return `<?php preemo_partial('header', '${s}'); ?>
<main class="${n}">
  <?php if(have_posts()): ?>
    <?php while(have_posts()): the_post(); ?>

      <?php preemo_partial('content', '${s}'); ?>

    <?php endwhile; ?>
  <?php endif; ?>
</main>
<?php preemo_partial('footer', '${s}'); ?>
  `
}

const makeDirectory = (base, name) => {
  const n   = normalizeName(name, 'kebab')
  const dir = `${base}/${n}`
  return new Promise((resolve, reject) => {
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir)
      resolve(`Directory ${dir} created successfully`)
    } else {
      reject(`Directory ${dir} already exists`)
    }
  })
}

const includeJS = (base, name) => {
  const n = normalizeName(name, 'kebab')
  return `
//BEGIN ${name}
if(window.preemo_router.indexOf('${name}') > -1) require('../../${base}/${n}/${n}.js')()
//END ${name}
`
}

const includeCSS = (base, name) => {
  const n = normalizeName(name, 'kebab')
  return `
//BEGIN ${name}
@import '../../${base}/${n}/_${n}.scss';
//END ${name}
`
}

const addFiles = (base, name) => {

  const n    = normalizeName(name, 'kebab')
  const js   = makeJS(name)
  const scss = makeSCSS(name)
  const php  = base === 'partials' ? makePartial(name) : makeLayout(name)
  const dir = `${base}/${n}`

  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(`${dir}/${n}.js`, js)
      fs.writeFileSync(`${dir}/_${n}.scss`, scss)
      fs.writeFileSync(`${dir}/${n}.php`, php)

      let jsFile = fs.readFileSync(jsEntry)
      jsFile = jsFile += includeJS(base, name)
      fs.writeFileSync(jsEntry, jsFile)

      // let cssFile = fs.readFileSync(cssEntry)
      // cssFile = cssFile += includeCSS(base, name)
      // fs.writeFileSync(cssEntry, cssFile)
    }
    catch(e) {
      reject(e)
    }
    resolve('Files added')
  })
}

const removeDirectory = (base, name) => {
  const n   = normalizeName(name, 'kebab')
  const dir = `${base}/${n}`
  return new Promise((resolve, reject) => {
    try {
      rimraf(dir, err => {
        resolve(`${dir} removed`)
      })
    }
    catch(e) {
      reject(e)
    }
  })
}

const cleanFiles = (base, name) => {
  const n = normalizeName(name, 'kebab')
  const pattern = `\/\/BEGIN ${n}\n.*\n\/\/END ${n}`
  const r = new RegExp(pattern, 'g')
  return new Promise((resolve, reject) => {
    try {
      let jsFile = fs.readFileSync(jsEntry, 'utf8')
      jsFile = jsFile.replace(r, '')
      fs.writeFileSync(jsEntry, jsFile)

      let cssFile = fs.readFileSync(cssEntry, 'utf8')
      cssFile = cssFile.replace(r, '')
      fs.writeFileSync(cssEntry, cssFile)

      resolve('JS and CSS files cleaned')
    }
    catch(e) {
      reject(e)
    }
  })
}

const cleanSchema = (type, name) => {
  return new Promise((resolve, reject) => {
    const pwd      = process.env.PWD
    let schema = require(`${pwd}/schema.json`)
    let base = schema[type]
    let index = base.indexOf(name)
    base.splice(index, 1)
    schema[type] = base
    const json     = JSON.stringify(schema, null, 2)

    fs.writeFile('schema.json', json, err => {
      if(err) reject(err)
      else resolve('Schema synced')
    })
  })
}

const syncSchema = (base, name) => {
  return new Promise((resolve, reject) => {
    const pwd      = process.env.PWD
    const schema = require(`${pwd}/schema.json`)
    schema[base].push(name)
    const json     = JSON.stringify(schema, null, 2)

    fs.writeFile('schema.json', json, err => {
      if(err) reject(err)
      else resolve('Schema synced')
    })
  })
}

program
  .version('1.0.0')
  .arguments('<base>')
  .option('-n, --name <name>', 'Name of component to create or remove')
  .option('-t, --type <type>', 'Type of component to create or remove')
  .action((base) => {
    const { name, type } = program

    if(!name) return console.log(chalk.red('Please specify the name of your component with -n'))

    if(!type) return console.log(chalk.red('Please specify the type of your component with -t'))

    if(base === 'remove'){
      removeDirectory(type, name)
        .then(success => {
          console.log(chalk.white(success))
          cleanFiles(type, name)
            .then(success => {
              console.log(chalk.white(success))
              cleanSchema(type, name)
                .then(success => {
                  console.log(chalk.white(success))
                  console.log(chalk.green('Component removed'))
                })
            })
            .catch(err => console.log(chalk.red(err)))
        })
        .catch(err => console.log(chalk.red(err)))
    }
    else if(base === 'add'){
      makeDirectory(type, name)
        .then(success => {
          console.log(chalk.white(success))
          addFiles(type, name)
            .then(success => {
              console.log(chalk.white(success))
              syncSchema(type, name)
                .then(success => {
                  console.log(chalk.white(success))
                  console.log(chalk.green('Component added'))
                })
                .catch(err => console.log(chalk.red(err)))
            })
            .catch(err => console.log(chalk.red(err)))
        })
        .catch(err => console.log(chalk.red(err)))
    }
    else {
      console.log(chalk.red('Please use either add or remove'))
    }
  }).parse(process.argv)

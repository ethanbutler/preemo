# Preemo

A CLI-driven WordPress theme for component-based development. The motivation here is to build an opinionated, tightly-modularized WordPress theme. The eventual goal is to leverage service workers, HTTP/2, and asset chunking to create an extremely performant theme framework.

## Installation

Download the ZIP and install as a WordPress theme. From the theme directory, run `yarn install` to install dev dependencies.

## CLI

```
preemo add -t <type> -n <component-name>
```

where `type` is either `layouts` or `partials` and `component-name` is the name of your component. This will add a new layout or component to your theme. A component uses the following structure:

```
partials/
  | <component>/
    | _<component>.scss
    | <component>.js
    | <component>.php
```

The necessary CSS and JS bundling happens under the hood – you can get right to making changes to them without worrying about modifying configuration or import statements.

All PHP code is run inside the loop, so you have access to functions like `the_title()` and `the_content()`.

Note that layouts use the default WordPress template hierarchy, and as such should be named one of the following:

* embed
* 404
* search
* front_page
* home
* post_type_archive
* tax
* attachment
* single
* page
* singular
* category
* tag
* author
* date
* archive

## `preemo_partial`

In order to take advantage of the automatic bundling, partialsshould be included in layouts by using the `preemo_partial()` function.

## Build tools

_(This is the most work-in-progress aspect of this project)_

`gulp js` and `gulp css` will build scripts and styles, respectively. `gulp watch` will watch for changes and serve the site at a proxy URL specified as a `DEV_URL` Node environment variable.

Builds currently use Browserify, but there are plans to replace this entire pipeline with Webpack.

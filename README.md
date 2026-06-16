# PionierGarage: Astro, React, Pocketbase, PagesCMS

## 🚀 Project Structure

Inside of the PionierGarage project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.ico
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── content <- Contains all the raw content files for rendering blocks
│   ├── components
│   │   ├── blocks <- Stores commonly used blocks with editable content from the CMS
│   │   ├── custom <- Stores 'custom' or one-off blocks whose content cannot be edited directly
│   │   ├── events <- React Components relating to rendering events
│   │   ├── README.md <- Read this for a small explanatory specifically regarding our custom component structure
│   │   ├── search <- React Components relating to collection searching
│   │   ├── types <- Typescript types
│   │   └── ui <- UI primitives
│   ├── layouts <- Base layouts
│   ├── pages <- Routing
│   └── content.config.ts <- IMPORTANT Zod schemas used for parsing content, must match structure of .pages.yml
├── astro.config.mts <- Configures astro settings
├── .env <- You must add this manually, not in this git repo
├── .pages.yml <- Configuration file for Pages CMS, make sure the collections here match the schema of content.config.ts
└── package.json <- you know what this is if you've ever used Node, if not now is a great time to learn!
```

To learn more about the folder structure of an Astro project, refer to [the guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run lint:types`      | Custom: check content.config.mts matches yaml cfg|

# Tools used

## Astro

## React

## Pocketbase
`https://data.pioniergarage.de/_/`

## Pages CMS
`https://app.pagescms.org/pioniergarage/startup-karlsruhe/main/collection/posts`

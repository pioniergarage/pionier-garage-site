# Site Data model

This is a very broad overview of the datatypes that make up startup-karlrsuhe. They are designed to be usable also for pioniergarage.de and potentially the GROW website.


Blocks:

- Hero: subtitle, title, image, button, layout: picker, class: string

- group layout (grid):  content, # of rows, # of columns, class

- card-text: class, title, subtitle, icon

- card-img: class, title, subtitle, image

- block: class, layout, header, body

- image: class, layout, size

- custom block: picker:['SponsorBlock','TeamGallery'], class

- rich text: content: rich text, class

- form: url to tally embed, class

- table: table, class

- button: href, class, icon

- FAQ block: items (question:string, answer:textfield), class

- separator: size, type [horizontal is default, vertical] , class

- spacer: size

- embed: url, width, height, class

- social medias: class


Custom components [relevant for picker]

./src/components/custom

├── CollectionHighlight.astro

├── EventCard.astro

├── EventCardCompact.astro

├── SponsorBlock.astro

├── StartupCard.astro

├── StartupDetail.astro

└── TeamGallery.astro


Singletons:

Site Header (logo image, navbar items, style overrides)

Site footer (center text: rich text, impressum, datenschutz, kontakt, optional additional navbar items, style overrides)

Team (members: name, image, position, contact email, start date)

Site Settings: title, description, image

Style Overrides (points to overrides.css, raw file editor)
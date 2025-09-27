import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { image3 } from './image-3'
import { imageHero1 } from './image-hero-1'
import { post1, post1_en } from './post-1'
import { post2, post2_en } from './post-2'
import { post3, post3_en } from './post-3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  // 'search', TO-DO: enable again!
]
const globals: GlobalSlug[] = ['header', 'footer']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not

  // #region Clearing database
  payload.logger.info(`— Clearing media...`)

  const mediaDir = path.resolve(dirname, '../../public/media')
  if (fs.existsSync(mediaDir)) {
    fs.rmdirSync(mediaDir, { recursive: true })
  }

  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  for (const global of globals) {
    await payload.updateGlobal({
      slug: global,
      data: {
        navItems: [],
      },
      req,
    })
  }

  for (const collection of collections) {
    await payload.delete({
      collection: collection,
      where: {
        id: {
          exists: true,
        },
      },
      req,
    })
  }

  await payload.delete({
    collection: 'pages',
    where: {},
    req,
  })
  // #endregion

  // #region Users
  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: 'demo-author@payloadcms.com',
      },
    },
    req,
  })

  const demoAuthor = await payload.create({
    collection: 'users',
    data: {
      name: 'Demo Author',
      email: 'demo-author@payloadcms.com',
      password: 'password',
    },
    req,
  })

  let demoAuthorID: number | string = demoAuthor.id
  // #endregion

  // #region Media
  payload.logger.info(`— Seeding media...`)
  const image1Doc = await payload.create({
    collection: 'media',
    data: image1('de'),
    locale: 'de',
    filePath: path.resolve(dirname, 'image-post1.webp'),
    req,
  })
  await payload.update({
    collection: 'media',
    id: image1Doc.id,
    data: image1('en'),
    locale: 'en',
    filePath: path.resolve(dirname, 'image-post1.webp'),
    req,
  })

  const image2Doc = await payload.create({
    collection: 'media',
    locale: 'de',
    data: image2('de'),
    filePath: path.resolve(dirname, 'image-post2.webp'),
    req,
  })
  await payload.update({
    collection: 'media',
    id: image2Doc.id,
    data: image2('en'),
    locale: 'en',
    filePath: path.resolve(dirname, 'image-post2.webp'),
    req,
  })

  const image3Doc = await payload.create({
    collection: 'media',
    locale: 'de',
    data: image3('de'),
    filePath: path.resolve(dirname, 'image-post3.webp'),
    req,
  })
  await payload.update({
    collection: 'media',
    id: image3Doc.id,
    data: image3('en'),
    locale: 'en',
    filePath: path.resolve(dirname, 'image-post3.webp'),
    req,
  })

  const imageHomeDoc = await payload.create({
    collection: 'media',
    locale: 'de',
    data: imageHero1('de'),
    filePath: path.resolve(dirname, 'image-hero1.webp'),
    req,
  })
  await payload.update({
    collection: 'media',
    id: imageHomeDoc.id,
    data: imageHero1('en'),
    locale: 'en',
    filePath: path.resolve(dirname, 'image-hero1.webp'),
    req,
  })

  let image1ID: number | string = image1Doc.id
  let image2ID: number | string = image2Doc.id
  let image3ID: number | string = image3Doc.id
  let imageHomeID: number | string = imageHomeDoc.id

  if (payload.db.defaultIDType === 'text') {
    image1ID = `"${image1Doc.id}"`
    image2ID = `"${image2Doc.id}"`
    image3ID = `"${image3Doc.id}"`
    imageHomeID = `"${imageHomeDoc.id}"`
    demoAuthorID = `"${demoAuthorID}"`
  }
  // #endregion

  // #region Categories
  payload.logger.info(`— Seeding categories...`)
  const technologyCategory = await payload.create({
    collection: 'categories',
    locale: 'de',
    data: {
      title: 'Technologie',
    },
    req,
  })
  await payload.update({
    collection: 'categories',
    id: technologyCategory.id,
    locale: 'en',
    data: {
      title: 'Technology',
    },
    req,
  })

  const newsCategory = await payload.create({
    collection: 'categories',
    locale: 'de',
    data: {
      title: 'Nachrichten',
    },
    req,
  })
  await payload.update({
    collection: 'categories',
    id: newsCategory.id,
    locale: 'en',
    data: {
      title: 'News',
    },
    req,
  })

  const financeCategory = await payload.create({
    collection: 'categories',
    locale: 'de',
    data: {
      title: 'Finanzen',
    },
    req,
  })
  await payload.update({
    collection: 'categories',
    id: financeCategory.id,
    locale: 'en',
    data: {
      title: 'Finance',
    },
    req,
  })

  const designCategory = await payload.create({
    collection: 'categories',
    locale: 'de',
    data: {
      title: 'Design',
    },
    req,
  })
  await payload.update({
    collection: 'categories',
    id: designCategory.id,
    locale: 'en',
    data: {
      title: 'Design',
    },
    req,
  })

  const softwareCategory = await payload.create({
    collection: 'categories',
    locale: 'de',
    data: {
      title: 'Software',
    },
    req,
  })
  await payload.update({
    collection: 'categories',
    id: softwareCategory.id,
    locale: 'en',
    data: {
      title: 'Software',
    },
    req,
  })

  const engineeringCategory = await payload.create({
    collection: 'categories',
    locale: 'de',
    data: {
      title: 'Ingenieurwesen',
    },
    req,
  })
  await payload.update({
    collection: 'categories',
    id: engineeringCategory.id,
    locale: 'en',
    data: {
      title: 'Engineering',
    },
    req,
  })
  // #endregion

  // #region Posts
  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...post1, categories: [technologyCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image1ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
    locale: 'de',
    req,
  })
  await payload.update({
    collection: 'posts',
    id: post1Doc.id,
    data: JSON.parse(
      JSON.stringify({ ...post1_en, categories: [technologyCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image1ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
    locale: 'en',
    req,
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...post2, categories: [newsCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image2ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image3ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
    locale: 'de',
    req,
  })
  await payload.update({
    collection: 'posts',
    id: post2Doc.id,
    data: JSON.parse(
      JSON.stringify({ ...post2_en, categories: [newsCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image2ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image3ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
    locale: 'en',
    req,
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...post3, categories: [financeCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image3ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image1ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
    locale: 'de',
    req,
  })
  await payload.update({
    collection: 'posts',
    id: post3Doc.id,
    data: JSON.parse(
      JSON.stringify({ ...post3_en, categories: [financeCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image3ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image1ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
    locale: 'en',
    req,
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
    req,
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
    req,
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
    req,
  })
  // #endregion

  // #region Pages
  payload.logger.info(`— Seeding home page...`)

  const homePage = await payload.create({
    collection: 'pages',
    locale: 'de',
    data: JSON.parse(
      JSON.stringify(home('de'))
        .replace(/"\{\{IMAGE_1\}\}"/g, String(imageHomeID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID)),
    ),
    req,
  })
  await payload.update({
    collection: 'pages',
    id: homePage.id,
    locale: 'en',
    data: JSON.parse(
      JSON.stringify(home('en'))
        .replace(/"\{\{IMAGE_1\}\}"/g, String(imageHomeID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID)),
    ),
    req,
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    locale: 'de',
    data: JSON.parse(JSON.stringify(contactFormData('de'))),
    req,
  })

  const contactFormData_es = JSON.parse(JSON.stringify(contactFormData('en')))
  await payload.update({
    collection: 'forms',
    id: contactForm.id,
    locale: 'en',
    data: {
      redirect: contactFormData_es.redirect,
      title: contactFormData_es.title,
      id: contactForm.id,
      submitButtonLabel: contactFormData_es.submitButtonLabel,
      confirmationType: contactFormData_es.confirmationType,
      createdAt: contactFormData_es.createdAt,
      updatedAt: contactFormData_es.updatedAt,
      confirmationMessage: contactFormData_es.confirmationMessage,
      // @ts-expect-error string value will be replaced with the actual ID when seeding
      fields: contactFormData_es.fields?.map((field, index) => ({
        id: contactForm.fields![index].id,
        ...field,
      })),
      // @ts-expect-error string value will be replaced with the actual ID when seeding
      emails: contactFormData_es.emails?.map((email, index) => ({
        id: contactForm.emails![index].id,
        ...email,
      })),
    },
    req,
  })

  let contactFormID: number | string = contactForm.id

  if (payload.db.defaultIDType === 'text') {
    contactFormID = `"${contactFormID}"`
  }

  payload.logger.info(`— Seeding contact page...`)

  const contactPage = await payload.create({
    collection: 'pages',
    locale: 'de',
    data: JSON.parse(
      JSON.stringify(contactPageData('de')).replace(
        /"\{\{CONTACT_FORM_ID\}\}"/g,
        String(contactFormID),
      ),
    ),
    req,
  })
  await payload.update({
    collection: 'pages',
    id: contactPage.id,
    locale: 'en',
    data: JSON.parse(
      JSON.stringify(contactPageData('en')).replace(
        /"\{\{CONTACT_FORM_ID\}\}"/g,
        String(contactFormID),
      ),
    ),
    req,
  })
  // #endregion

  // #region Globals
  payload.logger.info(`— Seeding header...`)

  const header = await payload.updateGlobal({
    slug: 'header',
    locale: 'de',
    data: {
      navItems: [
        {
          link: {
            type: 'custom',
            label: 'Home',
            url: '/',
          },
        },
        {
          link: {
            type: 'reference',
            label: 'Kontakt',
            reference: {
              relationTo: 'pages',
              value: contactPage.id,
            },
          },
        },
      ],
    },
    req,
  })

  await payload.updateGlobal({
    slug: 'header',
    locale: 'en',
    data: {
      navItems: [
        {
          id: header.navItems![0].id,
          link: {
            type: 'custom',
            url: '/',
            label: 'Home',
          },
        },
        {
          id: header.navItems![1].id,
          link: {
            type: 'reference',
            reference: {
              relationTo: 'pages',
              value: contactPage.id,
            },
            label: 'Contact',
          },
        },
      ],
    },
    req,
  })

  payload.logger.info(`— Seeding footer...`)

  const footer = await payload.updateGlobal({
    slug: 'footer',
    locale: 'de',
    data: {
      navItems: [
        {
          link: {
            type: 'custom',
            label: 'Admin',
            url: '/admin',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Source Code',
            newTab: true,
            url: 'https://github.com/payloadcms/payload/tree/beta/templates/website',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Payload',
            newTab: true,
            url: 'https://payloadcms.com/',
          },
        },
      ],
    },
    req,
  })
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'en',
    data: {
      navItems: [
        {
          id: footer.navItems![0].id,
          link: {
            type: 'custom',
            url: '/admin',
            label: 'Admin',
          },
        },
        {
          id: footer.navItems![1].id,
          link: {
            type: 'custom',
            url: 'https://github.com/payloadcms/payload/tree/beta/templates/website',
            label: 'Source Code',
          },
        },
        {
          id: footer.navItems![2].id,
          link: {
            type: 'custom',
            url: 'https://payloadcms.com/',
            label: 'Payload',
          },
        },
      ],
    },
    req,
  })
  // #endregion

  payload.logger.info('Seeded database successfully!')
}

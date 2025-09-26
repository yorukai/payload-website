import { NavGroup } from '@payloadcms/ui'
import Link from 'next/link.js'
import React from 'react'

export type ResourcesLink = {
  href: string
  label: string
}

const ResourcesNavLinks: React.FC = () => {
  const links: ResourcesLink[] = [
    {
      href: 'https://payloadcms.com/docs',
      label: 'Payload Docs',
    },
    {
      href: 'https://github.com/payloadcms/payload',
      label: 'GitHub',
    },
    {
      href: 'https://github.com/payloadcms/payload/releases',
      label: 'Changelog',
    },
    {
      href: 'https://payloadcms.com/docs/plugins/overview#official-plugins',
      label: 'Official Plugins',
    },
    {
      href: 'https://github.com/topics/payload-plugin',
      label: 'Community Plugins',
    },
  ]

  return (
    <NavGroup key="resources" label="Resources">
      {links.map(({ href, label }: ResourcesLink) => (
        <Link className="nav__link" href={href} target="_blank" key={label}>
          {label}
        </Link>
      ))}
    </NavGroup>
  )
}

export default ResourcesNavLinks

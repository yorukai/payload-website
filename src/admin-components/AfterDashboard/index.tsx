import SeedButton from './SeedButton'

const baseClass = 'after-dashboard'

export default function AfterDashboard() {
  return (
    <div className={`${baseClass} dashboard__group`}>
      <h2 className={`dashboard__label`}>{'Tools'}</h2>
      <ul className={'dashboard__card-list'}>
        <li>
          <SeedButton />
        </li>
      </ul>
    </div>
  )
}

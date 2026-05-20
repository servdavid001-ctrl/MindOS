export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <nav className="mb-6">
        <ul className="flex space-x-8">
          <li>
            <a href="/settings/devices" className="text-blue-600 font-medium">Dispositivos</a>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  )
}
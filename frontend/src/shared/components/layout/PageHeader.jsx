export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

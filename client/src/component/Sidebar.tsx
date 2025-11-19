const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md rounded-xl p-6 hidden lg:block">
      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
      <ul className="space-y-3 text-gray-700">
        <li>Dashboard</li>
        <li>Create Todo</li>
        <li>Profile</li>
      </ul>
    </aside>
  );
};

export default Sidebar;

import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-xl font-bold">UTM_TRUSTWALL</h2>
      <nav className="mt-5">
        <ul>
          <li className="py-2"><Link to="/">Dashboard</Link></li>
          <li className="py-2"><Link to="/antivirus">Antivirus</Link></li>
          <li className="py-2"><Link to="/firewall">Firewall</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
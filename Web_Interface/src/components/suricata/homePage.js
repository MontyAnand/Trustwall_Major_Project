import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Outlet ,useLocation} from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "./navbar";

const HomePage = () => {
  const [interfaces, setInterfaces] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      axios.delete(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/interfaces/${id}`).then(() => {
        setInterfaces(interfaces.filter((intf) => intf.id !== id));
      });
    }
  };


  useEffect(() => {
    axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/interfaces`).then((res) => setInterfaces(res.data));
  }, []);

  // Only render interface table when on base /suricata route
  const isRootSuricata = location.pathname === "/suricata";

  return (

    <>

      <Sidebar />
      <Navbar />

      <div className="container">
        {isRootSuricata && (
          <>
        <h2>Suricata Interfaces</h2>
        <table>
          <thead>
            <tr>
              <th>Interface</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interfaces.map((intf) => (
              <tr key={intf.id}>
                <td>{intf.interface}</td>
                <td>{intf.status}</td>
                <td>{intf.description}</td>
                <td>
                  <button onClick={() => navigate(`/suricata/edit/${intf.id}`)}>Edit</button>
                  <button onClick={() => handleDelete(intf.id)} style={{ marginLeft: "8px" }}>Delete</button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => navigate("/suricata/add")}>+ Add</button>
        </>
        )}
      </div>
      <Outlet />
    </>
  );
};

export default HomePage;

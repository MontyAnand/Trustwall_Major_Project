import React, { useEffect, useState } from "react";
import { Table, Select } from "antd";
import { useSocket } from "../Contexts/socketContex";

const InterfaceTable = () => {
    const { socket } = useSocket();
    const [interfaces, setInterfaces] = useState([]);

    useEffect(() => {
        if (socket) {
            socket.emit("interface-list-request");
        }
    }, [socket]);

    useEffect(() => {
        if(!socket)return;
        socket.on("interface-list", (data) => {
            setInterfaces(data);
        });

        return () => {
            socket.off("interface-list");
        };
    }, [socket]);

    // Function to handle dropdown change
    const handleTypeChange = (value, record) => {
        const updatedInterfaces = interfaces.map((item) =>
            item.if === record.if ? { ...item, type: value } : item
        );
        setInterfaces(updatedInterfaces);

        // Send update to backend if needed
        socket.emit("updateInterfaceType", { if: record.if, type: value });
    };

    // Define columns for the table
    const columns = [
        { title: "Interface", dataIndex: "if", key: "if" },
        { title: "IP Address", dataIndex: "ip", key: "ip" },
        { title: "Netmask", dataIndex: "netmask", key: "netmask" },
        {
          title: "Change Interface Type",
          key: "changeType",
          render: (text, record) => (
            <Select
              value={
                record.type === 0
                  ? "LAN"
                  : record.type === 1
                  ? "WAN"
                  : "Not Active"
              }
              onChange={(value) => handleTypeChange(value, record)}
            >
              {record.type === 0 && <Select.Option value="1">WAN</Select.Option>}
              {record.type === 1 && <Select.Option value="0">LAN</Select.Option>}
              {record.type !== 0 && record.type !== 1 && (
                <>
                  <Select.Option value="0">LAN</Select.Option>
                  <Select.Option value="1">WAN</Select.Option>
                </>
              )}
            </Select>
          ),
        },
      ];

    return (
        <div style={{ padding: 20 }}>
            <h2>Network Interfaces</h2>
            <Table
                dataSource={interfaces}
                columns={columns}
                rowKey="if"
                bordered
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default InterfaceTable;

import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Select } from "antd";
import { useSocket } from "../Contexts/socketContex";

const InterfaceTable = () => {
    const { socket } = useSocket();
    const [interfaces, setInterfaces] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState({ if: "", ip: "", netmask: "", type: "" });

    const ipToBigEndian = (ip) => {
        const parts = ip.split(".").map(Number);
        return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3])>>>0;
    };

    const countBits = (netmask) => {
        return netmask
            .split('.')                           // Split into octets
            .map(octet => parseInt(octet, 10))    // Convert each octet to integer
            .map(num => num.toString(2))          // Convert to binary
            .join('')                             // Join all binary strings
            .split('')                            // Convert to an array of characters
            .filter(bit => bit === '1')           // Filter only '1' bits
            .length;                              // Count them
    }

    useEffect(() => {
        if (socket) {
            socket.emit("interface-list-request");
        }
    }, [socket]);

    useEffect(() => {
        if (!socket) return;
        socket.on("interface-list", (data) => {
            setInterfaces(data);
        });

        socket.on('interface-ack', ()=>{
            socket.emit("interface-list-request");
        });

        return () => {
            socket.off("interface-list");
            socket.off("interface-list-request");
        };
    }, [socket]);

    // Open modal and set initial values
    const showModal = (record) => {
        setFormData({
            if: record.if, // Include interface name
            ip: record.ip,
            netmask: record.netmask,
            type: record.type === 0 ? "0" : record.type === 1 ? "1" : ""
        });
        setIsModalVisible(true);
    };

    // Close modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Handle form submission
    const handleSubmit = () => {
        if (!socket) {
            alert("Not connected to UTM !!!");
            setIsModalVisible(false);
            return;
        }
        const data = {
            if: formData.if,
            ip: ipToBigEndian(formData.ip),
            netmask: countBits(formData.netmask),
            type: Number(formData.type)
        };
        socket.emit('change-interface-configuration', data);
        setIsModalVisible(false);
    };

    // Handle input changes
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Define table columns
    const columns = [
        { title: "Interface", dataIndex: "if", key: "if" },
        { title: "IP Address", dataIndex: "ip", key: "ip" },
        { title: "Netmask", dataIndex: "netmask", key: "netmask" },
        {
            title: "Current Interface Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (type === 0 ? "LAN" : type === 1 ? "WAN" : "Not Active"),
        },
        {
            title: "Edit Interface",
            key: "edit",
            render: (_, record) => (
                <Button type="primary" onClick={() => showModal(record)}>
                    Edit
                </Button>
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

            {/* Modal Form */}
            <Modal title="Edit Interface" open={isModalVisible} onCancel={handleCancel} onOk={handleSubmit}>
                <label>Interface:</label>
                <Input value={formData.if} disabled />

                <label>IP Address:</label>
                <Input value={formData.ip} onChange={(e) => handleChange("ip", e.target.value)} />

                <label>Netmask:</label>
                <Input value={formData.netmask} onChange={(e) => handleChange("netmask", e.target.value)} />

                <label>Interface Type:</label>
                <Select value={formData.type} onChange={(value) => handleChange("type", value)} style={{ width: "100%" }}>
                    <Select.Option value="0">LAN</Select.Option>
                    <Select.Option value="1">WAN</Select.Option>
                </Select>
            </Modal>
        </div>
    );
};

export default InterfaceTable;

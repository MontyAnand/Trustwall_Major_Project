import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Select } from "antd";
import { useSocket } from "../Contexts/socketContex";

const InterfaceTable = () => {
    const { socket } = useSocket();
    const [interfaces, setInterfaces] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedInterface, setSelectedInterface] = useState(null);
    const [formData, setFormData] = useState({ ip: "", netmask: "", type: "" });

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

        return () => {
            socket.off("interface-list");
        };
    }, [socket]);

    // Open modal and set initial values
    const showModal = (record) => {
        setSelectedInterface(record);
        setFormData({
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
        alert(`Updated Data: ${JSON.stringify(formData)}`);
        setIsModalVisible(false);
    };

    // Handle input changes
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Define columns for the table
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

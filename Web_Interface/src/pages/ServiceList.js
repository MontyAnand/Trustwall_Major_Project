import React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSocket } from "../Contexts/socketContex";

const TableContainer = styled.div`
  width: 80%;
  margin: 20px auto;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  background-color: #4CAF50;
  color: white;
  padding: 12px;
  text-align: left;
  font-size: 16px;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  color: white;
  background-color: ${(props) => (props.active ? "#28a745" : "#dc3545")};
`;

const ServiceTable = () => {
    const [services, setServices] = useState([
        { service: "cron.service", isActive: 1, status: "running" },
        { service: "apache2.service", isActive: 0, status: "stopped" }
      ]);

    const {socket} = useSocket();
    
    if(socket){
        socket.emit('service-list-request');
    }
    
    useEffect(()=>{
        if (!socket) return;
        socket.on('service-list',(data)=>{
            setServices(data);
        });

        return ()=>{
            socket.off('service-list');
        }
    },[socket]);

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>Service</Th>
            <Th>Active</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {services.map((item, index) => (
            <Tr key={index}>
              <Td>{item.service}</Td>
              <Td>
                <StatusBadge active={item.isActive === 1}>
                  {item.isActive === 1 ? "Active" : "Inactive"}
                </StatusBadge>
              </Td>
              <Td>{item.status}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default ServiceTable;

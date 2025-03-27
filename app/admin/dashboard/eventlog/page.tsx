'use client';

import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Select, SelectItem } from '@heroui/react';
import { useEffect, useState } from 'react';
import type { EventLog } from '@/app/types/eventLog';
import { format } from 'date-fns';

// Define column configurations for each event type
const columnConfigs: Record<string, { name: string; uid: string }[]> = {
  ADD_SCORE: [
    { name: 'ID', uid: 'id' },
    { name: 'STUDENT', uid: 'student_id' },
    { name: 'NEW VALUE', uid: 'new_value' },
    { name: 'SUBJECT', uid: 'score_id' },
    { name: 'BY', uid: 'do_by' },
    { name: 'UPDATE AT', uid: 'update_at' },
  ],
  UPDATE_SCORE: [
    { name: 'ID', uid: 'id' },
    { name: 'STUDENT', uid: 'student_id' },
    { name: 'OLD VALUE', uid: 'old_value' },
    { name: 'NEW VALUE', uid: 'new_value' },
    { name: 'SUBJECT', uid: 'score_id' },
    { name: 'BY', uid: 'do_by' },
    { name: 'UPDATE AT', uid: 'update_at' },
  ],
  UPDATE_STUDENT: [
    { name: 'ID', uid: 'id' },
    { name: 'TYPE', uid: 'type' },
    { name: 'STUDENT', uid: 'student_id' },
    { name: 'OLD VALUE', uid: 'old_value' },
    { name: 'NEW VALUE', uid: 'new_value' },
    { name: 'BY', uid: 'do_by' },
    { name: 'UPDATE AT', uid: 'update_at' },
  ],
  ADD_STUDENT: [
    { name: 'ID', uid: 'id' },
    { name: 'STUDENT', uid: 'student_id' },
    { name: 'BY', uid: 'do_by' },
    { name: 'UPDATE AT', uid: 'update_at' },
  ],
  DELETE_STUDENT: [
    { name: 'ID', uid: 'id' },
    { name: 'STUDENT', uid: 'new_value' },
    { name: 'BY', uid: 'do_by' },
    { name: 'UPDATE AT', uid: 'update_at' },
  ],
};

export default function EventLogPage() {
  const [eventLog, setEventLog] = useState<EventLog[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ADD_SCORE');

  // Fetch event log data
  const fetchEventLog = async () => {
    try {
      const response = await fetch('/api/v1/admin/eventlog', { method: 'GET' });
      if (!response.ok) throw new Error('Failed to get eventLog');
      const data = await response.json();
      setEventLog(data.eventLog);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEventLog();
  }, []);

  const eventTypes = ['ADD_SCORE', 'UPDATE_SCORE', 'UPDATE_STUDENT', 'ADD_STUDENT', 'DELETE_STUDENT'];

  const filteredLogs =
    selectedType === 'UPDATE_STUDENT'
      ? eventLog.filter(log => ['UPDATE_FIRSTNAME', 'UPDATE_LASTNAME', 'UPDATE_CLASS', 'UPDATE_SEMESTER', 'UPDATE_BIRTHDATE'].includes(log.status))
      : eventLog.filter(log => log.status === selectedType);

  const currentColumns = columnConfigs[selectedType];

  const renderCell = (log: EventLog, columnKey: React.Key) => {
    switch (columnKey) {
      case 'id':
        return <div className="font-medium">{log.id}</div>;
      case 'type':
        return <div className="font-medium">{log.status}</div>;
      case 'student_id':
        return <div>{`${log.student?.firstname} ${log.student?.lastname}`}</div>;
      case 'old_value':
        return <div>{log.old_value}</div>;
      case 'new_value':
        return <div className="capitalize">{log.new_value}</div>;
      case 'score_id':
        return <div className="capitalize">{`${log.subject.name} (${log.term})` || '-'}</div>;
      case 'do_by':
        return <div>{log.teacher.username}</div>;
      case 'update_at':
        return <div>{format(new Date(log.update_at.toString()), 'yyyy-MM-dd')}</div>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Event Log</h1>
      {eventLog.length > 0 ? (
        <div className="mt-6">
          <Select aria-label="Select event log type" defaultSelectedKeys={[selectedType]} onChange={e => setSelectedType(e.target.value)} className="mb-4 max-w-xs">
            {eventTypes.map(type => (
              <SelectItem key={type}>{type}</SelectItem>
            ))}
          </Select>
          {selectedType && (
            <Table aria-label={`Event log table for ${selectedType}`} className="mt-4">
              <TableHeader>
                {currentColumns.map(column => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                {filteredLogs.map(log => (
                  <TableRow key={log.id}>
                    {currentColumns.map(column => (
                      <TableCell key={`${log.id}-${column.uid}`}>{renderCell(log, column.uid)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      ) : (
        <p className="mt-4">No event logs available.</p>
      )}
    </DashboardLayout>
  );
}

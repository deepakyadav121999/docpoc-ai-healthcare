const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "ENABLED ON", uid: "createdOn", sortable: true },
  { name: "TOTAL TRIGGERS", uid: "totalTriggers", sortable: true },
  { name: "ACTIVATED CHANNEL", uid: "channels" },
  { name: "STATUS", uid: "status", sortable: true },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "No Patient assigned", uid: "noPatientAssigned" },
  { name: "Inactive", uid: "inactive" },
];

const users = [
  {
    id: 1,
    name: "Medicine Reminder",
    totalTriggers: "13,870",
    createdOn: "26th Feb, 2023",
    status: "active",
    channels: "WhatsApp, SMS & Email",
  },
  {
    id: 2,
    name: "Patient Report",
    totalTriggers: "11,760",
    createdOn: "28th Feb, 2023",
    status: "active",
    channels: "WhatsApp & Email",
  },
  {
    id: 3,
    name: "Patient Invoice",
    totalTriggers: "18,180",
    createdOn: "4th Feb, 2023",
    status: "active",
    channels: "SMS & Email",
  },
  {
    id: 4,
    name: "Birthday Wish",
    totalTriggers: "890",
    createdOn: "6th Feb, 2023",
    status: "inactive",
    channels: "WhatsApp",
  },
  {
    id: 5,
    name: "Visit Confirmation",
    totalTriggers: "13,870",
    createdOn: "26th Feb, 2023",
    status: "active",
    channels: "WhatsApp",
  },
];

export { columns, users, statusOptions };

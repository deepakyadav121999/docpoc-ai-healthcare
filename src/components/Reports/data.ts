const columns = [
  { name: "Patient Name", uid: "name", sortable: true },
  { name: "Doctor Name", uid: "doctorName", sortable: true },
  { name: "Report Date", uid: "reportDate", sortable: true },
  { name: "Note", uid: "note" },
  { name: "Report", uid: "report", sortable: true },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "No Patient assigned", uid: "noPatientAssigned" },
  { name: "Inactive", uid: "inactive" },
];

const users = [
  {
    id: 1,
    name: "patient1",
    doctorName: "doctor1",
    reportDate: "26th Feb, 2023",
    note: "n/a",
    report: "view",
  },
  {
    id: 2,
    name: "patient2",
    doctorName: "doctor2",
    reportDate: "28th Feb, 2023",
    note: "n/a",
    report: "view",
  },
  {
    id: 3,
    name: "patient3",
    doctorName: "doctor3",
    reportDate: "4th Feb, 2023",
    note: "n/a",
    report: "view",
  },
  {
    id: 4,
    name: "patient4",
    doctorName: "doctor4",
    reportDate: "6th Feb, 2023",
    note: "n/a",
    report: "view",
  },
  {
    id: 5,
    name: "patient5",
    doctorName: "doctor5",
    reportDate: "26th Feb, 2023",
    note: "n/a",
    report: "view",
  },
];

export { columns, users, statusOptions };

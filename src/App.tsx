import React, { useState, ChangeEvent, FormEvent, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Define interfaces for data structures
interface PersonDetail {
  name: string;
  phone: string;
  idType: string;
  idUrl?: string; // Placeholder for uploaded ID
}

interface Tenant {
  id: string;
  roomNo: string;
  name: string;
  persons: PersonDetail[];
  totalPersons: number;
  phone: string;
  address: string;
  entryDate: string;
  facebookId?: string;
  rentAmount: number;
  photoUrl?: string; // Placeholder for uploaded photo
}

interface PaymentRecord {
  month: number; // 1-12
  year: number;
  rentStatus: 'paid' | 'due';
  electricityBill: number;
  electricityStatus: 'paid' | 'due';
  meterReading: number;
}

interface TenantPaymentDetails extends Tenant {
  payments: PaymentRecord[];
}

// Mock Data - Replace with API calls in a real app
const MOCK_TENANTS: Tenant[] = [
  { id: 't1', roomNo: '101', name: 'Alice Wonderland', persons: [{ name: 'Alice Wonderland', phone: '123-456-7890', idType: 'Citizen Card' }], totalPersons: 1, phone: '123-456-7890', address: '12 Fantasy Lane', entryDate: '2023-01-15', facebookId: 'alice.wonder', rentAmount: 5000 },
  { id: 't2', roomNo: '102', name: 'Bob The Builder', persons: [{ name: 'Bob The Builder', phone: '987-654-3210', idType: 'Student Card' }, { name: 'Wendy', phone: '555-555-5555', idType: 'Other Card' }], totalPersons: 2, phone: '987-654-3210', address: '45 Construction Ave', entryDate: '2023-02-20', rentAmount: 6500 },
  { id: 't3', roomNo: '201', name: 'Charlie Chaplin', persons: [{ name: 'Charlie Chaplin', phone: '111-222-3333', idType: 'ID Card' }], totalPersons: 1, phone: '111-222-3333', address: '78 Silent Film St', entryDate: '2023-03-10', facebookId: 'charlie.c', rentAmount: 5800 },
];

const MOCK_PAYMENTS: { [tenantId: string]: PaymentRecord[] } = {
  't1': [
    { month: 11, year: 2023, rentStatus: 'paid', electricityBill: 150, electricityStatus: 'paid', meterReading: 1200 },
    { month: 12, year: 2023, rentStatus: 'paid', electricityBill: 165, electricityStatus: 'paid', meterReading: 1310 },
    { month: 1, year: 2024, rentStatus: 'paid', electricityBill: 140, electricityStatus: 'paid', meterReading: 1400 },
    { month: 2, year: 2024, rentStatus: 'due', electricityBill: 180, electricityStatus: 'due', meterReading: 1520 },
  ],
  't2': [
    { month: 11, year: 2023, rentStatus: 'paid', electricityBill: 210, electricityStatus: 'paid', meterReading: 950 },
    { month: 12, year: 2023, rentStatus: 'paid', electricityBill: 225, electricityStatus: 'paid', meterReading: 1080 },
    { month: 1, year: 2024, rentStatus: 'paid', electricityBill: 200, electricityStatus: 'due', meterReading: 1190 },
    { month: 2, year: 2024, rentStatus: 'due', electricityBill: 240, electricityStatus: 'due', meterReading: 1330 },
  ],
  't3': [
    { month: 11, year: 2023, rentStatus: 'paid', electricityBill: 190, electricityStatus: 'paid', meterReading: 1500 },
    { month: 12, year: 2023, rentStatus: 'paid', electricityBill: 185, electricityStatus: 'paid', meterReading: 1620 },
    { month: 1, year: 2024, rentStatus: 'paid', electricityBill: 195, electricityStatus: 'paid', meterReading: 1750 },
    { month: 2, year: 2024, rentStatus: 'paid', electricityBill: 205, electricityStatus: 'due', meterReading: 1880 },
  ],
};

// Helper to get month name
const getMonthName = (monthNumber: number): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[monthNumber - 1] || '';
};

// --- Components ---

// Footer Component
const Footer: React.FC = () => (
  <footer className="text-center py-4 mt-auto text-sm text-gray-500 bg-gray-100">
    App Designed by MAC's Studio
  </footer>
);

// Login Page Component
const LoginPage: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">MAC's Rental Management</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

// Tenant Details Modal Component
const TenantDetailsModal: React.FC<{ tenant: TenantPaymentDetails | null; onClose: () => void }> = ({ tenant, onClose }) => {
  if (!tenant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-bold text-blue-700">Tenant Details - {tenant.name} (Room {tenant.roomNo})</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-2xl">&times;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Personal Details Section */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Personal Information</h3>
            <div className="flex items-center gap-4 mb-4">
                {tenant.photoUrl ? <img src={tenant.photoUrl} alt={tenant.name} className="w-20 h-20 rounded-full object-cover border-2 border-blue-200" /> : <div className="bg-gray-200 border-2 border-dashed rounded-full w-20 h-20 flex items-center justify-center text-gray-400 text-xs">Photo</div>}
                <div>
                    <p><strong>Name:</strong> {tenant.name}</p>
                    <p><strong>Room No:</strong> {tenant.roomNo}</p>
                    <p><strong>Phone:</strong> {tenant.phone}</p>
                    <p><strong>Address:</strong> {tenant.address}</p>
                    <p><strong>Entry Date:</strong> {tenant.entryDate}</p>
                    {tenant.facebookId && <p><strong>Facebook ID:</strong> {tenant.facebookId}</p>}
                    <p><strong>Rent Amount:</strong> ₹{tenant.rentAmount.toLocaleString()}</p>
                </div>
            </div>

            <h4 className="text-md font-semibold text-blue-800 mb-2 mt-4">Persons Staying ({tenant.totalPersons})</h4>
             {tenant.persons.map((person, index) => (
                <div key={index} className="mb-3 p-3 bg-white rounded border border-blue-100">
                    <p><strong>Person {index + 1}:</strong> {person.name}</p>
                    <p><strong>Phone:</strong> {person.phone}</p>
                    <p><strong>ID Type:</strong> {person.idType}</p>
                    {person.idUrl ? <a href={person.idUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View ID</a> : <span className="text-sm text-gray-400">(ID not uploaded)</span>}
                 </div>
             ))}
          </div>

          {/* Payment History Section */}
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Payment History</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {[...tenant.payments].sort((a, b) => b.year - a.year || b.month - a.month).map((payment, index) => (
                <div key={index} className="p-3 bg-white rounded border border-green-100">
                  <p className="font-semibold">{getMonthName(payment.month)} {payment.year}</p>
                  <p>Rent: <span className={payment.rentStatus === 'paid' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{payment.rentStatus.toUpperCase()}</span></p>
                   <p>Electricity Bill: ₹{payment.electricityBill.toLocaleString()} (<span className={payment.electricityStatus === 'paid' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{payment.electricityStatus.toUpperCase()}</span>)</p>
                   <p className="text-sm text-gray-600">Meter Reading: {payment.meterReading}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// Update Payment Modal Component
const UpdatePaymentModal: React.FC<{
  tenant: Tenant | null;
  month: number;
  year: number;
  onClose: () => void;
  onUpdate: (tenantId: string, month: number, year: number, updates: Partial<PaymentRecord>) => void;
}> = ({ tenant, month, year, onClose, onUpdate }) => {
    const [rentStatus, setRentStatus] = useState<'paid' | 'due' | ''>('');
    const [electricityStatus, setElectricityStatus] = useState<'paid' | 'due' | ''>('');
    const [meterReading, setMeterReading] = useState<string>('');
    const [electricityBill, setElectricityBill] = useState<string>('');


    // Find existing payment record to prefill if available
    useState(() => {
        const existingPayment = MOCK_PAYMENTS[tenant?.id ?? '']?.find(p => p.month === month && p.year === year);
        if (existingPayment) {
            setRentStatus(existingPayment.rentStatus);
            setElectricityStatus(existingPayment.electricityStatus);
            setMeterReading(existingPayment.meterReading.toString());
            setElectricityBill(existingPayment.electricityBill.toString());
        } else {
             setRentStatus('');
             setElectricityStatus('');
             setMeterReading('');
             setElectricityBill('');
        }
    });

  if (!tenant) return null;

  const handleUpdate = (e: FormEvent) => {
      e.preventDefault();
      const updates: Partial<PaymentRecord> = {};
      if (rentStatus) updates.rentStatus = rentStatus;
      if (electricityStatus) updates.electricityStatus = electricityStatus;
      if (meterReading) updates.meterReading = parseInt(meterReading, 10);
      if (electricityBill) updates.electricityBill = parseInt(electricityBill, 10);


      if (Object.keys(updates).length > 0) {
        onUpdate(tenant.id, month, year, updates);
      }
      onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
      <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">Update Payment for {tenant.name} ({getMonthName(month)} {year})</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-red-600 text-2xl">&times;</button>
        </div>
        <div className="space-y-4">
           <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rent Status</label>
                <select
                    value={rentStatus}
                    onChange={(e) => setRentStatus(e.target.value as 'paid' | 'due' | '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="" disabled>Select Status</option>
                    <option value="paid">Paid</option>
                    <option value="due">Due</option>
                </select>
            </div>
           <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Electricity Meter Reading</label>
                <input
                    type="number"
                    value={meterReading}
                    onChange={(e) => setMeterReading(e.target.value)}
                    placeholder="Enter meter reading"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Electricity Bill Amount</label>
                <input
                    type="number"
                    value={electricityBill}
                    onChange={(e) => setElectricityBill(e.target.value)}
                    placeholder="Enter bill amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                 />
             </div>
           <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Electricity Bill Status</label>
                 <select
                     value={electricityStatus}
                     onChange={(e) => setElectricityStatus(e.target.value as 'paid' | 'due' | '')}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                 >
                     <option value="" disabled>Select Status</option>
                     <option value="paid">Paid</option>
                     <option value="due">Due</option>
                 </select>
             </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
           <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
           >
              Cancel
           </button>
           <button
             type="submit"
             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
           >
             Update Payment
           </button>
        </div>
      </form>
    </div>
  );
};


// Dashboard Page Component
const DashboardPage: React.FC<{
  tenants: Tenant[];
  payments: { [tenantId: string]: PaymentRecord[] };
  onViewTenant: (tenant: TenantPaymentDetails) => void;
  onOpenUpdateModal: (tenant: Tenant, month: number, year: number) => void;
}> = ({ tenants, payments, onViewTenant, onOpenUpdateModal }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed

  // State for year/month selection (optional, default to current)
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth); // Example: filter by month

  const years = useMemo(() => {
      const allYears = new Set<number>();
      Object.values(payments).flat().forEach(p => allYears.add(p.year));
      if (!allYears.has(currentYear)) allYears.add(currentYear); // Ensure current year is present
      return Array.from(allYears).sort((a, b) => b - a);
  }, [payments, currentYear]);


  const getPaymentStatus = (tenantId: string, month: number, year: number): PaymentRecord | undefined => {
    return payments[tenantId]?.find(p => p.month === month && p.year === year);
  };

  // Prepare data for the graph (e.g., monthly income/due amounts)
  const graphData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    return months.map(month => {
      let totalRentPaid = 0;
      let totalRentDue = 0;
      let totalElecPaid = 0;
      let totalElecDue = 0;

      tenants.forEach(tenant => {
        const payment = getPaymentStatus(tenant.id, month, selectedYear);
        if (payment) {
          if (payment.rentStatus === 'paid') totalRentPaid += tenant.rentAmount;
          else totalRentDue += tenant.rentAmount;

          if (payment.electricityStatus === 'paid') totalElecPaid += payment.electricityBill;
          else totalElecDue += payment.electricityBill;
        } else if (new Date(tenant.entryDate) <= new Date(selectedYear, month - 1, 1)) {
             // If no payment record exists after entry date, consider it due
            totalRentDue += tenant.rentAmount;
            // Cannot calculate electricity due without a reading/bill
        }
      });

      return {
        name: getMonthName(month),
        rentPaid: totalRentPaid,
        rentDue: totalRentDue,
        elecPaid: totalElecPaid,
        elecDue: totalElecDue,
        totalPaid: totalRentPaid + totalElecPaid,
        totalDue: totalRentDue + totalElecDue,
      };
    });
  }, [tenants, payments, selectedYear]);

  const handleTenantClick = (tenantId: string) => {
      const tenant = tenants.find(t => t.id === tenantId);
      if (tenant) {
          const tenantPayments = payments[tenantId] || [];
          onViewTenant({ ...tenant, payments: tenantPayments });
      }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Dashboard</h2>

       {/* Year/Month Selector - Optional */}
       <div className="mb-6 flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
           <label htmlFor="year-select" className="font-medium text-gray-700">Select Year:</label>
           <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
               ))}
           </select>
            {/* Example: Add Month Selector if needed */}
            {/* <label htmlFor="month-select">Select Month:</label>
            <select id="month-select" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}> ... </select> */}
       </div>

      {/* Payment Summary Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 overflow-x-auto">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Monthly Payment Summary ({selectedYear})</h3>
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-3 font-semibold border-b border-blue-200">Tenant / Room</th>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <th key={month} className="p-3 font-semibold border-b border-blue-200 text-center">{getMonthName(month)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants.map(tenant => (
              <tr key={tenant.id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="p-3">
                   <button onClick={() => handleTenantClick(tenant.id)} className="font-medium text-blue-600 hover:underline hover:text-blue-800 transition duration-150">
                     {tenant.name}
                   </button>
                   <span className="block text-sm text-gray-500">Room {tenant.roomNo}</span>
                </td>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
                  const payment = getPaymentStatus(tenant.id, month, selectedYear);
                  const isPastEntry = new Date(tenant.entryDate) <= new Date(selectedYear, month - 1, 1);
                  let rentColor = 'text-gray-400'; // Default for future/before entry
                  let elecColor = 'text-gray-400';

                  if (isPastEntry) {
                      rentColor = payment?.rentStatus === 'paid' ? 'text-green-600' : 'text-red-600';
                      elecColor = payment?.electricityStatus === 'paid' ? 'text-green-600' : 'text-red-600';
                      if (!payment) { // If no record but past entry date, assume due
                           rentColor = 'text-red-600';
                           elecColor = 'text-gray-400'; // Cannot determine elec status without record
                      }
                  }

                  return (
                    <td key={month} className="p-3 text-center text-sm">
                       <div className='flex flex-col items-center space-y-1'>
                         <span className={rentColor}>Rent</span>
                         <span className={elecColor}>Elec</span>
                         {isPastEntry && (
                            <button
                                onClick={() => onOpenUpdateModal(tenant, month, selectedYear)}
                                className="mt-1 text-xs text-blue-500 hover:text-blue-700 underline"
                                title={`Update ${getMonthName(month)} ${selectedYear} for ${tenant.name}`}
                            >
                                Update
                            </button>
                         )}
                       </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Graph Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Financial Overview ({selectedYear})</h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#4b5563"/>
              <YAxis stroke="#4b5563"/>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
              <Legend />
              <Bar dataKey="rentPaid" stackId="rent" fill="#10b981" name="Rent Paid" />
              <Bar dataKey="rentDue" stackId="rent" fill="#f87171" name="Rent Due" />
              <Bar dataKey="elecPaid" stackId="elec" fill="#22c55e" name="Electricity Paid" />
              <Bar dataKey="elecDue" stackId="elec" fill="#ef4444" name="Electricity Due" />
            </BarChart>
          </ResponsiveContainer>
        </div>
         {/* Example: Another chart type */}
         <div style={{ width: '100%', height: 300, marginTop: '2rem' }}>
             <h4 className="text-lg font-semibold text-blue-700 mb-3 text-center">Total Paid vs Due ({selectedYear})</h4>
             <ResponsiveContainer>
                <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                     <XAxis dataKey="name" stroke="#4b5563"/>
                     <YAxis stroke="#4b5563"/>
                     <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
                     <Legend />
                     <Line type="monotone" dataKey="totalPaid" stroke="#16a34a" strokeWidth={2} name="Total Paid" activeDot={{ r: 8 }}/>
                     <Line type="monotone" dataKey="totalDue" stroke="#dc2626" strokeWidth={2} name="Total Due" />
                 </LineChart>
             </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

// Add Tenant Form Component
const AddTenantForm: React.FC<{ onAddTenant: (tenant: Tenant) => void; onClose: () => void }> = ({ onAddTenant, onClose }) => {
  const [roomNo, setRoomNo] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [facebookId, setFacebookId] = useState('');
  const [rentAmount, setRentAmount] = useState<number | ''>('');
  const [persons, setPersons] = useState<PersonDetail[]>([{ name: '', phone: '', idType: 'ID Card' }]);

  const handlePersonChange = (index: number, field: keyof PersonDetail, value: string) => {
    const newPersons = [...persons];
    // Type assertion needed because field is a keyof PersonDetail
    (newPersons[index] as any)[field] = value;
    setPersons(newPersons);
    // Update main tenant details if it's the first person being edited
    if (index === 0) {
        if(field === 'name') setName(value);
        if(field === 'phone') setPhone(value);
    }
  };

  const addPerson = () => {
    setPersons([...persons, { name: '', phone: '', idType: 'ID Card' }]);
  };

  const removePerson = (index: number) => {
    if (persons.length > 1) { // Prevent removing the last person
        const newPersons = persons.filter((_, i) => i !== index);
        setPersons(newPersons);
        // If removing the first person, update main details from the new first person
        if(index === 0 && newPersons.length > 0) {
            setName(newPersons[0].name);
            setPhone(newPersons[0].phone);
        } else if (newPersons.length === 0) {
            // This case shouldn't be reachable due to the length check, but good practice
             setName('');
             setPhone('');
        }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!roomNo || !name || !phone || !address || !entryDate || rentAmount === '' || persons.some(p => !p.name || !p.phone || !p.idType)) {
      alert("Please fill in all required fields for the tenant and each person.");
      return;
    }
    const newTenant: Tenant = {
      id: `t${Date.now()}`, // Simple unique ID generation
      roomNo,
      name: persons[0].name, // Main name is the first person's name
      phone: persons[0].phone, // Main phone is the first person's phone
      address,
      entryDate,
      facebookId,
      rentAmount: Number(rentAmount),
      totalPersons: persons.length,
      persons,
      // photoUrl and idUrl would be handled by actual upload logic
    };
    onAddTenant(newTenant);
    onClose(); // Close the form/modal after adding
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-40">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h2 className="text-2xl font-bold text-blue-700">Add New Tenant</h2>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-red-600 text-2xl">&times;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Room and Rent */}
             <div className="md:col-span-1">
                <label htmlFor="roomNo" className="block text-sm font-medium text-gray-700 mb-1">Room No <span className="text-red-500">*</span></label>
                <input id="roomNo" type="text" value={roomNo} onChange={(e) => setRoomNo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
             </div>
            <div className="md:col-span-1">
                <label htmlFor="rentAmount" className="block text-sm font-medium text-gray-700 mb-1">Rent Amount (Monthly) <span className="text-red-500">*</span></label>
                <input id="rentAmount" type="number" value={rentAmount} onChange={(e) => setRentAmount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
            </div>

            {/* Address and Entry Date */}
             <div className="md:col-span-1">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div className="md:col-span-1">
                 <label htmlFor="entryDate" className="block text-sm font-medium text-gray-700 mb-1">Entry Date <span className="text-red-500">*</span></label>
                 <input id="entryDate" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
             </div>

            {/* Facebook ID and Photo Upload */}
            <div className="md:col-span-1">
                 <label htmlFor="facebookId" className="block text-sm font-medium text-gray-700 mb-1">Facebook ID</label>
                 <input id="facebookId" type="text" value={facebookId} onChange={(e) => setFacebookId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
             </div>
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Tenant Photo</label>
                 <div className="flex items-center space-x-4">
                     <div className="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16 flex items-center justify-center text-gray-400 text-xs">Photo</div>
                     <button type="button" className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">Choose File</button>
                 </div>
             </div>
        </div>


        {/* Persons Section */}
        <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Person Details ({persons.length})</h3>
             {persons.map((person, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg bg-blue-50 relative">
                    <p className="font-medium text-blue-700 mb-3">Person {index + 1}</p>
                    {persons.length > 1 && (
                         <button
                             type="button"
                             onClick={() => removePerson(index)}
                             className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-semibold"
                         >
                             Remove
                         </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                            <input type="text" value={person.name} onChange={(e) => handlePersonChange(index, 'name', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                            <input type="tel" value={person.phone} onChange={(e) => handlePersonChange(index, 'phone', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID Card Type <span className="text-red-500">*</span></label>
                             <select value={person.idType} onChange={(e) => handlePersonChange(index, 'idType', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-white" required>
                                 <option>ID Card</option>
                                 <option>Citizen Card</option>
                                 <option>Student Card</option>
                                 <option>Other Card</option>
                             </select>
                         </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload ID</label>
                            <div className="flex items-center space-x-3">
                                <div className="bg-gray-200 border-2 border-dashed rounded-md w-10 h-10 flex items-center justify-center text-gray-400 text-xs">ID</div>
                                 <button type="button" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">Choose File</button>
                            </div>
                         </div>
                     </div>
                 </div>
             ))}
            <button
              type="button"
              onClick={addPerson}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Add Another Person
            </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Add Tenant
          </button>
        </div>
      </form>
    </div>
  );
};


// Tenants Page Component
const TenantsPage: React.FC<{
  tenants: Tenant[];
  onAddTenant: (tenant: Tenant) => void;
  onViewTenant: (tenant: TenantPaymentDetails) => void;
}> = ({ tenants, onAddTenant, onViewTenant }) => {
  const [showAddForm, setShowAddForm] = useState(false);

   const handleTenantClick = (tenantId: string) => {
      const tenant = tenants.find(t => t.id === tenantId);
       // In a real app, you'd fetch detailed payments here if not already loaded
      const tenantPayments = MOCK_PAYMENTS[tenantId] || [];
      if (tenant) {
          onViewTenant({ ...tenant, payments: tenantPayments });
      }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-800">Tenants</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Add New Tenant
        </button>
      </div>

      {/* Tenants List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="p-4 font-semibold">Room No</th>
              <th className="p-4 font-semibold">Tenant Name</th>
              <th className="p-4 font-semibold">Phone</th>
              <th className="p-4 font-semibold">Entry Date</th>
              <th className="p-4 font-semibold">Rent</th>
               <th className="p-4 font-semibold">Persons</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4">{tenant.roomNo}</td>
                <td className="p-4 font-medium">{tenant.name}</td>
                <td className="p-4 text-gray-600">{tenant.phone}</td>
                <td className="p-4 text-gray-600">{tenant.entryDate}</td>
                <td className="p-4 text-gray-600">₹{tenant.rentAmount.toLocaleString()}</td>
                 <td className="p-4 text-gray-600 text-center">{tenant.totalPersons}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleTenantClick(tenant.id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                  >
                    View Details
                  </button>
                  {/* Add Edit/Delete buttons here if needed */}
                </td>
              </tr>
            ))}
             {tenants.length === 0 && (
                 <tr>
                    <td colSpan={7} className="text-center p-6 text-gray-500">No tenants found.</td>
                 </tr>
             )}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <AddTenantForm
          onAddTenant={(newTenant) => {
            onAddTenant(newTenant); // Call parent's handler to update state
            setShowAddForm(false);
          }}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

// Main App Component
const RentalManagementApp: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'tenants'>('dashboard');
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
   // Simulate mutable payment data
  const [payments, setPayments] = useState<{ [tenantId: string]: PaymentRecord[] }>(JSON.parse(JSON.stringify(MOCK_PAYMENTS)));
  const [selectedTenantDetails, setSelectedTenantDetails] = useState<TenantPaymentDetails | null>(null);
  const [updateModalInfo, setUpdateModalInfo] = useState<{tenant: Tenant; month: number; year: number} | null>(null);


  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard'); // Go to dashboard after login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
     // Reset any sensitive state if needed
     setSelectedTenantDetails(null);
     setUpdateModalInfo(null);
  };

  const handleAddTenant = (newTenant: Tenant) => {
    setTenants(prev => [...prev, newTenant]);
    // Optionally initialize empty payment array for the new tenant
     setPayments(prev => ({ ...prev, [newTenant.id]: [] }));
  };

   const handleViewTenant = (tenantDetails: TenantPaymentDetails) => {
        setSelectedTenantDetails(tenantDetails);
    };

   const handleCloseTenantDetails = () => {
        setSelectedTenantDetails(null);
   };

   const handleOpenUpdateModal = (tenant: Tenant, month: number, year: number) => {
       setUpdateModalInfo({ tenant, month, year });
   };

   const handleCloseUpdateModal = () => {
        setUpdateModalInfo(null);
   }

    const handleUpdatePayment = (tenantId: string, month: number, year: number, updates: Partial<PaymentRecord>) => {
        setPayments(prevPayments => {
            const newPayments = JSON.parse(JSON.stringify(prevPayments)); // Deep copy
            const tenantPayments = newPayments[tenantId] || [];
            const paymentIndex = tenantPayments.findIndex((p: PaymentRecord) => p.month === month && p.year === year);

            if (paymentIndex > -1) {
                // Update existing record
                tenantPayments[paymentIndex] = { ...tenantPayments[paymentIndex], ...updates };
            } else {
                // Create new record if it doesn't exist (ensure all required fields are present eventually)
                 const newRecord: PaymentRecord = {
                    month,
                    year,
                    rentStatus: updates.rentStatus ?? 'due', // Default to due if not provided
                    electricityBill: updates.electricityBill ?? 0,
                    electricityStatus: updates.electricityStatus ?? 'due', // Default to due
                    meterReading: updates.meterReading ?? 0,
                    ...updates, // Override defaults with provided updates
                };
                tenantPayments.push(newRecord);
            }
            newPayments[tenantId] = tenantPayments;
            return newPayments;
        });
    };


  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Main Application Layout (after login)
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-blue-100 flex flex-col shadow-lg">
        <div className="p-6 text-center border-b border-blue-700">
          <h2 className="text-2xl font-semibold">MAC's Rental</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition duration-200 ${currentPage === 'dashboard' ? 'bg-blue-700 text-white shadow-inner' : 'hover:bg-blue-700 hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentPage('tenants')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition duration-200 ${currentPage === 'tenants' ? 'bg-blue-700 text-white shadow-inner' : 'hover:bg-blue-700 hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0110 11c-1.539 0-2.9-.596-3.998-1.574A6.97 6.97 0 004 16c0 .34.024.673.07 1h8.86zM10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <span>Tenants</span>
          </button>
          {/* Add more menu items here */}
        </nav>
        <div className="p-4 mt-auto border-t border-blue-700">
            <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
                Logout
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
            {currentPage === 'dashboard' && <DashboardPage tenants={tenants} payments={payments} onViewTenant={handleViewTenant} onOpenUpdateModal={handleOpenUpdateModal} />}
            {currentPage === 'tenants' && <TenantsPage tenants={tenants} onAddTenant={handleAddTenant} onViewTenant={handleViewTenant} />}
            {/* Render other pages based on currentPage */}
         </div>
        <Footer />
      </main>

       {/* Modals */}
        {selectedTenantDetails && (
             <TenantDetailsModal
                 tenant={selectedTenantDetails}
                 onClose={handleCloseTenantDetails}
             />
        )}
        {updateModalInfo && (
             <UpdatePaymentModal
                 tenant={updateModalInfo.tenant}
                 month={updateModalInfo.month}
                 year={updateModalInfo.year}
                 onClose={handleCloseUpdateModal}
                 onUpdate={handleUpdatePayment}
              />
        )}
    </div>
  );
};

export default RentalManagementApp;
const DashboardCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg transition">
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-3xl text-blue-500">{icon}</div>
    </div>
  );
  
  export default DashboardCard;
  
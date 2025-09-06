import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { getDashboardStats } from '../../api/dashboardApi';
import { useAuth } from '../../component/context/AuthContext';
import { 
  Users, 
  Trophy, 
  Target, 
  TrendingUp, 
  Award, 
  UserCheck, 
  Star,
  Activity,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await getDashboardStats(token);
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-xl">No data available</div>
      </div>
    );
  }

  const { role, users, challenges, user } = dashboardData;

  // Admin Dashboard
  if (role === 'admin') {
    const challengeStatusData = challenges.challengesByStatus.map(status => ({
      name: status._id || 'Unknown',
      value: status.count,
    }));

    const followersData = users.followersData.slice(0, 10).map(user => ({
      name: user.username,
      followers: user.followersCount,
      following: user.followingCount,
    }));

    const userStats = [
      { name: 'Total Users', value: users.totalUsers, icon: Users, color: 'bg-blue-500' },
      { name: 'Admins', value: users.totalAdmins, icon: Star, color: 'bg-purple-500' },
      { name: 'Regular Users', value: users.totalRegularUsers, icon: UserCheck, color: 'bg-green-500' },
      { name: 'Complete Profiles', value: users.usersWithCompleteProfile, icon: Award, color: 'bg-yellow-500' },
      { name: 'Total Points', value: users.totalPoints, icon: Trophy, color: 'bg-red-500' },
      { name: 'Total Challenges', value: challenges.totalChallenges, icon: Target, color: 'bg-indigo-500' },
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {userStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color} text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Challenge Status Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2" />
                Challenge Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={challengeStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {challengeStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Total Votes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Total Votes
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {challenges.totalVotes.toLocaleString()}
                </div>
                <p className="text-gray-600">Total votes across all challenges</p>
              </div>
            </div>
          </div>

          {/* Top Users by Followers */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Users by Followers
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={followersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="followers" fill="#8884d8" name="Followers" />
                <Bar dataKey="following" fill="#82ca9d" name="Following" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  // Regular User Dashboard
  const userChallenges = challenges.participated || [];
  const challengeProgress = userChallenges.map(challenge => ({
    name: challenge.title,
    points: challenge.points + (challenge.bonusPoints || 0),
    status: challenge.status,
    date: new Date(challenge.createdAt).toLocaleDateString(),
  }));

  const statusColors = {
    'active': 'bg-green-100 text-green-800',
    'completed': 'bg-blue-100 text-blue-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>
        
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
              <p className="text-gray-600">Profile Status: {user.isProfileComplete ? 'Complete' : 'Incomplete'}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{user.points}</div>
              <p className="text-gray-600">Total Points</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500 text-white">
                <Target className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Challenges Joined</p>
                <p className="text-2xl font-bold text-gray-900">{userChallenges.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Followers</p>
                <p className="text-2xl font-bold text-gray-900">{user.followers?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500 text-white">
                <Star className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Votes Received</p>
                <p className="text-2xl font-bold text-gray-900">{challenges.votesReceived || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Progress Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Challenge Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={challengeProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="points" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Challenges */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Challenges</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Challenge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userChallenges.slice(0, 5).map((challenge, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {challenge.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[challenge.status] || 'bg-gray-100 text-gray-800'}`}>
                        {challenge.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {challenge.points + (challenge.bonusPoints || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(challenge.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
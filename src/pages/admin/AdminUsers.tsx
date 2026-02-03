import { useState,useEffect  } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Search, Eye, Ban, CheckCircle } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Modal, ConfirmModal } from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchAdminUsers,blockUser } from '../../services/AdminServices';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  isActive: boolean;
}


export function AdminUsers() {
  const { user,token} = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading,setLoading]=useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [blockModal, setBlockModal] = useState<{ user: User; action: 'block' | 'unblock' } | null>(null);


  useEffect(() => {
    const loadUsers = async () => {
      if (!token) return;
      try{
      const data = await fetchAdminUsers(token);
      setUsers(data);
    }catch(err){
      console.error('Failed to fetch users',err);
    }finally{
      setLoading(false);
    }
    };
    loadUsers();
  }, [token]);


  const filteredUsers = users
    .filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(u => roleFilter === 'all' || u.role === roleFilter);

const handleBlockUser = async (user: User) => {
  if (!token) return;

  try {
    const updated = await blockUser(token, user._id);

    console.log("Updated user from API:", updated); // 🔍 debug

    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u._id === updated._id ? updated : u
      )
    );

    // Update selected user if modal open
    setSelectedUser((prev) =>
      prev?._id === updated._id ? updated : prev
    );

  } catch (err) {
    console.error("Block/unblock failed", err);
    alert("Failed to update user status");
  } finally {
    setBlockModal(null);
  }
};


  return (
    <AdminLayout title="User Management">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{user.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={user.role === 'admin' ? 'info' : 'neutral'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={user.isActive ? 'success' : 'error'}>
  {user.isActive ? 'active' : 'blocked'}
</Badge>

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    {user.isActive ? (
  <button
    onClick={() => setBlockModal({ user, action: 'block' })}
    className="p-2 text-red-600"
    disabled={user.role === 'admin'}
  >
    <Ban className="w-4 h-4" />
  </button>
) : (
  <button
    onClick={() => setBlockModal({ user, action: 'unblock' })}
    className="p-2 text-green-600"
  >
    <CheckCircle className="w-4 h-4" />
  </button>
)}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-600">No users found</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="User Details"
          size="md"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xl">
                  {selectedUser.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">User ID</p>
                <p className="font-medium text-gray-900">{selectedUser._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Role</p>
                <Badge variant={selectedUser.role === 'admin' ? 'info' : 'neutral'}>
                  {selectedUser.role}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
               <Badge variant={selectedUser.isActive ? 'success' : 'error'}>
  {selectedUser.isActive ? 'active' : 'blocked'}
</Badge>

              </div>
            </div>

            {selectedUser.role !== 'admin' && (
              <div className="pt-4 border-t border-gray-200">
{selectedUser.isActive ? (
  <button
    onClick={() => setBlockModal({ user: selectedUser!, action: 'block' })}
    className="p-2 text-red-600"
  >
    <Ban className="w-4 h-4" />
  </button>
) : (
  <button
    onClick={() => setBlockModal({ user: selectedUser!, action: 'unblock' })}
    className="p-2 text-green-600"
  >
    <CheckCircle className="w-4 h-4" />
  </button>
)}

              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Block/Unblock Confirmation */}
      <ConfirmModal
        isOpen={!!blockModal}
        onClose={() => setBlockModal(null)}
      onConfirm={() => blockModal && handleBlockUser(blockModal.user)}

        title={blockModal?.action === 'block' ? 'Block User' : 'Unblock User'}
        message={
          blockModal?.action === 'block'
            ? `Are you sure you want to block ${blockModal?.user?.name}? They will not be able to log in.`
            : `Are you sure you want to unblock ${blockModal?.user?.name}? They will be able to log in again.`
        }
        confirmText={blockModal?.action === 'block' ? 'Block' : 'Unblock'}
        variant={blockModal?.action === 'block' ? 'danger' : 'primary'}
      />
    </AdminLayout>
  );
}

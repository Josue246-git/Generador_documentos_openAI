import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Home } from "lucide-react"; // Añadido el ícono Home


const UserManagementInterface = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    password: '',
    rol: 'user',
    email: '',
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async () => {
    try {
      await axios.post('http://localhost:5000/api/users', newUser);
      setNewUser({
        cedula: '',
        nombre: '',
        apellido: '',
        password: '',
        rol: 'user',
        email: '',
      });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const updateUser = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${editingUser.id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  return (
    <div className="container mx-auto py-8">
        <div className="flex items-center mb-8">
          <Link 
              to="/main-menu" 
              className="p-2 mr-5 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center gap-2"
            >
              <Home className="w-7 h-7" />
          </Link>
          <h1 className="text-3xl font-bold mb-4">GESTIÓN DE USUARIOS</h1>
        </div>
  
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Crear usuario</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createUser();
          }}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <label htmlFor="cedula" className="block mb-1 font-medium">
              Cedula *
            </label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              value={newUser.cedula}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="nombre" className="block mb-1 font-medium">
              Nombre *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={newUser.nombre}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="apellido" className="block mb-1 font-medium">
              Apellido *
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={newUser.apellido}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="rol" className="block mb-1 font-medium">
              Rol *
            </label>
            <select
              id="rol"
              name="rol"
              value={newUser.rol}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="col-span-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Create User
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Users</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Cedula</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Apellido</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2">{user.cedula}</td>
                <td className="px-4 py-2">{user.nombre}</td>
                <td className="px-4 py-2">{user.apellido}</td>
                <td className="px-4 py-2">{user.rol}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded-md mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateUser();
              }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label htmlFor="cedula" className="block mb-1 font-medium">
                  Cedula
                </label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  value={editingUser.cedula}
                  onChange={(e) =>
                    setEditingUser((prevUser) => ({
                      ...prevUser,
                      cedula: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="nombre" className="block mb-1 font-medium">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={editingUser.nombre}
                  onChange={(e) =>
                    setEditingUser((prevUser) => ({
                      ...prevUser,
                      nombre: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="apellido" className="block mb-1 font-medium">
                  Apellido
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={editingUser.apellido}
                  onChange={(e) =>
                    setEditingUser((prevUser) => ({
                      ...prevUser,
                      apellido: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="rol" className="block mb-1 font-medium">
                  Rol
                </label>
                <select
                  id="rol"
                  name="rol"
                  value={editingUser.rol}
                  onChange={(e) =>
                    setEditingUser((prevUser) => ({
                      ...prevUser,
                      rol: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser((prevUser) => ({
                      ...prevUser,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-md mr-2 hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementInterface;
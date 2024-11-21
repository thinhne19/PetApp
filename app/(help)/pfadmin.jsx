import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile, updateEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    phone: '',
    about: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(firestore, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUser({
              name: userDoc.data().name || '',
              email: userDoc.data().phone || '',
              phone: userDoc.data().about || ''
            });
          }
          setLoading(false);
        } catch (err) {
          setError('Không thể tải thông tin người dùng');
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const currentUser = auth.currentUser;
      
      // Cập nhật tên trong Authentication
      await updateProfile(currentUser, {
        displayName: user.name
      });



      // Cập nhật thông tin trong Firestore
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        name: user.name,
        phone: user.phone
      });

      alert('Cập nhật thành công');
      setLoading(false);
    } catch (err) {
      setError('Cập nhật không thành công: ' + err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Thông Tin Cá Nhân</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleUpdateProfile}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tên
          </label>
          <input 
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nhập tên"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input 
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nhập email"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Số Điện Thoại
          </label>
          <input 
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div className="flex items-center justify-center">
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Đang Cập Nhật...' : 'Cập Nhật'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
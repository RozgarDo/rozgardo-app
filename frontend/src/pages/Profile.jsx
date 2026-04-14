import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { 
  UserCircle, 
  Settings, 
  ShieldCheck, 
  Bell, 
  CreditCard, 
  Camera, 
  Trash2,
  ChevronDown,
  Loader2
} from 'lucide-react';

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || user?.name?.split(' ')[0] || '',
    last_name: user?.last_name || user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city_state: user?.city_state || user?.location || '',
    country: user?.country || 'USA',
    postal_code: user?.postal_code || '',
    tax_id: user?.tax_id || '',
    company_name: user?.company_name || (user?.role === 'employer' ? user?.name : '') || '',
    language: user?.language || 'English',
    bio: user?.bio || '',
    photo_url: user?.photo_url || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 2MB' });
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photo_url: reader.result }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, photo_url: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Combine First and Last name for compatibility if needed
    const updatedData = {
        ...formData,
        name: `${formData.first_name} ${formData.last_name}`.trim()
    };

    try {
      const res = await fetch(`http://localhost:5001/api/auth/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      const data = await res.json();
      if(res.ok) {
         setUser(data.user);
         localStorage.setItem('user', JSON.stringify(data.user));
         setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
         throw new Error(data.error || 'Failed to update profile');
      }
    } catch(err) {
      console.error(err);
      // MOCK UPDATE FALLBACK
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage({ type: 'success', text: 'Profile updated (fallback mode)!' });
    } finally {
      setLoading(false);
    }
  };

  const isEmployer = user?.role === 'employer';

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:block py-8">
        <div className="px-6 mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Settings</h3>
        </div>
        <nav className="space-y-1 px-3">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-xl font-semibold transition-all">
                <UserCircle size={20} /> My Profile
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                <ShieldCheck size={20} /> Security
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                <Bell size={20} /> Notification
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                <CreditCard size={20} /> Billing
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                <Settings size={20} /> Settings
            </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <Card className="p-6 flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden relative border border-gray-100 shadow-sm">
                        {formData.photo_url ? (
                            <img src={formData.photo_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <UserCircle size={48} className="absolute inset-0 m-auto text-gray-300" strokeWidth={1} />
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <Loader2 className="animate-spin text-primary" size={24} />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors"
                        >
                            Change avatar
                        </button>
                        <button 
                            type="button"
                            onClick={removeAvatar}
                            className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Remove avatar
                        </button>
                    </div>
                </Card>

                {/* Form Fields Section */}
                <Card className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Row 1 */}
                        <Input 
                            label="First Name" 
                            name="first_name"
                            placeholder="e.g., Washim"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                        <Input 
                            label="Last Name" 
                            name="last_name"
                            placeholder="e.g., Chowdhury"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />

                        {/* Row 2 */}
                        <Input 
                            label="Email Address" 
                            name="email"
                            placeholder="washim@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input 
                            label="Phone" 
                            name="phone"
                            placeholder="+2234654767"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                        {/* Row 3 */}
                        <Input 
                            label="City/State" 
                            name="city_state"
                            placeholder="New York"
                            value={formData.city_state}
                            onChange={handleChange}
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Country</label>
                            <div className="relative group">
                                <select 
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full h-[46px] rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none group-hover:border-primary/50"
                                >
                                    <option value="USA">USA</option>
                                    <option value="India">India</option>
                                    <option value="UK">UK</option>
                                    <option value="Canada">Canada</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Row 4 */}
                        <Input 
                            label="Postal Code" 
                            name="postal_code"
                            placeholder="TR 2435"
                            value={formData.postal_code}
                            onChange={handleChange}
                        />
                        <Input 
                            label="Tax ID" 
                            name="tax_id"
                            placeholder="LKS243546"
                            value={formData.tax_id}
                            onChange={handleChange}
                        />

                        {/* Row 5 */}
                        <Input 
                            label="Company Name" 
                            name="company_name"
                            placeholder="Filllo"
                            value={formData.company_name}
                            onChange={handleChange}
                            required={isEmployer}
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Language</label>
                            <div className="relative group">
                                <select 
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="w-full h-[46px] rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none group-hover:border-primary/50"
                                >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Marathi">Marathi</option>
                                    <option value="Bengali">Bengali</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Row 6: Bio */}
                        <div className="md:col-span-2 flex flex-col gap-1.5 mt-2">
                            <label className="text-sm font-semibold text-gray-700">Bio</label>
                            <textarea 
                                name="bio"
                                rows={4}
                                placeholder="Tell us about yourself..."
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[120px] resize-none"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-10">
                        <button 
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-white text-primary border border-primary px-8 py-2.5 rounded-xl font-bold hover:bg-primary/5 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading || uploading}
                            className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all text-sm flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save'}
                        </button>
                    </div>

                    {message.text && (
                        <div className={`mt-6 p-4 rounded-xl text-sm font-medium transition-all ${
                            message.type === 'success' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                            {message.type === 'success' ? '✅' : '❌'} {message.text}
                        </div>
                    )}
                </Card>
            </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;


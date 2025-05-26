import React from "react";

const settings = [
    {
        title: "Profile",
        description: "Update your personal information and change your password.",
        icon: (
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        action: "Edit Profile",
    },
    {
        title: "Notifications",
        description: "Manage your notification preferences and alerts.",
        icon: (
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        ),
        action: "Manage Notifications",
    },
    {
        title: "Theme",
        description: "Switch between light and dark mode.",
        icon: (
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.485-8.485l-.707.707M4.222 4.222l-.707.707m16.97 0l-.707-.707M4.222 19.778l-.707-.707M21 12h-1M4 12H3m16.485 4.485l-.707-.707M4.222 19.778l-.707-.707" />
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth={2} />
            </svg>
        ),
        action: "Toggle Theme",
    },
    {
        title: "Security",
        description: "Configure two-factor authentication and security settings.",
        icon: (
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2V7a2 2 0 10-4 0v2c0 1.104.896 2 2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 11a7.5 7.5 0 0013 0M12 17v2m-4 0h8" />
            </svg>
        ),
        action: "Update Security",
    },
];

const SettingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
                <h1 className="text-3xl font-bold text-[#e9d758] mb-2">Settings</h1>
                <p className="text-gray-500 mb-8">Manage your account preferences and dashboard settings.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {settings.map((setting, idx) => (
                        <div
                            key={idx}
                            className="flex items-start bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow hover:shadow-lg transition-shadow p-6"
                        >
                            <div className="mr-4">{setting.icon}</div>
                            <div>
                                <h2 className="text-lg font-semibold text-[#e9d758]">{setting.title}</h2>
                                <p className="text-gray-500 text-sm mb-2">{setting.description}</p>
                                <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs font-medium shadow">
                                    {setting.action}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ); 
};

export default SettingPage;
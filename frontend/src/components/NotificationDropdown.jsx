import React from "react";

const NotificationDropdown = ({ notifications, onClose, onRead, onReadAll }) => {
  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden z-50 animate-slide-down transform origin-top-right transition-colors pointer-events-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 transition-colors">
        <h3 className="font-semibold text-zinc-900 dark:text-white transition-colors">Notifications</h3>
        {notifications.some(n => !n.read) && (
          <button 
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
            onClick={onReadAll}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-[350px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-zinc-400 dark:text-zinc-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors">You're all caught up!</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800 transition-colors">
            {notifications.map((notif) => (
              <div 
                key={notif._id} 
                className={`flex gap-3 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-default ${
                  !notif.read ? "bg-indigo-50/50 dark:bg-indigo-500/5" : ""
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-2 h-2 rounded-full ${!notif.read ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-700"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notif.read ? "text-zinc-900 dark:text-zinc-100 font-medium" : "text-zinc-600 dark:text-zinc-400"} transition-colors`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(notif.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
                {!notif.read && (
                  <button 
                    className="flex-shrink-0 text-zinc-400 hover:text-indigo-500 transition-colors"
                    onClick={() => onRead(notif._id)}
                    aria-label="Mark as read"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;

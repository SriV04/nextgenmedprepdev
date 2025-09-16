/**
 * Timeline component style utilities
 * This approach provides reusable card styles while keeping the styling manageable
 */

// Timeline Card Styles
export const timelineCardStyles = { base: "relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 group", final: "bg-gradient-to-br from-emerald-50/90 to-sky-50/90 dark:from-emerald-900/30 dark:to-sky-900/30 border-emerald-200 dark:border-emerald-700", badge: { container: "absolute -top-3", content: "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-lg" }, title: "text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 mt-4 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors", content: "text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6", button: "inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-lg font-medium hover:from-sky-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg" };

// Timeline Node Styles
export const timelineNodeStyles = {
  outer: "w-20 h-20 rounded-full bg-gradient-to-r from-sky-400 to-purple-600 p-1 shadow-2xl",
  inner: "w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center",
  number: "w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg relative z-10"
};

// Progress Tracker Styles
export const timelineProgressStyles = {
  container: "fixed right-6 top-1/2 transform -translate-y-1/2 z-30 hidden lg:flex flex-col items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-slate-200/50 dark:border-slate-700/50"
};

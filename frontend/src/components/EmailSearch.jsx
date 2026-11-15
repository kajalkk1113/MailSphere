
import { useState } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";

function EmailSearch({ onSearch }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSearch({
      search,
      filter,
      sort,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
    >
      {/* Search Input */}
      <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg px-4">
        <Search size={20} className="text-slate-400" />

        <input
          type="text"
          placeholder="Search by sender, subject or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-white py-3 outline-none placeholder:text-slate-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Email Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg px-4 py-2.5 outline-none"
          >
            <option value="all">All Emails</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
            <option value="starred">Starred</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={18} className="text-slate-400" />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg px-4 py-2.5 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          <Search size={18} />
          Search
        </button>
      </div>
    </form>
  );
}

export default EmailSearch;

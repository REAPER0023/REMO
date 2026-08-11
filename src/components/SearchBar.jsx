import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div className="search-bar">
      <Search size={18} />
      <input placeholder="Search chats..." />
    </div>
  );
}

export default SearchBar;
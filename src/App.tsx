import type { LoginResponse } from "./types/auth";

function App() {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        return;
    }

    const data: LoginResponse = JSON.parse(storedUser);

    const handleLogout = () => {
        localStorage.clear();
    };

    return (
        <h1 className="text-blue-900 text-5xl p-5">
            {data.user?.id} <br />
            {data.user?.full_name} <br />
            {data.user?.email} <br />
            {data.user?.is_verified ? "verified" : "not verified"} <br />
            <h1
                className="cursor-grab w-40 overflow-hidden"
                onClick={() => navigator.clipboard.writeText(data.access)}
            >
                {data.access}
            </h1>
            <br />
            <h1 onClick={handleLogout} className="text-red-700 cursor-pointer">
                Logout
            </h1>
            <br />
        </h1>
    );
}

export default App;

import Reaact from 'react';

function Logout() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div>
            <h1>Logout</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Logout;
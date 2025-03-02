export const handleLogout = async (navigate, setIsLoggedIn) => {
    try {
        const response = await fetch('http://localhost:4000/logout', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Successfully logged out:', data.message);
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userType")
            setIsLoggedIn(false);
            navigate('/')
        } else {
            console.error('Error logging out:', data.message);
            alert(`Error: ${data.message || 'Failed to logout'}`);
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
};

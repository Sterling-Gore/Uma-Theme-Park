// Frontend/src/components/authentication/handleLogout.js

export const handleLogout = async (navigate, logout) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/logout`, {
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
            
            logout();

            navigate('/');
        } else {
            console.error('Error logging out:', data.message);
            
       
            logout();
            navigate('/');
        
        }
    } catch (error) {
        console.error('Logout error:', error);
        
        logout();
        navigate('/');
    }
};
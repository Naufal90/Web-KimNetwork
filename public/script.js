// Supabase Client
const supabaseUrl = 'https://iafrlxyoeostvhnoywnv.supabase.co'; // Ganti dengan URL Supabase Anda
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZnJseHlvZW9zdHZobm95d252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MzMwNjAsImV4cCI6MjA1NDEwOTA2MH0.WEdZeif209ew2iEWsGs9Y10529hDFI9BVdFvz_7Yeno'; // Ganti dengan API Key Supabase Anda
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const githubLoginButton = document.getElementById('github-login');
const logoutButton = document.getElementById('logout');
const userInfo = document.getElementById('user-info');

// Check if user is already logged in
async function checkUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
        showUserInfo(user);
    }
}

// Show user info after login
function showUserInfo(user) {
    userInfo.textContent = `Logged in as: ${user.email || user.user_metadata.name}`;
    userInfo.classList.remove('hidden');
    logoutButton.classList.remove('hidden');
    githubLoginButton.classList.add('hidden');
}

// GitHub Login
githubLoginButton.addEventListener('click', async () => {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
    });

    if (error) {
        console.error('Error logging in:', error.message);
    } else {
        showUserInfo(user);
    }
});

// Logout
logoutButton.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error.message);
    } else {
        userInfo.textContent = '';
        userInfo.classList.add('hidden');
        logoutButton.classList.add('hidden');
        githubLoginButton.classList.remove('hidden');
    }
});

// Check user on page load
checkUser();

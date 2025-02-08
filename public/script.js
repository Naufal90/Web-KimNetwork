// Supabase Client
const supabaseUrl = 'https://iafrlxyoeostvhnoywnv.supabase.co'; // Ganti dengan URL Supabase Anda
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZnJseHlvZW9zdHZobm95d252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MzMwNjAsImV4cCI6MjA1NDEwOTA2MH0.WEdZeif209ew2iEWsGs9Y10529hDFI9BVdFvz_7Yeno'; // Ganti dengan API Key Supabase Anda
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const registerGamertag = document.getElementById('register-gamertag');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerButton = document.getElementById('register-button');
const loginGamertag = document.getElementById('login-gamertag');
const loginPassword = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const resetEmail = document.getElementById('reset-email');
const resetPasswordButton = document.getElementById('reset-password-button');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const backToLogin = document.getElementById('back-to-login');
const userInfo = document.getElementById('user-info');
const logoutButton = document.getElementById('logout');

// Register Function
registerButton.addEventListener('click', async () => {
    const gamertag = registerGamertag.value;
    const email = registerEmail.value;
    const password = registerPassword.value;

    if (!gamertag || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // Simpan data ke Supabase
    const { data, error } = await supabase
        .from('players')
        .insert([{ gamertag, email, password }]); // Password seharusnya di-hash di backend untuk keamanan

    if (error) {
        console.error('Error registering:', error.message);
        alert('Registration failed. Please try again.');
    } else {
        alert('Registration successful! Please login.');
        registerGamertag.value = '';
        registerEmail.value = '';
        registerPassword.value = '';
    }
});

// Login Function
loginButton.addEventListener('click', async () => {
    const gamertag = loginGamertag.value;
    const password = loginPassword.value;

    if (!gamertag || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // Cek data di Supabase
    const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('gamertag', gamertag)
        .eq('password', password)
        .single();

    if (error || !data) {
        console.error('Error logging in:', error?.message || 'Invalid credentials');
        alert('Login failed. Please check your GamerTag and password.');
    } else {
        alert('Login successful!');
        showUserInfo(data.gamertag);
    }
});

// Forgot Password Function
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('forgot-password-form').classList.remove('hidden');
});

// Reset Password Function
resetPasswordButton.addEventListener('click', async () => {
    const email = resetEmail.value;

    if (!email) {
        alert('Please enter your email.');
        return;
    }

    // Kirim reset password link via email
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
        console.error('Error sending reset link:', error.message);
        alert('Failed to send reset link. Please try again.');
    } else {
        alert('Reset link sent to your email. Please check your inbox.');
    }
});

// Back to Login
backToLogin.addEventListener('click', () => {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('forgot-password-form').classList.add('hidden');
});

// Show User Info
function showUserInfo(gamertag) {
    userInfo.textContent = `Logged in as: ${gamertag}`;
    userInfo.classList.remove('hidden');
    logoutButton.classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.add('hidden');
}

// Logout Function
logoutButton.addEventListener('click', () => {
    userInfo.textContent = '';
    userInfo.classList.add('hidden');
    logoutButton.classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('login-form').classList.remove('hidden');
});

<template>
  <div class="min-h-screen flex items-center justify-center bg-black">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-white mb-4">Connexion en cours...</h1>
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
    </div>
  </div>
</template>
  
<script>
export default {
  async mounted() {
    const code = this.$route.query.code;

    if (!code) {
      console.error("Code d'autorisation manquant.");
      this.$toast.error("Erreur d'authentification. Veuillez réessayer.");
      this.$router.push('/login');
      return;
    }

    try {
      const response = await this.$axios.$post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'https://spotifycloneoff.vercel.app/callback',
          client_id: 'b1073ff1d9f24709a2ccaeca5dc3ae46',
          client_secret: '2ad319b3d1ae4cdaa26a5cf996bb1855',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('Réponse Spotify :', response);

      // Store tokens
      localStorage.setItem('spotify_access_token', response.access_token);
      localStorage.setItem('spotify_refresh_token', response.refresh_token);
      localStorage.setItem('spotify_token_expires_at', Date.now() + (response.expires_in * 1000));

      // Redirect to home page
      this.$router.push('/dashboard');
    } catch (error) {
      console.error("Erreur lors de l'échange du token :", error.response?.data || error.message);
      this.$toast.error("Erreur lors de l'authentification. Veuillez réessayer.");
      this.$router.push('/login');
    }
  },
};
</script>
  
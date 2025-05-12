export default {
  ssr: false,  
  target: 'static',  
  // Modules used in the project
  modules: [
    '@nuxtjs/axios', 
    '@nuxtjs/auth-next', 
    '@nuxt/postcss8', 
    '@nuxtjs/toast'
  ],

  // Axios configuration
  axios: {
    baseURL: 'https://api.spotify.com/v1',  // Base URL for Spotify API
  },

  // CSS configuration (Tailwind CSS)
  css: [
    '@/assets/css/tailwind.css',  // Include Tailwind CSS
  ],

  // Build Configuration
  build: {
    postcss: {
      plugins: {
        'postcss-import': {},
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },

  // Head configuration for additional meta and link tags
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',  // Add Material Icons link
      },
    ],
  },

  // Auth configuration for Spotify OAuth2
  auth: {
    strategies: {
      spotify: {
        scheme: 'oauth2',
        endpoints: {
          authorization: 'https://accounts.spotify.com/authorize',
          token: 'https://accounts.spotify.com/api/token',
          userInfo: 'https://api.spotify.com/v1/me',
        },
        clientId: 'b1073ff1d9f24709a2ccaeca5dc3ae46',
        clientSecret: '2ad319b3d1ae4cdaa26a5cf996bb1855',
        scope: [
          'user-read-private',
          'user-read-email',
          'playlist-read-private',
          'playlist-modify-public',
          'playlist-modify-private',
          'user-library-read',
          'user-library-modify',
          'user-read-playback-state',
          'user-modify-playback-state',
          'streaming',
          'user-read-currently-playing',
          'user-read-recently-played',
          'user-top-read',
          'user-follow-read',
        ],
        grantType: 'authorization_code',
        responseType: 'code',
        redirectUri: 'https://spotifycloneoff.vercel.app/callback', // Ensure this URL matches your Vercel deployment
      },
    },
  },

  // Toast notifications configuration
  toast: {
    position: 'top-right',
    duration: 3000,
    keepOnHover: true,
  },

  // Generate pages dynamically if needed
  generate: {
    dir: 'dist',  // Vercel will automatically detect this directory
  },
};

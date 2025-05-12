<template>
  <div class="flex h-screen bg-gray-900 text-white">
    <!-- Barre latérale -->
    <Sidebar />

    <!-- Contenu principal -->
    <main class="flex-1 overflow-y-auto">
      <!-- Header -->
      <header class="p-4 bg-gray-900">
        <!-- Barre de recherche -->
        <div class="flex items-center">
          <input
            v-model="query"
            @keyup.enter="search"
            placeholder="Rechercher des artistes, titres ou podcasts"
            class="w-full p-2 bg-gray-800 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </header>

      <!-- Category Grid Section -->
      <section v-if="!query" class="p-8">
        <h2 class="text-2xl font-bold mb-6">Parcourir tout</h2>
        <div v-if="categoriesLoading" class="text-center py-8">
          <p class="text-gray-400">Chargement des catégories...</p>
        </div>
        <div v-else-if="categories.length === 0" class="text-center py-8">
          <p class="text-gray-400">Aucune catégorie trouvée</p>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div
            v-for="category in categories"
            :key="category.id"
            class="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg border-4 border-white/10 hover:border-green-400 transition-all duration-200"
            @click="browseCategory(category.id)"
            :style="{ backgroundColor: categoryColor(category) }"
            style="min-height: 160px;"
          >
            <h3 class="absolute left-5 top-5 text-xl font-extrabold z-20 drop-shadow-lg w-2/3 leading-tight">{{ category.name }}</h3>
            <img
              :src="category.icons[0]?.url"
              :alt="category.name"
              class="absolute right-4 bottom-4 w-24 h-24 object-cover rounded-lg shadow-2xl z-10"
              style="transform: rotate(12deg); border: 3px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.05);"
            />
            <div class="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200 z-0"></div>
          </div>
        </div>
      </section>

      <!-- Playlists Grid Section (after clicking a category) -->
      <section v-if="selectedCategory && playlists && playlists.length" class="p-8">
        <h2 class="text-2xl font-bold mb-6">Playlists - {{ selectedCategoryName }}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div
            v-for="playlist in playlists"
            :key="playlist.id"
            class="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg border-4 border-white/10 hover:border-green-400 transition-all duration-200 bg-gradient-to-br from-pink-700 via-purple-800 to-black"
            @click="goToPlaylist(playlist.id)"
            style="min-height: 180px;"
          >
            <img
              :src="playlist.images[0]?.url || require('~/assets/default-album.png')"
              :alt="playlist.name"
              class="absolute right-4 bottom-4 w-24 h-24 object-cover rounded-lg shadow-2xl z-10 border-2 border-pink-400 bg-black/20"
              style="transform: rotate(8deg);"
            />
            <h3 class="absolute left-5 top-5 text-lg font-extrabold z-20 drop-shadow-lg w-2/3 leading-tight text-pink-100">{{ playlist.name }}</h3>
            <p class="absolute left-5 bottom-5 text-xs text-pink-200 z-20 w-1/2 line-clamp-2">{{ playlist.description }}</p>
            <div class="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200 z-0"></div>
          </div>
        </div>
      </section>

      <!-- Résultats de recherche -->
      <section class="p-4">
        <h2 v-if="results" class="text-2xl font-bold mb-4">Résultats de recherche</h2>
        <div v-if="results" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="item in results"
            :key="item.id"
            class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700"
          >
            <img
              :src="item.album.images[0]?.url || require('~/assets/default-album.png')"
              :alt="`Pochette de l'album ${item.album.name}`"
              class="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 class="text-lg font-semibold mb-1">{{ item.name }}</h3>
            <p class="text-gray-400 mb-2">{{ item.artists[0]?.name }}</p>
            <button
              @click="playTrack(item.uri)"
              class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Lire
            </button>
          </div>
        </div>
        <div v-else-if="loading" class="text-center mt-8">
          <svg class="animate-spin h-8 w-8 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p class="mt-4">Recherche en cours...</p>
        </div>
      </section>

      <!-- Lecteur en bas de page -->
      <footer v-if="currentTrack" class="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex items-center">
        <img
          :src="currentTrack.albumCover || require('~/assets/default-album.png')"
          :alt="`Pochette de l'album ${currentTrack.albumName}`"
          class="w-16 h-16 object-cover mr-4"
        />
        <div class="flex-1">
          <p class="text-white font-semibold">{{ currentTrack.name }}</p>
          <p class="text-gray-400">{{ currentTrack.artist }}</p>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="pausePlayback" class="text-white hover:text-green-500">
            <span class="material-icons text-3xl">pause_circle_filled</span>
          </button>
        </div>
      </footer>
    </main>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import Sidebar from '~/components/Sidebar.vue';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      player: null,
      deviceId: null,
      currentTrack: null,
      query: '',
      results: null,
      loading: false,
      categories: [],
      categoriesLoading: false,
      selectedCategory: null,
      selectedCategoryName: '',
      playlists: [],
    };
  },
  mounted() {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      console.error('Token non disponible. Veuillez vous reconnecter.');
      return;
    }
    this.loadCategories();
    if (window.Spotify) {
      this.initializePlayer(token);
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        this.initializePlayer(token);
      };
    }
  },
  methods: {
    ...mapMutations(['setDeviceId']),
    initializePlayer(token) {
      console.log('Initialisation du lecteur Spotify.');

      this.player = new Spotify.Player({
        name: 'Spotify Clone Player',
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      this.player.addListener('ready', ({ device_id }) => {
        console.log('Lecteur prêt avec Device ID :', device_id);
        this.deviceId = device_id;
        this.setDeviceId(device_id);
      });

      this.player.addListener('player_state_changed', (state) => {
        if (state) {
          const track = state.track_window.current_track;
          this.currentTrack = {
            name: track.name,
            artist: track.artists[0]?.name,
            albumCover: track.album.images[0]?.url,
            albumName: track.album.name,
          };
          console.log('Morceau en cours :', this.currentTrack);
        }
      });

      this.player.connect().then((success) => {
        if (success) {
          console.log('Lecteur Spotify connecté.');
        } else {
          console.error('Échec de la connexion au lecteur Spotify.');
        }
      });
    },

    async search() {
      this.loading = true;

      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('Token non disponible. Veuillez vous reconnecter.');
          return;
        }

        const response = await this.$axios.$get(
          'https://api.spotify.com/v1/search',
          {
            params: { q: this.query, type: 'track' },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.results = response.tracks?.items || [];
      } catch (error) {
        console.error('Erreur lors de la recherche :', error.response?.data || error.message);
      } finally {
        this.loading = false;
      }
    },

    async playTrack(uri) {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!this.deviceId) {
          console.error("Device ID non disponible. Le lecteur n'est pas prêt.");
          return;
        }

        await this.$axios.$put(
          `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
          {
            uris: [uri],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log(`Lecture démarrée pour ${uri}`);
      } catch (error) {
        console.error('Erreur lors du démarrage de la lecture :', error.response?.data || error.message);
      }
    },

    async pausePlayback() {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!this.deviceId) {
          console.error("Device ID non disponible. Le lecteur n'est pas prêt.");
          return;
        }

        await this.$axios.$put(
          `https://api.spotify.com/v1/me/player/pause?device_id=${this.deviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Lecture mise en pause.');
      } catch (error) {
        console.error('Erreur lors de la mise en pause :', error.response?.data || error.message);
      }
    },

    async loadCategories() {
      this.categoriesLoading = true;
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('Token non disponible. Veuillez vous reconnecter.');
          return;
        }
        const response = await this.$axios.$get(
          'https://api.spotify.com/v1/browse/categories',
          {
            params: { limit: 20, country: 'FR' },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response && response.categories && response.categories.items) {
          this.categories = response.categories.items;
        } else {
          console.error('Format de réponse invalide:', response);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      } finally {
        this.categoriesLoading = false;
      }
    },

    async browseCategory(categoryId) {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
          console.error('Token non disponible. Veuillez vous reconnecter.');
          return;
        }
        const response = await this.$axios.$get(
          `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`,
          {
            params: { limit: 20 },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.selectedCategory = categoryId;
        const cat = this.categories.find(c => c.id === categoryId);
        this.selectedCategoryName = cat ? cat.name : '';
        this.playlists = response.playlists.items;
        this.results = null; // Hide search results if any
      } catch (error) {
        console.error('Erreur lors du chargement des playlists de la catégorie :', error.response?.data || error.message);
      }
    },

    goToPlaylist(playlistId) {
      this.$router.push(`/playlist/${playlistId}`);
    },

    categoryColor(category) {
      const colorMap = {
        'musique': '#e13300',
        'podcasts': '#1e3264',
        'événements live': '#8d67ab',
        'conçu spécialement pour vous': '#477d95',
        'dernières sorties': '#537a3a',
        'pop': '#148a08',
        'hip-hop': '#bc5900',
        'arabe': '#e8115b',
        'afro': '#b02897',
        'classements': '#8c67ab',
        'contenu éducatif': '#477d95',
        'documentaires': '#503750',
        'humour': '#e8115b',
        'pop culture': '#b02897',
        'rock': '#148a08',
        'latino': '#e13300',
      };
      const key = category.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (colorMap[key]) return colorMap[key];
      let hash = 0;
      for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
      const h = Math.abs(hash) % 360;
      return `hsl(${h}, 60%, 65%)`;
    },
  },
};
</script>

<style scoped>
/* Exemple de styles pour la page de recherche */
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #333;
  color: white;
}
</style>

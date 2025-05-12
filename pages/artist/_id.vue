<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-[#2d0036] to-[#1a0022] text-white">
    <div class="max-w-5xl mx-auto py-10 px-4">
      <div v-if="loading" class="text-center py-20">
        <svg class="animate-spin h-8 w-8 text-pink-300 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <p class="mt-4 text-pink-300">Chargement de l'artiste...</p>
      </div>
      <div v-else>
        <div class="flex items-center mb-8">
          <img :src="artist.images[0]?.url" :alt="artist.name" class="w-32 h-32 object-cover rounded-full border-4 border-pink-400 shadow-lg mr-8" />
          <div>
            <h1 class="text-4xl font-extrabold text-pink-200 mb-2">{{ artist.name }}</h1>
            <p class="text-pink-300">{{ artist.followers.total.toLocaleString() }} followers</p>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-pink-200 mb-4">Top titres</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div v-for="track in topTracks" :key="track.id" class="flex items-center bg-black/70 rounded-2xl p-4 shadow-lg shadow-pink-900/10">
            <img :src="track.album?.images?.[0]?.url" :alt="track.name" class="w-16 h-16 object-cover rounded mr-4 border-2 border-pink-400" />
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-pink-100">{{ track.name }}</h3>
              <p class="text-pink-300 text-sm">{{ track.album.name }}</p>
            </div>
            <button @click="playTrack(track.uri)" class="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full shadow-lg shadow-pink-500/40 hover:from-pink-400 hover:to-purple-400 text-white ml-4">
              <i class="material-icons">play_arrow</i>
            </button>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-pink-200 mb-4">Albums</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div v-for="album in albums" :key="album.id" class="cursor-pointer group" @click="goToAlbum(album.id)">
            <img :src="album.images[0]?.url" :alt="album.name" class="w-full h-40 object-cover rounded-xl border-2 border-pink-400 group-hover:scale-105 transition" />
            <h3 class="mt-2 text-pink-100 font-semibold text-base truncate">{{ album.name }}</h3>
            <p class="text-pink-300 text-xs">{{ album.release_date }}</p>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-pink-200 mb-4">Artistes similaires</h2>
        <div class="flex flex-wrap gap-4">
          <div v-for="related in relatedArtists" :key="related.id" class="flex flex-col items-center cursor-pointer" @click="goToArtist(related.id)">
            <img :src="related.images[0]?.url" :alt="related.name" class="w-20 h-20 object-cover rounded-full border-2 border-pink-400 mb-2" />
            <span class="text-pink-100 text-sm font-semibold">{{ related.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      artist: {},
      topTracks: [],
      albums: [],
      relatedArtists: [],
      loading: true,
    };
  },
  async mounted() {
    this.loading = true;
    const token = localStorage.getItem('spotify_access_token');
    const artistId = this.$route.params.id;
    try {
      // Get artist details
      const artistRes = await this.$axios.$get(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.artist = artistRes;
      // Get top tracks
      const topRes = await this.$axios.$get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
        params: { market: 'FR' },
        headers: { Authorization: `Bearer ${token}` },
      });
      this.topTracks = topRes.tracks;
      // Get albums
      const albumsRes = await this.$axios.$get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
        params: { market: 'FR', limit: 8, include_groups: 'album,single' },
        headers: { Authorization: `Bearer ${token}` },
      });
      this.albums = albumsRes.items;
      // Get related artists
      const relatedRes = await this.$axios.$get(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.relatedArtists = relatedRes.artists;
    } catch (error) {
      console.error('Error loading artist:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async playTrack(uri) {
      try {
        const token = localStorage.getItem('spotify_access_token');
        const deviceId = localStorage.getItem('spotify_device_id');
        if (!token || !deviceId) return;
        await this.$axios.$put(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          { uris: [uri] },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Error playing track:', error);
      }
    },
    goToAlbum(albumId) {
      this.$router.push(`/album/${albumId}`);
    },
    goToArtist(artistId) {
      this.$router.push(`/artist/${artistId}`);
    },
  },
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 
import { useState, useEffect } from 'react';

interface Video {
  id: string;
}

interface YouTubeChannelState {
  isLiveStreaming: boolean;
  liveVideoId?: string;
  recentVideos: Video[];
}

export function useYouTubeChannel() {
  const [state, setState] = useState<YouTubeChannelState>({
    isLiveStreaming: false,
    liveVideoId: '',
    recentVideos: []
  });

  const channelId = 'UCgGPgRVu7vaqdnjZVEioNKQ';
  const apiKey = 'AIzaSyDHrHC41U6xGYT3Ag-VYWi5tcV2HB6p2Ro';

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Verificar se há live ao vivo
        const liveRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&channelId=${channelId}&eventType=live&key=${apiKey}`
        );
        const liveData = await liveRes.json();
        
        let isLive = false;
        let liveVideoId = '';
        
        if (liveData.items && liveData.items.length > 0) {
          isLive = true;
          liveVideoId = liveData.items[0].id.videoId;
        }

        // 2. Buscar vídeos recentes (últimos 4, por exemplo)
        const playlistId = 'UU' + channelId.substring(2);
        const recentRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${apiKey}`
        );
        const recentData = await recentRes.json();
        const recentVideos = (recentData.items || []).map((item: any) => ({
          id: item.snippet.resourceId.videoId
        }));

        setState({
          isLiveStreaming: isLive,
          liveVideoId,
          recentVideos
        });
      } catch (error) {
        console.error('Erro ao buscar dados do YouTube:', error);
      }
    }

    const intervalId = setInterval(fetchData, 1200000); // Verifica a cada 20 minutos

    fetchData(); // Chamada inicial

    return () => clearInterval(intervalId);
  }, [channelId, apiKey]);

  return state;
}

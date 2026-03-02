'use client';
import { useUserData } from '@/context/userData';
import { SettingsCard } from '../../../shared/settings-card';
import { Switch } from '../../../ui/switch';
import { TextInput } from '../../../ui/text-input';
import { DEFAULT_PRELOAD_SELECTOR } from '../../../../../../core/src/utils/constants';

export function BackgroundOptimization() {
  const { userData, setUserData } = useUserData();

  return (
    <>
      <SettingsCard
        title="Pre-cache Next Episode"
        description="When enabled, AIOStreams will fetch the next episode's streams in the background and ping the URLs selected by the precache selector. This triggers server-side caching before you click. A per-user cooldown prevents repeat pings for the same episode (controlled by PRECACHE_NEXT_EPISODE_MIN_INTERVAL, default 24 h)."
      >
        <Switch
          label="Enable"
          side="right"
          value={userData.precacheNextEpisode}
          onValueChange={(value) => {
            setUserData((prev) => ({
              ...prev,
              precacheNextEpisode: value,
            }));
          }}
        />
        <Switch
          label="First stream only"
          help="When on (default), only the first stream returned by the selector is pinged. Turn off to ping all streams the selector returns (capped by the server's MAX_BACKGROUND_PINGS limit)."
          side="right"
          disabled={!userData.precacheNextEpisode}
          value={userData.precacheSingleStream ?? true}
          defaultValue={true}
          onValueChange={(value) => {
            setUserData((prev) => ({
              ...prev,
              precacheSingleStream: value,
            }));
          }}
        />
        <TextInput
          label="Precache Selector"
          help={
            <>
              <p>
                A SEL expression that determines which stream(s) to precache for
                the next episode. Should evaluate to a list of streams.
              </p>
              <p className="mt-2">
                <strong>Recommended pattern:</strong>{' '}
                <code>condition ? streamsToSelectFrom : []</code>
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>
                  <code>condition</code> - When precaching should activate
                </li>
                <li>
                  <code>streamsToSelectFrom</code> - Which streams AIOStreams
                  should choose from
                </li>
              </ul>
              <p className="mt-2">
                <strong>Examples:</strong>
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>
                  <strong>Default behavior</strong> (precache only when all
                  streams are uncached):
                  <br />
                  <code className="text-xs">
                    count(cached(streams)) == 0 ? uncached(streams) : []
                  </code>
                </li>
                <li>
                  <strong>Always precache first uncached stream:</strong>
                  <br />
                  <code className="text-xs">true ? uncached(streams) : []</code>
                </li>
                <li>
                  <strong>Only for anime series:</strong>
                  <br />
                  <code className="text-xs">
                    queryType == &apos;anime.series&apos; ? uncached(streams) :
                    []
                  </code>
                </li>
              </ul>
              <p className="mt-2 text-sm text-gray-600">
                Has access to the same constants as expression filters (streams,
                queryType, isAnime, etc.).
              </p>
            </>
          }
          placeholder="e.g., true ? uncached(streams) : []"
          disabled={!userData.precacheNextEpisode}
          value={userData.precacheSelector ?? ''}
          onValueChange={(value) => {
            setUserData((prev) => ({
              ...prev,
              precacheSelector: value || undefined,
            }));
          }}
        />
      </SettingsCard>

      <SettingsCard
        title="Preload Streams"
        description="When enabled, AIOStreams will automatically send HTTP requests to selected streams so they start processing before you click on them. This happens asynchronously and does not delay the display of results. Controlled by the server's MAX_BACKGROUND_PINGS (max streams), PRELOAD_STREAMS_CONCURRENCY (concurrent requests), and PRELOAD_MIN_INTERVAL (per-user cooldown, default 1 h)."
      >
        <Switch
          label="Enable"
          side="right"
          value={userData.preloadStreams?.enabled}
          onValueChange={(value) => {
            setUserData((prev) => ({
              ...prev,
              preloadStreams: {
                ...prev.preloadStreams,
                enabled: value,
              },
            }));
          }}
        />
        <TextInput
          label="Preload Selector"
          help={
            <>
              <p>
                A SEL expression that determines which streams to preload.
                Should evaluate to a list of streams — all streams in the result
                will have an HTTP request sent to their URLs.
              </p>
              <p className="mt-2">
                <strong>Examples:</strong>
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>
                  <strong>Top 5 streams (default):</strong>
                  <br />
                  <code className="text-xs">slice(streams, 0, 5)</code>
                </li>
                <li>
                  <strong>Top 5 usenet streams only:</strong>
                  <br />
                  <code className="text-xs">
                    slice(type(streams, &apos;usenet&apos;), 0, 5)
                  </code>
                </li>
                <li>
                  <strong>Top 3 cached streams:</strong>
                  <br />
                  <code className="text-xs">slice(cached(streams), 0, 3)</code>
                </li>
              </ul>
              <p className="mt-2 text-sm text-gray-600">
                Has access to the same constants as expression filters (streams,
                queryType, isAnime, etc.).
              </p>
            </>
          }
          defaultValue={DEFAULT_PRELOAD_SELECTOR}
          disabled={!userData.preloadStreams?.enabled}
          value={userData.preloadStreams?.selector ?? ''}
          onValueChange={(value) => {
            setUserData((prev) => ({
              ...prev,
              preloadStreams: {
                ...prev.preloadStreams,
                selector: value || undefined,
              },
            }));
          }}
        />
      </SettingsCard>
    </>
  );
}
